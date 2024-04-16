import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const options = [
    {
        title: "Profile",
        href: "/settings/profile"
    },
    {
        title: "About",
        href: "/settings/about"
    }
]

export default function SettingsLayout() {
    return (
        <div className='w-full flex pt-12 px-4 h-full flex-row'>
            <div className=' w-full max-w-md text-white h-full min-h-[calc(100vh-6rem)] border-r border-r-slate-700 flex flex-col justify-start items-start mt-4'>
                {options.map((option) => (
                    <NavLink key={option.href} to={option.href} className={({ isActive }) => `py-3 px-4 w-full cursor-pointer hover:bg-slate-800 hover:border-l-4 hover:border-cyan-400 ${isActive ? "bg-slate-800 border-l-2 border-cyan-400" : ""}`}>{option.title}</NavLink>
                ))}
            </div>
            <div className='w-full pl-20 h-full flex flex-col justify-start items-start pt-12'>
                <Outlet />
            </div>
        </div>
    )
}