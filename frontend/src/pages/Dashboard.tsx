import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import UploadForm from "../components/UploadForm";
import Sidebar from "../components/Layout/Sidebar";

interface Stats {
  total_files: number;
  active_links: number;
  total_views: number;
  expiring_soon: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, filesResponse] = await Promise.all([
        api.get("/dashboard/stats/"),
        api.get("/images/?limit=5"),
      ]);
      setStats(statsResponse.data);
      setRecentFiles(filesResponse.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Loading state with skeletons
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Date
  const today = new Date();
  const dateStr = today
    .toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

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
              <div className="flex items-center space-x-4 ml-auto">
                {" "}
                {/* ✅ ml-auto pushes to right */}
                <p className="text-sm text-gray-300 truncate max-w-[200px] sm:max-w-none">
                  Welcome back, {user?.first_name || user?.username || "User"}{" "}
                  👋
                </p>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ✅ Stats Cards - 4 columns like image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Files */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <p className="text-sm text-gray-400 font-medium">TOTAL FILES</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats?.total_files ?? 0}
              </p>
              <p className="text-xs text-green-400 mt-1">
                {stats?.total_files && stats.total_files > 0
                  ? "+12 this week"
                  : "No files yet"}
              </p>
            </div>

            {/* Active Links */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <p className="text-sm text-gray-400 font-medium">ACTIVE LINKS</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats?.active_links ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.active_links && stats.active_links > 0
                  ? "+3 today"
                  : "No active links"}
              </p>
            </div>

            {/* Total Views */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <p className="text-sm text-gray-400 font-medium">TOTAL VIEWS</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats?.total_views ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.total_views && stats.total_views > 0
                  ? "+284 this week"
                  : "No views yet"}
              </p>
            </div>

            {/* Expiring Soon */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <p className="text-sm text-gray-400 font-medium">EXPIRING SOON</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats?.expiring_soon ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.expiring_soon && stats.expiring_soon > 0
                  ? "Next in 2 days"
                  : "No expiring links"}
              </p>
            </div>
          </div>

          {/* ✅ Quick Actions */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowUpload(true)}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
              >
                📤 Upload New File
              </button>
              <button
                onClick={() => (window.location.href = "/files")}
                className="border border-gray-600 text-gray-300 px-6 py-2.5 rounded-lg hover:border-primary hover:text-primary transition text-sm font-medium flex items-center gap-2"
              >
                📋 Manage Links
              </button>
            </div>
          </div>

          {/* ✅ Recent Activity */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">
                  Recent Activity
                </h2>
                <button
                  onClick={() => (window.location.href = "/files")}
                  className="text-sm text-primary hover:underline"
                >
                  View All →
                </button>
              </div>
            </div>

            {recentFiles.length === 0 ? (
              /* ✅ Empty State */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-gray-400 text-lg font-medium">
                  No files uploaded yet
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload your first file to get started!
                </p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
                >
                  + Upload File
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {recentFiles.map((file: any) => {
                  // ✅ Check if link is expired (older than 7 days)
                  const uploadedAt = new Date(file.uploaded_at);
                  const now = new Date();
                  const daysDiff =
                    (now.getTime() - uploadedAt.getTime()) /
                    (1000 * 60 * 60 * 24);
                  const isExpired = file.is_public && daysDiff > 7;

                  return (
                    <div
                      key={file.id}
                      className="px-6 py-4 hover:bg-gray-700/50 transition flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-medium text-white">{file.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(file.uploaded_at).toLocaleDateString()} •{" "}
                            {file.view_count} views
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {/* ✅ Visual distinction: Private vs Active vs Expired */}
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            file.is_public
                              ? isExpired
                                ? "bg-red-900/50 text-red-400 border border-red-700"
                                : "bg-green-900/50 text-green-400 border border-green-700"
                              : "bg-gray-700 text-gray-400 border border-gray-600"
                          }`}
                        >
                          {file.is_public
                            ? isExpired
                              ? "Expired"
                              : "Active"
                            : "Private"}
                        </span>
                        {!isExpired && (
                          <button className="text-sm text-primary hover:underline">
                            Share
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">📤 Upload Image</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <UploadForm
              onUploadSuccess={() => {
                setShowUpload(false);
                fetchDashboardData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
