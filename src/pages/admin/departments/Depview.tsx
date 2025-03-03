import {useEffect, useState} from "react";
import {useParams } from "react-router";
import {axiosInstance} from "@/axios";

interface Department {
    id: number;
    title: string;
    departmentType: string;
    parent: string;
}

const ViewItem = ({ record }:{record:Department | null}) => {
    const { id } = useParams();
    const [data, setData] = useState<Department | null>(record || null);
    //const [data, setData] = useState<Department | null>(null);
    const [loading, setLoading] = useState(!record); // فقط اگه record نباشه لودینگ true باشه

    useEffect(() => {
        // اگه record از props اومده، نیازی به API نیست
        if (record) {
            setData(record);
            setLoading(false);
        } else if (id) {
            // اگه record نیست ولی id هست، از API بگیر
            fetchRecordFromApi();
        }
    }, [id, record]);

    const fetchRecordFromApi = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/v1/department/${id}`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching department:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Item not found</p>;

    return (
        <div>
            <span>Item view</span>
            <ul>
            <li>{data.id}</li>
            <li>{data.title}</li>
            <li>{data.departmentType}</li>
            <li>{data.parent}</li>
            </ul>
        </div>
    );
};

export default ViewItem;