import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';

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
                className='px-8 min-w-32 text-center  py-2'>
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
            text: 'About',
            href: '/about'
        },
        {
            text: 'Log In',
            href: '/login'
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
                    className='flex-1 flex justify-center items-center'>
                    {links.map((link, i) => <NavbarItem key={i} {...link} />)}
                </motion.div>
                <div className='flex-1 flex justify-end items-center'>
                    <div className='flex justify-center items-center bg-slate-900 rounded-full text-white w-8 h-8'>C</div>
                    <div className='text-xs'>
                        <div>@nsadjkasd</div>
                    </div>
                </div>
            </div>
        </>
    )
}