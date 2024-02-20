import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
import UserBtn from './user-btn';

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

const NavbarItem = ({ text, href }: { text: string, href: string }) => {
    return (
        <Link to={href}>
            <motion.div
                variants={item}
                className='px-8 min-w-32 text-center py-2 hover:border-b-2 border-b-cyan-400 hover:text-cyan-400 hover:font-semibold'>
                {text}
            </motion.div>
        </Link>
    )
}

export default function Navbar({ }: Props) {
    const links = [
        {
            text: 'Join',
            href: '/'
        },
        {
            text: 'Create',
            href: '/create'
        },
        {
            text: 'Sets',
            href: '/sets'
        }
    ]
    return (
        <>
            <div className='fixed top-0 px-12 left-0 select-none text-white w-full bg-slate-950 border-b border-b-slate-800 h-14 flex justify-center items-center z-40'>
                <div className=' flex-1 font-zahoot text-3xl'>Zahoot!</div>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className='flex-1 flex justify-center items-center '>
                    {links.map((link, i) => <NavbarItem key={i} {...link} />)}
                </motion.div>
                <div className='flex-1 flex justify-end items-center'>
                    <UserBtn />
                </div>
            </div>
        </>
    )
}