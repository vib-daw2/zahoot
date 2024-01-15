import React from 'react'
import { UserRound } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { containerMotion, itemMotion } from '@/utils/motion';
import { generateRandomInt, generateRandomString } from '@/utils/random';

type Props = {}

const Participant = ({ name }: { name: string }) => (
    <motion.div initial={{ opacity: 0, translateY: 100 }} animate={{ opacity: 1, translateY: 0 }} className='flex flex-col justify-center items-center p-4 bg-white rounded-lg border drop-shadow-md min-w-24'>
        <UserRound size={48} />
        <div className='mt-2'>{name}</div>
    </motion.div>
)

export default function Participants({ }: Props) {
    const maxParticipants = 20
    const allParticipants = Array.from({ length: maxParticipants }, (_) => `${generateRandomString(generateRandomInt(12))}`)
    const [participants, setParticipants] = React.useState<string[]>([])

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
    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='text-4xl'>Waiting for everyone to join</div>
            <div className='text-light text-xl mt-4'>60s left</div>
            <div className='text-light text-xl mt-4'>Players: {participants.length}/{maxParticipants}</div>
            <motion.div variants={containerMotion} className='flex flex-row justify-center h-[45vh] p-2 overflow-y-hidden items-center max-w-[60%] flex-wrap gap-6 mt-4'>
                <AnimatePresence>
                    {participants.map((participant, i) => (<Participant key={i} name={participant} />))}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}