import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
//import { useState,useEffect } from "react";

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
//import decodeJWT, {getTokenFromCookie, getUserFromToken, isExpiredJwt, saveTokenToCookie} from "@/lib/jwt";

//import {Toaster} from "@/components/ui/toaster";
import Isguest from "@/components/Isguest.tsx";
import { useNavigate } from "react-router";
import {login} from "@/services/authService.ts";
import {toast} from "@/hooks/use-toast";

const Login = () =>{


    const navigate = useNavigate();



    const FormSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        password: z.string().min(2, {
            message: "Password must be at least 2 characters.",
        }),
    })



    function InputForm({username,password}:{username: string,password: string}) {

        const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                username: username,
                password: password,
            },
        })

        const onSubmit = async (data: z.infer<typeof FormSchema>) => {

            try {
                const logininfo = await login(data.username, data.password);

                toast({
                    title: "Login Successful",
                    description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify(logininfo.message, null, 2)}</code>
                            </pre>
                    ),
                });

                if (logininfo.access_token) navigate("/admin");

            } catch (error: any) {
                let errorMessage = "An unexpected error occurred. Please try again.";

                if (error.response) {
                    errorMessage = error.response.data?.message || "Login failed. Please check your credentials.";
                    console.error("Server Error:", error.response.status, error.response.data);
                } else if (error.request) {
                    errorMessage = "Unable to connect to the server. Please check your internet connection.";
                    console.error("Network Error: No response received.");
                } else {
                    console.error("Unexpected Error:", error.message);
                }
                toast({
                    title: "Login Failed",
                    description: errorMessage,
                    variant: "destructive", // فرض می‌کنیم این نوع استایل برای خطا وجود دارد
                });
            }


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
                        
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <InputForm password={""} username={''}></InputForm>
                    </div>
                </div>

            </div>
        </Isguest>

    )
}

export default Login

