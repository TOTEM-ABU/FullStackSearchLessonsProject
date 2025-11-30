import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { educationalCentersAPI, regionsAPI } from "../services/api";
import type { EducationalCenter, Region, SearchFilters } from "../types";
import { useAuth } from "../contexts/AuthContext";

const EducationalCenters: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    address: "",
    regionId: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 12,
  });

  // Fetch educational centers (requires auth)
  const {
    data: centersData,
    isLoading: centersLoading,
    error: centersError,
  } = useQuery({
    queryKey: ["educational-centers", filters, isAuthenticated],
    queryFn: () => educationalCentersAPI.getCenters(filters),
    enabled: isAuthenticated,
  });

  // Fetch regions for filter dropdown (public)
  const { data: regionsData } = useQuery({
    queryKey: ["regions"],
    queryFn: () => regionsAPI.getRegions({ limit: 100 }),
  });

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when other filters change
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger refetch by updating filters
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            O'quv markazlarini ko'rish uchun tizimga kiring
          </h1>
          <p className="text-gray-600 mb-6">
            Markazlar ro'yxati faqat ro'yxatdan o'tgan foydalanuvchilar uchun
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

  if (centersLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (centersError) {
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
        <p className="text-gray-500">
          O'quv markazlarini yuklashda muammo yuz berdi.
        </p>
      </div>
    );
  }

  const centers = centersData?.data || [];
  const totalPages = centersData?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">O'quv markazlari</h1>
          <p className="mt-2 text-gray-600">
            Eng yaxshi o'quv markazlarini toping va o'z kelajagingizni yarating
          </p>
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
                  Nomi
                </label>
                <input
                  type="text"
                  id="name"
                  value={filters.name || ""}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Markaz nomini kiriting..."
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Manzil
                </label>
                <input
                  type="text"
                  id="address"
                  value={filters.address || ""}
                  onChange={(e) =>
                    handleFilterChange("address", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Manzilni kiriting..."
                />
              </div>

              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hudud
                </label>
                <select
                  id="region"
                  value={filters.regionId || ""}
                  onChange={(e) =>
                    handleFilterChange("regionId", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Barcha hududlar</option>
                  {regionsData?.data?.map((region: Region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
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
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Qidirish
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              {centersData?.total || 0} ta markaz topildi
            </h2>
          </div>

          {centers.length === 0 ? (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
              {centers.map((center: EducationalCenter) => (
                <div
                  key={center.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={center.image || "/placeholder-center.jpg"}
                      alt={center.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {center.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <svg
                        className="inline w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {center.address}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <svg
                        className="inline w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {center.phoneNumber}
                    </p>
                    {center.Region && (
                      <p className="text-sm text-gray-600 mb-3">
                        <svg
                          className="inline w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                        {center.Region.name}
                      </p>
                    )}
                    {center.averageStar && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(center.averageStar!)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            ({center.averageStar.toFixed(1)})
                          </span>
                        </div>
                      </div>
                    )}
                    <Link
                      to={`/centers/${center.id}`}
                      className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Batafsil ko'rish
                    </Link>
                  </div>
                </div>
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

export default EducationalCenters;
