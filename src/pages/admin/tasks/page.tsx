//import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
//import { taskSchema } from "./data/schema"
import { useEffect, useState, useCallback  } from 'react';


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(1);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                page_size: rowsPerPage.toString(),
                ...(sortColumn && { sort: sortColumn }), // ستون مرتب‌سازی
                ...(sortOrder && { order: sortOrder }), // ترتیب مرتب‌سازی
            });

            const response = await fetch(`http://localhost:4000/api/v1/department2?${queryParams}`);
            const data = await response.json();
            setTasks(data.data);
            setTotalPages(data._pagination.total_pages);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    }, [currentPage, rowsPerPage, sortColumn, sortOrder]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSortingChange = (column: string, order: "asc" | "desc") => {
        setSortColumn(column);
        setSortOrder(order);
    };

    return { tasks, currentPage, rowsPerPage, totalPages, setCurrentPage, setRowsPerPage, handleSortingChange };
}


export default function TaskPage() {


    const { tasks, currentPage, rowsPerPage, totalPages, setCurrentPage, setRowsPerPage, handleSortingChange } = TaskList();


    return (
        <>
            <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your tasks for this month!
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserNav />
                    </div>
                </div>
                <DataTable
                    data={tasks}
                    columns={columns}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPage={(page: number) => setRowsPerPage(page)}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    onSortingChange={(column: string, order: "asc" | "desc") => handleSortingChange(column,order)}
                />
            </div>
        </>
    )
}