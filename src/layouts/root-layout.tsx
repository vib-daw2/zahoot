import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
    const queryClient = new QueryClient()
    return (
        <div className=' overflow-x-hidden'>
            <QueryClientProvider client={queryClient}>
                <Outlet />
            </QueryClientProvider>
        </div>
    )
}