import { motion } from 'framer-motion'
import { Loader2Icon, PlayIcon, PlusIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getSetByIdResponse } from "../../backend/types/routes/sets/getSetByIdResponse"

export default function Play() {
    const [loading, setLoading] = React.useState(false)
    const [cookies,] = useCookies(['accessToken'])
    const [selectedSet, setSelectedSet] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)
    const navigation = useNavigate()
    const playGame = async () => {
        setLoading(true)
        setError(null)
        if (!selectedSet) {
            setError('Please select a set to continue')
            setLoading(false)
            return
        }
        const response = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + '/games/create', {
            method: 'POST',
            body: JSON.stringify({ questionSetId: parseInt(selectedSet) }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + cookies.accessToken
            }
        })
        if (!response.ok) {
            setError(`Error creating game - ${response.status} - ${response.statusText}`)
            setLoading(false)
            return
        }
        const { pin } = await response.json()
        if (!pin) {
            setError('Error creating game - no game pin returned')
            setLoading(false)
            return
        }
        setLoading(false)
        setError(null)
        navigation(`/games/${pin}/participants`)
    }

    const fetchMySets = async () => {
        const res = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + '/sets/mine', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + cookies.accessToken
            }
        })
        return await res.json() as getSetByIdResponse[]
    }

    const { data, isLoading } = useQuery('mySets', fetchMySets)

    React.useEffect(() => {
        if (data && data.length) {
            setSelectedSet(data[0].id.toString())
        }
    }, [data])

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <div className='w-full max-w-lg flex flex-col gap-3'>
                {
                    isLoading
                        ? <div className='w-full text-white flex justify-center gap-3 items-center'>
                            <Loader2Icon className=' animate-spin w-8 h-8' />
                            <div className=' font-zahoot text-xl animate-pulse uppercase'>Loading</div>
                        </div>
                        : data && data.length
                            ? <>
                                <div className='text-lg text-white mb-2'>Select a question set to get started</div>
                                <select value={selectedSet ?? ""} onChange={v => setSelectedSet(v.currentTarget.value)} name="test" id="test" className='w-full p-2'>
                                    {data?.map((set) => (
                                        <option key={set.id} value={set.id}>
                                            {set.name}
                                        </option>
                                    ))
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
                                {
                                    error && <div className='text-red-500'>{error}</div>
                                }
                            </>
                            :
                            <div>

                                <Link to={"/sets/create"} className='w-full py-2 rounded-md bg-cyan-400 disabled:bg-cyan-700 disabled:text-cyan-400 flex flex-row items-center justify-center gap-2 text-cyan-900'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <PlusIcon size={16} className=' fill-cyan-900' />
                                        <div>Create a set to get started</div>
                                    </div>
                                </Link>
                            </div>
                }

            </div>
        </div>
    )
}