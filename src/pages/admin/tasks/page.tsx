//import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
//import { taskSchema } from "./data/schema"
import { useEffect, useState, useCallback  } from 'react';
import {axiosInstance} from "@/axios";
// import * as React from "react";


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [title, setTitle] = useState<string | null>(null);


    const fetchTasks = useCallback(async () => {

        //console.log(title);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                page_size: rowsPerPage.toString(),
                ...(sortColumn && { sort: sortColumn }), // ستون مرتب‌سازی
                ...(sortOrder && { order: sortOrder }), // ترتیب مرتب‌سازی
                ...(title && title.length >= 2 && { title: title }),
                //...(title && { title: title }),
            });
            const response = await axiosInstance.get(`/api/v1/department?${queryParams}`);
            const data = response.data;


            setTasks(data.data);
            setTotalPages(data._pagination.total_pages);
            setTotalRows(data._pagination.total_rows);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    }, [currentPage, rowsPerPage, sortColumn, sortOrder, title]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSortingChange = (column: string, order: "asc" | "desc") => {
        setSortColumn(column);
        setSortOrder(order);
    };

    const handleTitleChange = (title: string) => {
        console.log(title)
        setTitle(title);
        //onTitleChange(value); // این تابع را از والد به عنوان props بفرست
    };

    return { tasks, currentPage, rowsPerPage, totalPages, totalRows, setCurrentPage, setRowsPerPage, handleSortingChange, handleTitleChange };
}


export default function TaskPage() {


    const { tasks, currentPage, rowsPerPage, totalPages, totalRows, setCurrentPage, setRowsPerPage, handleSortingChange, handleTitleChange } = TaskList();


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
                    totalRows={totalRows}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPage={(page: number) => setRowsPerPage(page)}
                    onPageChange={(page: number) => setCurrentPage(page)}
                    onSortingChange={(column: string, order: "asc" | "desc") => handleSortingChange(column,order)}
                    onTitleChange={(title: string) => handleTitleChange(title)}
                />
            </div>
        </>
    )
}