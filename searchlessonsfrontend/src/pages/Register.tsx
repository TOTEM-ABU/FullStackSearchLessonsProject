import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserRoles } from "../types";
import { regionsAPI } from "../services/api";

// Predefined regions data to avoid API dependency
// Using actual regions from the database as fallback
const REGIONS = [
  { id: "cabc552e-76b4-4e4b-80db-fa1b80ee7723", name: "Toshkent" },
  { id: "405d2c71-a278-4251-a698-348e112dcfe6", name: "Samarqand" },
  { id: "2d7902b2-68f7-401a-bffa7-eb5171925065", name: "Buxoro" },
  { id: "b9de8194-ddec-44cf-be31-19e4788368c6", name: "Andijon" },
  { id: "73150a57-1ff9-44eb-8fac-0a743f3a0f68", name: "Farg'ona" },
];

const Register: React.FC = () => {
  const [regions, setRegions] = useState(REGIONS);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    yearOfBirth: "",
    password: "",
    confirmPassword: "",
    role: UserRoles.USER,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    regionId: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Fetch real regions from backend
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setRegionsLoading(true);
        console.log("Attempting to fetch regions from backend...");
        console.log("Current regions state before API call:", regions);

        const response = await regionsAPI.getRegions({ limit: 100 });
        console.log("Regions API response:", response);

        if (response.data && response.data.length > 0) {
          const fetchedRegions = response.data.map((region) => ({
            id: region.id,
            name: region.name,
          }));
          setRegions(fetchedRegions);
          console.log("Successfully fetched real regions:", fetchedRegions);
        } else {
          console.log("No regions found in response, keeping fallback regions");
          console.log("Fallback regions being used:", REGIONS);
        }
      } catch (error) {
        console.error("Failed to fetch regions from backend:", error);
        console.log("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          status:
            error && typeof error === "object" && "response" in error
              ? (error as { response?: { status?: number } }).response?.status
              : "Unknown",
        });
        console.log("Keeping fallback regions due to error:", REGIONS);
        // Keep using the predefined REGIONS
      } finally {
        setRegionsLoading(false);
        console.log("Regions loading completed. Final regions state:", regions);
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError("Ism kiritish majburiy");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Familiya kiritish majburiy");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email kiritish majburiy");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email formatini to'g'ri kiriting");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Telefon raqam kiritish majburiy");
      return false;
    }
    // More flexible phone number validation
    const phoneClean = formData.phoneNumber.replace(/[\s\-()+ ]/g, "");
    if (!/^[0-9]{9,15}$/.test(phoneClean)) {
      setError("Telefon raqamini to'g'ri kiriting (faqat raqamlar, 9-15 ta)");
      return false;
    }
    if (!formData.yearOfBirth || !/^\d{4}$/.test(formData.yearOfBirth)) {
      setError("Tug'ilgan yilni to'g'ri kiriting (4 ta raqam)");
      return false;
    }
    const birthYear = parseInt(formData.yearOfBirth);
    const currentYear = new Date().getFullYear();
    if (birthYear < 1900 || birthYear > currentYear - 5) {
      setError("Tug'ilgan yilni to'g'ri kiriting (1900-dan hozirgi kungacha)");
      return false;
    }
    if (formData.password.length < 4 || formData.password.length > 8) {
      setError("Parol 4-8 ta belgidan iborat bo'lishi kerak");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Parollar mos kelmadi");
      return false;
    }
    if (!formData.regionId || formData.regionId === "") {
      setError("Viloyatni tanlang");
      return false;
    }
    // Ensure regionId is valid
    const validRegionIds = regions.map((r) => r.id);
    if (!validRegionIds.includes(formData.regionId)) {
      setError("Noto'g'ri viloyat tanlangan");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      console.log("Form data before processing:", formData);
      console.log("Current regions state:", regions);
      console.log("Selected regionId:", formData.regionId);
      console.log(
        "Is selected regionId valid?",
        regions.some((r) => r.id === formData.regionId)
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = formData;

      // Send yearOfBirth as string (the backend expects string format)
      const registrationData = {
        ...userData,
        yearOfBirth: userData.yearOfBirth, // Keep as string
      };

      console.log(
        "Sending registration data:",
        JSON.stringify(registrationData, null, 2)
      );
      console.log("Data types:", {
        firstName: typeof registrationData.firstName,
        lastName: typeof registrationData.lastName,
        email: typeof registrationData.email,
        phoneNumber: typeof registrationData.phoneNumber,
        yearOfBirth: typeof registrationData.yearOfBirth,
        password: typeof registrationData.password,
        role: typeof registrationData.role,
        avatar: typeof registrationData.avatar,
        regionId: typeof registrationData.regionId,
      });

      await register(registrationData);

      // Redirect to OTP verification
      navigate("/auth/verify-otp", {
        state: {
          email: formData.email,
          message:
            "Ro'yxatdan muvaffaqiyatli o'tildi. Email tasdiqini bajaring.",
        },
      });
    } catch (error: unknown) {
      console.error("Registration failed:", error);

      // Extract more detailed error message from API response
      let errorMessage =
        "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string };
            status?: number;
          };
        };
        console.log("Full error response:", axiosError.response);

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
          // Check for specific UUID validation error
          if (
            errorMessage.toLowerCase().includes("uuid") ||
            errorMessage.toLowerCase().includes("region")
          ) {
            errorMessage =
              "Viloyat ma'lumotlari noto'g'ri. Iltimos, qaytadan urinib ko'ring.";
          }
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.response?.status === 400) {
          errorMessage =
            "Yuborilgan ma'lumotlar noto'g'ri formatda. Iltimos, barcha maydonlarni to'g'ri to'ldiring.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Ro'yxatdan O'tish
          </h2>
          <p className="text-gray-300">
            Allaqachon hisobingiz bormi?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Kirish
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Ism"
                />
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Familiya"
                />
              </div>

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Email"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Telefon"
                />
                <input
                  type="number"
                  name="yearOfBirth"
                  required
                  value={formData.yearOfBirth}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() - 5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Tug'ilgan yil"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="regionId"
                  required
                  value={formData.regionId}
                  onChange={handleChange}
                  disabled={regionsLoading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                >
                  <option value="" className="bg-gray-800">
                    {regionsLoading ? "Viloyatlar yuklanmoqda..." : "Viloyat"}
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
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value={UserRoles.USER} className="bg-gray-800">
                    👤 Foydalanuvchi
                  </option>
                  <option value={UserRoles.ADMIN} className="bg-gray-800">
                    ⚙️ Administrator
                  </option>
                  <option value={UserRoles.CEO} className="bg-gray-800">
                    👑 Direktor
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Parol (4-8)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          showPassword
                            ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        }
                      />
                    </svg>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Parolni tasdiqlash"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          showConfirmPassword
                            ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        }
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-4 px-4 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white transition-all duration-200 transform hover:scale-105 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Yuklanmoqda...
                  </>
                ) : (
                  <>🚀 Ro'yxatdan O'tish</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
