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
    departmentType: number;
    title: string;
    label: string;
}

// interface Department {
//     id: number;
//     title: string;
//     departmentType: number;
//     parent: number;
// }

interface Department {
    id: string | null;
    title: string;
    departmentType: number | DepType; // می‌تونه عدد یا آبجکت باشه
    parent: number | Department; // می‌تونه عدد یا آبجکت باشه
    label?: string;
}

const FormSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    departmenttypeid: z.preprocess((value) => Number(value), z.number({ message: "DepartmentTypeID must be a number." })),
    id: z.preprocess(
        (value) => (value ? Number(value) : undefined), // اگه مقدار داره به عدد تبدیل کن، وگرنه undefined
        z.number({ message: "ID must be a number." }).optional()
    ),
    parentid: z.preprocess((value) => Number(value), z.number({ message: "ParentID must be a number." })),
});



const InputForm = ({ 
        dep_id, 
        onSuccess
    }: { 
        dep_id?: string;
        onSuccess?: () => void 
    }) => {
    
    const { id } = useParams();

    const effectiveId = dep_id || id;


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: undefined,
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
    const [effectiveRecord, setEffectiveRecord] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecordLoaded, setIsRecordLoaded] = useState(false);

    

    useEffect(() => {
        async function fetchRecord(recordId: string) {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/api/v1/department/${recordId}?expand=true`);
                const record = response.data.data;
                setEffectiveRecord(record);
                // console.info(record)
                
                form.reset({
                    id: record.id,
                    title: record.title,
                    departmenttypeid: typeof record.departmentType === "number" ? record.departmentType : record.departmentType?.id,
                    parentid: typeof record.parent === "number" ? record.parent : record.parent?.id,
                });
                
            } catch (error) {
                console.error("Error fetching record:", error);
                toast({ title: "Error", description: "Failed to load record." });
            } finally {
                setIsLoading(false);
                setIsRecordLoaded(true)
            }
        }

        if (effectiveId) {
            fetchRecord(effectiveId);
        } else {
            setIsLoading(false);
            setIsRecordLoaded(true); // اگه رکوردی نیست، مستقیم برو به مرحله بعد
        }
    }, [effectiveId, form]);

    // گرفتن انواع دپارتمان
    useEffect(() => {

        if (effectiveId && !isRecordLoaded) return; // فقط وقتی رکورد لود شده اجرا بشه

        async function fetchDepTypes(searchQuery = "") {
            try {
                
                let url = `/api/v1/department-type?title=${encodeURIComponent(searchQuery)}`

                if(effectiveId){
                    const depTypeid = effectiveRecord?.departmentType?.id;
                    url = depTypeid
                    ? `/api/v1/department-type?title=${encodeURIComponent(searchQuery)}&department_type=${depTypeid}`: url;
                }

                const response = await axiosInstance.get(url);
                setDepTypes(response.data.data);
                
            } catch (error) {
                console.error("Error fetching depTypes:", error);
                setDepTypes([]);
            }
        }
        fetchDepTypes(query1);
    }, [query1, effectiveRecord, isRecordLoaded]);

    // گرفتن دپارتمان‌ها
    useEffect(() => {

        if (effectiveId && !isRecordLoaded) return; // فقط وقتی رکورد لود شده اجرا بشه

        
        async function fetchDepartments(searchQuery = "") {
            try {
                let url = `/api/v1/department?title=${encodeURIComponent(searchQuery)}`

                if(effectiveId){
                    const parentId = effectiveRecord?.parent?.id;
                    url = parentId
                    ? `/api/v1/department?title=${encodeURIComponent(searchQuery)}&department=${parentId}`: url;
                }

                const response = await axiosInstance.get(url);
                setDepartments(response.data.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                setDepartments([]);
            }
        }

        fetchDepartments(query2);

    }, [query2, record, isRecordLoaded]);

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

                // حالت ثبت جدید: درخواست POST
                const { id, ...dataWithoutId } = data; // id رو حذف کن
                response = await axiosInstance.post(`/api/v1/department`, dataWithoutId);
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

            {/*{effectiveRecord ? (*/}
            {/*    <>*/}
            {/*    <h1>effectiveRecord.id:{effectiveRecord.id}</h1>*/}
            {/*    <h2>effectiveRecord.title:{effectiveRecord.title}</h2>*/}
            {/*    <h2>effectiveRecord.departmentType:{effectiveRecord.departmentType?.title}</h2>*/}
            {/*    <h2>effectiveRecord.parent:{effectiveRecord.parent?.title}</h2>*/}
            {/*    </>*/}
            {/*) : (*/}
            {/*    <h1>*/}

            {/*    </h1>*/}
            {/*)}*/}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {effectiveId && (
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} type="hidden" />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}
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

                {/*/!* بقیه فیلدها مثل departmenttypeid و parentid *!/*/}
                {/*<Button type="submit" disabled={isLoading}>*/}
                {/*    {isLoading ? "در حال ارسال..." : "ذخیره"}*/}
                {/*</Button>*/}

            </form>
            </Form>
            )}
        </div>
    )
}

export default InputForm