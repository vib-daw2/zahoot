import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Outlet, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import { Toaster } from 'sonner'

type Props = {}

export default function LoginLayout({ }: Props) {
    const [cookies, setCookies] = useCookies()
    const location = useLocation()
    const navigation = useNavigate()
    const path = useNavigation()

    React.useEffect(() => {
        if (cookies.accessToken) {
            navigation('/')
        }
    }, [cookies, location.pathname])
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='text-216956xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</div>
            <AnimatePresence mode="wait">
                <Outlet />
            </AnimatePresence>

        </div>
    )
}