import { PencilIcon, UploadIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type SettingsOption = "Profile" | "Account" | "Notifications" | "Privacy" | "Security" | "Help" | "About"

export default function Settings() {

    const [selected, setSelected] = useState<SettingsOption>("Profile")

    return (
        <div className='w-full h-screen flex flex-row justify-center items-center z-50 py-20 px-10'>
            <div className='w-1/4 border-r-2 border-slate-700 h-full flex flex-col justify-start items-start text-white'>
                <h1 className='text-2xl font-zahoot'>Settings</h1>
                <div className='w-full flex flex-col justify-start items-start mt-4'>
                    {["Profile", "Account", "Notifications", "Privacy", "Security", "Help", "About"].map((option, i) => {
                        return (
                            <div
                                key={i} onClick={() => setSelected(option as SettingsOption)}
                                className={`py-3 px-4 w-full cursor-pointer hover:bg-slate-800 hover:border-l-4 hover:border-cyan-400 ${selected === option ? 'bg-slate-800 border-l-2 border-cyan-400' : ''}`}>
                                {option}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='w-full h-full flex flex-col justify-start items-start text-white px-10'>

                {(() => {
                    switch (selected) {
                        case "Profile":
                            return <ProfileSection />;
                        // case "Account":
                        //     return <AccountSection />;
                        // case "Notifications":
                        //     return <NotificationsSection />;
                        // case "Privacy":
                        //     return <PrivacySection />;
                        // case "Security":
                        //     return <SecuritySection />;
                        // case "Help":
                        //     return <HelpSection />;
                        case "About":
                            return <AboutSection />;
                        default:
                            return null;
                    }
                }
                )()}
            </div>
        </div>
    )
}


function ProfileSection() {
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        setName(localStorage.getItem('ZAHOOT_NAME') || '')
        setUsername(localStorage.getItem('ZAHOOT_USERNAME') || '')
    }, [])


    return (
        <>
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
        </>
    )
}

function AboutSection() {
    return (
        <>
            <h1 className='font-zahoot text-2xl'>About Zahoot</h1>
            <p className='mt-4'>
                Zahoot is a quiz app similiar to the original Kahoot (c)
                It is a project built by Albert Bru and Carlos Carpio as the end of year project for the 2023-24 school year.
            </p>
            <p className='mt-4'>
                The project has been built using React, TailwindCSS, and TypeScript on the frontend and Node.js, Express, Socket.io, with MySQL on the backend.
            </p>
            <p className='mt-4'>
                The project is open source and can be found on GitHub at
                <a href='https://github.com/vib-daw2/zahoot' className='text-cyan-400 hover:underline cursor-pointer'> this link</a>.
            </p>
        </>
    )
}