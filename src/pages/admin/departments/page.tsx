import { columns } from "./grid/columns";
import { DataTable } from "@/components/data-table/data-table.tsx";
import { lazy, Suspense, useState, useEffect } from "react";
import { axiosInstance } from "@/axios";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { NavLink } from "react-router";
import { DataTableToolbar } from "@/pages/admin/departments/grid/data-table-toolbar.tsx";
import { Deptable } from "@/pages/admin/departments/table.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from 'lucide-react';

const useDebounce = (value: string | null, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const InputForm = lazy(() => import("./Depform"));

const useDepartments = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [parentIds, setParentIds] = useState<number[] | null>([]);
  const [departmentTypes, setDepartmentTypes] = useState<number[] | null>([]);
  const [displayedDepartments, setDisplayedDepartments] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1); // به state منتقل شد
  const [totalRows, setTotalRows] = useState(0); // به state منتقل شد
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const debouncedTitle = useDebounce(title, 500);

  const fetchDepartments = async () => {
    const queryParams = new URLSearchParams({
      expand: "true",
      page: currentPage.toString(),
      page_size: rowsPerPage.toString(),
      ...(sortColumn && { sort: sortColumn }),
      ...(sortOrder && { order: sortOrder }),
      ...(debouncedTitle && debouncedTitle.length >= 2 && { title: debouncedTitle }),
      ...(parentIds?.length && { parent: parentIds.join(",") }),
      ...(departmentTypes?.length && { department_type: departmentTypes.join(",") }),
    });

    const response = await axiosInstance.get(`/api/v1/department?${queryParams}`);
    return response.data;
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [
      "departments",
      currentPage,
      rowsPerPage,
      sortColumn,
      sortOrder,
      debouncedTitle,
      parentIds,
      departmentTypes,
    ],
    queryFn: fetchDepartments,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const departments = data?.data || [];

  useEffect(() => {
    if (!isFetching) {
      setDisplayedDepartments(departments);
      setTotalPages(data?._pagination?.total_pages || 1); // فقط وقتی داده جدیده آپدیت می‌شه
      setTotalRows(data?._pagination?.total_rows || 0); // فقط وقتی داده جدیده آپدیت می‌شه
    }
    if (isInitialLoad && !isLoading) {
      setIsInitialLoad(false);
    }
  }, [data, departments, isFetching, isLoading, isInitialLoad]);

  const refreshDepartments = () => {
    queryClient.invalidateQueries({ queryKey: ["departments"] });
  };

  const clearDepartmentsCache = () => {
    queryClient.removeQueries({ queryKey: ["departments"] });
  };

  const clearAllCache = () => {
    queryClient.clear();
  };

  const handleSortingChange = (column: string, order: "asc" | "desc") => {
    setSortColumn(column);
    setSortOrder(order);
    refreshDepartments();
  };

  const handleTitleChange = (title: string) => {
    setTitle(title);
    setCurrentPage(1);
  };

  const handleFilterChange = (column: string | undefined, values: number[]) => {
    if (column === "departmentType") {
      setDepartmentTypes(values.length > 0 ? values.map((v) => Number(v)) : null);
    } else if (column === "parent") {
      setParentIds(values.length > 0 ? values.map((v) => Number(v)) : null);
    }
    setCurrentPage(1);
    refreshDepartments();
  };

  return {
    departments: displayedDepartments,
    currentPage,
    rowsPerPage,
    totalPages,
    totalRows,
    setCurrentPage,
    setRowsPerPage,
    handleSortingChange,
    handleTitleChange,
    handleFilterChange,
    refreshDepartments,
    clearDepartmentsCache,
    clearAllCache,
    isLoading,
    isFetching,
    error,
    isInitialLoad,
  };
};

const DepartmentPage = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    departments,
    currentPage,
    rowsPerPage,
    totalPages,
    totalRows,
    setCurrentPage,
    setRowsPerPage,
    handleSortingChange,
    handleTitleChange,
    handleFilterChange,
    refreshDepartments,
    clearDepartmentsCache,
    clearAllCache,
    isLoading,
    isFetching,
    error,
    isInitialLoad,
  } = useDepartments();

  const table = Deptable({
    data: departments,
    columns: columns,
    onSortingChange: handleSortingChange,
  });

  const handleFormSuccess = () => {
    refreshDepartments();
    //setOpen(false);
  };

  if (isLoading && isInitialLoad) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error) {
    return <p>خطا: {(error as Error).message}</p>;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-4 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("site.departments")}</h2>
          <p className="text-muted-foreground">
            Here's a list of your {t("site.departments")} for this month!
          </p>
        </div>
        {/* <div className="space-x-2">
          <Button onClick={refreshDepartments}>رفرش داده‌ها</Button>
          <Button onClick={clearDepartmentsCache}>پاک کردن کش دپارتمان‌ها</Button>
          <Button onClick={clearAllCache}>پاک کردن همه کش‌ها</Button>
        </div> */}
      </div>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new department</DialogTitle>
            <DialogDescription>Add new department</DialogDescription>
          </DialogHeader>
          <Suspense fallback={<p>در حال بارگذاری...</p>}>
            <InputForm onSuccess={handleFormSuccess} />
          </Suspense>
          <DialogFooter>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="bg-muted/40 border rounded-[0.5rem]">
          <div className="flex flex-wrap border-b bg-muted/80 pl-4">
            <NavLink
              className="text-blue-600 gap-x-3 rounded-md p-2 text-xs font-semibold"
              to="/admin/depform"
            >
              Add new department
            </NavLink>
            <button
              onClick={() => setOpen(true)}
              className="text-blue-600 gap-x-3 rounded-md p-2 text-xs font-semibold"
            >
              Add new department
            </button>
            <button
              onClick={refreshDepartments}
              className="text-blue-600 gap-x-3 rounded-md p-2 text-xs font-semibold"
            >
              Refresh
              
            </button>
            {isFetching && departments.length ? (
              <Loader2 className="animate-spin" />
            ) : null}
          </div>
          <div className="p-4">
            <DataTableToolbar
              table={table}
              onTitleChange={handleTitleChange}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="relative">
            
            <div className="min-h-[300px] transition-all duration-300">
              <DataTable
                table={table}
                columns={columns}
                totalPages={totalPages}
                totalRows={totalRows}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPage={(page: number) => setRowsPerPage(page)}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;