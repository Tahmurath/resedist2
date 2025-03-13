import {z} from "zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import {toast} from "@/hooks/use-toast";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {cn} from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react"
import {axiosInstance} from "@/axios";
import Depview from "@/pages/admin/departments/Depview.tsx";
import { Loader2 } from 'lucide-react';
import {useParams } from "react-router";

interface DepType {
    id: number;
    title: string;
}
interface Department {
    id: number;
    title: string;
    departmentType: number;
    parent: number;
}

const FormSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    departmenttypeid: z.preprocess((value) => Number(value), z.number({ message: "DepartmentTypeID must be a number." })),
    parentid: z.preprocess((value) => Number(value), z.number({ message: "ParentID must be a number." })),
});

function InputForm({ dep_id, onSuccess }: { dep_id?: number; onSuccess?: () => void }) {
    const { id } = useParams(); // گرفتن id از URL

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            departmenttypeid: undefined,
            parentid: undefined,
        },
    });

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isPopoverOpen2, setIsPopoverOpen2] = useState(false);
    const [depTypes, setDepTypes] = useState<DepType[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");
    const [record, setRecord] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecordLoaded, setIsRecordLoaded] = useState(false); // حالت جدید برای هماهنگی

    // dep_id= 202
    // تعیین اینکه آیا در حالت ویرایش هستیم یا خیر
    const effectiveId = dep_id || id; // اولویت با dep_id است، اگر نبود از id استفاده می‌شه

    // گرفتن داده‌های رکورد برای ویرایش
    useEffect(() => {
        async function fetchRecord(recordId: number) {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/api/v1/department/${recordId}?expand=true`);
                const record = response.data.data;
                form.reset({
                    title: record.title,
                    departmenttypeid: typeof record.departmentType === "number" ? record.departmentType : record.departmentType.id,
                    parentid: typeof record.parent === "number" ? record.parent : record.parent.id,
                });

                // اضافه کردن departmentType به لیست
                if (record.departmentType && typeof record.departmentType !== "number") {
                    setDepTypes((prev) => {
                        if (!prev.some((dt) => dt.id === record.departmentType.id)) {
                            return [...prev, record.departmentType];
                        }
                        return prev;
                    });
                }

                // اضافه کردن parent به لیست
                if (record.parent && typeof record.parent !== "number") {
                    setDepartments((prev) => {
                        if (!prev.some((d) => d.id === record.parent.id)) {
                            return [...prev, record.parent];
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error("Error fetching record:", error);
                toast({ title: "Error", description: "Failed to load record." });
            } finally {
                setIsLoading(false);
                setIsRecordLoaded(true); // وقتی رکورد لود شد یا خطا داد، این رو true کن
            }
        }

        if (effectiveId) {
            fetchRecord(effectiveId);
        } else {
            setIsLoading(false);
            setIsRecordLoaded(true);
        }
    }, [effectiveId, form]);

    // گرفتن انواع دپارتمان
    useEffect(() => {

        if (!isRecordLoaded) return; // فقط وقتی رکورد لود شده اجرا بشه

        async function fetchDepTypes(searchQuery = "") {
            try {
                const response = await axiosInstance.get(`/api/v1/department-type?title=${searchQuery}`);
                setDepTypes(response.data.data);
            } catch (error) {
                console.error("Error fetching depTypes:", error);
                setDepTypes([]);
            }
        }
        fetchDepTypes(query1);
    }, [query1]);

    // گرفتن دپارتمان‌ها
    useEffect(() => {

        if (!isRecordLoaded) return; // فقط وقتی رکورد لود شده اجرا بشه
        async function fetchDepartments(searchQuery = "") {
            try {
                const response = await axiosInstance.get(`/api/v1/department?title=${searchQuery}`);
                setDepartments(response.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setDepartments([]);
            }
        }
        fetchDepartments(query2);
    }, [query2]);

    // سابمیت فرم
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        //setIsLoading(true);
        try {
            let response;
            if (effectiveId) {
                // حالت ویرایش: درخواست PUT
                response = await axiosInstance.put(`/api/v1/department/${effectiveId}`, data);
                setRecord(response.data.data);
            } else {
                // حالت ثبت جدید: درخواست POST
                response = await axiosInstance.post(`/api/v1/department`, data);
                setRecord(response.data.data);
            }
            

            if (onSuccess) onSuccess();
            toast({
                title: effectiveId ? "Record updated" : "Record created",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(response.data.data, null, 2)}</code>
                    </pre>
                ),
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast({ title: "Error", description: "Failed to submit form." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {record ? (
                <div>
                    <Depview record={record}></Depview>
                </div>
            ) : (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-sm/6 font-medium text-gray-900">Title</FormLabel>

                            <FormControl>
                                <Input placeholder="Title" {...field}/>
                            </FormControl>
                            <FormDescription>
                                Department title
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departmenttypeid"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>departmenttypeid</FormLabel>
                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                        >
                                            {field.value
                                                ? depTypes.find(
                                                    (departmenttypeid) => departmenttypeid.id === field.value
                                                )?.title
                                                : "Select department type"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search framework..."
                                            className="h-9"
                                            onValueChange={setQuery1}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {depTypes && depTypes.length > 0 ? (
                                                    depTypes.map((departmenttypeid) => (
                                                        <CommandItem
                                                            value={`${departmenttypeid.id}:${departmenttypeid.title}`}
                                                            key={departmenttypeid.id}
                                                            onSelect={() => {
                                                                form.setValue("departmenttypeid", departmenttypeid.id);
                                                                setIsPopoverOpen(false);
                                                            }}
                                                        >
                                                            {departmenttypeid.id}:{departmenttypeid.title}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    departmenttypeid.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))
                                                ) : (
                                                    <CommandItem>No data available</CommandItem>
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                This is the department type that will be used in the dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="parentid"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>parentid</FormLabel>
                            <Popover open={isPopoverOpen2} onOpenChange={setIsPopoverOpen2} >
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            onClick={() => setIsPopoverOpen2(!isPopoverOpen2)}
                                        >
                                            {field.value
                                                ? departments.find(
                                                    (parentid) => parentid.id === field.value
                                                )?.title
                                                : "Select parentid type"}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search framework..."
                                            className="h-9"
                                            onValueChange={setQuery2}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {departments && departments.length > 0 ? (
                                                    departments.map((parentid) => (
                                                        <CommandItem
                                                            value={`${parentid.id}:${parentid.title}`}
                                                            key={parentid.id}
                                                            onSelect={() => {
                                                                form.setValue("parentid", parentid.id);
                                                                setIsPopoverOpen2(false);
                                                            }}
                                                        >
                                                            {parentid.id}:{parentid.title}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    parentid.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))
                                                ) : (
                                                    <CommandItem>No data available</CommandItem>
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                This is the department type that will be used in the dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Submit'}
                </Button>

            </form>
            </Form>
            )}
        </div>
    )
}

export default InputForm