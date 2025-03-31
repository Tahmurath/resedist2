import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // مسیر رو بر اساس پروژه‌تون تنظیم کنید
import { Loader2 } from "lucide-react"; // برای لودینگ
import { axiosInstance } from "@/axios"; // فرض کردم اینو دارید
import {toast} from "@/hooks/use-toast.ts"; // فرض کردم از این برای toast استفاده می‌کنید
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface DeleteAlertProps {
  depid: string;
  removeOpen: boolean;
  setRemoveOpen: (open: boolean) => void;
  refreshDepartments: () => void;
}

const DeleteAlert = ({
  depid,
  removeOpen,
  setRemoveOpen,
  refreshDepartments,
}: DeleteAlertProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onDelete = async (depid: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/v1/department-type/${depid}`);
      toast({
        title: "delete",
        description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">#{depid} Deleted</code>
                    </pre>
        ),
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      navigate("/admin/department-types");
    
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({ title: "خطا", description: "حذف دپارتمان با شکست مواجه شد." });
    } finally {
      setIsLoading(false);
      setRemoveOpen(false); // دیالوگ رو بعد از عملیات می‌بندیم
    }
  };

  return (
    <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onDelete(depid)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;