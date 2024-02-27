import { LogOutIcon, PlayIcon } from 'lucide-react'
import React, { MouseEventHandler } from 'react'
import { useCookies } from 'react-cookie'
import { Link, useLocation } from 'react-router-dom'

type Props = {}

export default function UserBtn({ }: Props) {
    const [cookies, setCookies] = useCookies(['accessToken'])
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(cookies.accessToken)
    const [user, setUser] = React.useState<{ username: string; name: string } | null>(null)
    const [open, setOpen] = React.useState(false)
    const location = useLocation()

    React.useEffect(() => {
        setIsLoggedIn(cookies.accessToken)
        console.log(cookies)
    }, [cookies, location])

    React.useEffect(() => {
        if (cookies.accessToken) {
            const username = localStorage.getItem('ZAHOOT_USERNAME')
            const name = localStorage.getItem('ZAHOOT_NAME')
            if (!username || !name) {
                localStorage.removeItem("ZAHOOT_USERNAME")
                localStorage.removeItem("ZAHOOT_NAME")
                setCookies("accessToken", null)
                setUser(null)
            } else {
                setUser({ username, name })
            }
        } else {
            localStorage.removeItem("ZAHOOT_USERNAME")
            localStorage.removeItem("ZAHOOT_NAME")
            setUser(null)
        }
    }, [localStorage])

    const logout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        localStorage.removeItem("ZAHOOT_USERNAME")
        localStorage.removeItem("ZAHOOT_NAME")
        setCookies("accessToken", null)
        setUser(null)
    }

    if (user) {
        return (
            <div className='flex items-center gap-3'>
                <Link to={"/play"} className='w-[100px] bg-cyan-400 hover:bg-cyan-300 py-2 rounded-md font-zahoot text-cyan-900 flex justify-center items-center gap-2'>
                    <PlayIcon size={16} className=' fill-cyan-900' />
                    <span className='font-medium'>Play</span>
                </Link>
                <div onClick={() => setOpen(v => !v)} className='flex relative items-center gap-4 px-4 py-1 rounded-md cursor-pointer min-w-[150px] hover:bg-slate-800'>
                    <div className='w-10 h-10 rounded-sm flex justify-center items-center bg-cyan-400 font-zahoot text-black text-xl'>{user.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div>{user.name}</div>
                        <div className='text-sm text-slate-400 font-zahoot'>@{user.username}</div>
                    </div>
                    {
                        open && <button onClick={logout} className='absolute top-14 py-2 inline-flex items-center px-4 left-0 border border-slate-800 font-medium text-red-500 hover:bg-red-800/50 rounded-b-md border-t-0 w-[150px]'>
                            <LogOutIcon size={16} className='mr-2' />
                            Log Out
                        </button>
                    }
                </div>
            </div>
        )
    }
    return (
        <Link to={"/login"} className='px-4 min-w-[150px] border border-slate-800 rounded-md py-2 text-center hover:bg-slate-800 hover:font-medium hover:text-cyan-400'>Log In</Link>
    )
}