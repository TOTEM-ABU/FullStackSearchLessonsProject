import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import {
  Users,
  Building,
  GitBranch,
  BookOpen,
  Tag,
  FileText,
  MapPin,
  Star,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: window.location.pathname === "/admin",
    },
    {
      name: "Foydalanuvchilar",
      href: "/admin/users",
      icon: Users,
      current: window.location.pathname.startsWith("/admin/users"),
    },
    {
      name: "Ta'lim markazlari",
      href: "/admin/educational-centers",
      icon: Building,
      current: window.location.pathname.startsWith(
        "/admin/educational-centers"
      ),
    },
    {
      name: "Filiallar",
      href: "/admin/branches",
      icon: GitBranch,
      current: window.location.pathname.startsWith("/admin/branches"),
    },
    {
      name: "Mintaqalar",
      href: "/admin/regions",
      icon: MapPin,
      current: window.location.pathname.startsWith("/admin/regions"),
    },
    {
      name: "Yo'nalishlar",
      href: "/admin/fields",
      icon: BookOpen,
      current: window.location.pathname.startsWith("/admin/fields"),
    },
    {
      name: "Fanlar",
      href: "/admin/subjects",
      icon: Tag,
      current: window.location.pathname.startsWith("/admin/subjects"),
    },
    {
      name: "Resurslar",
      href: "/admin/resources",
      icon: FileText,
      current: window.location.pathname.startsWith("/admin/resources"),
    },
    {
      name: "Baholar",
      href: "/admin/stars",
      icon: Star,
      current: window.location.pathname.startsWith("/admin/stars"),
    },
    {
      name: "Qidiruv",
      href: "/admin/search",
      icon: Search,
      current: window.location.pathname.startsWith("/admin/search"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if user is authenticated and has admin permissions
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    user.role !== "CEO"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ruxsat berilmagan
          </h1>
          <p className="text-gray-600 mb-4">
            Ushbu sahifaga kirish uchun admin huquqlari kerak.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Asosiy sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl transform transition-transform ease-in-out duration-300">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? "bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      item.current
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Mobile user info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-700">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {menuItems.find((item) => item.current)?.name ||
                    "Admin Dashboard"}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              {/* Desktop user menu */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>

                <div className="relative">
                  <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">
                    Chiqish
                  </span>
                </button>
              </div>

              {/* Mobile user avatar */}
              <div className="sm:hidden">
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-700">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
