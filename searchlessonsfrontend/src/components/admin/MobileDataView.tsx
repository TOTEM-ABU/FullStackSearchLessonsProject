import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Grid,
  List,
  MoreVertical,
} from "lucide-react";
import type { TableColumn, TableAction } from "./DataTable";

interface MobileDataViewProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  actions?: TableAction<T>[];
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  filters?: React.ReactNode;
  onRefresh?: () => void;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  rowKey?: keyof T | ((record: T) => string);
}

const MobileDataView = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  title,
  searchPlaceholder = "Qidirish...",
  onSearch,
  onAdd,
  onEdit,
  onDelete,
  actions = [],
  pagination,
  filters,
  onRefresh,
  selectedRows = [],
  onSelectionChange,
  rowKey = "id",
}: MobileDataViewProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const getRowKey = (record: T): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return String(record[rowKey]);
  };

  const isSelected = (record: T): boolean => {
    const key = getRowKey(record);
    return selectedRows.some((row) => getRowKey(row) === key);
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    if (!onSelectionChange) return;

    const key = getRowKey(record);
    if (checked) {
      onSelectionChange([...selectedRows, record]);
    } else {
      onSelectionChange(selectedRows.filter((row) => getRowKey(row) !== key));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const renderMobileCard = (record: T) => {
    const primaryColumn = columns[0];
    const secondaryColumns = columns.slice(1, 4); // Show up to 3 additional fields

    return (
      <div
        key={getRowKey(record)}
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        {/* Header with selection and primary info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            {onSelectionChange && (
              <input
                type="checkbox"
                checked={isSelected(record)}
                onChange={(e) => handleSelectRow(record, e.target.checked)}
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            )}
            <div className="flex-1">
              <div className="text-base font-medium text-gray-900">
                {primaryColumn.render
                  ? primaryColumn.render(record[primaryColumn.key], record)
                  : String(record[primaryColumn.key] || "")}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-md transition-colors"
                title="Tahrirlash"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(record)}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-md transition-colors"
                title="O'chirish"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {actions.length > 0 && (
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Secondary information */}
        <div className="space-y-2">
          {secondaryColumns.map((column) => {
            const value = record[column.key];
            if (!value) return null;

            return (
              <div
                key={column.key}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-500">{column.title}:</span>
                <span className="text-sm text-gray-900">
                  {column.render
                    ? column.render(value, record)
                    : String(value || "")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((record) => renderMobileCard(record))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {data.map((record) => renderMobileCard(record))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Title and Actions Row */}
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}
              {pagination && (
                <p className="text-sm text-gray-500">
                  {pagination.total} ta element
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>

              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              )}

              {onAdd && (
                <button
                  onClick={onAdd}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Qo'shish</span>
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {onSearch && (
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={searchPlaceholder}
                />
              </div>
            )}

            {filters && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-md text-sm transition-colors flex items-center space-x-1 ${
                  showFilters
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && filters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            {filters}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-500">Yuklanmoqda...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Ma'lumotlar topilmadi
          </div>
        ) : viewMode === "grid" ? (
          renderGridView()
        ) : (
          renderListView()
        )}
      </div>

      {/* Pagination */}
      {pagination && data.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              <span className="font-medium">
                {Math.min(
                  (pagination.current - 1) * pagination.pageSize + 1,
                  pagination.total
                )}
              </span>
              {" - "}
              <span className="font-medium">
                {Math.min(
                  pagination.current * pagination.pageSize,
                  pagination.total
                )}
              </span>
              {" / "}
              <span className="font-medium">{pagination.total}</span>
              {" natija"}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  pagination.onChange(
                    pagination.current - 1,
                    pagination.pageSize
                  )
                }
                disabled={pagination.current <= 1}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm text-gray-700">
                Sahifa {pagination.current} /{" "}
                {Math.ceil(pagination.total / pagination.pageSize)}
              </span>

              <button
                onClick={() =>
                  pagination.onChange(
                    pagination.current + 1,
                    pagination.pageSize
                  )
                }
                disabled={
                  pagination.current >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDataView;
