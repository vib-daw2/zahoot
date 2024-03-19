import { AtSignIcon, MailIcon, PencilIcon, SaveIcon, UploadIcon, UserRoundIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

type Props = {}

export default function Profile({ }: Props) {
    const [isEditing, setIsEditing] = React.useState(false)
    const { register, formState: { errors } } = useForm()

    // React.useEffect(() => {
    //     setName(localStorage.getItem('ZAHOOT_NAME') || '')
    //     setUsername(localStorage.getItem('ZAHOOT_USERNAME') || '')
    // }, [])
    const name = "Manolete"
    const username = "manolete"
    const email = "manolete@zahoot.com"

    const sampleStats = [
        {
            title: "Sets created",
            value: 10
        },
        {
            title: "Games played",
            value: 100
        },
        {
            title: "Games won",
            value: 50
        },
        {
            title: "Games created",
            value: 20
        }
    ]

    // TODO: Endpoint to update user profile
    // TODO: Endpoint to get user profile


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
                        sampleStats.map((stat, i) => (
                            <div key={i} className='flex flex-col gap-2 px-4 border-r last:border-r-0 w-[200px]'>
                                <div className='text-5xl'>{stat.value}</div>
                                <div className='text-sm text-slate-300'>{stat.title}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}