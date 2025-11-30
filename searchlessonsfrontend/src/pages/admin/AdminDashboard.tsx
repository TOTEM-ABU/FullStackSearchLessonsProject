import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  GitBranch,
  BookOpen,
  Tag,
  FileText,
  TrendingUp,
  Activity,
  MapPin,
  Star,
} from "lucide-react";
import {
  usersAPI,
  educationalCentersAPI,
  branchesAPI,
  fieldsAPI,
  subjectsAPI,
  resourcesAPI,
  regionsAPI,
  starsAPI,
} from "../../services/api";

interface DashboardStats {
  users: number;
  educationalCenters: number;
  branches: number;
  fields: number;
  subjects: number;
  resources: number;
  regions: number;
  stars: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    educationalCenters: 0,
    branches: 0,
    fields: 0,
    subjects: 0,
    resources: 0,
    regions: 0,
    stars: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load all stats in parallel
      const [
        usersRes,
        centersRes,
        branchesRes,
        fieldsRes,
        subjectsRes,
        resourcesRes,
        regionsRes,
        starsRes,
      ] = await Promise.allSettled([
        usersAPI.getUsers({ limit: 1 }),
        educationalCentersAPI.getCenters({ limit: 1 }),
        branchesAPI.getBranches({ limit: 1 }),
        fieldsAPI.getFields({ limit: 1 }),
        subjectsAPI.getSubjects({ limit: 1 }),
        resourcesAPI.getResources({ limit: 1 }),
        regionsAPI.getRegions({ limit: 1 }),
        starsAPI.getStars({ limit: 1 }),
      ]);

      setStats({
        users: usersRes.status === "fulfilled" ? usersRes.value.total : 0,
        educationalCenters:
          centersRes.status === "fulfilled" ? centersRes.value.total : 0,
        branches:
          branchesRes.status === "fulfilled" ? branchesRes.value.total : 0,
        fields: fieldsRes.status === "fulfilled" ? fieldsRes.value.total : 0,
        subjects:
          subjectsRes.status === "fulfilled" ? subjectsRes.value.total : 0,
        resources:
          resourcesRes.status === "fulfilled" ? resourcesRes.value.total : 0,
        regions: regionsRes.status === "fulfilled" ? regionsRes.value.total : 0,
        stars: starsRes.status === "fulfilled" ? starsRes.value.total : 0,
      });
    } catch (err) {
      setError("Statistikalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Foydalanuvchilar",
      value: stats.users,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/users",
    },
    {
      name: "Ta'lim markazlari",
      value: stats.educationalCenters,
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/educational-centers",
    },
    {
      name: "Filiallar",
      value: stats.branches,
      icon: GitBranch,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/branches",
    },
    {
      name: "Mintaqalar",
      value: stats.regions,
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-100",
      href: "/admin/regions",
    },
    {
      name: "Yo'nalishlar",
      value: stats.fields,
      icon: BookOpen,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      href: "/admin/fields",
    },
    {
      name: "Fanlar",
      value: stats.subjects,
      icon: Tag,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      href: "/admin/subjects",
    },
    {
      name: "Resurslar",
      value: stats.resources,
      icon: FileText,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      href: "/admin/resources",
    },
    {
      name: "Baholar",
      value: stats.stars,
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/admin/stars",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Tizim statistikalari va boshqaruv paneli
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>
              So'nggi yangilanish: {new Date().toLocaleString("uz-UZ")}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadDashboardStats}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => window.open(stat.href, "_self")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Batafsil ko'rish</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tez amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => window.open("/admin/users/create", "_self")}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <Users className="h-8 w-8 text-indigo-600 mb-2" />
            <h3 className="font-medium text-gray-900">Yangi foydalanuvchi</h3>
            <p className="text-sm text-gray-500">
              Tizimga yangi foydalanuvchi qo'shish
            </p>
          </button>

          <button
            onClick={() =>
              window.open("/admin/educational-centers/create", "_self")
            }
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <Building className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Yangi ta'lim markazi</h3>
            <p className="text-sm text-gray-500">
              Ta'lim markazini ro'yxatga olish
            </p>
          </button>

          <button
            onClick={() => window.open("/admin/regions/create", "_self")}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
          >
            <MapPin className="h-8 w-8 text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">Yangi mintaqa</h3>
            <p className="text-sm text-gray-500">
              Tizimga yangi mintaqa qo'shish
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity - Placeholder for now */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          So'nggi faoliyat
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>So'nggi faoliyat ma'lumotlari tez orada qo'shiladi</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
