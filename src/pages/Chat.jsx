import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { FaArrowLeft, FaPaperPlane, FaSpinner } from "react-icons/fa";

const Chat = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);


  // Load document info
  useEffect(() => {
    const fetchDocument = async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();
      if (data) setDocument(data);
    };
    fetchDocument();
  }, [documentId]);

  // Load existing conversation or create new one
  useEffect(() => {
    const loadOrCreateConversation = async () => {
      if (!user || !documentId) return;

      // Check for existing conversation
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('document_id', documentId)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Load existing conversation
        setConversationId(existing.id);

        const { data: savedMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', existing.id)
          .order('created_at', { ascending: true });

        if (savedMessages) setMessages(savedMessages);
      } else {
        // Create new conversation
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            document_id: documentId,
            user_id: user.id,
            title: document?.filename || "Chat"
          })
          .select()
          .single();

        if (newConv) setConversationId(newConv.id);
      }
    };

    if (user && documentId && document) {
      loadOrCreateConversation();
    }
  }, [user, documentId, document]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let activeConversationId = conversationId;

    if (!activeConversationId) {
      // Create new conversation
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          document_id: documentId,
          user_id: user.id,
          title: input.trim().substring(0, 50)
        })
        .select()
        .single();

      if (newConv) {
        activeConversationId = newConv.id;
        setConversationId(activeConversationId);
      }
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          documentId: documentId,
          question: userMessage,
          conversationId: activeConversationId
        },
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer,
        citations: data.citations
      }]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        citations: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-brand-dark/50 backdrop-blur-lg border-b border-brand-light/20 px-6 py-6 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white transition p-3 rounded-md bg-brand-dark hover:bg-lime-50/20"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="hidden md:inline-block font-medium">
              {document?.filename}
            </h1>
            <span className="block md:hidden max-w-[300px] truncate">
              {document?.filename}
            </span>
            <p className="text-xs text-gray-400">
              {conversationId ? "Chat history saved" : "New conversation"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 pb-32">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">Ask a question about this document</p>
            <p className="text-sm mt-2">Your chat history will be saved automatically</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                    ? "bg-gradient-to-r from-brand-light to-brand-medium text-white"
                    : "bg-brand-muted/50 text-gray-200"
                    }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.citations && (
                    <div className="mt-2 text-xs opacity-70">
                      Source: Page {msg.citations.page}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-brand-muted/50 rounded-2xl px-4 py-3">
                  <FaSpinner className="animate-spin text-secondary-text" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-lg px-6 py-7">
        <div className="max-w-7xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-5 py-3 bg-brand-dark/90 border border-brand-light/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary-text transition"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-btn-primary rounded-xl text-white hover:opacity-80 transition disabled:opacity-75"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;