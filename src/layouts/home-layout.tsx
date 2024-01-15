import Navbar from '@/components/ui/navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

export default function HomeLayout({ }: Props) {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}