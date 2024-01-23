import { motion } from 'framer-motion'
import React from 'react'

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
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <motion.div variants={container} initial="hidden" animate="visible" className='w-fit border border-gray-200 drop-shadow-lg h-fit py-4 px-4 bg-white flex flex-col justify-center items-center gap-3 rounded-md min-w-80 min-h-24'>
                <motion.input variants={item} type="text" placeholder='Game PIN' className='px-6 bg-slate-100 placeholder:font-bold text-center w-full py-3 border-2 border-gray-300 rounded-sm' />
                <motion.button variants={item} className='px-6 py-3 bg-gray-900 text-white text-lg font-semibold rounded-sm w-full'>Join</motion.button>
            </motion.div>
            <div className='absolute bottom-2 left-0 w-full flex justify-center items-center'>
                <div className=' hover:underline'>Create your own zahoot! <span className='font-bold'>here</span></div>
            </div>
        </div >
    )
}