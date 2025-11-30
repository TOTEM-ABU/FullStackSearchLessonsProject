import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Settings,
  Lock,
  Activity,
  BarChart3,
  LogOut,
  ChevronDown,
  Shield,
  Crown,
  RefreshCw,
} from "lucide-react";
import { UserRoles } from "../../types";

const UserQuickActions: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const getRoleIcon = (role: UserRoles) => {
    switch (role) {
      case UserRoles.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-purple-500" />;
      case UserRoles.ADMIN:
        return <Shield className="h-4 w-4 text-blue-500" />;
      case UserRoles.CEO:
        return <Crown className="h-4 w-4 text-orange-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleName = (role: UserRoles) => {
    switch (role) {
      case UserRoles.SUPER_ADMIN:
        return "Super Admin";
      case UserRoles.ADMIN:
        return "Admin";
      case UserRoles.CEO:
        return "CEO";
      default:
        return "Foydalanuvchi";
    }
  };

  const isAdmin =
    user?.role === UserRoles.ADMIN ||
    user?.role === UserRoles.SUPER_ADMIN ||
    user?.role === UserRoles.CEO;

  if (!user) return null;

  return (
    <div className="relative">
      {/* User Avatar and Name */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-gray-300 flex items-center">
            {getRoleIcon(user.role)}
            <span className="ml-1">{getRoleName(user.role)}</span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{getRoleName(user.role)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                Tezkor harakatlar
              </div>

              <Link
                to="/enhanced-profile"
                onClick={closeDropdown}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-400" />
                Profilni boshqarish
              </Link>

              <Link
                to="/sessions"
                onClick={closeDropdown}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Activity className="h-4 w-4 mr-3 text-gray-400" />
                Sessiyalar
              </Link>

              <Link
                to="/activities"
                onClick={closeDropdown}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-3 text-gray-400" />
                Faoliyat tarixi
              </Link>

              <button
                onClick={() => {
                  closeDropdown();
                  // This would trigger the password change modal or navigate to password change
                  navigate("/enhanced-profile");
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Lock className="h-4 w-4 mr-3 text-gray-400" />
                Parolni o'zgartirish
              </button>

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                      Admin amallar
                    </div>

                    <Link
                      to="/admin"
                      onClick={closeDropdown}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-3 text-blue-500" />
                      Admin panel
                    </Link>

                    <Link
                      to="/admin/user-analytics"
                      onClick={closeDropdown}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <BarChart3 className="h-4 w-4 mr-3 text-green-500" />
                      Foydalanuvchilar analitikasi
                    </Link>

                    <Link
                      to="/admin/users"
                      onClick={closeDropdown}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <User className="h-4 w-4 mr-3 text-purple-500" />
                      Foydalanuvchilarni boshqarish
                    </Link>
                  </div>
                </>
              )}

              {/* Account Actions */}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    closeDropdown();
                    // Trigger token refresh
                    const refreshToken = localStorage.getItem("refresh_token");
                    if (refreshToken) {
                      // You can call the refresh API here
                      console.log("Refreshing token...");
                    }
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-3 text-gray-400" />
                  Tokenni yangilash
                </button>

                <button
                  onClick={() => {
                    closeDropdown();
                    handleLogout();
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Tizimdan chiqish
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              <div className="flex justify-between items-center">
                <span>Ro'yxatdan o'tgan:</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                </span>
              </div>
              {user.yearOfBirth && (
                <div className="flex justify-between items-center mt-1">
                  <span>Tug'ilgan yil:</span>
                  <span>{new Date(user.yearOfBirth).getFullYear()}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserQuickActions;
