import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

export default function RootLayout({ }: Props) {
    return (
        <div className='bg-zahoot-primary h-screen absolute inset-0'>
            <div className='min-w-[75vh] min-h-[75vh] bg-black fixed -top-[15vh] -left-[15vh] rotate-45 opacity-10'></div>
            <div className='min-w-[75vh] min-h-[75vh] bg-black fixed -right-[15vh] -bottom-[15vh] rotate-45 opacity-10 rounded-full'></div>
            <Outlet />
        </div>
    )
}