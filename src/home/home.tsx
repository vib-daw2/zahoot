import { useUsername } from '@/hooks/useUsername';
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';
import React from 'react'
import { useCookies } from 'react-cookie';
import { Link, redirect, useNavigate } from 'react-router-dom';

type Props = {}

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
}


export default function Home({ }: Props) {
    const [pin, setPin] = React.useState('')
    const [page, setPage] = React.useState(0)
    const [error, setError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const { username, setUsername } = useUsername()
    const navigate = useNavigate()
    const validateOnInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(parseInt(e.target.value.charAt(e.target.value.length - 1)))) {
            e.target.value = e.target.value.slice(0, e.target.value.length - 1)
        }
        if (e.target.value.length > 5) {
            e.target.value = e.target.value.slice(0, 5)
        }
        return e.target.value
    }

    React.useEffect(() => {
        setError('')
        setLoading(true)
        if (pin.length === 5 && page === 0) {
            const pinValid = isPinValid(pin).then(valid => {
                if (!valid) {
                    setError('Game not found')
                } else {
                    setError('')
                }
            })
        } else {
            setError('')
        }
        setLoading(false)
    }, [pin])

    React.useEffect(() => {
        if (username.length < 5 && page === 1) {
            setError('Username must be at least 5 characters')
        } else {
            setError('')
        }
    }, [username])

    React.useEffect(() => {
        if (localStorage.getItem('ZAHOOT_USERNAME')) {
            setUsername(localStorage.getItem('ZAHOOT_USERNAME')!)
        }
    }, [])

    const isPinValid = async (pin: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/games/exists?pin=${pin}`, {
            method: 'HEAD',
        })
        return response.status === 200
    }


    async function goNext() {
        if (page === 1) {
            if (localStorage.getItem('ZAHOOT_USERNAME') !== username) {
                localStorage.setItem('ZAHOOT_USERNAME', username)
            }
            if (username.length < 5) {
                setError('Username must be at least 5 characters')
                return
            }
            console.log('goNext')
            navigate(`/games/${pin}/participants`)
        } else {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/games/exists?pin=${pin}`, {
                method: 'HEAD',
            })
            if (response.status === 200) {
                setPage(1)
            } else {
                setError('Game not found')
            }
        }
    }


    return (
        <div className='w-full h-screen flex flex-col justify-center items-center z-50'>
            <>
                <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
                <div className='w-full flex z-50 justify-center items-center'>
                    <div className='w-full max-w-md flex justify-center items-center relative'>
                        <AnimatePresence>
                            {page === 0 &&
                                <>
                                    <motion.input initial={{ opacity: 0, translateX: 100 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -100 }} value={pin} onChange={e => setPin(validateOnInput(e))} maxLength={5} type="text" placeholder='PIN' className=' bg-transparent text-white font-zahoot text-lg text-center py-2 focus:outline-none w-full max-w-md mx-auto' />
                                    {pin.length == 5 && !error &&
                                        <button onClick={goNext} className='bg-gradient-to-tr text-cyan-400 p-px from-cyan-400/40 via-indigo-400/40 to-indigo-600/20 bg-clip-border absolute right-0 cursor-pointer flex justify-center items-center rounded-md hover:bg-slate-500/50'>
                                            <div className=' bg-slate-950 rounded-md'>
                                                <ArrowRightIcon size={32} className=' stroke-1' />
                                            </div>
                                        </button>}
                                </>}
                            {
                                page === 1 && <>
                                    <motion.input initial={{ opacity: 0, translateX: 100 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -100 }} value={username ?? ""} onChange={e => setUsername(e.currentTarget.value)} type="text" placeholder='Username' className=' bg-transparent text-white font-zahoot text-lg text-center py-2 focus:outline-none w-full max-w-md mx-auto' />
                                    {username && username.length > 4 &&
                                        <button disabled={loading} onClick={goNext} className='bg-gradient-to-tr text-cyan-400 p-px from-cyan-400/40 via-indigo-400/40 to-indigo-600/20 bg-clip-border absolute right-0 cursor-pointer flex justify-center items-center rounded-md hover:bg-slate-500/50'>
                                            <div className=' bg-slate-950 rounded-md'>
                                                {loading
                                                    ? <Loader2Icon size={32} className=' stroke-1 animate-spin' />
                                                    : <ArrowRightIcon size={32} className=' stroke-1' />
                                                }
                                            </div>
                                        </button>}
                                </>
                            }
                        </AnimatePresence>
                        <div className={`absolute left-0 -bottom-1 bg-gradient-to-r from-transparent ${error ? "via-rose-500" : "via-indigo-500"} to-transparent h-[2px] w-full max-w-md blur-sm`} />
                        <div className={`absolute left-0 -bottom-1 bg-gradient-to-r from-transparent ${error ? "via-rose-600" : "via-indigo-600"} to-transparent h-px w-full max-w-md`} />
                        <div className={`absolute left-0 -bottom-1 bg-gradient-to-r from-transparent ${error ? "via-rose-600" : "via-sky-500"} to-transparent h-[5px] w-full blur-sm max-w-md`} />
                        <div className={`absolute left-0 -bottom-1 bg-gradient-to-r from-transparent ${error ? "via-amber-500" : "via-sky-500"} to-transparent h-px w-full max-w-md`} />
                    </div>
                </div>
                {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}
                <div className='absolute bottom-2 left-0 w-full flex justify-center items-center'>
                    <Link to={'/create'} className=' hover:underline text-white'>Create your own zahoot! <span className='font-bold'>here</span></Link>
                </div>
            </>
        </div >
    )
}