import React, { useState, useEffect } from "react";
import ResponsiveDataDisplay from "../../components/admin/ResponsiveDataDisplay";
import { type TableColumn } from "../../components/admin/DataTable";
import UserForm from "../../components/admin/UserForm";
import { usersAPI, regionsAPI } from "../../services/api";
import { type User, UserRoles, type Region } from "../../types";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Crown,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react";

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    role: "" as UserRoles | "",
    regionId: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    loadUsers();
    loadRegions();
  }, [pagination.current, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers({
        page: pagination.current,
        limit: pagination.pageSize,
        firstName: filters.firstName || undefined,
        lastName: filters.lastName || undefined,
        role: filters.role || undefined,
        regionId: filters.regionId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setUsers(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
      // Show user-friendly error message
      alert(
        "Foydalanuvchilarni yuklashda xatolik yuz berdi. Iltimos, sahifani yangilang."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await regionsAPI.getRegions({ limit: 1000 });
      setRegions(response.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
      // Show user-friendly error message
      alert("Mintaqalarni yuklashda xatolik yuz berdi.");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsUserFormOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsUserFormOpen(true);
  };

  const handleUserSubmit = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (editingUser) {
        // Update existing user
        await usersAPI.updateUser(editingUser.id, userData);
        alert("Foydalanuvchi muvaffaqiyatli yangilandi");
      } else {
        // Create new user
        await usersAPI.createUser(userData);
        alert("Yangi foydalanuvchi muvaffaqiyatli yaratildi");
      }
      loadUsers();
      setIsUserFormOpen(false);
      setEditingUser(null);
    } catch (error: unknown) {
      console.error("Failed to save user:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : "Foydalanuvchini saqlashda xatolik yuz berdi";
      throw new Error(errorMessage);
    }
  };

  const handleDelete = async (user: User) => {
    if (
      window.confirm(
        `${user.firstName} ${user.lastName} foydalanuvchisini o'chirishni tasdiqlaysizmi?`
      )
    ) {
      try {
        await usersAPI.deleteUser(user.id);
        loadUsers();
        alert("Foydalanuvchi muvaffaqiyatli o'chirildi");
      } catch (_error: unknown) {
        console.error("Failed to delete user:", _error);
        alert("Foydalanuvchini o'chirishda xatolik yuz berdi");
      }
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const getRoleBadge = (role: UserRoles) => {
    const roleConfig = {
      [UserRoles.SUPER_ADMIN]: {
        label: "Super Admin",
        icon: Crown,
        color: "text-purple-600",
      },
      [UserRoles.ADMIN]: {
        label: "Admin",
        icon: Shield,
        color: "text-blue-600",
      },
      [UserRoles.CEO]: { label: "CEO", icon: Crown, color: "text-orange-600" },
      [UserRoles.USER]: {
        label: "User",
        icon: UserIcon,
        color: "text-gray-600",
      },
    };

    const config = roleConfig[role];
    if (!config) return null;

    const Icon = config.icon;
    const { label, color } = config;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} bg-gray-100`}
      >
        <Icon className="h-3 w-3 mr-1" />
        <span className="ml-1">{label}</span>
      </span>
    );
  };

  const columns: TableColumn<User>[] = [
    {
      key: "user",
      title: "Foydalanuvchi",
      render: (_, user) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      title: "Telefon",
      render: (phoneNumber) => (
        <div className="flex items-center text-sm text-gray-900">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {phoneNumber}
        </div>
      ),
    },
    {
      key: "role",
      title: "Rol",
      render: (role) => getRoleBadge(role),
    },
    {
      key: "Region",
      title: "Mintaqa",
      render: (_, user) =>
        user.Region ? (
          <div className="flex items-center text-sm text-gray-900">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {user.Region.name}
          </div>
        ) : (
          <span className="text-gray-400">Belgilanmagan</span>
        ),
    },
    {
      key: "status",
      title: "Holat",
      render: (status) =>
        status ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <UserCheck className="h-3 w-3 mr-1" />
            Faol
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <UserX className="h-3 w-3 mr-1" />
            Nofaol
          </span>
        ),
    },
    {
      key: "createdAt",
      title: "Ro'yxatdan o'tgan",
      render: (createdAt) => (
        <div className="flex items-center text-sm text-gray-900">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          {new Date(createdAt).toLocaleDateString("uz-UZ")}
        </div>
      ),
      sortable: true,
    },
  ];

  const renderFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ism
        </label>
        <input
          type="text"
          value={filters.firstName}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, firstName: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ism bo'yicha qidirish"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Familiya
        </label>
        <input
          type="text"
          value={filters.lastName}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, lastName: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Familiya bo'yicha qidirish"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol
        </label>
        <select
          value={filters.role}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              role: e.target.value as UserRoles | "",
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Barcha rollar</option>
          <option value={UserRoles.USER}>User</option>
          <option value={UserRoles.ADMIN}>Admin</option>
          <option value={UserRoles.CEO}>CEO</option>
          <option value={UserRoles.SUPER_ADMIN}>Super Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mintaqa
        </label>
        <select
          value={filters.regionId}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, regionId: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Barcha mintaqalar</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Saralash
        </label>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            setFilters((prev) => ({
              ...prev,
              sortBy,
              sortOrder: sortOrder as "asc" | "desc",
            }));
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="createdAt-desc">Yangi ro'yxatdan o'tganlar</option>
          <option value="createdAt-asc">Eski ro'yxatdan o'tganlar</option>
          <option value="firstName-asc">Ism (A-Z)</option>
          <option value="firstName-desc">Ism (Z-A)</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <ResponsiveDataDisplay<User>
        data={users}
        columns={columns}
        loading={loading}
        title="Foydalanuvchilar boshqaruvi"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        filters={renderFilters()}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: handlePageChange,
        }}
        onRefresh={loadUsers}
        rowKey="id"
      />

      <UserForm
        user={editingUser}
        isOpen={isUserFormOpen}
        onClose={() => {
          setIsUserFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
        title={
          editingUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"
        }
      />
    </div>
  );
};

export default UsersManagement;
