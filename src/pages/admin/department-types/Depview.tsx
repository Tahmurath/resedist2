import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/axios";
import DeleteAlert from "./Delete";


interface Department {
  id: string;
  title: string;
  is_active: boolean;
}

const ViewItem = ({ record }: { record?: Department | null }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Department | null>(record || null);
  const [loading, setLoading] = useState(!record);
  const [removeOpen, setRemoveOpen] = useState(false);

  useEffect(() => {
    if (record) {
      setData(record);
      setLoading(false);
    } else if (id) {
      fetchRecordFromApi();
    }
  }, [id, record]);

  const fetchRecordFromApi = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/v1/department-type/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching department:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDepartments = () => {
    if (!record && id) {
      fetchRecordFromApi(); // برای رفرش دیتا بعد از حذف
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (!data) return <p>موردی یافت نشد</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Department</h2>
      <ul className="mt-2 space-y-2">
        <li>id: {data.id}</li>
        <li>title: {data.title}</li>
        <li>is_active: {data.is_active ? "Active":"Inactive"}</li>
      </ul>
      <div className="mt-4 space-x-2">
        <NavLink to={`/admin/department-types/${data.id}/edit`}>
          <Button variant="default">Edit</Button>
        </NavLink>
        <Button variant="destructive" onClick={() => setRemoveOpen(true)}>
          Delete
        </Button>
      </div>

      <DeleteAlert
        depid={data.id}
        removeOpen={removeOpen}
        setRemoveOpen={setRemoveOpen}
        refreshDepartments={refreshDepartments}
      />
    </div>
  );
};

export default ViewItem;