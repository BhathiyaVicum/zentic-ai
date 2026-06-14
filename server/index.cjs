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
  }
  const result = await embeddingPipeline(text, { pooling: 'mean', normalize: true })
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
    
    return fullText.replace(/\s+/g, ' ').trim()
  } catch (error) {
    console.error('PDF extraction error:', error.message)
    return ''
  }
}

app.post('/api/process/:documentId', async (req, res) => {
  const { documentId } = req.params

  try {
    const { data: doc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    const { data: fileData } = await supabase.storage
      .from('documents')
      .download(doc.file_path)

    const buffer = Buffer.from(await fileData.arrayBuffer())
    let text = await extractTextFromPDF(buffer)
    
    await supabase.from('document_chunks').delete().eq('document_id', documentId)

    const chunkSize = 1000
    const chunks = []
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push({
        text: text.substring(i, i + chunkSize),
        index: Math.floor(i / chunkSize)
      })
    }

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
          
          await supabase
            .from('document_chunks')
            .update({ embedding: embeddingString })
            .eq('id', inserted[0].id)
          
          embeddingCount++
          console.log(`Chunk ${chunk.index} embedded`)
        } catch (e) {
          console.log(`Failed to embed chunk ${chunk.index}:`, e.message)
        }
      }
    }

    await supabase
      .from('documents')
      .update({ status: 'ready' })
      .eq('id', documentId)

    res.json({ success: true, chunks: savedCount, embeddings: embeddingCount })

  } catch (error) {
    console.error('Error:', error.message)
    res.json({ success: false, error: error.message })
  }
})

app.post('/api/embed', async (req, res) => {
  const { text } = req.body
  try {
    const embedding = await getEmbedding(text)
    res.json({ embedding })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))