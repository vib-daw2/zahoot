import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react';
import React from 'react'
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

    function goNext() {
        console.log('goNext')
        navigate(`/${pin}/participants`)
    }

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <div className='w-full flex justify-center items-center'>
                <div className='w-full max-w-md flex justify-center items-center relative'>
                    <input value={pin} onChange={e => setPin(validateOnInput(e))} maxLength={5} type="text" placeholder='PIN' className='border-b border-b-white bg-transparent text-white font-zahoot text-lg text-center py-2 focus:outline-none w-full max-w-md mx-auto' />
                    {pin.length == 5 && <button onClick={goNext} className='text-white absolute right-0 cursor-pointer flex justify-center items-center rounded-md hover:bg-slate-500/50'>
                        <ArrowRightIcon size={32} className='' />
                    </button>}
                </div>
            </div>
            <div className='absolute bottom-2 left-0 w-full flex justify-center items-center'>
                <Link to={'/create'} className=' hover:underline text-white'>Create your own zahoot! <span className='font-bold'>here</span></Link>
            </div>
        </div >
    )
}