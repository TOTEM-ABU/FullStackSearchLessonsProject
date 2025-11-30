import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn } from "../../components/admin/DataTable";
import { fieldsAPI } from "../../services/api";
import { type Field } from "../../types";
import { BookOpen, Calendar, Image as ImageIcon } from "lucide-react";

const FieldsManagement: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
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
    loadFields();
  }, [pagination.current, filters]);

  const loadFields = async () => {
    try {
      setLoading(true);
      const response = await fieldsAPI.getFields({
        page: pagination.current,
        limit: pagination.pageSize,
        name: filters.name || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setFields(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      alert(
        "Yo'nalishlarni yuklashda xatolik yuz berdi. Iltimos, sahifani yangilang."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field: Field) => {
    // TODO: Implement edit form or modal for field editing
    alert(
      `Edit functionality for ${field.name} will be implemented in future versions`
    );
  };

  const handleDelete = async (field: Field) => {
    if (
      window.confirm(`${field.name} yo'nalishini o'chirishni tasdiqlaysizmi?`)
    ) {
      try {
        await fieldsAPI.deleteField(field.id);
        loadFields();
        alert("Yo'nalish muvaffaqiyatli o'chirildi");
      } catch (error) {
        alert("Yo'nalishni o'chirishda xatolik yuz berdi");
        alert("Yo'nalishni o'chirishda xatolik yuz berdi");
      }
    }
  };

  const handleAdd = () => {
    // TODO: Implement add form or modal for field creation
    alert("Add functionality will be implemented in future versions");
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const columns: TableColumn<Field>[] = [
    {
      key: "field",
      title: "Yo'nalish",
      render: (_, field) => (
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {field.image ? (
              <img
                src={field.image}
                alt={field.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <BookOpen className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {field.name}
            </div>
            <div className="text-sm text-gray-500">
              ID: {field.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "image",
      title: "Rasm",
      render: (image) => (
        <div className="flex items-center">
          {image ? (
            <div className="flex items-center text-green-600">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">Mavjud</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <ImageIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">Mavjud emas</span>
            </div>
          )}
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
          placeholder="Yo'nalish nomi bo'yicha qidirish"
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
        data={fields}
        columns={columns}
        loading={loading}
        title="Yo'nalishlar boshqaruvi"
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
        onRefresh={loadFields}
        rowKey="id"
      />
    </div>
  );
};

export default FieldsManagement;
