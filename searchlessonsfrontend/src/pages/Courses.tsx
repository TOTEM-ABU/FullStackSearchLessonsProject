import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  resourcesAPI,
  resourceCategoriesAPI,
  fieldsAPI,
  subjectsAPI,
} from "../services/api";
import type {
  Resource,
  ResourceCategory,
  Field,
  Subject,
  SearchFilters,
} from "../types";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Courses: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 12,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch resources (requires auth)
  const {
    data: resourcesData,
    isLoading: resourcesLoading,
    error: resourcesError,
  } = useQuery({
    queryKey: ["resources", filters, selectedCategory, isAuthenticated],
    queryFn: () =>
      resourcesAPI.getResources({
        ...filters,
        resourceCategoryId: selectedCategory || undefined,
      }),
    enabled: isAuthenticated,
  });

  // Fetch categories for filter (requires auth per backend controller)
  const { data: categoriesData } = useQuery({
    queryKey: ["resource-categories", isAuthenticated],
    queryFn: () => resourceCategoriesAPI.getCategories({ limit: 100 }),
    enabled: isAuthenticated,
  });

  // Fetch fields and subjects (require auth in backend controllers)
  const { data: fieldsData } = useQuery({
    queryKey: ["fields", isAuthenticated],
    queryFn: () => fieldsAPI.getFields({ limit: 100 }),
    enabled: isAuthenticated,
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects", isAuthenticated],
    queryFn: () => subjectsAPI.getSubjects({ limit: 100 }),
    enabled: isAuthenticated,
  });

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number
  ) => {
    setFilters((prev) => {
      const updatedValue =
        key === "page" || key === "limit" ? Number(value) : value;
      return {
        ...prev,
        [key]: updatedValue,
        page: key !== "page" ? 1 : (updatedValue as number),
      };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Resurslarni ko'rish uchun tizimga kiring
          </h1>
          <p className="text-gray-600 mb-6">
            Resurslar ro'yxati faqat ro'yxatdan o'tgan foydalanuvchilar uchun
            mavjud.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/auth/login"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Kirish
            </Link>
            <Link
              to="/auth/register"
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (resourcesLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (resourcesError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Xatolik yuz berdi
        </h3>
        <p className="text-gray-500">Resurslarni yuklashda muammo yuz berdi.</p>
      </div>
    );
  }

  const resources = resourcesData?.data || [];
  const categories = categoriesData?.data || [];
  const fields = fieldsData?.data || [];
  const subjects = subjectsData?.data || [];
  const totalPages = resourcesData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Ta'lim resurslari
          </h1>
          <p className="mt-2 text-gray-600">
            Eng foydali ta'lim materiallarini toping va bilimingizni oshiring
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Tez havolalar
          </h2>

          {/* Fields */}
          {fields.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Yo'nalishlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {fields.slice(0, 8).map((field: Field) => (
                  <span
                    key={field.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                  >
                    {field.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Fanlar</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.slice(0, 8).map((subject: Subject) => (
                  <span
                    key={subject.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                  >
                    {subject.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Qidirish
                </label>
                <input
                  type="text"
                  id="name"
                  value={filters.name || ""}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Resurs nomini kiriting..."
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kategoriya
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Barcha kategoriyalar</option>
                  {categories.map((category: ResourceCategory) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700"
                >
                  Saralash
                </label>
                <select
                  id="sortBy"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    handleFilterChange("sortBy", sortBy);
                    handleFilterChange("sortOrder", sortOrder);
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt-desc">Yangi qo'shilganlar</option>
                  <option value="name-asc">Nom bo'yicha (A-Z)</option>
                  <option value="name-desc">Nom bo'yicha (Z-A)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Qidirish
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              {resourcesData?.total || 0} ta resurs topildi
            </h2>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Hech narsa topilmadi
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Qidiruv shartlaringizni o'zgartiring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource: Resource) => (
                <CourseCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleFilterChange("page", Math.max(1, filters.page! - 1))
                  }
                  disabled={filters.page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Oldingi
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handleFilterChange("page", page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        filters.page === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handleFilterChange(
                      "page",
                      Math.min(totalPages, filters.page! + 1)
                    )
                  }
                  disabled={filters.page === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keyingi
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
