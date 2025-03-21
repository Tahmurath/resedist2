import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options.tsx";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter.tsx";
import { axiosInstance } from "@/axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import useDebounce2 from "@/lib/debounce.ts";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onTitleChange: (title: string) => void;
  onFilterChange: (column: string | undefined, values: number[]) => void;
}


// تابع گرفتن داده‌ها از API
const fetchFilteredOptions = async (
    query: string,
    type: "departmentTypes" | "parents"
) => {
  const endpoint =
      type === "departmentTypes"
          ? `/api/v1/department-type?title=${query}&page_size=5`
          : `/api/v1/department?title=${query}&page_size=5`;

  const response = await axiosInstance.get(endpoint);
  return response.data.data;
};

export function DataTableToolbar<TData>({
                                          table,
                                          onTitleChange,
                                          onFilterChange,
                                        }: DataTableToolbarProps<TData>) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;

  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({
    departmentTypes: "",
    parents: "",
  });

  // دیبانس کردن مقادیر جستجو
  const debouncedDepartmentQuery = useDebounce2(searchQueries.departmentTypes, 500);
  const debouncedParentQuery = useDebounce2(searchQueries.parents, 500);





  // درخواست‌ها با react-query
  const { data: departmentTypes = [], isLoading: isLoadingDeptTypes } = useQuery({
    queryKey: ["departmentTypes", debouncedDepartmentQuery],
    queryFn: () => fetchFilteredOptions(debouncedDepartmentQuery, "departmentTypes"),
    enabled: true, // همیشه فعال باشه، حتی اگه کوئری خالیه
    //keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const { data: parents = [], isLoading: isLoadingParents } = useQuery({
    queryKey: ["parents", debouncedParentQuery],
    queryFn: () => fetchFilteredOptions(debouncedParentQuery, "parents"),
    enabled: true,
    //keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return (
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
              placeholder={t("department.searchbytitle")}
              onChange={(event) => onTitleChange(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
          />
          <div className="hidden lg:flex">
            {table.getColumn("departmentType") && (
                <DataTableFacetedFilter
                    column={table.getColumn("departmentType")}
                    title={t("department.deptype")}
                    onFilterChange={onFilterChange}
                    options={departmentTypes}
                    setSearchQuery={(query) =>
                        setSearchQueries((prev) => ({ ...prev, departmentTypes: query }))
                    }
                    isLoading={isLoadingDeptTypes} // اضافه کردن وضعیت بارگذاری
                />
            )}
          </div>
          <div className="hidden lg:flex">
            {table.getColumn("parent") && (
                <DataTableFacetedFilter
                    column={table.getColumn("parent")}
                    title={t("department.parent")}
                    onFilterChange={onFilterChange}
                    options={parents}
                    setSearchQuery={(query) =>
                        setSearchQueries((prev) => ({ ...prev, parents: query }))
                    }
                    isLoading={isLoadingParents} // اضافه کردن وضعیت بارگذاری
                />
            )}
            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => {
                      table.resetColumnFilters();
                      onFilterChange("departmentType", []);
                      onFilterChange("parent", []);
                    }}
                    className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <X />
                </Button>
            )}
          </div>
        </div>
        <DataTableViewOptions table={table} />
      </div>
  );
}