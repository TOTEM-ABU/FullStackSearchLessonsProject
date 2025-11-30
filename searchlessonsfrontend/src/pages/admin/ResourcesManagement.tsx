import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn } from "../../components/admin/DataTable";
import { resourcesAPI, resourceCategoriesAPI } from "../../services/api";
import { type Resource, type ResourceCategory } from "../../types";
import {
  FileText,
  Calendar,
  Users,
  Tag,
  ExternalLink,
  File,
} from "lucide-react";

const ResourcesManagement: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    name: "",
    resourceCategoryId: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    loadResources();
    loadCategories();
  }, [pagination.current, filters]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await resourcesAPI.getResources({
        page: pagination.current,
        limit: pagination.pageSize,
        name: filters.name || undefined,
        resourceCategoryId: filters.resourceCategoryId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setResources(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      alert(
        "Resurslarni yuklashda xatolik yuz berdi. Iltimos, sahifani yangilang."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await resourceCategoriesAPI.getCategories({
        limit: 1000,
      });
      setCategories(response.data);
    } catch (error) {
      alert("Kategoriyalarni yuklashda xatolik yuz berdi.");
    }
  };

  const handleEdit = (resource: Resource) => {
    // TODO: Implement edit form or modal for resource editing
    alert(
      `Edit functionality for ${resource.name} will be implemented in future versions`
    );
  };

  const handleDelete = async (resource: Resource) => {
    if (
      window.confirm(`${resource.name} resursini o'chirishni tasdiqlaysizmi?`)
    ) {
      try {
        await resourcesAPI.deleteResource(resource.id);
        loadResources();
        alert("Resurs muvaffaqiyatli o'chirildi");
      } catch (error) {
        alert("Resursni o'chirishda xatolik yuz berdi");
        alert("Resursni o'chirishda xatolik yuz berdi");
      }
    }
  };

  const handleAdd = () => {
    // TODO: Implement add form or modal for resource creation
    alert("Add functionality will be implemented in future versions");
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const getMediaIcon = (media: string) => {
    if (media.includes("youtube.com") || media.includes("youtu.be")) {
      return <ExternalLink className="h-4 w-4 text-red-500" />;
    }
    if (media.endsWith(".pdf")) {
      return <File className="h-4 w-4 text-red-600" />;
    }
    if (media.endsWith(".mp4") || media.endsWith(".avi")) {
      return <ExternalLink className="h-4 w-4 text-blue-500" />;
    }
    return <File className="h-4 w-4 text-gray-500" />;
  };

  const columns: TableColumn<Resource>[] = [
    {
      key: "resource",
      title: "Resurs",
      render: (_, resource) => (
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center overflow-hidden">
            {resource.image ? (
              <img
                src={resource.image}
                alt={resource.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <FileText className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {resource.name}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {resource.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "ResourceCategory",
      title: "Kategoriya",
      render: (_, resource) =>
        resource.ResourceCategory ? (
          <div className="flex items-center text-sm text-gray-900">
            <Tag className="h-4 w-4 mr-2 text-gray-400" />
            {resource.ResourceCategory.name}
          </div>
        ) : (
          <span className="text-gray-400">Belgilanmagan</span>
        ),
    },
    {
      key: "media",
      title: "Media",
      render: (media) => (
        <div className="flex items-center">
          {getMediaIcon(media)}
          <a
            href={media}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-blue-600 hover:text-blue-800 truncate max-w-32"
          >
            {media.length > 30 ? `${media.substring(0, 30)}...` : media}
          </a>
        </div>
      ),
    },
    {
      key: "User",
      title: "Yaratuvchi",
      render: (_, resource) =>
        resource.User ? (
          <div className="flex items-center text-sm text-gray-900">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {resource.User.firstName} {resource.User.lastName}
          </div>
        ) : (
          <span className="text-gray-400">Noma'lum</span>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          placeholder="Resurs nomi bo'yicha qidirish"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategoriya
        </label>
        <select
          value={filters.resourceCategoryId}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              resourceCategoryId: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
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
        data={resources}
        columns={columns}
        loading={loading}
        title="Resurslar boshqaruvi"
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
        onRefresh={loadResources}
        rowKey="id"
      />
    </div>
  );
};

export default ResourcesManagement;
