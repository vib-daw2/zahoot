import React from 'react'
import { motion } from 'framer-motion'

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

const NavbarItem = ({ text }: { text: string }) => {
    return (
        <motion.div
            variants={item}
            className='px-8 min-w-32 text-center hover:bg-yellow-200 hover:rounded-full py-2'>
            {text}
        </motion.div>
    )
}

export default function Navbar({ }: Props) {
    const links = ['Join', 'Create', 'About', 'Log In']
    return (
        <div className='fixed top-3 left-0 w-full flex justify-center items-center z-40'>
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className='absolute left-8 top-2 text-black text-4xl font-bold font-zahoot'>Zahoot!</motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className='w-fit min-w-1/2 flex justify-between bg-yellow-50 drop-shadow-lg bg-opacity-90 border-gray-200 border rounded-full'>
                {links.map((link, i) => <NavbarItem key={i} text={link} />)}
            </motion.div>
        </div>
    )
}