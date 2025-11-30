import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn } from "../../components/admin/DataTable";
import EducationalCenterForm from "../../components/admin/EducationalCenterForm";
import { educationalCentersAPI, regionsAPI } from "../../services/api";
import {
  type EducationalCenter,
  type Region,
  type CreateEducationalCenterRequest,
} from "../../types";
import {
  Building,
  MapPin,
  Phone,
  Star,
  Users,
  GitBranch,
  Calendar,
} from "lucide-react";

const EducationalCentersManagement: React.FC = () => {
  const [centers, setCenters] = useState<EducationalCenter[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCenterFormOpen, setIsCenterFormOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<EducationalCenter | null>(
    null
  );
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
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    loadCenters();
    loadRegions();
  }, [pagination.current, filters]);

  const loadCenters = async () => {
    try {
      setLoading(true);
      const response = await educationalCentersAPI.getCenters({
        page: pagination.current,
        limit: pagination.pageSize,
        name: filters.name || undefined,
        address: filters.address || undefined,
        phoneNumber: filters.phoneNumber || undefined,
        regionId: filters.regionId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setCenters(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error("Failed to load educational centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await regionsAPI.getRegions({ limit: 1000 });
      setRegions(response.data);
    } catch (error) {
      console.error("Failed to load regions:", error);
    }
  };

  const handleEdit = (center: EducationalCenter) => {
    setEditingCenter(center);
    setIsCenterFormOpen(true);
  };

  const handleDelete = async (center: EducationalCenter) => {
    if (
      window.confirm(
        `${center.name} ta'lim markazini o'chirishni tasdiqlaysizmi?`
      )
    ) {
      try {
        await educationalCentersAPI.deleteCenter(center.id);
        loadCenters();
        alert("Ta'lim markazi muvaffaqiyatli o'chirildi");
      } catch (error) {
        console.error("Failed to delete center:", error);
        alert("Ta'lim markazini o'chirishda xatolik yuz berdi");
      }
    }
  };

  const handleAdd = () => {
    setEditingCenter(null);
    setIsCenterFormOpen(true);
  };

  const handleCenterSubmit = async (
    centerData: CreateEducationalCenterRequest
  ) => {
    try {
      if (editingCenter) {
        // Update existing center
        await educationalCentersAPI.updateCenter(editingCenter.id, centerData);
        alert("Ta'lim markazi muvaffaqiyatli yangilandi");
      } else {
        // Create new center
        await educationalCentersAPI.createCenter(centerData);
        alert("Yangi ta'lim markazi muvaffaqiyatli yaratildi");
      }
      loadCenters();
      setIsCenterFormOpen(false);
      setEditingCenter(null);
    } catch (error: unknown) {
      console.error("Failed to save center:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ta'lim markazini saqlashda xatolik yuz berdi";
      throw new Error(errorMessage);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const getStarDisplay = (averageStar?: number) => {
    if (!averageStar) {
      return <span className="text-gray-400 text-sm">Baholanmagan</span>;
    }

    const roundedStar = Math.round(averageStar * 10) / 10;
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-medium">{roundedStar}</span>
      </div>
    );
  };

  const columns: TableColumn<EducationalCenter>[] = [
    {
      key: "center",
      title: "Ta'lim markazi",
      render: (_, center) => (
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden">
            {center.image ? (
              <img
                src={center.image}
                alt={center.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {center.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {center.address}
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
      key: "Region",
      title: "Mintaqa",
      render: (_, center) =>
        center.Region ? (
          <div className="flex items-center text-sm text-gray-900">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {center.Region.name}
          </div>
        ) : (
          <span className="text-gray-400">Belgilanmagan</span>
        ),
    },
    {
      key: "averageStar",
      title: "Baho",
      render: (averageStar) => getStarDisplay(averageStar),
    },
    {
      key: "branches",
      title: "Filiallar",
      render: (_, center) => (
        <div className="flex items-center text-sm text-gray-900">
          <GitBranch className="h-4 w-4 mr-2 text-gray-400" />
          {center.branches?.length || 0} ta
        </div>
      ),
    },
    {
      key: "User",
      title: "Egasi",
      render: (_, center) =>
        center.User ? (
          <div className="flex items-center text-sm text-gray-900">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {center.User.firstName} {center.User.lastName}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          placeholder="Markaz nomi bo'yicha qidirish"
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
          <option value="averageStar-desc">Eng yuqori baho</option>
          <option value="averageStar-asc">Eng past baho</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <DataTable
        data={centers}
        columns={columns}
        loading={loading}
        title="Ta'lim markazlari boshqaruvi"
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
        onRefresh={loadCenters}
        rowKey="id"
      />

      <EducationalCenterForm
        center={editingCenter}
        isOpen={isCenterFormOpen}
        onClose={() => {
          setIsCenterFormOpen(false);
          setEditingCenter(null);
        }}
        onSubmit={handleCenterSubmit}
        title={
          editingCenter ? "Ta'lim markazini tahrirlash" : "Yangi ta'lim markazi"
        }
      />
    </div>
  );
};

export default EducationalCentersManagement;
