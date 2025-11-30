import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Activity,
  Calendar,
  Clock,
  Monitor,
  LogIn,
  LogOut,
  Edit,
  Key,
  User,
  Shield,
  RefreshCw,
  MapPin,
  Smartphone,
  Tablet,
  Filter,
  Search,
} from "lucide-react";

interface UserActivity {
  id: string;
  type:
    | "login"
    | "logout"
    | "profile_update"
    | "password_change"
    | "token_refresh"
    | "registration";
  description: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  location?: string;
  success: boolean;
}

const UserActivities: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "security" | "profile">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);

      // Since we don't have a real activities API, we'll simulate some activities
      const simulatedActivities: UserActivity[] = [
        {
          id: "1",
          type: "login",
          description: "Tizimga muvaffaqiyatli kirish",
          timestamp: new Date().toISOString(),
          ipAddress: "192.168.1.1",
          deviceInfo: navigator.userAgent,
          location: "Toshkent, O'zbekiston",
          success: true,
        },
        {
          id: "2",
          type: "registration",
          description: "Hisobni ro'yxatdan o'tkazish",
          timestamp: user?.createdAt || new Date().toISOString(),
          ipAddress: "192.168.1.1",
          deviceInfo:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          location: "Toshkent, O'zbekiston",
          success: true,
        },
        {
          id: "3",
          type: "profile_update",
          description: "Profil ma'lumotlari yangilandi",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          ipAddress: "192.168.1.1",
          deviceInfo: navigator.userAgent,
          location: "Toshkent, O'zbekiston",
          success: true,
        },
        {
          id: "4",
          type: "token_refresh",
          description: "Access token yangilandi",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          ipAddress: "192.168.1.1",
          deviceInfo: navigator.userAgent,
          success: true,
        },
      ];

      setActivities(simulatedActivities);
    } catch (error: unknown) {
      console.error("Failed to load activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: UserActivity["type"]) => {
    switch (type) {
      case "login":
        return <LogIn className="h-5 w-5 text-green-500" />;
      case "logout":
        return <LogOut className="h-5 w-5 text-red-500" />;
      case "profile_update":
        return <Edit className="h-5 w-5 text-blue-500" />;
      case "password_change":
        return <Key className="h-5 w-5 text-purple-500" />;
      case "token_refresh":
        return <RefreshCw className="h-5 w-5 text-orange-500" />;
      case "registration":
        return <User className="h-5 w-5 text-indigo-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: UserActivity["type"]) => {
    switch (type) {
      case "login":
        return "border-green-200 bg-green-50";
      case "logout":
        return "border-red-200 bg-red-50";
      case "profile_update":
        return "border-blue-200 bg-blue-50";
      case "password_change":
        return "border-purple-200 bg-purple-50";
      case "token_refresh":
        return "border-orange-200 bg-orange-50";
      case "registration":
        return "border-indigo-200 bg-indigo-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return <Smartphone className="h-4 w-4 text-gray-400" />;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="h-4 w-4 text-gray-400" />;
    } else {
      return <Monitor className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const activityTime = new Date(timestamp).getTime();
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Hozir";
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} soat oldin`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} kun oldin`;
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "security" &&
        ["login", "logout", "password_change", "token_refresh"].includes(
          activity.type
        )) ||
      (filter === "profile" &&
        ["profile_update", "registration"].includes(activity.type));

    const matchesSearch =
      searchTerm === "" ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.ipAddress.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">Iltimos, tizimga kiring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Faoliyat tarixi
          </h1>
          <p className="text-gray-300">Hisobingiz bo'yicha barcha harakatlar</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Faoliyat yoki IP manzil bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all" className="bg-gray-800">
                  Barcha faoliyatlar
                </option>
                <option value="security" className="bg-gray-800">
                  Xavfsizlik
                </option>
                <option value="profile" className="bg-gray-800">
                  Profil
                </option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadActivities}
              disabled={loading}
              className="flex items-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Yangilash
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 animate-pulse"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 bg-white/20 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/20 rounded w-3/4"></div>
                      <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-12 text-center">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                Faoliyat topilmadi
              </h3>
              <p className="text-gray-300">
                Sizning qidiruv mezonlaringiz bo'yicha faoliyat topilmadi.
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6 hover:bg-white/15 transition-colors ${getActivityColor(
                  activity.type
                )}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {activity.description}
                      </h3>
                      <div className="flex items-center text-sm text-gray-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(activity.timestamp).toLocaleString("uz-UZ")}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{activity.ipAddress}</span>
                        {activity.location && (
                          <span className="ml-1">({activity.location})</span>
                        )}
                      </div>

                      <div className="flex items-center">
                        {getDeviceIcon(activity.deviceInfo)}
                        <span className="ml-2 truncate">
                          {activity.deviceInfo.split(" ")[0]} Browser
                        </span>
                      </div>
                    </div>

                    {/* Success/Failure Status */}
                    <div className="mt-3 flex items-center">
                      {activity.success ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Muvaffaqiyatli
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Muvaffaqiyatsiz
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Faoliyat statistikasi
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.type === "login").length}
              </div>
              <div className="text-sm text-gray-300">Kirishlar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.type === "profile_update").length}
              </div>
              <div className="text-sm text-gray-300">
                Profil yangilanishlari
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.type === "token_refresh").length}
              </div>
              <div className="text-sm text-gray-300">Token yangilanishlari</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {activities.filter((a) => a.success).length}
              </div>
              <div className="text-sm text-gray-300">
                Muvaffaqiyatli amallar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivities;
