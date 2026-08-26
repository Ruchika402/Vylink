import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import toast from "react-hot-toast";
import Sidebar from "../components/Layout/Sidebar";

interface File {
  id: number;
  title: string;
  description: string;
  file_url: string;
  view_count: number;
  is_public: boolean;
  uploaded_at: string;
}

const Files: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/images/");
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/images/${id}/`);
      setFiles(files.filter((file) => file.id !== id));
      toast.success("File deleted");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleShare = async (file: File) => {
    try {
      const response = await api.post(`/images/${file.id}/share/`, {
        expires_in: expiryDays
      });
      setShareLink(response.data.full_url || response.data.shareable_link);
      setSelectedFile(file);
      setShowShareModal(true);
    } catch (error) {
      toast.error("Failed to generate share link");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied!");
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "public" && file.is_public) ||
      (filter === "private" && !file.is_public);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        {/* Top Navbar */}
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white text-2xl"
              >
                ☰
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.location.href = "/dashboard"}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition text-sm"
                >
                  + Upload
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">📁 My Files</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-gray-800 p-4 rounded-xl shadow-sm mb-6 border border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  view === "grid"
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  view === "list"
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                List
              </button>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="all">All files</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 flex-1 min-w-[200px] text-sm placeholder-gray-400"
            />
          </div>

          {/* Files List */}
          {filteredFiles.length === 0 ? (
            <div className="bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-700">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-400 text-lg">No files found</p>
              <p className="text-gray-500 text-sm mt-1">
                {search ? "Try adjusting your search" : "Upload your first file to get started!"}
              </p>
            </div>
          ) : view === "list" ? (
            <div className="bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-700 border border-gray-700">
  {filteredFiles.map((file) => (
    <div key={file.id} className="px-6 py-4 hover:bg-gray-700/50 transition flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl flex-shrink-0">📄</span>
        <div className="min-w-0">
          <p className="font-medium text-white">{file.title}</p>
          <p className="text-xs text-gray-400">
            {new Date(file.uploaded_at).toLocaleDateString()} • {file.view_count} views
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className={`text-xs px-2.5 py-1 rounded-full ${
          file.is_public
            ? "bg-green-900/50 text-green-400 border border-green-700"
            : "bg-gray-700 text-gray-400 border border-gray-600"
        }`}>
          {file.is_public ? "Public" : "Private"}
        </span>
        {/* ✅ Share as text link */}
        <button
          onClick={() => handleShare(file)}
          className="text-sm text-primary hover:underline"
        >
          Share
        </button>
        {/* ✅ Delete as text link */}
        <button
          onClick={() => handleDelete(file.id)}
          className="text-sm text-red-400 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 hover:border-gray-500 transition">
                  <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden mb-2">
                    {file.file_url ? (
                      <img src={file.file_url} alt={file.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📄</div>
                    )}
                  </div>
                  <h4 className="font-medium text-white truncate">{file.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(file.uploaded_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      file.is_public
                        ? "bg-green-900/50 text-green-400 border border-green-700"
                        : "bg-gray-700 text-gray-400 border border-gray-600"
                    }`}>
                      {file.is_public ? "Public" : "Private"}
                    </span>
                    <span className="text-xs text-gray-400">{file.view_count} views</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleShare(file)}
                      className="flex-1 text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="flex-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
            <p>Showing {filteredFiles.length} of {files.length} files</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-600 rounded-lg hover:bg-gray-700 transition">←</button>
              <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-gray-600 rounded-lg hover:bg-gray-700 transition">→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">🔗 Share File</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium text-white">{selectedFile.title}</p>
                  <p className="text-xs text-gray-400">{selectedFile.view_count} views</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Link Expires</label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={0}>Never</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition whitespace-nowrap"
                >
                  Copy
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">Anyone with this link can view this file</p>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;