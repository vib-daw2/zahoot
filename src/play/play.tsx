import { motion } from 'framer-motion'
import { Loader2Icon, PlayIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import {getSetByIdResponse} from "../../backend/types/routes/sets/getSetByIdResponse"

export default function Play() {
    const [loading, setLoading] = React.useState(false)
    const [, setGameCode] = React.useState<number | null>(null)
    const [cookies,] = useCookies(['accessToken'])
    const navigation = useNavigate()
    const playGame = async () => {
        setLoading(true)
        const p1 = new Promise((resolve) => setTimeout(() => resolve('p1'), 5000))
        await p1
        setLoading(false)
        setGameCode(123456)
        navigation(`/games/123456/participants`)
    }

    const fetchMyGames = async () => {
        const res = await fetch(import.meta.env.VITE_API_URL + '/sets/mine', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + cookies.accessToken
            }
        })
        return await res.json() as getSetByIdResponse[]
    }

    const {data, isLoading} = useQuery('myGames', fetchMyGames)

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <div className='w-full max-w-lg flex flex-col gap-3'>
                <div className='text-lg text-white mb-2'>Select a question set to get started</div>
                <select name="test" id="test" className='w-full p-2'>
                    {
                        isLoading
                            ?
                            <option>Loading ...</option>
                            :
                            data?.map((set) => <option key={set.id} value={set.id}>{set.name}</option>)
                    }
                </select>
                <button disabled={loading} onClick={playGame} className='w-full py-2 rounded-md bg-cyan-400 disabled:bg-cyan-700 disabled:text-cyan-400 flex flex-row items-center justify-center gap-2 text-cyan-900'>
                    {
                        loading
                            ?
                            <div className='flex flex-row items-center gap-2'>
                                <Loader2Icon size={16} className='animate-spin' />
                                <div>Creating game ...</div>
                            </div>
                            :
                            <div className='flex flex-row items-center gap-2'>
                                <PlayIcon size={16} className=' fill-cyan-900' />
                                <div>Start Game</div>
                            </div>
                    }
                </button>
            </div>
        </div>
    )
}