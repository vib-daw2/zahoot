import { PencilIcon, UploadIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

type SettingsOption = "Profile" | "Account" | "Notifications" | "Privacy" | "Security" | "Help" | "About"

export default function Settings() {
    const navigate = useNavigate()
    navigate('/settings/profile')
    return null
}


function ProfileSection() {
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        setName(localStorage.getItem('ZAHOOT_NAME') || '')
        setUsername(localStorage.getItem('ZAHOOT_USERNAME') || '')
    }, [])


    return (
        <div className='flex flex-col'>
            <h1 className='font-zahoot text-2xl'>Profile</h1>
            <div className='h-40 w-40 rounded-full bg-slate-800 mt-4'>
                <UploadIcon className='relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 cursor-pointer text-slate-400' />
            </div>

            <div className='mt-4'>
                <p>Name</p>
                <div className='text-slate-400 mt-2 flex flex-row gap-2 items-center font-zahoot '>{name} <PencilIcon className='w-4 h-4 cursor-pointer' /></div>
            </div>
            <div className='mt-4'>
                <p>Username</p>
                <div className='text-slate-400 mt-2 flex flex-row gap-2 items-center font-zahoot '>@{username} <PencilIcon className='w-4 h-4 cursor-pointer' /></div>
            </div>
        </div>
    )
}

