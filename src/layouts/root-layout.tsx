import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

export default function RootLayout({ }: Props) {
    return (
        <div className=''>

            <Outlet />
        </div>
    )
}