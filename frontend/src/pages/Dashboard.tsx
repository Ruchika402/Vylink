import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import StatsCard from "../components/dashboard/StatsCard";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <button className="text-sm text-[#6C63FF] hover:underline">
              View All →
            </button>
          </div>

          {recentFiles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No files uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentFiles.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-900">{file.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {file.view_count} views
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        file.is_public
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {file.is_public ? "Active" : "Private"}
                    </span>
                    <button className="text-[#6C63FF] text-sm hover:underline">
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
