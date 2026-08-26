import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";

interface Image {
  id: number;
  title: string;
  description: string;
  file_url: string;
  view_count: number;
  uploaded_at: string;
  owner_username: string;
}

const PublicFeed: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicImages = async () => {
      try {
        const response = await api.get("/images/public/");
        setImages(response.data);
      } catch (error) {
        console.error("Failed to fetch public images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading public images...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">🌐 Public Feed</h1>

        {images.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-400 text-lg">No public images yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Upload an image and make it public to share with the world!
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              + Upload Image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition"
              >
                <div className="aspect-square bg-gray-700">
                  {image.file_url ? (
                    <img
                      src={image.file_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📄
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white truncate">{image.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    By {image.owner_username} • {image.view_count} views
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(image.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFeed;