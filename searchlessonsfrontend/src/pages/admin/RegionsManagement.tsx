import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn } from "../../components/admin/DataTable";
import { regionsAPI } from "../../services/api";
import { type Region } from "../../types";
import { MapPin, Calendar, Building, Users } from "lucide-react";

const RegionsManagement: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    name: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    loadRegions();
  }, [pagination.current, filters]);

  const loadRegions = async () => {
    try {
      setLoading(true);
      const response = await regionsAPI.getRegions({
        page: pagination.current,
        limit: pagination.pageSize,
        name: filters.name || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setRegions(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      alert(
        "Mintaqalarni yuklashda xatolik yuz berdi. Iltimos, sahifani yangilang."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (region: Region) => {
    // TODO: Implement edit form or modal for region editing
    alert(
      `Edit functionality for ${region.name} will be implemented in future versions`
    );
  };

  const handleDelete = async (region: Region) => {
    if (
      window.confirm(`${region.name} mintaqasini o'chirishni tasdiqlaysizmi?`)
    ) {
      try {
        await regionsAPI.deleteRegion(region.id);
        loadRegions();
        alert("Mintaqa muvaffaqiyatli o'chirildi");
      } catch (error) {
        alert("Mintaqani o'chirishda xatolik yuz berdi");
        alert("Mintaqani o'chirishda xatolik yuz berdi");
      }
    }
  };

  const handleAdd = () => {
    // TODO: Implement add form or modal for region creation
    alert("Add functionality will be implemented in future versions");
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const columns: TableColumn<Region>[] = [
    {
      key: "region",
      title: "Mintaqa",
      render: (_, region) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {region.name}
            </div>
            <div className="text-sm text-gray-500">
              ID: {region.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "statistics",
      title: "Statistika",
      render: () => (
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2 text-gray-400" />
            <span>Ta'lim markazlari: -</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>Foydalanuvchilar: -</span>
          </div>
        </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          placeholder="Mintaqa nomi bo'yicha qidirish"
        />
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
        data={regions}
        columns={columns}
        loading={loading}
        title="Mintaqalar boshqaruvi"
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
        onRefresh={loadRegions}
        rowKey="id"
      />
    </div>
  );
};

export default RegionsManagement;
