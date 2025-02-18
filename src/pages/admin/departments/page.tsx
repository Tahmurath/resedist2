import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { useEffect, useState, useCallback  } from 'react';
import {axiosInstance} from "@/axios";



const Departments = () => {
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
                expand: true,
                page: currentPage.toString(),
                page_size: rowsPerPage.toString(),
                ...(sortColumn && { sort: sortColumn }),
                ...(sortOrder && { order: sortOrder }),
                ...(title && title.length >= 2 && { title: title }),
                ...(parentIds?.length > 0 ? { parent: parentIds.join(",") } : {}),
                ...(departmentTypes?.length > 0 ? { department_type: departmentTypes.join(",") } : {}),
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
    
    const handleFilterChange = (column: string, values: number[]) => {
        if (column === "departmentType") {
            setDepartmentTypes(values.length > 0 ? values.map(v => Number(v)) : null);
        } else if (column === "parent") {
            setParentIds(values.length > 0 ? values.map(v => Number(v)) : null);
        }
    };

    const handleFilterChange2 = (column: string, values: number[]) => {

        console.info(column,values )
        if (column === "departmentType") {
            setDepartmentTypes(values);
        } else if (column === "parent") {
            setParentIds(values);
        }
    };

    return { departments, currentPage, rowsPerPage, totalPages, totalRows, setCurrentPage, setRowsPerPage, handleSortingChange, handleTitleChange, handleFilterChange };
}


export default function DepartmentPage() {


    const { departments, currentPage, rowsPerPage, totalPages, totalRows, setCurrentPage, setRowsPerPage, handleSortingChange, handleTitleChange, handleFilterChange } = Departments();


    return (
        <>
            <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your departments for this month!
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserNav />
                    </div>
                </div>
                <DataTable
                    data={departments}
                    columns={columns}
                    totalPages={totalPages}
                    totalRows={totalRows}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPage={(page: number) => setRowsPerPage(page)}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    onSortingChange={(column: string, order: "asc" | "desc") => handleSortingChange(column,order)}
                    onTitleChange={(title: string) => handleTitleChange(title)}
                    onFilterChange={(column: string, values: number[]) => handleFilterChange(column,values)}
                />
            </div>
        </>
    )
}