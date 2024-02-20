import { motion } from 'framer-motion'
import { Loader2Icon, PlayIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

export default function Play({ }: Props) {
    const [loading, setLoading] = React.useState(false)
    const [gameCode, setGameCode] = React.useState<number | null>(null)
    const navigation = useNavigate()
    const playGame = async () => {
        setLoading(true)
        const p1 = new Promise((resolve) => setTimeout(() => resolve('p1'), 5000))
        await p1
        setLoading(false)
        setGameCode(123456)
        navigation(`/games/123456/participants`)
    }
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <div className='w-full max-w-lg flex flex-col gap-3'>
                <div className='text-lg text-white mb-2'>Select a question set to get started</div>
                <select name="test" id="test" className='w-full p-2'>
                    {
                        Array(9).fill(0).map((_, i) => <option className='py-1' value={i} key={i}>Test {i + 1}</option>)
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