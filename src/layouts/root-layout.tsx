import React from 'react'
import { useCookies } from 'react-cookie'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Outlet, useLocation } from 'react-router-dom'

export default function RootLayout() {
    const queryClient = new QueryClient()
    const location = useLocation()
    const privateRoutes = ['/sets', '/admin']
    const [cookies,] = useCookies(['accessToken'])

    React.useEffect(() => {
        if (privateRoutes.filter(route => location.pathname.startsWith(route)).length > 0 && !cookies.accessToken) {
            window.location.href = '/login'
        }
    }, [location, cookies])

    return (
        <div className=' overflow-x-hidden'>
            <QueryClientProvider client={queryClient}>
                <Outlet />
            </QueryClientProvider>
        </div>
    )
}