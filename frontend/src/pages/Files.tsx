import React, { useState, useEffect } from "react";
import api from "../api/client";
import toast from "react-hot-toast";

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
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "public" | "private">("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Fetch files
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

  // Delete file
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

  // Generate share link
  const handleShare = async (file: File) => {
    try {
      const response = await api.post(`/images/${file.id}/share/`);
      setShareLink(response.data.full_url || response.data.shareable_link);
      setSelectedFile(file);
      setShowShareModal(true);
    } catch (error) {
      toast.error("Failed to generate share link");
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied!");
  };

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "public" && file.is_public) ||
      (filter === "private" && !file.is_public);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📁 My Files</h1>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            + Upload
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                view === "grid"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                view === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              List
            </button>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 flex-1 min-w-[200px] text-sm"
          />
        </div>

        {/* Files Grid/List */}
        {filteredFiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-500 text-lg">No files found</p>
            <p className="text-gray-400 text-sm mt-1">
              Upload your first file to get started!
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                  {file.file_url ? (
                    <img
                      src={file.file_url}
                      alt={file.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📄
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-800 truncate">
                  {file.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(file.uploaded_at).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      file.is_public
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {file.is_public ? "Public" : "Private"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {file.view_count} views
                  </span>
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
        ) : (
          <div className="bg-white rounded-xl shadow-sm divide-y">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">📄</span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {file.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.uploaded_at).toLocaleDateString()} •{" "}
                      {file.view_count} views
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      file.is_public
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {file.is_public ? "Public" : "Private"}
                  </span>
                  <button
                    onClick={() => handleShare(file)}
                    className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🔗 Share File</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-medium">{selectedFile.title}</p>
                  <p className="text-xs text-gray-500">
                    {selectedFile.view_count} views
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition whitespace-nowrap"
                >
                  Copy
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Anyone with this link can view this file
              </p>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
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
