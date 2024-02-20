import React from 'react'
import { CheckCheckIcon, CopyCheckIcon, CopyIcon, PlayIcon, UserRound, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { containerMotion, itemMotion } from '@/utils/motion';
import { generateRandomInt, generateRandomString } from '@/utils/random';
import { useParams } from 'react-router-dom';

type Props = {}

const Participant = ({ name, isAdmin, remove }: { name: string, isAdmin: boolean, remove: () => void }) => {
    return (
        <motion.div
            draggable
            drag
            dragElastic
            dragSnapToOrigin
            initial={{ opacity: 0, translateY: 100 }}
            animate={{ opacity: 1, translateY: 0 }}
            className='flex z-[100] relative w-32 flex-col justify-center items-center p-4 bg-transparent hover:bg-slate-900 border border-slate-800 rounded-lg drop-shadow-md text-white min-w-24'
        >
            <UserRound size={48} />
            <div className='mt-2'>{name}</div>
            {isAdmin && <button onClick={() => isAdmin && remove()} className='absolute top-1 right-1 text-red-500 p-1 rounded-md hover:bg-red-950'>
                <XIcon size={24} />
            </button>}
        </motion.div>
    )
}

export default function Participants({ }: Props) {
    const maxParticipants = 100
    const allParticipants = Array.from({ length: maxParticipants }, (_) => `${generateRandomString(generateRandomInt(12))}`)
    const isAdmin = false
    const [participants, setParticipants] = React.useState<string[]>(allParticipants)
    const [copied, setCopied] = React.useState(false)
    const params = useParams()

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (participants.length >= maxParticipants) {
                clearInterval(interval)
                return
            } else {
                setParticipants((prev) => prev.length >= maxParticipants ? prev : [...prev, allParticipants[prev.length]])
            }
        }, 500)
        return () => clearInterval(interval)
    }, [])

    function copyToClipboard() {
        setCopied(true)
        const p1 = new Promise((resolve) => {
            if (params.id) {
                navigator.clipboard.writeText(params.id)
                setTimeout(() => resolve('copied'), 2000)
            }
        })
        p1.then(() => setCopied(false))
    }

    function removeParticipant(index: number) {
        setParticipants((prev) => prev.filter((_, i) => i !== index))
    }


    return (
        <div className='w-full h-screen flex flex-col justify-center items-center text-white'>
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-6 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <div className='text-2xl bg-cyan-400 font-medium py-2 px-4 min-w-[200px] rounded-md text-black flex justify-between gap-4 items-center'>
                #{params.id}
                <button className='ml-2 cursor-pointer' onClick={copyToClipboard}>
                    {copied ? <CheckCheckIcon size={24} /> : <CopyIcon size={24} />}
                </button>
            </div>
            <div className='w-full flex justify-between max-w-6xl mt-4 px-8 border-b border-b-slate-600 py-4 border-t-slate-600 border-t items-center'>
                <div className={`flex-1 text-light text-xl ${isAdmin ? "text-left" : "text-center"}`}>Players: {participants.length}/{maxParticipants}</div>
                {isAdmin && <button className='py-2 px-2 w-[200px] text-cyan-900 bg-cyan-400 rounded-md font-medium flex justify-center items-center'>
                    <PlayIcon size={24} className='mr-2 fill-cyan-900' />
                    Start Game
                </button>}
            </div>
            <motion.div variants={containerMotion} className='flex flex-row justify-center h-96 p-2 overflow-y-auto items-center max-w-6xl flex-wrap gap-6 mt-4'>
                {participants.map((participant, i) => (<Participant key={i} name={participant} isAdmin={isAdmin} remove={() => removeParticipant(i)} />))}
            </motion.div>
        </div>
    )
}