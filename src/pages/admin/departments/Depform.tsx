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
import { Loader2 } from 'lucide-react';
import Depview from "@/pages/admin/departments/Depview.tsx";

interface DepType {
    id: number;
    title: string;
}
interface Department {
    id: number;
    title: string;
    departmentType: number;
    parent	: number;
}

//const token = isExpiredJwt()

const FormSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    departmenttypeid: z.preprocess(
        (value) => (value ? Number(value) : undefined),
        z.number({ required_error: "DepartmentTypeID is required." }).optional()
    ),
    parentid: z.preprocess(
        (value) => (value ? Number(value) : undefined),
        z.number({ required_error: "ParentID is required." }).optional()
    ),
});





const InputForm = ({
                   title = "",
                   departmenttypeid,
                   parentid,
                   onSuccess,
               }: {
    title?: string;
    departmenttypeid?: number;
    parentid?: number;
    onSuccess?: () => void | undefined;
}) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: title || "",
            departmenttypeid: departmenttypeid ?? undefined,
            parentid: parentid ?? undefined,
        },
    });

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isPopoverOpen2, setIsPopoverOpen2] = useState(false);
    const [depTypes, setDepTypes] = useState<DepType[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [query1, setQuery1] = useState("");
    const [query2, setQuery2] = useState("");
    const [record, setRecord] = useState(null);



    useEffect(() => {
    async function fetchDepTypes(searchQuery = "") {
        try {
            const response = await axiosInstance.get(`/api/v1/department-type?title=${searchQuery}`);
            setDepTypes(response.data.data || []);
        } catch (error) {
            console.error('Error fetching depTypes:', error);
            setDepTypes([]);
            toast({
                title: "خطا",
                description: "دریافت نوع دپارتمان‌ها با مشکل مواجه شد.",
                variant: "destructive",
            });
        }
    }
    fetchDepTypes(query1);
}, [query1]);

useEffect(() => {
    async function fetchDepartments(searchQuery = "") {
        try {
            const response = await axiosInstance.get(`/api/v1/department?title=${searchQuery}`);
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error fetching depTypes:', error);
            setDepartments([]);
            toast({
                title: "خطا",
                description: "دریافت نوع دپارتمان‌ها با مشکل مواجه شد.",
                variant: "destructive",
            });
        }
    }
    fetchDepartments(query2);
}, [query2]);

   

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(`/api/v1/department`, data);
            setRecord(response.data.data);
            toast({
                title: "موفقیت",
                description: "دپارتمان با موفقیت ثبت شد.",
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: "خطا",
                description: "ثبت دپارتمان با مشکل مواجه شد.",
                variant: "destructive",
            });
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
                                                                    value={String(departmenttypeid.id)}
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
                                                                    value={String(parentid.id)}
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


