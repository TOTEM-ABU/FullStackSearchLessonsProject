import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  className?: string;
  show?: (record: T) => boolean;
}

interface DataTableProps<T = any> {
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

const DataTable = <T extends Record<string, any>>({
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
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange(data);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected =
    selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {pagination && (
              <p className="mt-1 text-sm text-gray-500">
                Jami {pagination.total} ta element
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            )}

            {filters && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Filter className="h-5 w-5" />
              </button>
            )}

            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <Download className="h-5 w-5" />
            </button>

            {onAdd && (
              <button
                onClick={onAdd}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Qo'shish</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex items-center space-x-4">
          {onSearch && (
            <div className="flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={searchPlaceholder}
              />
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && filters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            {filters}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={
                    column.sortable ? () => handleSort(column.key) : undefined
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-indigo-600">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(actions.length > 0 || onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0) + 1}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-500">Yuklanmoqda...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0) + 1}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Ma'lumotlar topilmadi
                </td>
              </tr>
            ) : (
              data.map((record) => (
                <tr key={getRowKey(record)} className="hover:bg-gray-50">
                  {onSelectionChange && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected(record)}
                        onChange={(e) =>
                          handleSelectRow(record, e.target.checked)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(record[column.key], record)
                        : record[column.key]}
                    </td>
                  ))}
                  {(actions.length > 0 || onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Custom actions */}
                        {actions.map((action) => (
                          <button
                            key={action.key}
                            onClick={() => action.onClick(record)}
                            className={
                              action.className ||
                              "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            }
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}

                        {/* Default edit action */}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(record)}
                            className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-md transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}

                        {/* Default delete action */}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(record)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-md transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Sahifa {pagination.current} dan{" "}
            {Math.ceil(pagination.total / pagination.pageSize)} ta. Jami{" "}
            {pagination.total} ta element dan{" "}
            {Math.min(
              (pagination.current - 1) * pagination.pageSize + 1,
              pagination.total
            )}
            -{" "}
            {Math.min(
              pagination.current * pagination.pageSize,
              pagination.total
            )}{" "}
            ta ko'rsatilmoqda.
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                pagination.onChange(pagination.current - 1, pagination.pageSize)
              }
              disabled={pagination.current <= 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-gray-700">
              Sahifa {pagination.current}
            </span>

            <button
              onClick={() =>
                pagination.onChange(pagination.current + 1, pagination.pageSize)
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
      )}
    </div>
  );
};

export default DataTable;
