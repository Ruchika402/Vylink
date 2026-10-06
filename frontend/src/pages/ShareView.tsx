import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

interface ShareData {
  id: number;
  title: string;
  description: string;
  file_url: string;
  view_count: number;
  expires_at: string;
  owner_username: string;
}

const ShareView: React.FC = () => {
  const { link } = useParams<{ link: string }>();
  const [data, setData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchShare = async () => {
      try {
        const response = await api.get(`/images/share/${link}/`);
        setData(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("This share link does not exist or has been removed.");
        } else if (err.response?.status === 410) {
          setError("This share link has expired.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (link) fetchShare();
  }, [link]);

  // Countdown timer
  useEffect(() => {
    if (!data?.expires_at) return;

    const updateCountdown = () => {
      const expires = new Date(data.expires_at).getTime();
      const now = Date.now();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) setTimeLeft(`${hours}h ${minutes}m`);
      else if (minutes > 0) setTimeLeft(`${minutes}m ${seconds}s`);
      else setTimeLeft(`${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const handleDownload = () => {
    if (!data?.file_url) return;
    const a = document.createElement("a");
    a.href = data.file_url;
    a.download = data.title || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading shared file...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-700">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-white mb-2">Link Unavailable</h1>
          <p className="text-gray-400">{error}</p>
          <a
            href="/"
            className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Go to Vylink
          </a>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isExpiringSoon = timeLeft && !timeLeft.includes("Expired") && parseInt(timeLeft) < 10;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-primary">
            🔗 Vylink
          </a>
          <p className="text-gray-400 text-sm mt-1">Secure file sharing</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          {/* File Info Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white truncate">{data.title}</h1>
            {data.description && (
              <p className="text-gray-400 mt-1">{data.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              <span>👤 Shared by {data.owner_username}</span>
              <span>👁️ {data.view_count} views</span>
              {timeLeft && (
                <span className={isExpiringSoon ? "text-red-400" : "text-yellow-400"}>
                  ⏱️ Expires in {timeLeft}
                </span>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="p-6 bg-gray-900">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={data.file_url}
                alt={data.title}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  console.error("❌ Image failed to load:", data.file_url);
                  e.currentTarget.src =
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23374151' width='400' height='300'/><text fill='%239CA3AF' x='50%' y='50%' text-anchor='middle' font-family='sans-serif' font-size='20'>Image Unavailable</text></svg>";
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-700 flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 min-w-[150px] bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition font-medium"
            >
              📥 Download
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 min-w-[150px] border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
            >
              🔗 Copy Link
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-900/50 text-center text-xs text-gray-500">
            🔒 This file is served securely via pre-signed S3 URL
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareView;