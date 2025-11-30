import React, { useState } from "react";
import GlobalSearch from "../../components/admin/GlobalSearch";
import {
  Search,
  Users,
  Building,
  GitBranch,
  MapPin,
  BookOpen,
  Tag,
  FileText,
  Star,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type:
    | "user"
    | "center"
    | "branch"
    | "region"
    | "field"
    | "subject"
    | "resource";
  data: any;
  score: number;
}

const AdvancedSearch: React.FC = () => {
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const handleResultSelect = (result: SearchResult) => {
    // Add to selected results if not already present
    if (
      !selectedResults.some((r) => r.id === result.id && r.type === result.type)
    ) {
      setSelectedResults((prev) => [...prev, result]);
    }
  };

  const removeResult = (index: number) => {
    setSelectedResults((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllResults = () => {
    setSelectedResults([]);
  };

  const getEntityIcon = (type: string) => {
    const icons = {
      user: Users,
      center: Building,
      branch: GitBranch,
      region: MapPin,
      field: BookOpen,
      subject: Tag,
      resource: FileText,
    };

    const Icon = icons[type as keyof typeof icons] || Search;
    return <Icon className="h-5 w-5" />;
  };

  const getEntityColor = (type: string) => {
    const colors = {
      user: "bg-blue-100 text-blue-800 border-blue-200",
      center: "bg-green-100 text-green-800 border-green-200",
      branch: "bg-purple-100 text-purple-800 border-purple-200",
      region: "bg-red-100 text-red-800 border-red-200",
      field: "bg-indigo-100 text-indigo-800 border-indigo-200",
      subject: "bg-yellow-100 text-yellow-800 border-yellow-200",
      resource: "bg-pink-100 text-pink-800 border-pink-200",
    };

    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const renderResultDetails = (result: SearchResult) => {
    const { type, data } = result;

    switch (type) {
      case "user":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{data.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{data.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Born: {data.yearOfBirth}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.role === "ADMIN"
                    ? "bg-blue-100 text-blue-800"
                    : data.role === "CEO"
                    ? "bg-purple-100 text-purple-800"
                    : data.role === "SUPER_ADMIN"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {data.role}
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {data.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        );

      case "center":
      case "branch":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{data.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{data.phoneNumber}</span>
            </div>
            {data.Region && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Region: {data.Region.name}</span>
              </div>
            )}
            {data.averageStar && (
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">
                  {data.averageStar.toFixed(1)} stars
                </span>
              </div>
            )}
          </div>
        );

      case "resource":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{data.description}</p>
            {data.media && (
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-gray-400" />
                <a
                  href={data.media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 truncate"
                >
                  View resource
                </a>
              </div>
            )}
            {data.ResourceCategory && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  Category: {data.ResourceCategory.name}
                </span>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Created: {new Date(data.createdAt).toLocaleDateString("uz-UZ")}
              </span>
            </div>
          </div>
        );
    }
  };

  const handleEdit = (result: SearchResult) => {
    // Navigate to edit page based on type
    const editUrls = {
      user: `/admin/users`,
      center: `/admin/educational-centers`,
      branch: `/admin/branches`,
      region: `/admin/regions`,
      field: `/admin/fields`,
      subject: `/admin/subjects`,
      resource: `/admin/resources`,
    };

    const url = editUrls[result.type];
    if (url) {
      window.location.href = url;
    }
  };

  const handleView = (result: SearchResult) => {
    // Open detailed view based on result type
    const detailUrls = {
      user: `/admin/users?search=${result.data.id}`,
      center: `/centers/${result.data.id}`,
      branch: `/centers/${result.data.educationalCenterId}`,
      region: `/admin/regions?search=${result.data.name}`,
      field: `/admin/fields?search=${result.data.name}`,
      subject: `/courses?subject=${result.data.id}`,
      resource: `/admin/resources?search=${result.data.name}`,
    };

    const url = detailUrls[result.type];
    if (url) {
      // Open in new tab for external links, navigate for internal ones
      if (result.type === "center" || result.type === "subject") {
        window.open(url, "_blank");
      } else {
        window.location.href = url;
      }
    } else {
      alert(
        `View details functionality for ${result.type} will be enhanced in future versions`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Advanced Search
            </h1>
            <p className="mt-2 text-gray-600">
              Search across all entities in the system with advanced filtering
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="h-4 w-4 border border-current"></div>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="grid grid-cols-2 gap-1 h-4 w-4">
                <div className="border border-current"></div>
                <div className="border border-current"></div>
                <div className="border border-current"></div>
                <div className="border border-current"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <GlobalSearch
            onResultSelect={handleResultSelect}
            placeholder="Search users, centers, branches, regions, fields, subjects, resources..."
            showAdvancedFilters={true}
          />

          {selectedResults.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedResults.length} search result
                {selectedResults.length !== 1 ? "s" : ""} selected
              </p>
              <button
                onClick={clearAllResults}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear all results
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {selectedResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
          </div>

          <div
            className={`p-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {selectedResults.map((result, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${getEntityColor(
                        result.type
                      )}`}
                    >
                      {getEntityIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleView(result)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(result)}
                      className="p-1 text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeResult(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Remove from results"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">{renderResultDetails(result)}</div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEntityColor(
                        result.type
                      )}`}
                    >
                      {result.type.charAt(0).toUpperCase() +
                        result.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      Score: {Math.round(result.score)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {selectedResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start searching to see results
          </h3>
          <p className="text-gray-500">
            Use the search bar above to find users, centers, branches, and more.
            You can filter by entity type and other criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
