import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { documentId, question, conversationId } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    let currentConversationId = conversationId

    if (!currentConversationId) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          document_id: documentId,
          title: question.substring(0, 50)
        })
        .select()
        .single()
      
      if (newConv) {
        currentConversationId = newConv.id
      }
    }

    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: question
      })

    const embeddingResponse = await fetch('http://localhost:3001/api/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: question })
    })
    
    const { embedding } = await embeddingResponse.json()
    
    const { data: chunks } = await supabase
      .rpc('match_document_chunks', {
        query_embedding: embedding,
        doc_id: documentId,
        match_threshold: 0.3,
        match_count: 5
      })

    const context = chunks?.map(c => c.chunk_text).join('\n\n') || ""
    
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    
    let answer = "I could not find that information in the document."

    if (GROQ_API_KEY && context) {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: `Answer based ONLY on this context:\n\n${context.substring(0, 4000)}` },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      const groqData = await response.json()
      if (groqData.choices && groqData.choices[0]) {
        answer = groqData.choices[0].message.content
      }
    }

    await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: answer
      })

    return new Response(
      JSON.stringify({ answer, conversationId: currentConversationId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Chat error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: corsHeaders, status: 500 }
    )
  }
})