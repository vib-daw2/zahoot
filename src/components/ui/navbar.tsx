import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import UserBtn from './user-btn';
import { useCookies } from 'react-cookie';

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
    const [hovering, setHovering] = React.useState(false)
    return (
        <Link to={href} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className=' relative'>
            <motion.div
                variants={item}
                className='px-8 min-w-32 text-center py-2  border-b-cyan-400 hover:text-cyan-400 hover:font-semibold'>
                {text}
            </motion.div>
            {hovering && <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className='absolute w-full rounded-xs -bottom-3 bg-cyan-500 h-1 px-3 z-1'></motion.div>}
        </Link>
    )
}

export default function Navbar() {

    const [isAdmin, setIsAdmin] = React.useState(false)
    const [cookies, setCookies] = useCookies(['accessToken'])

    useEffect(() => {
        if (cookies.accessToken) {
            const admin = localStorage.getItem('ZAHOOT_ADMIN')
            if (admin == 'true') {
                setIsAdmin(true)
            }
        }
    }, [cookies.accessToken, setCookies])


    const links = [
        {
            text: 'Join',
            href: '/',
            requiresAuth: false
        },
        {
            text: 'Create',
            href: '/sets/create',
            requiresAuth: true
        },
        {
            text: 'Sets',
            href: '/sets',
            requiresAuth: true
        },
        {
            text: 'Admin',
            href: '/admin',
            onlyAdmin: true,
            requiresAuth: true
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
                    className='flex-1 gap-2 flex justify-center items-center '>
                    {links.filter(x => x.requiresAuth ? cookies.accessToken : true).map((link, i) => {
                        if (link.onlyAdmin && !isAdmin) return null
                        return <NavbarItem key={i} text={link.text} href={link.href} />
                    }
                    )}
                </motion.div>
                <div className='flex-1 flex justify-end items-center'>
                    <UserBtn />
                </div>
            </div>
        </>
    )
}