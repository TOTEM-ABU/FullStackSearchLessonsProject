import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Shield,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface SessionInfo {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

const SessionManagement: React.FC = () => {
  const { logout } = useAuth();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");

      // Since our backend doesn't have a sessions endpoint yet,
      // we'll simulate session data for now
      const currentSession: SessionInfo = {
        id: "current",
        deviceInfo: navigator.userAgent,
        ipAddress: "Current IP",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: true,
      };

      setSessions([currentSession]);
    } catch (error: unknown) {
      console.error("Failed to load sessions:", error);
      setError("Sessiyalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      setRefreshing(true);
      setError("");
      setSuccess("");

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("Refresh token topilmadi");
      }

      const response = await authAPI.refreshToken(refreshToken);
      localStorage.setItem("access_token", response.access_token);

      setSuccess("Token muvaffaqiyatli yangilandi");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: unknown) {
      console.error("Token refresh failed:", error);
      setError(
        "Tokenni yangilashda xatolik yuz berdi. Iltimos, qayta tizimga kiring."
      );

      // If refresh fails, logout user
      setTimeout(() => {
        logout();
      }, 2000);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogoutAllSessions = () => {
    if (
      window.confirm(
        "Barcha qurilmalardagi sessiyalarni tugatishni tasdiqlaysizmi?"
      )
    ) {
      logout();
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return <Smartphone className="h-6 w-6 text-blue-500" />;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="h-6 w-6 text-green-500" />;
    } else {
      return <Monitor className="h-6 w-6 text-gray-500" />;
    }
  };

  const getDeviceType = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return "Mobil qurilma";
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return "Planshet";
    } else {
      return "Kompyuter";
    }
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Noma'lum brauzer";
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    return expiryTime - now < oneDay;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sessiyalar boshqaruvi
          </h2>
          <p className="text-gray-600">
            Faol sessiyalar va xavfsizlik sozlamalari
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefreshToken}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Yangilanmoqda..." : "Tokenni yangilash"}
          </button>
          <button
            onClick={handleLogoutAllSessions}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Barchasidan chiqish
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {/* Security Information */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-blue-800">
            Xavfsizlik ma'lumoti
          </h3>
        </div>
        <div className="mt-2 text-sm text-blue-700">
          <p>• Access token 15 daqiqa davomida faol</p>
          <p>• Refresh token 7 kun davomida faol</p>
          <p>• Shubhali faoliyat aniqlansa, darhol parolni o'zgartiring</p>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Faol sessiyalar
          </h3>
          <p className="text-sm text-gray-600">
            Hozirda tizimga kirgan barcha qurilmalar ro'yxati
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {sessions.map((session) => (
            <div key={session.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getDeviceIcon(session.deviceInfo)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {getDeviceType(session.deviceInfo)}
                      </h4>
                      {session.isCurrent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Joriy sessiya
                        </span>
                      )}
                      {isExpiringSoon(session.expiresAt) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Tez tugaydi
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        <span>{getBrowserInfo(session.deviceInfo)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{session.ipAddress}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          Kirgan vaqt:{" "}
                          {new Date(session.createdAt).toLocaleString("uz-UZ")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>
                          Amal qiladi:{" "}
                          {new Date(session.expiresAt).toLocaleString("uz-UZ")}
                        </span>
                      </div>
                    </div>

                    {/* User Agent Details */}
                    <details className="mt-3">
                      <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                        Texnik ma'lumotlar
                      </summary>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600 font-mono">
                        {session.deviceInfo}
                      </div>
                    </details>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {session.isCurrent ? (
                    <button
                      onClick={handleRefreshToken}
                      disabled={refreshing}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-1 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      Yangilash
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-red-50 hover:bg-red-100">
                      <LogOut className="h-4 w-4 mr-1" />
                      Tugatish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Token Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Token ma'lumotlari
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Access Token</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Amal qilish muddati: 15 daqiqa</p>
              <p>• API so'rovlari uchun ishlatiladi</p>
              <p>• Avtomatik yangilanadi</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Refresh Token</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Amal qilish muddati: 7 kun</p>
              <p>• Access token yangilash uchun</p>
              <p>• Xavfsiz saqlanadi</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="font-medium text-yellow-800">
              Xavfsizlik tavsiyalari
            </h4>
          </div>
          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
            <li>• Ommaviy kompyuterda ishlagandan keyin chiqishni unutmang</li>
            <li>
              • Shubhali harakatlarni aniqlasangiz, darhol parolni o'zgartiring
            </li>
            <li>
              • Bir nechta qurilmada ishlasangiz, vaqti-vaqti bilan sessiyalarni
              tekshiring
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
