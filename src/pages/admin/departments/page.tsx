import {columns} from "./grid/columns"
import {DataTable} from "@/components//data-table/data-table.tsx"
import {lazy, Suspense, useCallback, useEffect, useState} from 'react';
import {axiosInstance} from "@/axios";
import {useTranslation} from "react-i18next";
import {Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button.tsx";
import {NavLink} from "react-router";
import {DataTableToolbar} from "@/pages/admin/departments/grid/data-table-toolbar.tsx";
import {Deptable} from "@/pages/admin/departments/table.ts";

const FormComponent = lazy(() => import("./Depform"));
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
// import {DataTablePagination} from "@/components/data-table/data-table-pagination.tsx";
// import * as React from "react";

const useDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    const [parentIds, setParentIds] = useState<number[] | null>([]);
    const [departmentTypes, setDepartmentTypes] = useState<number[] | null>([]);


    

    const fetchDepartments = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams({
                expand: "true",
                page: currentPage.toString(),
                page_size: rowsPerPage.toString(),
                ...(sortColumn && { sort: sortColumn }),
                ...(sortOrder && { order: sortOrder }),
                ...(title && title.length >= 2 && { title: title }),
                ...(parentIds?.length ? { parent: parentIds.join(",") } : {}),
                ...(departmentTypes?.length ? { department_type: departmentTypes.join(",") } : {}),
            });
    
            const response = await axiosInstance.get(`/api/v1/department?${queryParams}`);
            const data = response.data;
    
            setDepartments(data.data);
            setTotalPages(data._pagination.total_pages);
            setTotalRows(data._pagination.total_rows);
        } catch (error) {
            console.error("Failed to fetch departments:", error);
        }
    }, [currentPage, rowsPerPage, sortColumn, sortOrder, title, parentIds, departmentTypes]); 
    

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments, parentIds, departmentTypes]);
    

    const handleSortingChange = (column: string, order: "asc" | "desc") => {
        setSortColumn(column);
        setSortOrder(order);
    };

    const handleTitleChange = (title: string) => {
        console.log(title)
        setTitle(title);
    };
    
    const handleFilterChange = (column: string | undefined, values: number[]) => {
        if (column === "departmentType") {
            setDepartmentTypes(values.length > 0 ? values.map(v => Number(v)) : null);
        } else if (column === "parent") {
            setParentIds(values.length > 0 ? values.map(v => Number(v)) : null);
        }
    };

    return { departments, currentPage, rowsPerPage, totalPages, totalRows, setCurrentPage, setRowsPerPage,
         handleSortingChange, handleTitleChange, handleFilterChange };
}


export default function DepartmentPage() {

    const [open, setOpen] = useState(false);

    const { departments, currentPage, rowsPerPage, totalPages, totalRows, setCurrentPage, setRowsPerPage, handleSortingChange,
         handleTitleChange, handleFilterChange } = useDepartments();

    const { t } = useTranslation();

    const table = Deptable({
        data:departments,
        columns:columns,
        onSortingChange: handleSortingChange,
    })
    return (
        <>
            <div className="h-full flex-1 flex-col space-y-4 md:flex ">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t("site.departments")}</h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your {t("site.departments")} for this month!
                        </p>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        {/* <Button onClick={() => setOpen(true)}>افزودن رکورد جدید</Button> */}
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                        <Suspense fallback={<p>در حال بارگذاری...</p>}>
                            <FormComponent/>
                        </Suspense>
                        <DialogFooter>
                        <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="space-y-4 ">
                    <div className="bg-muted/40 border rounded-[0.5rem]">

                        <div className="flex  flex-wrap border-b bg-muted/80 pl-4">
                            <NavLink className="text-blue-600 gap-x-3 rounded-md p-2 text-xs font-semibold"
                                     to="/admin/depform">Add new department
                            </NavLink>
                            <button onClick={() => setOpen(true)} className="text-blue-600 gap-x-3 rounded-md p-2 text-xs font-semibold">
                                Add new department
                            </button>
                        </div>

                        <div className="p-4">
                            <DataTableToolbar table={table} onTitleChange={handleTitleChange}
                                              onFilterChange={handleFilterChange}/>
                        </div>
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
        </>
    )
}


