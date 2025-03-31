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
import Depview from "@/pages/admin/department-types/Depview.tsx";
import { Loader2 } from 'lucide-react';
import {useParams } from "react-router";
import useDebounce2 from "@/lib/debounce.ts";
import {useQuery} from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";




interface Department {
    id: string | null;
    title: string;
    is_active:boolean
    
}

const FormSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    is_active: z.boolean().default(true).optional(),
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
            //id: undefined,
            title: "",
            is_active:true
        },
    });

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isPopoverOpen2, setIsPopoverOpen2] = useState(false);
    // const [depTypes, setDepTypes] = useState<DepType[]>([]);
    // const [departments, setDepartments] = useState<Department[]>([]);
    // const [query1, setQuery1] = useState("");
    // const [query2, setQuery2] = useState("");
    const [record, setRecord] = useState(null);
    const [effectiveRecord, setEffectiveRecord] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecordLoaded, setIsRecordLoaded] = useState(false);

    // const debouncedQuery1 = useDebounce2(query1, 500);
    // const debouncedQuery2 = useDebounce2(query2, 500);

    

    useEffect(() => {
        async function fetchRecord(recordId: string) {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/api/v1/department-type/${recordId}?expand=true`);
                const record = response.data.data;
                setEffectiveRecord(record);
                // console.info(record)
                
                form.reset({
                    //id: record.id,
                    title: record.title,
                    is_active: record.is_active,
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

    

    // سابمیت فرم
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        try {
            let response;
            if (effectiveId) {
                // حالت ویرایش: درخواست PUT
                response = await axiosInstance.put(`/api/v1/department-type/${effectiveId}`, data);
                setRecord(response.data.data);
            } else {
                // حالت ثبت جدید: درخواست POST

                // حالت ثبت جدید: درخواست POST
                // const { id, ...dataWithoutId } = data; // id رو حذف کن
                response = await axiosInstance.post(`/api/v1/department-type`, data);
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
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Is Active?</FormLabel>
                            <FormDescription>
                            Is this Department type avialable & published?
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
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