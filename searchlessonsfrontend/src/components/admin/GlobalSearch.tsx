import React, { useState, useEffect, useCallback } from "react";
import {
  usersAPI,
  educationalCentersAPI,
  branchesAPI,
  regionsAPI,
  fieldsAPI,
  subjectsAPI,
  resourcesAPI,
  starsAPI,
} from "../../services/api";
import {
  Search,
  Filter,
  X,
  Users,
  Building,
  GitBranch,
  MapPin,
  BookOpen,
  Tag,
  FileText,
  Star,
  Loader,
  ChevronDown,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import {
  type User,
  type EducationalCenter,
  type Branch,
  type Region,
  type Field,
  type Subject,
  type Resource,
} from "../../types";

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

interface GlobalSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onResultSelect,
  placeholder = "Search users, centers, branches, and more...",
  showAdvancedFilters = true,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    types: [] as string[],
    dateRange: "",
    region: "",
    status: "",
  });

  const entityTypes = [
    { key: "user", label: "Users", icon: Users, color: "text-blue-600" },
    {
      key: "center",
      label: "Educational Centers",
      icon: Building,
      color: "text-green-600",
    },
    {
      key: "branch",
      label: "Branches",
      icon: GitBranch,
      color: "text-purple-600",
    },
    { key: "region", label: "Regions", icon: MapPin, color: "text-red-600" },
    { key: "field", label: "Fields", icon: BookOpen, color: "text-indigo-600" },
    { key: "subject", label: "Subjects", icon: Tag, color: "text-yellow-600" },
    {
      key: "resource",
      label: "Resources",
      icon: FileText,
      color: "text-pink-600",
    },
  ];

  const searchEntities = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      const searchResults: SearchResult[] = [];

      try {
        const searchPromises = [];

        // Search Users
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("user")
        ) {
          searchPromises.push(
            usersAPI
              .getUsers({
                firstName: searchQuery,
                lastName: searchQuery,
                email: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (user: User): SearchResult => ({
                    id: user.id,
                    title: `${user.firstName} ${user.lastName}`,
                    subtitle: `${user.email} • ${user.role}`,
                    type: "user",
                    data: user,
                    score: calculateScore(
                      searchQuery,
                      `${user.firstName} ${user.lastName} ${user.email}`
                    ),
                  })
                )
              )
              .catch(() => [])
          );
        }

        // Search Educational Centers
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("center")
        ) {
          searchPromises.push(
            educationalCentersAPI
              .getCenters({
                name: searchQuery,
                address: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (center: EducationalCenter): SearchResult => ({
                    id: center.id,
                    title: center.name,
                    subtitle: `${center.address} • ${center.phoneNumber}`,
                    type: "center",
                    data: center,
                    score: calculateScore(
                      searchQuery,
                      `${center.name} ${center.address}`
                    ),
                  })
                )
              )
              .catch(() => [])
          );
        }

        // Search Branches
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("branch")
        ) {
          searchPromises.push(
            branchesAPI
              .getBranches({
                name: searchQuery,
                address: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (branch: Branch): SearchResult => ({
                    id: branch.id,
                    title: branch.name,
                    subtitle: `${branch.address} • ${branch.phoneNumber}`,
                    type: "branch",
                    data: branch,
                    score: calculateScore(
                      searchQuery,
                      `${branch.name} ${branch.address}`
                    ),
                  })
                )
              )
              .catch(() => [])
          );
        }

        // Search Regions
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("region")
        ) {
          searchPromises.push(
            regionsAPI
              .getRegions({
                name: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (region: Region): SearchResult => ({
                    id: region.id,
                    title: region.name,
                    subtitle: "Region",
                    type: "region",
                    data: region,
                    score: calculateScore(searchQuery, region.name),
                  })
                )
              )
              .catch(() => [])
          );
        }

        // Search Fields
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("field")
        ) {
          searchPromises.push(
            fieldsAPI
              .getFields({
                name: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (field: Field): SearchResult => ({
                    id: field.id,
                    title: field.name,
                    subtitle: "Educational Field",
                    type: "field",
                    data: field,
                    score: calculateScore(searchQuery, field.name),
                  })
                )
              )
              .catch(() => [])
          );
        }

        // Search Subjects
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("subject")
        ) {
          searchPromises.push(
            subjectsAPI
              .getSubjects({
                name: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (subject: Subject): SearchResult => ({
                    id: subject.id,
                    title: subject.name,
                    subtitle: "Subject",
                    type: "subject",
                    data: subject,
                    score: calculateScore(searchQuery, subject.name),
                  })
                )
              )
              .catch(() => [])
          );
        }

        // Search Resources
        if (
          activeFilters.types.length === 0 ||
          activeFilters.types.includes("resource")
        ) {
          searchPromises.push(
            resourcesAPI
              .getResources({
                name: searchQuery,
                limit: 50,
              })
              .then((response) =>
                response.data.map(
                  (resource: Resource): SearchResult => ({
                    id: resource.id,
                    title: resource.name,
                    subtitle: resource.description || "Resource",
                    type: "resource",
                    data: resource,
                    score: calculateScore(
                      searchQuery,
                      `${resource.name} ${resource.description}`
                    ),
                  })
                )
              )
              .catch(() => [])
          );
        }

        const allResults = await Promise.all(searchPromises);
        const flatResults = allResults.flat();

        // Sort by relevance score and limit results
        const sortedResults = flatResults
          .sort((a, b) => b.score - a.score)
          .slice(0, 20);

        setResults(sortedResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [activeFilters.types]
  );

  const calculateScore = (query: string, text: string): number => {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    if (textLower === queryLower) return 100;
    if (textLower.startsWith(queryLower)) return 90;
    if (textLower.includes(queryLower)) return 70;

    // Word matching
    const queryWords = queryLower.split(" ");
    const textWords = textLower.split(" ");
    const matchingWords = queryWords.filter((word) =>
      textWords.some((textWord) => textWord.includes(word))
    );

    return (matchingWords.length / queryWords.length) * 50;
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchEntities(query);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, searchEntities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  const getEntityIcon = (type: string) => {
    const entityType = entityTypes.find((t) => t.key === type);
    if (!entityType) return <Search className="h-4 w-4" />;

    const Icon = entityType.icon;
    return <Icon className={`h-4 w-4 ${entityType.color}`} />;
  };

  const toggleTypeFilter = (type: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      types: [],
      dateRange: "",
      region: "",
      status: "",
    });
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(query.length > 0)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {loading && (
            <Loader className="h-5 w-5 text-gray-400 animate-spin mr-2" />
          )}
          {showAdvancedFilters && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors ${
                showFilters
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
          )}
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setShowResults(false);
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Advanced Filters
            </h4>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-4">
            {/* Entity Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search in:
              </label>
              <div className="flex flex-wrap gap-2">
                {entityTypes.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeFilters.types.includes(type.key);
                  return (
                    <button
                      key={type.key}
                      onClick={() => toggleTypeFilter(type.key)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                        isActive
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
          {results.length === 0 && !loading && query ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getEntityIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {result.type}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
