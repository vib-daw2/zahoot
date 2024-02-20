import { AtSignIcon, LockIcon, MailIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'


export default function Signup() {

    return (
        <div className='max-w-md w-full border border-slate-800 flex justify-center items-center flex-col gap-y-8 rounded-md p-4 py-6 bg-slate-900/70'>
            <div className='relative mx-auto w-full'>
                <AtSignIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input type="text" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='username' />
            </div>
            <div className='relative mx-auto w-full'>
                <MailIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input type="text" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='username' />
            </div>
            <div className='relative mx-auto w-full'>
                <LockIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input type="password" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='password' />
            </div>
            <div className='relative mx-auto w-full'>
                <LockIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                <input type="password" className='pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b-slate-200 border-b focus:outline-none text-white' placeholder='repeat' />
            </div>
            <div className='flex flex-col gap-3 w-full'>
                <button className='w-full bg-white hover:bg-slate-200 text-black font-zahoot uppercase font-bold tracking-widest py-2 rounded-md'>
                    Sign Up
                </button>
                <Link to='/login' className='text-white text-center hover:underline text-sm font-zahoot'>Log In</Link>
            </div>
        </div>
    )
}