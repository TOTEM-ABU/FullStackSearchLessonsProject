import React, { useState, useEffect } from "react";
import DataTable, { type TableColumn, type TableAction } from "./DataTable";
import MobileDataView from "./MobileDataView";

interface ResponsiveDataDisplayProps<
  T extends Record<string, unknown> = Record<string, unknown>
> {
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
  mobileBreakpoint?: number; // Width in pixels
}

const ResponsiveDataDisplay = <
  T extends Record<string, unknown> = Record<string, unknown>
>({
  mobileBreakpoint = 768,
  ...props
}: ResponsiveDataDisplayProps<T>) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Check on mount
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [mobileBreakpoint]);

  if (isMobile) {
    return <MobileDataView {...props} />;
  }

  return <DataTable {...props} />;
};

export default ResponsiveDataDisplay;
