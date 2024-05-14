import { useForm, SubmitHandler } from "react-hook-form"
import { AtSignIcon, LockIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Link, useSearchParams } from 'react-router-dom'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginRequestSchema } from "@/utils/schemas/auth"
import { loginResponse } from "~/types/routes/auth/loginResponse"
import { toast } from "sonner"

export default function Login() {
    const [, setCookies] = useCookies()
    const [error, setError] = React.useState<string | null>(null)
    const { register, formState: { errors }, handleSubmit, watch } = useForm<z.infer<typeof loginRequestSchema>>({
        resolver: zodResolver(loginRequestSchema)
    })
    const params = useSearchParams()

    React.useEffect(() => {
        if (params[0].get('action') === 'logout') {
            toast.info('You have been logged out')
        } else if (params[0].get('action') === 'signup') {
            toast.success('Account created successfully. You can now login')
        }
    }, [])

    const onSubmit: SubmitHandler<z.infer<typeof loginRequestSchema>> = async (data) => {
        setError(null)
        const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}/auth/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        try {
            const data = await response.json() satisfies loginResponse as loginResponse
            if (data.error) {
                setError(data.message)
            } else {
                // Guardamos el token en las cookies y los datos del usuario en el localStorage
                setCookies('accessToken', data.token)
                localStorage.setItem("ZAHOOT_NAME", data.data?.name ?? "")
                localStorage.setItem("ZAHOOT_USERNAME", data.data?.username ?? "")
                localStorage.setItem("ZAHOOT_ADMIN", data.data?.isAdmin ? "true" : "false")

                // El redirect despues de hacer login se hace asi para que se recargue la pagina y 
                // se actualice la navbar. Lo propio seria usar el hook useNavigate de react-router-dom
                // para navegar pero eso no actualiza la navbar que está en el layout
                window.location.href = '/'
            }
        } catch (error) {
            console.error(error)
            setError("An error occurred. Please try again later")
        }
    }

    React.useEffect(() => {
        if (watch().username) {
            setError(null)
        } else if (watch().password) {
            setError(null)
        }
    }, [watch])


    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-md w-full border border-slate-800 flex justify-center items-center flex-col gap-y-8 rounded-md p-4 py-6 bg-slate-900/70'>
            <div className="w-full">
                <div className='relative mx-auto w-full'>
                    <AtSignIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                    <input {...register("username")} type="text" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='username' />
                </div>
                <p className="text-red-500 mt-1 px-2">{errors.username?.message}</p>
            </div>
            <div className="w-full">
                <div className='relative mx-auto w-full'>
                    <LockIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                    <input {...register("password")} type="password" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='password' />
                </div>
                <p className="text-red-500 mt-1 px-2">{errors.password?.message}</p>
                <p className="text-red-500 mt-1 px-2">{error}</p>
            </div>
            <div className='flex flex-col gap-3 w-full'>
                <button type='submit' className='w-full bg-white hover:bg-slate-200 text-black font-zahoot uppercase font-bold tracking-widest py-2 rounded-md'>
                    Log In
                </button>
                <Link to='/signup' className='text-white hover:underline text-sm font-zahoot text-center'>Or signup</Link>
            </div>
        </form>
    )
}