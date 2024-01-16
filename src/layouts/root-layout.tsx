import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

export default function RootLayout({ }: Props) {
    return (
        <div className='bg-yellow-50 h-screen absolute inset-0 z-0'>

            <Outlet />
        </div>
    )
}