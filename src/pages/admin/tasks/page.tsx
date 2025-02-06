import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { taskSchema } from "./data/schema"
import { useEffect, useState } from 'react';


function TaskList2() {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await fetch('http://192.168.1.164:4000/api/v1/department2?page_size=10');
                const data = await response.json();
                console.log(data.data);
                setTasks(data.data);
                setTotalPages(data._pagination.total_pages);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
            } finally {
                //setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    return z.array(taskSchema).parse(tasks);
}
// Simulate a database read for tasks.


export default function TaskPage() {
    //const tasks = TaskList()

    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(1);

    const fetchTasks = async (page: number,perPage: number) => {
        try {
            const response = await fetch(`http://192.168.1.164:4000/api/v1/department2?page=${page}&page_size=${perPage}`);
            const tasks = await response.json();
            setTasks(tasks.data);
            //console.log(data._pagination.total_pages);
            setTotalPages(tasks._pagination.total_pages); // فرض کنید API تعداد کل صفحات را برمی‌گرداند

        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks(currentPage, rowsPerPage);
    }, [currentPage,rowsPerPage]);


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
                />
            </div>
        </>
    )
}