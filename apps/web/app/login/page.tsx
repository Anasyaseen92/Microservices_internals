"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, ApiError } from "../../lib/api-client";
import { auth } from "../../lib/auth";
import { useToast } from "../../components/toast";
const schema = z.object({ email: z.string().email("Enter a valid email"), password: z.string().min(1, "Enter your password") });
type Form = z.infer<typeof schema>;
export default function LoginPage() { const router=useRouter(); const toast=useToast(); const [error,setError]=useState(""); const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<Form>({resolver:zodResolver(schema)}); useEffect(()=>{if(auth.getUser()) router.replace("/")},[router]); const submit=async(data:Form)=>{try{const result=await api.login(data);auth.save(result.token,result.user);toast("Welcome back");router.push("/products")}catch(e){setError(e instanceof ApiError?e.message:"Unable to sign in")}}; return <main className="grid min-h-[calc(100vh-73px)] place-items-center px-5 py-12"><form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"><p className="eyebrow">Welcome back</p><h1 className="mt-2 text-3xl font-black">Sign in to Northstar</h1><p className="mt-2 text-sm text-slate-500">Demo: customer@example.com / DemoPass123!</p>{error&&<p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<label className="label">Email<input className="input mt-2" {...register("email")} /></label>{errors.email&&<p className="field-error">{errors.email.message}</p>}<label className="label mt-5">Password<input type="password" className="input mt-2" {...register("password")} /></label>{errors.password&&<p className="field-error">{errors.password.message}</p>}<button className="button-primary mt-7 w-full" disabled={isSubmitting}>{isSubmitting?"Signing in…":"Sign in"}</button><p className="mt-6 text-center text-sm text-slate-500">New here? <Link className="font-bold text-indigo-600" href="/register">Create an account</Link></p></form></main>; }
