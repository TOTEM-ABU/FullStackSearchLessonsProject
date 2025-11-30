import React, { useState } from "react";
import { authAPI } from "../../services/api";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordChangeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.oldPassword) {
      setError("Joriy parolni kiriting");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Yangi parol barcha talablarga javob berishi kerak");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Yangi parollar mos kelmaydi");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("Yangi parol joriy paroldan farq qilishi kerak");
      return;
    }

    try {
      setLoading(true);

      await authAPI.updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setSuccess("Parol muvaffaqiyatli o'zgartirildi!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (error: unknown) {
      console.error("Password change error:", error);

      let errorMessage = "Parolni o'zgartirishda xatolik yuz berdi";

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
        const message = String(error.response.data.message);
        if (message.includes("wrong") || message.includes("invalid")) {
          errorMessage = "Joriy parol noto'g'ri";
        } else {
          errorMessage = message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const ValidationIndicator: React.FC<{ isValid: boolean; text: string }> = ({
    isValid,
    text,
  }) => (
    <div
      className={`flex items-center text-sm ${
        isValid ? "text-green-600" : "text-gray-400"
      }`}
    >
      {isValid ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <X className="h-4 w-4 mr-2" />
      )}
      {text}
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Lock className="h-6 w-6 text-indigo-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">
          Parolni o'zgartirish
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joriy parol
          </label>
          <div className="relative">
            <input
              type={showPasswords.old ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Joriy parolni kiriting"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("old")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.old ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yangi parol
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Yangi parolni kiriting"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="mt-2 space-y-1">
              <ValidationIndicator
                isValid={passwordValidation.minLength}
                text="Kamida 8 ta belgi"
              />
              <ValidationIndicator
                isValid={passwordValidation.hasUpper}
                text="Katta harf (A-Z)"
              />
              <ValidationIndicator
                isValid={passwordValidation.hasLower}
                text="Kichik harf (a-z)"
              />
              <ValidationIndicator
                isValid={passwordValidation.hasNumber}
                text="Raqam (0-9)"
              />
              <ValidationIndicator
                isValid={passwordValidation.hasSpecial}
                text="Maxsus belgi (!@#$%^&*)"
              />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Yangi parolni tasdiqlang
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Yangi parolni qayta kiriting"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {formData.confirmPassword &&
            formData.newPassword !== formData.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">Parollar mos kelmaydi</p>
            )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={
              loading ||
              !passwordValidation.isValid ||
              formData.newPassword !== formData.confirmPassword
            }
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "O'zgartirilmoqda..." : "Parolni o'zgartirish"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
