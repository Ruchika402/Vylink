import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import StatsCard from "../components/dashboard/StatsCard";
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        {/* Top Navbar - Only hamburger + upload button */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 text-2xl"
              >
                ☰
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition text-sm"
                >
                  + Upload
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header - Now only in main content */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.first_name || user?.username || "User"}! 🎉
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your files today.
            </p>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Files"
            value={stats?.total_files || 0}
            change="+12 this week"
            icon="📄"
            color="bg-blue-500"
          />
          <StatsCard
            title="Active Links"
            value={stats?.active_links || 0}
            change="+3 today"
            icon="🔗"
            color="bg-green-500"
          />
          <StatsCard
            title="Total Views"
            value={stats?.total_views || 0}
            change="+284 this week"
            icon="👁️"
            color="bg-purple-500"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats?.expiring_soon || 0}
            change="Next in 2 days"
            icon="⚠️"
            color="bg-red-500"
          />
        </div>
        

        {/* Quick Actions */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-8">
  <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h3>
  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => setShowUpload(true)}
      className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
    >
      📤 Upload New File
    </button>
    <button
      onClick={() => window.location.href = "/files"}
      className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:border-primary hover:text-primary transition text-sm font-medium flex items-center gap-2"
    >
      📋 Manage Links
    </button>
  </div>
</div>

       {/* Recent Activity */}
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      <button
        onClick={() => window.location.href = "/files"}
        className="text-sm text-primary hover:underline"
      >
        View All →
      </button>
    </div>
  </div>

  {recentFiles.length === 0 ? (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📂</div>
      <p className="text-gray-500">No files uploaded yet.</p>
      <p className="text-sm text-gray-400 mt-1">Upload your first file to get started!</p>
    </div>
  ) : (
    <div className="divide-y divide-gray-100">
      {recentFiles.map((file: any) => (
        <div key={file.id} className="px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-medium text-gray-900">{file.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(file.uploaded_at).toLocaleDateString()} • {file.view_count} views
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              file.is_public
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {file.is_public ? "Active" : "Private"}
            </span>
            <button className="text-sm text-primary hover:underline">
              Share
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
      </div>
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">📤 Upload Image</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
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
    </div>
  );
};

export default Dashboard;
