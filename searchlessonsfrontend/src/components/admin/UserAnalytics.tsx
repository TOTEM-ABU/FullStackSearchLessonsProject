import React, { useState, useEffect } from "react";
import { usersAPI, regionsAPI } from "../../services/api";
import { User, Region, UserRoles } from "../../types";
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  MapPin,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  roles: Record<UserRoles, number>;
  regions: Record<string, { name: string; count: number }>;
  recentRegistrations: User[];
}

const UserAnalytics: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    roles: {
      [UserRoles.USER]: 0,
      [UserRoles.ADMIN]: 0,
      [UserRoles.CEO]: 0,
      [UserRoles.SUPER_ADMIN]: 0,
    },
    regions: {},
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load all users to calculate statistics
      const [usersResponse, regionsResponse] = await Promise.all([
        usersAPI.getUsers({ limit: 10000 }), // Get all users
        regionsAPI.getRegions({ limit: 1000 }), // Get all regions
      ]);

      const users = usersResponse.data;
      const regionsData = regionsResponse.data;
      setRegions(regionsData);

      // Calculate statistics
      const activeUsers = users.filter((user) => user.status);
      const inactiveUsers = users.filter((user) => !user.status);

      // Count users by roles
      const rolesCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<UserRoles, number>);

      // Count users by regions
      const regionsCounts = users.reduce((acc, user) => {
        if (user.regionId && user.Region) {
          const regionId = user.regionId;
          if (!acc[regionId]) {
            acc[regionId] = {
              name: user.Region.name,
              count: 0,
            };
          }
          acc[regionId].count++;
        }
        return acc;
      }, {} as Record<string, { name: string; count: number }>);

      // Get recent registrations (last 10 users)
      const recentUsers = users
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

      setStats({
        total: users.length,
        active: activeUsers.length,
        inactive: inactiveUsers.length,
        roles: {
          [UserRoles.USER]: rolesCounts[UserRoles.USER] || 0,
          [UserRoles.ADMIN]: rolesCounts[UserRoles.ADMIN] || 0,
          [UserRoles.CEO]: rolesCounts[UserRoles.CEO] || 0,
          [UserRoles.SUPER_ADMIN]: rolesCounts[UserRoles.SUPER_ADMIN] || 0,
        },
        regions: regionsCounts,
        recentRegistrations: recentUsers,
      });
    } catch (error: unknown) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: UserRoles) => {
    switch (role) {
      case UserRoles.SUPER_ADMIN:
        return <Crown className="h-5 w-5 text-purple-500" />;
      case UserRoles.ADMIN:
        return <Shield className="h-5 w-5 text-blue-500" />;
      case UserRoles.CEO:
        return <Crown className="h-5 w-5 text-orange-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role: UserRoles) => {
    switch (role) {
      case UserRoles.SUPER_ADMIN:
        return "from-purple-500 to-purple-600";
      case UserRoles.ADMIN:
        return "from-blue-500 to-blue-600";
      case UserRoles.CEO:
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatRoleName = (role: UserRoles) => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topRegions = Object.entries(stats.regions)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Foydalanuvchilar analitikasi
          </h2>
          <p className="text-gray-600">
            Foydalanuvchilar faoliyati va statistikasi
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Activity className="h-4 w-4 mr-2" />
          Yangilash
        </button>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Jami foydalanuvchilar</p>
              <p className="text-3xl font-bold">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Faol foydalanuvchilar</p>
              <p className="text-3xl font-bold">
                {stats.active.toLocaleString()}
              </p>
              <p className="text-sm text-green-100">
                {stats.total > 0
                  ? ((stats.active / stats.total) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <UserCheck className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Nofaol foydalanuvchilar</p>
              <p className="text-3xl font-bold">
                {stats.inactive.toLocaleString()}
              </p>
              <p className="text-sm text-red-100">
                {stats.total > 0
                  ? ((stats.inactive / stats.total) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <UserX className="h-12 w-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Adminlar</p>
              <p className="text-3xl font-bold">
                {(
                  stats.roles[UserRoles.ADMIN] +
                  stats.roles[UserRoles.SUPER_ADMIN] +
                  stats.roles[UserRoles.CEO]
                ).toLocaleString()}
              </p>
            </div>
            <Shield className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Rollar bo'yicha taqsimot
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(stats.roles).map(([role, count]) => {
              const roleType = role as UserRoles;
              const percentage =
                stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getRoleIcon(roleType)}
                    <span className="ml-2 font-medium text-gray-700">
                      {formatRoleName(roleType)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getRoleColor(
                          roleType
                        )}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Regions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Top mintaqalar
            </h3>
          </div>

          <div className="space-y-4">
            {topRegions.map(([regionId, data], index) => {
              const percentage =
                stats.total > 0 ? (data.count / stats.total) * 100 : 0;

              return (
                <div
                  key={regionId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full bg-indigo-${
                        (index + 1) * 100
                      } flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {index + 1}
                    </div>
                    <MapPin className="h-4 w-4 text-gray-400 mx-2" />
                    <span className="font-medium text-gray-700">
                      {data.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8 text-right">
                      {data.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              So'nggi ro'yxatdan o'tganlar
            </h3>
          </div>
          <span className="text-sm text-gray-500">So'nggi 10 ta</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foydalanuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sana
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentRegistrations.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="ml-2 text-sm text-gray-900">
                        {formatRoleName(user.role)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.status ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Faol
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <UserX className="h-3 w-3 mr-1" />
                        Nofaol
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString("uz-UZ")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
