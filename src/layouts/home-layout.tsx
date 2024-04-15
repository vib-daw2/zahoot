import Navbar from '@/components/ui/navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'


export default function HomeLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Toaster richColors />
        </>
    )
}