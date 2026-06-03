import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth(); // ← Clean!
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch documents when user is available
  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) setDocuments(data);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      filename: file.name,
      file_size: file.size,
      file_path: filePath,
      status: "pending"
    });

    if (dbError) {
      console.error(dbError);
    } else {
      fetchDocuments();
    }

    setUploading(false);
  };

  // Handle loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Handle no user
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please sign in</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Documents</h1>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="text-gray-400 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>
        
        <label className="inline-block bg-btn-primary px-6 py-3 rounded-xl text-white cursor-pointer hover:opacity-80">
          {uploading ? "Uploading..." : "+ Upload PDF"}
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
        </label>

        <div className="mt-8 grid gap-4">
          {documents.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No documents yet. Upload your first PDF!
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="bg-brand-muted/30 border border-brand-light/10 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{doc.filename}</p>
                  <p className="text-gray-400 text-sm">
                    Status: {doc.status} | {(doc.file_size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button className="text-secondary-text hover:underline">Chat →</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;