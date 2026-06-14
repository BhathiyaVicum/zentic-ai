import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { FaTrash, FaFilePdf, FaSpinner, FaUpload } from "react-icons/fa";
import DashboardNavbar from "../components/home/DashboardNavbar";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to load documents");
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  // Handle file upload
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Max 50MB");
      return;
    }

    setUploading(true);
    setError(null);

    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Save to database
    const { data: insertedData, error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      filename: file.name,
      file_size: file.size,
      file_path: filePath,
      status: "pending"
    })
      .select();

    if (dbError) {
      console.error("DB error:", dbError);
      setError(dbError.message);
      setUploading(false);
      return;
    }

    // Trigger Edge Function to process PDF
    const documentId = insertedData[0]?.id;
    if (documentId) {
      const { error: functionError } = await supabase.functions.invoke('process-pdf', {
        body: {
          filePath: filePath,
          userId: user.id,
          documentId: documentId
        }
      });

      if (functionError) {
        console.error("Edge Function error:", functionError);
      }
    }

    fetchDocuments();
    setUploading(false);
  };

  // Delete document
  const handleDelete = async (doc) => {
    if (!confirm(`Delete "${doc.filename}"?`)) return;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([doc.file_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);

    if (dbError) {
      console.error("DB delete error:", dbError);
      setError(dbError.message);
    } else {
      fetchDocuments(); // Refresh list
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="text-secondary-text text-4xl animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/signin");
    return null;
  }

  const truncateFilename = (filename, maxLength = 20) => {

    if (filename.length <= maxLength) return filename;

    const name = filename.split('.');
    const ext = name.pop();
    const baseName = name.join('.');

    // Cut the name and add "..."
    const truncatedBase = baseName.substring(0, maxLength - 3);

    return `${truncatedBase}...`;
  };

  return (
    <div className="min-h-screen bg-black">

      <DashboardNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto md:px-0 px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Documents</h1>
            <p className="text-gray-400 mt-1 hidden sm:block">
              Upload PDFs to start chatting with your documents
            </p>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-2 bg-btn-primary px-5 py-2.5 rounded-xl text-white cursor-pointer hover:opacity-80 transition">
            <FaUpload />
            {uploading ? "Uploading..." : "Upload PDF"}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="text-center py-16 bg-brand-muted/20 rounded-2xl border border-brand-light/10">
            <FaFilePdf className="text-5xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No documents yet</h3>
            <p className="text-gray-400">
              Upload your first PDF to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-brand-muted/30 border border-brand-light/10 rounded-xl p-4 hover:border-brand-light/30 transition"
              >
                <div className="flex items-center gap-4">
                  <FaFilePdf className="text-red-400 text-2xl" />
                  <div>
                    <span className="block md:hidden">
                      {truncateFilename(doc.filename)}
                    </span>

                    <span className="hidden md:block">
                      {doc.filename}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{(doc.file_size / 1024).toFixed(2)} KB</span>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/chat/${doc.id}`)}
                    className="px-4 py-1.5 bg-secondary-text/20 text-secondary-text rounded-lg hover:bg-secondary-text/30 transition"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleDelete(doc)}
                    className=" md:p-2 p-0 text-gray-400 hover:text-red-400 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;