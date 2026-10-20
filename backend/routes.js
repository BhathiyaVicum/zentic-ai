const express = require('express');
const { supabase } = require('./db');
const { getEmbedding, extractTextFromPDF } = require('./services');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
router.get('/', (req, res) => {
    res.json({ message: 'PDF Processor Server is running', endpoints: ['/api/process/:documentId', '/api/chat', '/api/embed', '/health'] });
});

// Process PDF endpoint
router.post('/api/process/:documentId', async (req, res) => {
    const { documentId } = req.params;
    console.log(`\nProcessing document: ${documentId}`);

    try {
        // 1. Get document details from DB
        const { data: doc, error: docError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .single();

        if (docError) throw docError;

        console.log(`Downloading: ${doc.filename}`);

        // 2. Download the actual PDF file from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
            .from('documents')
            .download(doc.file_path);

        if (downloadError) throw downloadError;

        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log('Extracting text with pdfjs-dist...');
        
        // 3. Extract raw text from the PDF
        let text = await extractTextFromPDF(buffer);
        
        console.log(`Extracted ${text.length} characters total`);

        if (text.length < 100) {
            console.warn('Warning: Very little text extracted.');
        }

        // 4. Delete old chunks first. If the user clicks "process" twice, this prevents duplicate chunks in DB
        await supabase
            .from('document_chunks')
            .delete()
            .eq('document_id', documentId);

        const chunkSize = 1000;
        const chunks = [];

        // 5. Split text into 1000 character blocks
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push({
                text: text.substring(i, i + chunkSize),
                index: Math.floor(i / chunkSize)
            });
        }

        console.log(`Split into ${chunks.length} chunks`);

        let savedCount = 0;
        let embeddingCount = 0;

        for (const chunk of chunks) {
            // 6. Save the text chunk to DB
            const { data: inserted, error: insertError } = await supabase
                .from('document_chunks')
                .insert({
                    document_id: documentId,
                    chunk_text: chunk.text,
                    chunk_index: chunk.index
                })
                .select();

            if (!insertError && inserted && inserted[0]) {
                savedCount++;

                try {
                    // 7. Convert text chunk into numbers (embedding)
                    const embedding = await getEmbedding(chunk.text);
                    
                    // Convert array of numbers to a string "[0.1, 0.5]" because our DB column is plain text
                    const embeddingString = '[' + embedding.join(',') + ']';

                    // 8. Update the chunk row with the numbers
                    const { error: updateError } = await supabase
                        .from('document_chunks')
                        .update({ embedding: embeddingString })
                        .eq('id', inserted[0].id);

                    if (!updateError) {
                        embeddingCount++;
                        console.log(`Chunk ${chunk.index} embedded (${embeddingCount}/${savedCount})`);
                    }
                } catch (e) {
                    console.log(`Failed to embed chunk ${chunk.index}:`, e.message);
                }
            }
        }

        console.log(`Saved ${savedCount} chunks, ${embeddingCount} embedded`);

        // 9. Mark document as ready so frontend knows chatting is allowed
        await supabase
            .from('documents')
            .update({ status: 'ready' })
            .eq('id', documentId);

        console.log(`Done processing ${doc.filename}\n`);
        res.json({ success: true, chunks: savedCount, embeddings: embeddingCount });

    } catch (error) {
        console.error('Error:', error.message);
        
        // Mark as failed so the frontend doesn't hang waiting forever
        try {
            await supabase
                .from('documents')
                .update({ status: 'failed' })
                .eq('id', documentId);
        } catch (e) { }

        res.status(200).json({ success: false, error: error.message });
    }
});

// Chat endpoint
router.post('/api/chat', async (req, res) => {
    try {
        const { documentId, question, conversationId, userId } = req.body;

        console.log(`Chat request - Document: ${documentId}, Question: ${question}`);

        let currentConversationId = conversationId;

        // 1. If new chat, create a conversation row in DB
        if (!currentConversationId) {
            const { data: newConv, error: convError } = await supabase
                .from('conversations')
                .insert({
                    user_id: userId,
                    document_id: documentId,
                    title: question.substring(0, 50)
                })
                .select()
                .single();
            
            if (newConv) {
                currentConversationId = newConv.id;
                console.log(`Created new conversation: ${currentConversationId}`);
            }
        }

        // 2. Save user question to DB
        await supabase
            .from('messages')
            .insert({
                conversation_id: currentConversationId,
                role: 'user',
                content: question
            });

        console.log('Generating embedding for question...');
        
        // 3. Convert user question into numbers
        const questionEmbedding = await getEmbedding(question);
        
        console.log('Fetching chunks from database...');
        // 4. Get all chunks for this document
        const { data: allChunks, error: fetchError } = await supabase
            .from('document_chunks')
            .select('chunk_text, chunk_index, embedding')
            .eq('document_id', documentId);

        console.log(`Found ${allChunks?.length || 0} chunks in database`);

        let context = "";
        
        if (allChunks && allChunks.length > 0) {
            const similarities = [];
            
            for (const chunk of allChunks) {
                if (!chunk.embedding) {
                    console.log(`Chunk ${chunk.chunk_index} has no embedding, skipping`);
                    continue;
                }
                
                let chunkEmbedding;
                
                // 5. Convert stored string "[0.1, 0.5]" back to real numbers
                if (typeof chunk.embedding === 'string') {
                    try {
                        const cleanStr = chunk.embedding.replace(/[\[\]]/g, '');
                        chunkEmbedding = cleanStr.split(',').map(Number);
                    } catch (e) {
                        console.log(`Failed to parse embedding for chunk ${chunk.chunk_index}`);
                        continue;
                    }
                } else if (Array.isArray(chunk.embedding)) {
                    chunkEmbedding = chunk.embedding;
                } else {
                    console.log(`Unknown embedding type for chunk ${chunk.chunk_index}`);
                    continue;
                }
                
                // 6. Cosine Similarity: checks the angle between question and chunk.
                // Closer to 1 means the chunk is highly relevant to the question.
                let dotProduct = 0;
                let norm1 = 0;
                let norm2 = 0;
                
                for (let i = 0; i < questionEmbedding.length; i++) {
                    dotProduct += questionEmbedding[i] * chunkEmbedding[i];
                    norm1 += questionEmbedding[i] * questionEmbedding[i];
                    norm2 += chunkEmbedding[i] * chunkEmbedding[i];
                }
                
                const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
                
                similarities.push({
                    chunk_text: chunk.chunk_text,
                    chunk_index: chunk.chunk_index,
                    similarity: similarity
                });
            }
            
            // 7. Sort highest score first, grab top 5
            similarities.sort((a, b) => b.similarity - a.similarity);
            const topChunks = similarities.slice(0, 5);
            
            console.log(`Calculated similarities for ${similarities.length} chunks`);
            console.log(`Top ${topChunks.length} chunks:`, 
                topChunks.map(c => ({ index: c.chunk_index, similarity: c.similarity.toFixed(4) })));
            
            if (topChunks.length > 0) {
                // 8. Join top 5 chunks text together to create the context for AI
                context = topChunks.map(c => c.chunk_text).join('\n\n');
                console.log(`Context length: ${context.length} characters`);
            } else {
                console.log('No valid chunks found');
            }
        } else {
            console.log('No chunks found for this document');
        }
        
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

        let answer = "I could not find that information in the document.";

        if (GROQ_API_KEY && context) {
            console.log("Calling Groq API...");

            try {
                // 9. Send the context and the question to AI
                const response = await fetch(GROQ_API_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${GROQ_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "openai/gpt-oss-120b",
                        messages: [
                            {
                                role: "system",
                                // Tell AI to ONLY use our context and not hallucinate
                                content: `Answer based ONLY on this context. If the answer is not present, say "I could not find that information."

                                Context:
                                ${context.substring(0, 4000)}`,
                            },
                            { role: "user", content: question },
                        ],
                        temperature: 0.7,
                        max_tokens: 500,
                    }),
                    // Stop waiting if AI takes more than 30 seconds
                    signal: AbortSignal.timeout(30000),
                });

                console.log("Groq HTTP status:", response.status);

                const groqData = await response.json();

                if (!response.ok) {
                    console.error("Groq API error:", groqData);
                    throw new Error(
                        `Groq returned HTTP ${response.status}: ${
                            groqData.error?.message || JSON.stringify(groqData)
                        }`
                    );
                }

                if (groqData.choices?.[0]) {
                    answer = groqData.choices[0].message.content;
                    console.log("Groq response received");
                } else {
                    console.error("Unexpected Groq response:", groqData);
                    throw new Error("Groq returned no answer");
                }
            } catch (error) {
                console.error("Groq request failed:", error.message);
                console.error("Underlying cause:", error.cause);
                throw error;
            }
        } else if (!context) {
            answer = "No text found in this document. Please make sure the PDF was processed correctly.";
        } else {
            answer = "Groq API key is missing. Please check your environment variables.";
        }

        // 10. Save AI answer to DB for chat history
        await supabase
            .from('messages')
            .insert({
                conversation_id: currentConversationId,
                role: 'assistant',
                content: answer
            });

        // 11. Send answer back to React
        res.json({
            answer: answer,
            conversationId: currentConversationId
        });

    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;