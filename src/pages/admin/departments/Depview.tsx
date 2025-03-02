import {useEffect, useState} from "react";
import {useParams, useLocation } from "react-router";
import {axiosInstance} from "@/axios";

interface Department {
    id: number;
    title: string;
    departmentType: string;
    parent: string;
}

const ViewItem = () => {
    const { id } = useParams();
    const location = useLocation();
    const initialData = location.state; // دریافت داده از state
    const [data, setData] = useState<Department | null>(null);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (!initialData) {
            // اگر داده در state موجود نبود، از API دریافت کن
            const fetchData = async () => {
                try {
                    const response = await axiosInstance.get(`/api/v1/department/${id}`);
                    setData(response.data.data);
                } catch (error) {
                    console.error("Error fetching department:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id, initialData]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Item not found</p>;

    return (
        <div>
            <h1>{data.id}</h1>
            <h1>{data.title}</h1>
            <h1>{data.departmentType}</h1>
            <h1>{data.parent}</h1>
        </div>
    );
};

export default ViewItem;