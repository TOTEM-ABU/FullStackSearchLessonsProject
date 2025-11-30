import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PasswordChangeForm from "../components/user/PasswordChangeForm";
import { regionsAPI } from "../services/api";
import type { Region } from "../types";
import {
  User,
  Lock,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Check,
} from "lucide-react";

const EnhancedProfile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [regions, setRegions] = useState<Region[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    regionId: "",
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        regionId: user.regionId || "",
      });
    }
  }, [user]);

  // Load regions for selection
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const response = await regionsAPI.getRegions({ limit: 100 });
        setRegions(response.data);
      } catch (error: unknown) {
        console.error("Failed to load regions:", error);
      }
    };
    loadRegions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Validate required fields
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim()
      ) {
        setError("Ism, familiya va email majburiy maydonlar");
        return;
      }

      // Phone number validation
      if (
        formData.phoneNumber &&
        !/^\+?[0-9]{9,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))
      ) {
        setError("Telefon raqam formati noto'g'ri");
        return;
      }

      await updateUser(formData);
      setMessage("Profil muvaffaqiyatli yangilandi");
      setEditing(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      let errorMessage = "Profilni yangilashda xatolik yuz berdi";

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        errorMessage = String(error.response.data.message);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        regionId: user.regionId || "",
      });
    }
    setEditing(false);
    setError("");
  };

  const handlePasswordChangeSuccess = () => {
    setMessage(
      "Parol muvaffaqiyatli o'zgartirildi. Iltimos, qayta tizimga kiring."
    );
    setTimeout(() => {
      logout();
    }, 2000);
  };

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

  const userRegion = regions.find((r) => r.id === user.regionId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profil boshqaruvi
          </h1>
          <p className="text-gray-300">Shaxsiy ma'lumotlarni boshqaring</p>
        </div>

        {/* Notification Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg backdrop-blur-sm">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-white/20 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Settings className="h-5 w-5 inline mr-2" />
              Profil ma'lumotlari
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === "password"
                  ? "bg-white/20 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Lock className="h-5 w-5 inline mr-2" />
              Parolni o'zgartirish
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-300 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      Ro'yxatdan o'tgan:{" "}
                      {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Tahrirlash
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Bekor qilish
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ism
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                      placeholder="Ismingizni kiriting"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Familiya
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                      placeholder="Familiyangizni kiriting"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                        placeholder="Email manzilingizni kiriting"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefon raqam
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mintaqa
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        name="regionId"
                        value={formData.regionId}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value="" className="bg-gray-800">
                          Mintaqani tanlang
                        </option>
                        {regions.map((region) => (
                          <option
                            key={region.id}
                            value={region.id}
                            className="bg-gray-800"
                          >
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Current Info Display (when not editing) */}
                {!editing && (
                  <div className="border-t border-white/20 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Joriy ma'lumotlar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-5 w-5 mr-3 text-purple-400" />
                        <span>
                          {user.phoneNumber || "Telefon raqam ko'rsatilmagan"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                        <span>
                          {userRegion?.name || "Mintaqa ko'rsatilmagan"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                        <span>
                          {user.yearOfBirth
                            ? new Date(user.yearOfBirth).getFullYear() + "-yil"
                            : "Tug'ilgan yil ko'rsatilmagan"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div className="max-w-md mx-auto">
                <PasswordChangeForm
                  onSuccess={handlePasswordChangeSuccess}
                  onCancel={() => setActiveTab("profile")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;
