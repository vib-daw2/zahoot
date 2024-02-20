import { zodResolver } from '@hookform/resolvers/zod';
import { AtSignIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { Link, redirect, useNavigate } from 'react-router-dom'
import { z } from 'zod';

const customZodError: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_string) {
        return { message: "Password must contain at least a number and a special character" }
    }
    return { message: ctx.defaultError }
}

const signupRequestSchema = z.object({
    name: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    password: z.string(
        {
            errorMap: customZodError
        }
    ).min(6).max(255).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,255}$/),
    email: z.string().email().min(1).max(255),
});


export default function Signup() {
    const [error, setError] = React.useState<string | null>(null)
    const { register, formState: { errors }, handleSubmit, watch } = useForm<z.infer<typeof signupRequestSchema>>({
        resolver: zodResolver(signupRequestSchema)
    })
    const navigation = useNavigate()

    const onSubmit: SubmitHandler<z.infer<typeof signupRequestSchema>> = async (input) => {
        console.log(input)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                method: "POST",
                body: JSON.stringify(input),
                headers: {
                    "Content-Type": "application/json"
                }
        })
            const data = await response.json()
            if (data.error) {
                setError(data.message)
            } else {
                console.log(data)
                navigation('/login')
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        }
    }

    React.useEffect(() => {
        setError(null)
    }, [watch])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-md w-full border border-slate-800 flex justify-center items-center flex-col gap-y-8 rounded-md p-4 py-6 bg-slate-900/70'>
            <div className='w-full'>
                <div className='relative mx-auto w-full'>
                    <UserIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                    <input {...register("name")} type="text" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='name' />
                </div>
                <p className='text-red-500'>{errors?.name?.message}</p>
            </div>
            <div className='w-full'>
                <div className='relative mx-auto w-full'>
                    <AtSignIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                    <input {...register("username")} type="text" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='username' />
                </div>
                <p className='text-red-500'>{errors?.username?.message}</p>
            </div>
            <div className='w-full'>
            <div className='relative mx-auto w-full'>
                <MailIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input 
                    {...register("email")} 
                    type="text" 
                    className={`${errors?.email ? "border-b-red-500" : "border-b-slate-200"} pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b focus:outline-none text-white`} 
                    placeholder='email' />
            </div>
                <p className='text-red-500 text-sm'>{errors?.email?.message}</p>
            </div>
            <div className='w-full'>
                <div className='relative mx-auto w-full'>
                    <LockIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                    <input aria-invalid={errors?.password ? "true" : "false"} {...register("password")} type="password" className={`${errors?.password ? "border-b-red-500" : "border-b-slate-200"} pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b focus:outline-none text-white`} placeholder='password' />
                </div>
                    <p className='text-red-500 text-sm'>{errors?.password?.message}</p>
                    <p className='text-red-500'>{error}</p>
            </div>
            <div className='flex flex-col gap-3 w-full'>
                <button className='w-full bg-white hover:bg-slate-200 text-black font-zahoot uppercase font-bold tracking-widest py-2 rounded-md'>
                    Sign Up
                </button>
                <Link to='/login' className='text-white text-center hover:underline text-sm font-zahoot'>Log In</Link>
            </div>
        </form>
    )
}