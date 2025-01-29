import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState,useEffect } from "react";
// import { toast } from "@/hooks/use-toast"
// import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import decodeJWT, {getTokenFromCookie, getUserFromToken, isExpiredJwt, saveTokenToCookie} from "@/lib/jwt";
import { useRouter } from 'next/navigation'
import {Toaster} from "@/components/ui/toaster";
import Isguest from "@/components/Isguest.tsx";

const Login = () =>{



    const router = useRouter();
    const token = isExpiredJwt()

    useEffect(() => {
        if (token) {
            router.push('/dashboard');
        }
    }, [token, router]);


    const [error, setError] = useState<any>(null);

    const FormSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        password: z.string().min(2, {
            message: "Password must be at least 2 characters.",
        }),
    })

    async function getUser() {
        //setLoading(true);
        setError(null); // پاک کردن خطای قبلی

        const token = isExpiredJwt()
        const user = getUserFromToken()


        try {
            const res = await fetch("http://localhost:8080/api/v1/auth/user?" + new Date().getTime(),
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // ست کردن هدر Authorization
                    }
                }
            );
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();

            console.info(data)
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("خطا در دریافت داده‌ها. لطفاً بعداً تلاش کنید.");
        } finally {
            //setLoading(false);
        }
    }

    function InputForm({username,password}:{username: string,password: string}) {

        const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                username: username,
                password: password,
            },
        })

        function onSubmit(data: z.infer<typeof FormSchema>) {
            //alert(JSON.stringify(data, null, 2))

            //const token = getTokenFromCookie()
            fetch("http://127.0.0.1:8080/api/v1/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email: data.username,
                    password: data.password
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                    //'Authorization': `Bearer ${token}`,
                }
            })
                .then((response) => response.json())
                .then((json) =>
                {
                    saveTokenToCookie(json.token)
                    router.push('/dashboard');
                });
        }

        return (

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm/6 font-medium text-gray-900">Username</FormLabel>

                                <FormControl>
                                    <Input placeholder="shadcn" {...field}
                                        // type="text"
                                        // value={inputValue}
                                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm/6 font-medium text-gray-900">password</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field}
                                        // type="text"
                                        // value={inputValue2}
                                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue2(e.target.value)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        )
    }


    return (
        <Isguest>
            <div>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Your Company"
                            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                            className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <InputForm password={""} username={''}></InputForm>
                        <Button onClick={getUser}>getJWT</Button>
                    </div>
                </div>
                <Toaster />
            </div>
        </Isguest>

    )
}

export default Login

