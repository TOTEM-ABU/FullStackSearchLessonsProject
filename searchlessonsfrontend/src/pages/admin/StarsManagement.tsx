import React, { useState, useEffect } from "react";
import ResponsiveDataDisplay from "../../components/admin/ResponsiveDataDisplay";
import { type TableColumn } from "../../components/admin/DataTable";
import { starsAPI } from "../../services/api";
import { type Star } from "../../types";
import { Star as StarIcon, Calendar, Users, Building } from "lucide-react";

const StarsManagement: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    star: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  useEffect(() => {
    loadStars();
  }, [pagination.current, filters]);

  const loadStars = async () => {
    try {
      setLoading(true);
      const response = await starsAPI.getStars({
        page: pagination.current,
        limit: pagination.pageSize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setStars(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error("Failed to load stars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (star: Star) => {
    if (window.confirm("Ushbu bahoni o'chirishni tasdiqlaysizmi?")) {
      try {
        await starsAPI.deleteStar(star.id);
        loadStars();
        alert("Baho muvaffaqiyatli o'chirildi");
      } catch (error) {
        console.error("Failed to delete star:", error);
        alert("Bahoni o'chirishda xatolik yuz berdi");
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-900">{rating}</span>
      </div>
    );
  };

  const columns: TableColumn<Star>[] = [
    {
      key: "star",
      title: "Baho",
      render: (star) => renderStars(star),
    },
    {
      key: "User",
      title: "Foydalanuvchi",
      render: (_, star) =>
        star.User ? (
          <div className="flex items-center text-sm text-gray-900">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">
                {star.User.firstName} {star.User.lastName}
              </div>
              <div className="text-gray-500">{star.User.email}</div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Noma'lum foydalanuvchi</span>
        ),
    },
    {
      key: "EducationalCenter",
      title: "Ta'lim markazi",
      render: (_, star) =>
        star.EducationalCenter ? (
          <div className="flex items-center text-sm text-gray-900">
            <Building className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <div className="font-medium">{star.EducationalCenter.name}</div>
              <div className="text-gray-500">
                {star.EducationalCenter.address}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Noma'lum markaz</span>
        ),
    },
    {
      key: "createdAt",
      title: "Berilgan vaqt",
      render: (createdAt) => (
        <div className="flex items-center text-sm text-gray-900">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <div>
            <div>{new Date(createdAt).toLocaleDateString("uz-UZ")}</div>
            <div className="text-gray-500">
              {new Date(createdAt).toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
  ];

  const renderFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Baho
        </label>
        <select
          value={filters.star}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, star: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Barcha baholar</option>
          <option value="5">5 yulduz</option>
          <option value="4">4 yulduz</option>
          <option value="3">3 yulduz</option>
          <option value="2">2 yulduz</option>
          <option value="1">1 yulduz</option>
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
          <option value="createdAt-desc">Yangi berilganlar</option>
          <option value="createdAt-asc">Eski berilganlar</option>
          <option value="star-desc">Yuqori baho</option>
          <option value="star-asc">Past baho</option>
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <ResponsiveDataDisplay<Star>
        data={stars}
        columns={columns}
        loading={loading}
        title="Baholar boshqaruvi"
        onDelete={handleDelete}
        filters={renderFilters()}
        pagination={{
          current: pagination.current,
          total: pagination.total,
          pageSize: pagination.pageSize,
          onChange: handlePageChange,
        }}
        onRefresh={loadStars}
        rowKey="id"
      />
    </div>
  );
};

export default StarsManagement;
