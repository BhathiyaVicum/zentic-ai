import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let documentId: string | undefined
  
  try {
    // Log request method and headers for debugging
    console.log(`Request method: ${req.method}`)
    console.log(`Request headers:`, Object.fromEntries(req.headers.entries()))
    
    // Parse the request body
    let body
    try {
      body = await req.json()
      console.log('Request body:', body)
    } catch (e) {
      console.error('Failed to parse JSON:', e)
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    const { filePath, userId, documentId: docId } = body
    documentId = docId
    
    // Validate required fields
    if (!filePath) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing filePath' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing userId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    if (!documentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing documentId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1 - Download the PDF from storage
    console.log(`Downloading PDF from: ${filePath}`)
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (downloadError) {
      console.error('Download error:', downloadError)
      throw new Error(`Failed to download PDF: ${downloadError.message}`)
    }
    
    if (!fileData) {
      throw new Error('No file data received from storage')
    }
    
    console.log(`PDF downloaded, size: ${fileData.size} bytes`)

    // 2 - Convert to text
    const text = await extractTextFromPDF(fileData)
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF')
    }

    console.log(`Extracted ${text.length} characters from PDF`)

    // 3 - Split into chunks
    const chunkSize = 500
    const chunks = []
    
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push({
        text: text.substring(i, i + chunkSize),
        index: Math.floor(i / chunkSize)
      })
    }

    console.log(`Split into ${chunks.length} chunks`)

    // 4 - Save chunks to database
    for (const chunk of chunks) {
      const { error: insertError } = await supabase
        .from('document_chunks')
        .insert({
          document_id: documentId,
          chunk_text: chunk.text,
          chunk_index: chunk.index
        })
      
      if (insertError) {
        console.error('Error inserting chunk:', insertError)
        // Don't throw, continue with other chunks
      }
    }

    // 5 - Update document status to 'ready'
    const { error: updateError } = await supabase
      .from('documents')
      .update({ status: 'ready' })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document status:', updateError)
      throw new Error(`Failed to update document status: ${updateError.message}`)
    }

    console.log('Document processing completed successfully')
    
    return new Response(
      JSON.stringify({ success: true, chunks: chunks.length, characters: text.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in edge function:', error.message)
    console.error('Error stack:', error.stack)
    
    // Update document status to 'failed' if we have documentId
    if (documentId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey)
          await supabase
            .from('documents')
            .update({ status: 'failed' })
            .eq('id', documentId)
        }
      } catch (updateError) {
        console.error('Failed to update document status:', updateError)
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Simple PDF text extractor that works with Deno
async function extractTextFromPDF(fileData: Blob): Promise<string> {
  try {
    const arrayBuffer = await fileData.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    let text = ''
    const pdfString = new TextDecoder('latin1').decode(uint8Array)
    
    // Look for text between BT (Begin Text) and ET (End Text) operators
    const textMatches = pdfString.match(/BT(.*?)ET/gs)
    
    if (textMatches) {
      for (const match of textMatches) {
        const stringMatches = match.match(/\(([^)]*)\)/g)
        if (stringMatches) {
          for (const str of stringMatches) {
            let cleanText = str.slice(1, -1)
            cleanText = cleanText.replace(/\\[0-9]{3}/g, ' ')
            cleanText = cleanText.replace(/\\[()\\]/g, ' ')
            cleanText = cleanText.replace(/\s+/g, ' ')
            text += cleanText + ' '
          }
        }
      }
    }
    
    // If no text found, try a simpler approach
    if (text.trim().length === 0) {
      const readableText = pdfString.match(/[A-Za-z0-9\s.,!?;:'"()-]{20,}/g)
      if (readableText) {
        text = readableText.join(' ')
      }
    }
    
    // Clean up
    text = text
      .replace(/\0/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    return text
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    return ''
  }
}