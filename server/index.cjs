const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const cors = require('cors')
const path = require('path')
const { pipeline } = require('@xenova/transformers')
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

require('dotenv').config({ path: path.join(__dirname, '../.env') })

const app = express()
app.use(cors())
app.use(express.json())

pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

let embeddingPipeline = null

async function getEmbedding(text) {
  if (!embeddingPipeline) {
    console.log('Loading embedding model...')
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    console.log('Embedding model ready')
  }
  
  const truncatedText = text.length > 2000 ? text.substring(0, 2000) : text
  const result = await embeddingPipeline(truncatedText, { pooling: 'mean', normalize: true })
  return Array.from(result.data)
}

async function extractTextFromPDF(buffer) {
  try {
    const uint8Array = new Uint8Array(buffer)
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdfDocument = await loadingTask.promise
    
    let fullText = ''
    const numPages = pdfDocument.numPages
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + '\n'
    }
    
    const cleanedText = fullText.replace(/\s+/g, ' ').trim()
    console.log(`Extracted ${cleanedText.length} characters`)
    console.log(`Preview: ${cleanedText.substring(0, 200)}...`)
    
    return cleanedText
  } catch (error) {
    console.error('PDF extraction error:', error.message)
    return ''
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'PDF Processor Server is running', endpoints: ['/api/process/:documentId', '/api/chat', '/api/embed', '/health'] })
})

// Process PDF endpoint
app.post('/api/process/:documentId', async (req, res) => {
  const { documentId } = req.params

  console.log(`\nProcessing document: ${documentId}`)

  try {
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError) throw docError

    console.log(`Downloading: ${doc.filename}`)

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(doc.file_path)

    if (downloadError) throw downloadError

    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('Extracting text with pdfjs-dist...')
    let text = await extractTextFromPDF(buffer)
    
    console.log(`Extracted ${text.length} characters total`)

    if (text.length < 100) {
      console.warn('Warning: Very little text extracted.')
    }

    // Clear old chunks
    await supabase
      .from('document_chunks')
      .delete()
      .eq('document_id', documentId)

    const chunkSize = 1000
    const chunks = []

    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push({
        text: text.substring(i, i + chunkSize),
        index: Math.floor(i / chunkSize)
      })
    }

    console.log(`Split into ${chunks.length} chunks`)

    let savedCount = 0
    let embeddingCount = 0

    for (const chunk of chunks) {
      const { data: inserted, error: insertError } = await supabase
        .from('document_chunks')
        .insert({
          document_id: documentId,
          chunk_text: chunk.text,
          chunk_index: chunk.index
        })
        .select()

      if (!insertError && inserted && inserted[0]) {
        savedCount++

        try {
          const embedding = await getEmbedding(chunk.text)
          const embeddingString = '[' + embedding.join(',') + ']'

          const { error: updateError } = await supabase
            .from('document_chunks')
            .update({ embedding: embeddingString })
            .eq('id', inserted[0].id)

          if (!updateError) {
            embeddingCount++
            console.log(`Chunk ${chunk.index} embedded (${embeddingCount}/${savedCount})`)
          }
        } catch (e) {
          console.log(`Failed to embed chunk ${chunk.index}:`, e.message)
        }
      }
    }

    console.log(`Saved ${savedCount} chunks, ${embeddingCount} embedded`)

    await supabase
      .from('documents')
      .update({ status: 'ready' })
      .eq('id', documentId)

    console.log(`Done processing ${doc.filename}\n`)
    res.json({ success: true, chunks: savedCount, embeddings: embeddingCount })

  } catch (error) {
    console.error('Error:', error.message)
    
    try {
      await supabase
        .from('documents')
        .update({ status: 'failed' })
        .eq('id', documentId)
    } catch (e) { }

    res.status(200).json({ success: false, error: error.message })
  }
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { documentId, question, conversationId, userId } = req.body

    console.log(`Chat request - Document: ${documentId}, Question: ${question}`)

    let currentConversationId = conversationId

    // Create conversation if needed
    if (!currentConversationId) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          document_id: documentId,
          title: question.substring(0, 50)
        })
        .select()
        .single()
      
      if (newConv) {
        currentConversationId = newConv.id
        console.log(`Created new conversation: ${currentConversationId}`)
      }
    }

    // Save user message
    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: question
      })

    // Generate embedding for the question
    console.log('Generating embedding for question...')
    const questionEmbedding = await getEmbedding(question)
    
    // (MANUAL VECTOR SEARCH) Get all chunks and calculate similarity
    console.log('Fetching chunks from database...')
    const { data: allChunks, error: fetchError } = await supabase
      .from('document_chunks')
      .select('chunk_text, chunk_index, embedding')
      .eq('document_id', documentId)

    console.log(`Found ${allChunks?.length || 0} chunks in database`)

    let context = ""
    
    if (allChunks && allChunks.length > 0) {
      // Calculate similarities
      const similarities = []
      
      for (const chunk of allChunks) {
        if (!chunk.embedding) {
          console.log(`Chunk ${chunk.chunk_index} has no embedding, skipping`)
          continue
        }
        
        let chunkEmbedding
        
        // Parse the embedding from string to array
        if (typeof chunk.embedding === 'string') {
          try {
            // Remove brackets and parse
            const cleanStr = chunk.embedding.replace(/[\[\]]/g, '')
            chunkEmbedding = cleanStr.split(',').map(Number)
          } catch (e) {
            console.log(`Failed to parse embedding for chunk ${chunk.chunk_index}`)
            continue
          }
        } else if (Array.isArray(chunk.embedding)) {
          chunkEmbedding = chunk.embedding
        } else {
          console.log(`Unknown embedding type for chunk ${chunk.chunk_index}`)
          continue
        }
        
        // Calculate cosine similarity
        let dotProduct = 0
        let norm1 = 0
        let norm2 = 0
        
        for (let i = 0; i < questionEmbedding.length; i++) {
          dotProduct += questionEmbedding[i] * chunkEmbedding[i]
          norm1 += questionEmbedding[i] * questionEmbedding[i]
          norm2 += chunkEmbedding[i] * chunkEmbedding[i]
        }
        
        const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
        
        similarities.push({
          chunk_text: chunk.chunk_text,
          chunk_index: chunk.chunk_index,
          similarity: similarity
        })
      }
      
      // Sort by similarity (highest first) and take top 5
      similarities.sort((a, b) => b.similarity - a.similarity)
      const topChunks = similarities.slice(0, 5)
      
      console.log(`Calculated similarities for ${similarities.length} chunks`)
      console.log(`Top ${topChunks.length} chunks:`, 
        topChunks.map(c => ({ index: c.chunk_index, similarity: c.similarity.toFixed(4) })))
      
      if (topChunks.length > 0) {
        context = topChunks.map(c => c.chunk_text).join('\n\n')
        console.log(`Context length: ${context.length} characters`)
      } else {
        console.log('No valid chunks found')
      }
    } else {
      console.log('No chunks found for this document')
    }
    
    const GROQ_API_KEY = process.env.GROQ_API_KEY
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
    
    let answer = "I could not find that information in the document."

    if (GROQ_API_KEY && context) {
      console.log('Calling Groq API...')
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `Answer based ONLY on this context. If not in context, say "I could not find that information."\n\nContext:\n${context.substring(0, 4000)}` },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      const groqData = await response.json()
      if (groqData.choices && groqData.choices[0]) {
        answer = groqData.choices[0].message.content
        console.log('Groq response received')
      } else {
        console.error('Groq error:', groqData)
      }
    } else if (!context) {
      console.log('No context found - no relevant chunks retrieved')
      answer = "No text found in this document. Please make sure the PDF was processed correctly."
    } else if (!GROQ_API_KEY) {
      console.log('Groq API key missing')
      answer = "Groq API key is missing. Please add it to environment variables."
    }

    // Save assistant message
    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: answer
      })

    res.json({
      answer: answer,
      conversationId: currentConversationId
    })

  } catch (error) {
    console.error('Chat error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`)
  console.log(`Chat endpoint: POST http://localhost:${PORT}/api/chat`)
  console.log(`Process endpoint: POST http://localhost:${PORT}/api/process/:documentId`)
  console.log(`Health check: GET http://localhost:${PORT}/health\n`)
})