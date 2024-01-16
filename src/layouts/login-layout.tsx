import Login from '@/auth/login'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

type Props = {}

export default function LoginLayout({ }: Props) {
    const location = useLocation()
    console.log(location)
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='text-6xl mb-8 mt-2 font-bold font-zahoot text-black'>Zahoot!</div>
            <AnimatePresence mode="wait">
                <Outlet />
            </AnimatePresence>
        </div>
    )
}