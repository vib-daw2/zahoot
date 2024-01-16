import { Input } from '@/components/auth-input'
import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

export default function Login({ }: Props) {
    const itemMotion = {
        initial: { translateX: 400, opacity: 0 },
        animate: { translateX: 0, opacity: 1 },
        exit: { translateX: -400, opacity: 0 },
        transition: { delay: 0.3, duration: 0.5 }
    }
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ ease: "easeInOut" }}
            className='max-w-[350px] overflow-hidden w-full border border-gray-200 drop-shadow-lg space-y-4 h-fit p-4 bg-white flex flex-col justify-center items-center rounded-lg'>
            <div className='font-zahoot text-2xl font-light'>Log In</div>
            <Input />
            <Input />
            <motion.button {...itemMotion} className='px-6 py-3 bg-gray-900 text-white text-lg font-semibold rounded-sm w-full'>Log In</motion.button>
            <motion.div {...itemMotion}>
                <Link to={"/signup"}>Signup</Link>
            </motion.div>
        </motion.div>
    )
}