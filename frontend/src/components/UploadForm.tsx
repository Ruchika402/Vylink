import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import api from "../api/client";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("is_public", String(isPublic));

    setUploading(true);
    try {
      await api.post("/images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Image uploaded as ${isPublic ? "Public" : "Private"}! 🎉`);
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      setIsPublic(false);
      onUploadSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ LIGHT Drag & Drop Card */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-gray-400 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="flex flex-col items-center">
            <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
            <p className="mt-2 text-sm text-gray-600">Click or drag to replace</p>
          </div>
        ) : (
          <div className="text-gray-500">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-700">Drag & drop an image here, or click to select</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {/* ✅ LIGHT Inputs */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Image title *"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white text-gray-900"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-white text-gray-900"
      />

      {/* ✅ LIGHT Toggle */}
      <div className="flex items-center space-x-3 py-2">
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            isPublic ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              isPublic ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-sm text-gray-700 font-medium">
          {isPublic ? "🌐 Public" : "🔒 Private"}
        </span>
        <span className="text-xs text-gray-500">
          {isPublic
            ? "Anyone can view this image"
            : "Only you can view this image"}
        </span>
      </div>

      {/* ✅ LIGHT Button */}
      <button
        type="submit"
        disabled={uploading || !file}
        className={`w-full py-2 rounded-md text-white font-medium transition ${
          uploading || !file
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  );
};

export default UploadForm;