import React from 'react'
import { useCookies } from 'react-cookie'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'

export default function RootLayout() {
    const queryClient = new QueryClient()
    const location = useLocation()
    const privateRoutes = ['/sets', '/admin', '/play', '/settings']
    const [cookies,] = useCookies(['accessToken'])
    const navigation = useNavigate()

    React.useEffect(() => {
        if (privateRoutes.filter(route => location.pathname.startsWith(route)).length > 0 && !cookies.accessToken) {
            navigation('/login')
        }
    }, [location, cookies])

    return (
        <div className=' overflow-x-hidden'>
            <QueryClientProvider client={queryClient}>
                <Outlet />
                <Toaster />
            </QueryClientProvider>
        </div>
    )
}