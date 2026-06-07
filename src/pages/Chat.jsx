import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Chat = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-brand-dark/50 backdrop-blur-lg border-b border-brand-light/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-white">
            Chat with Document
          </h1>
          <p className="text-gray-400 text-sm">
            Document ID: {documentId}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center py-16">
          <p className="text-gray-400">
            Chat interface coming soon!
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This will be the AI chat interface for your document
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;