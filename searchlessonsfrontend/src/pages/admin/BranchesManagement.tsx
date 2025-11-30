import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn } from "../../components/admin/DataTable";
import {
  branchesAPI,
  regionsAPI,
  educationalCentersAPI,
} from "../../services/api";
import { type Branch, type Region, type EducationalCenter } from "../../types";
import {
  GitBranch,
  MapPin,
  Phone,
  Building,
  Users,
  Calendar,
} from "lucide-react";

const BranchesManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [centers, setCenters] = useState<EducationalCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    regionId: "",
    educationalCenterId: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    loadBranches();
    loadRegions();
    loadCenters();
  }, [pagination.current, filters]);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await branchesAPI.getBranches({
        page: pagination.current,
        limit: pagination.pageSize,
        name: filters.name || undefined,
        address: filters.address || undefined,
        phoneNumber: filters.phoneNumber || undefined,
        regionId: filters.regionId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setBranches(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      alert(
        "Filiallarni yuklashda xatolik yuz berdi. Iltimos, sahifani yangilang."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await regionsAPI.getRegions({ limit: 1000 });
      setRegions(response.data);
    } catch (error) {
      alert("Mintaqalarni yuklashda xatolik yuz berdi.");
    }
  };

  const loadCenters = async () => {
    try {
      const response = await educationalCentersAPI.getCenters({ limit: 1000 });
      setCenters(response.data);
    } catch (error) {
      alert("Ta'lim markazlarini yuklashda xatolik yuz berdi.");
    }
  };

  const handleEdit = (branch: Branch) => {
    // TODO: Implement edit form or modal for branch editing
    alert(
      `Edit functionality for ${branch.name} will be implemented in future versions`
    );
  };

  const handleDelete = async (branch: Branch) => {
    if (
      window.confirm(`${branch.name} filialini o'chirishni tasdiqlaysizmi?`)
    ) {
      try {
        await branchesAPI.deleteBranch(branch.id);
        loadBranches();
        alert("Filial muvaffaqiyatli o'chirildi");
      } catch (error) {
        alert("Filialni o'chirishda xatolik yuz berdi");
        alert("Filialni o'chirishda xatolik yuz berdi");
      }
    }
  };

  const handleAdd = () => {
    // TODO: Implement add form or modal for branch creation
    alert("Add functionality will be implemented in future versions");
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const columns: TableColumn<Branch>[] = [
    {
      key: "branch",
      title: "Filial",
      render: (_, branch) => (
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center overflow-hidden">
            {branch.image ? (
              <img
                src={branch.image}
                alt={branch.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <GitBranch className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {branch.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {branch.address}
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
      key: "EducationalCenter",
      title: "Ta'lim markazi",
      render: (_, branch) =>
        branch.EducationalCenter ? (
          <div className="flex items-center text-sm text-gray-900">
            <Building className="h-4 w-4 mr-2 text-gray-400" />
            {branch.EducationalCenter.name}
          </div>
        ) : (
          <span className="text-gray-400">Belgilanmagan</span>
        ),
    },
    {
      key: "Region",
      title: "Mintaqa",
      render: (_, branch) =>
        branch.Region ? (
          <div className="flex items-center text-sm text-gray-900">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {branch.Region.name}
          </div>
        ) : (
          <span className="text-gray-400">Belgilanmagan</span>
        ),
    },
    {
      key: "User",
      title: "Mas'ul",
      render: (_, branch) =>
        branch.User ? (
          <div className="flex items-center text-sm text-gray-900">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {branch.User.firstName} {branch.User.lastName}
          </div>
        ) : (
          <span className="text-gray-400">Belgilanmagan</span>
        ),
    },
    {
      key: "createdAt",
      title: "Yaratilgan",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nomi
        </label>
        <input
          type="text"
          value={filters.name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Filial nomi bo'yicha qidirish"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Manzil
        </label>
        <input
          type="text"
          value={filters.address}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, address: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Manzil bo'yicha qidirish"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ta'lim markazi
        </label>
        <select
          value={filters.educationalCenterId}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              educationalCenterId: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Barcha markazlar</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name}
            </option>
          ))}
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
          <option value="createdAt-desc">Yangi yaratilganlar</option>
          <option value="createdAt-asc">Eski yaratilganlar</option>
          <option value="name-asc">Nomi (A-Z)</option>
          <option value="name-desc">Nomi (Z-A)</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <DataTable
        data={branches}
        columns={columns}
        loading={loading}
        title="Filiallar boshqaruvi"
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
        onRefresh={loadBranches}
        rowKey="id"
      />
    </div>
  );
};

export default BranchesManagement;
