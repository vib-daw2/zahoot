import { AtSignIcon, MailIcon, PencilIcon, SaveIcon, Loader2Icon, UserRoundIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

export default function Profile() {
    const [isEditing, setIsEditing] = React.useState(false)
    const { register, formState: { errors } } = useForm()
    const [cookies,] = useCookies(['accessToken'])

    // TODO: Endpoint to update user profile
    // TODO: Endpoint to get user profile

    const name = "John Doe"
    const username = "johndoe"
    const email = "john@doe.e"

    const handleUpdateProfile = async (data: { name: string, username: string, email: string }) => {
        console.log(data)
        await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + '/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.accessToken}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json().then(data => {
            console.log(data)
        }))
    }

    const fetchProfileStats = async () => {
        return await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + '/profile/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.accessToken}`
            }
        }).then(res => res.json().then(data => {
            return [{ title: "Sets created", value: data.createdSetsCount },
            { title: "Games created", value: data.createdGamesCount }]
        })).catch(err => {
            throw new Error(`Error fetching profile stats from the server - ${err}`)
        })  
    }

    const { data: profileStats, isLoading: areProfileStatsLoading, error: errorLoadingProfileStats } = useQuery('profileStats', fetchProfileStats)

    return (
        <div className='flex flex-col h-full gap-6 w-full px-8'>

            <form className='flex flex-col gap-4 text-white'>
                <h1 className='font-zahoot text-2xl'>Profile</h1>
                <div className='flex flex-row items-center py-2'>
                    <div className='w-[150px]'>Name</div>
                    {isEditing
                        ? <div className='relative w-full max-w-md'>
                            <UserRoundIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                            <input {...register("name")} type="text" className={` ${errors?.name ? "border-b-red-500" : "border-b-slate-500"} pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b focus:outline-none text-white`} placeholder='name' />
                        </div>
                        : <div className='flex flex-row items-center gap-4'>
                            <UserRoundIcon className='w-6 h-6 text-slate-400' />
                            <div className='text-slate-400 flex flex-row gap-2 items-center font-zahoot '>
                                {name}
                            </div>
                        </div>}
                </div>
                <div className='flex flex-row items-center py-2'>
                    <div className='w-[150px]'>Username</div>
                    {isEditing
                        ? <div className='relative w-full max-w-md'>
                            <AtSignIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                            <input {...register("username")} type="text" className={` ${errors?.name ? "border-b-red-500" : "border-b-slate-500"} pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b focus:outline-none text-white`} placeholder='username' />
                        </div>
                        : <div className='flex flex-row items-center gap-4'>
                            <AtSignIcon className='w-6 h-6 text-slate-400' />
                            <div className='text-slate-400 flex flex-row gap-2 items-center font-zahoot '>
                                {username}
                            </div>
                        </div>}
                </div>
                <div className='flex flex-row items-center py-2'>
                    <div className='w-[150px]'>Email</div>
                    {
                        isEditing
                            ? <div className='relative w-full max-w-md'>
                                <MailIcon size={20} className='text-slate-500 absolute top-1/2 left-2 transform -translate-y-1/2' />
                                <input {...register("email")} type="text" className={` ${errors?.name ? "border-b-red-500" : "border-b-slate-500"} pl-10 w-full font-zahoot py-1 px-2 bg-transparent border-b focus:outline-none text-white`} placeholder='name' />
                            </div>
                            :
                            <div className='flex flex-row justify-start items-center gap-4'>
                                <MailIcon className='w-6 h-6 text-slate-400' />
                                <div className='text-slate-400 flex flex-row gap-2 items-center font-zahoot '>
                                    {email}
                                </div>
                            </div>}
                </div>
                <div className='flex flex-row justify-start items-center gap-4'>
                    {isEditing
                        ? <button type='button' onClick={() => setIsEditing(false)} className='w-[200px] py-2 bg-cyan-400 text-cyan-950 rounded-md font-medium flex justify-center items-center gap-2'>
                            <SaveIcon className='w-6 h-6' />
                            <div>Save Changes</div>
                        </button>
                        : <button type='button' onClick={() => setIsEditing(true)} className='w-[200px] py-2 border border-slate-700 hover:bg-slate-900 rounded-md font-medium flex justify-center items-center gap-2'>
                            <PencilIcon className='w-4 h-4' />
                            <div>Edit Profile</div>
                        </button>
                    }
                </div>
            </form>
            <div className='flex flex-col text-white border-t border-t-slate-700 pt-4 w-full'>
                <h2 className='text-xl font-zahoot'>Stats</h2>
                <div className='w-full flex flex-row gap-12 mt-4 flex-wrap'>
                    {
                        areProfileStatsLoading ?
                            <div className='w-full flex justify-center items-center gap-3 mx-auto text-white'>
                                <Loader2Icon className='w-8 h-8 animate-spin' />
                                <div className=' font-zahoot text-3xl uppercase font-semibold animate-pulse'>Loading...</div>
                            </div>
                            : profileStats
                                ? profileStats.map((stat, index) => <div key={index} className='flex flex-col gap-2'>
                                    <div className='text-2xl font-zahoot'>{stat.value}</div>
                                    <div className='text-slate-400'>{stat.title}</div>
                                </div>)
                                : errorLoadingProfileStats
                                    ? <div className='flex flex-col justify-center items-center w-full'>
                                        <div className='flex justify-center items-center'>
                                            <XIcon className='w-8 h-8 text-red-500' />
                                            <div className='text-red-500 font-zahoot text-3xl uppercase font-semibold'>Error</div>
                                        </div>
                                        <div className=' text-red-200 text-center'>{(errorLoadingProfileStats as Error).message}</div>
                                    </div>
                                    : <div className='w-full flex flex-col justify-center items-center h-[75vh] text-lg text-white z-50'>
                                        <div>No stats found</div>
                                    </div>
                    }
                </div>
            </div>
        </div>
    )
}