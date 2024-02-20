import Login from '@/auth/login'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Outlet, useLocation, useNavigate, useNavigation } from 'react-router-dom'

type Props = {}

export default function LoginLayout({ }: Props) {
    const [cookies, setCookies] = useCookies()
    const location = useLocation()
    const navigation = useNavigate()
    const path = useNavigation()

    React.useEffect(() => {
        if (cookies.accessToken) {
            console.log('redirecting')
            navigation('/')
        }
    }, [cookies, location.pathname])
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</div>
            <AnimatePresence mode="wait">
                <Outlet />
            </AnimatePresence>
        </div>
    )
}