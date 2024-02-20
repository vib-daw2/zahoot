import { AtSignIcon, LockIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Link } from 'react-router-dom'


type LoginResponse = {
    error: boolean
    message: string
    token?: string
}

export default function Login() {
    const [cookies, setCookies] = useCookies()


    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const username = form.get('username')
        const password = form.get('password')
        console.log({ username, password })
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json"
            }

        })
        if (response.ok) {
            const data = await response.json() satisfies LoginResponse as LoginResponse
            if (data.error) {
                alert(data.message)
            } else {
                setCookies('token', data.token)
                console.log(cookies)
            }
        }
    }

    return (
        <form onSubmit={handleLogin} className='max-w-md w-full border border-slate-800 flex justify-center items-center flex-col gap-y-8 rounded-md p-4 py-6 bg-slate-900/70'>
            <div className='relative mx-auto w-full'>
                <AtSignIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input name='username' type="text" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='username' />
            </div>
            <div className='relative mx-auto w-full'>
                <LockIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input name='password' type="password" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='password' />
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