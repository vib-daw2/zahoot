import React from 'react'
import { CheckCheckIcon, CopyCheckIcon, CopyIcon, PlayIcon, UserRound, XIcon } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { containerMotion, itemMotion } from '@/utils/motion';
import { generateRandomInt, generateRandomString } from '@/utils/random';
import { useNavigate, useParams } from 'react-router-dom';
import { FollowerPointerCard } from '@/components/ui/following-pointer';
import { socket } from '@/lib/socket';
import { useUsername } from '@/hooks/useUsername';
import { z } from 'zod';
import { Toaster, toast } from 'sonner';

type Props = {}
const participantSchema = z.object({
    id: z.number(),
    name: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
})

type Participant = z.infer<typeof participantSchema>

const ParticipantMouse = ({ participant: { x, y, name } }: { participant: Participant }) => {
    const mouseRef = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        if (mouseRef.current) {
            mouseRef.current.style.top = `${y}px`
            mouseRef.current.style.left = `${x}px`
        }
    }, [x, y, mouseRef])
    const colors = [
        "stroke-blue-500",
        "stroke-red-500",
        "stroke-rose-500",
        "stroke-emerald-500",
        "stroke-cyan-500",
        "stroke-yellow-500",
    ]
    const bgColors = [
        "bg-blue-500",
        "bg-red-500",
        "bg-rose-500",
        "bg-emerald-500",
        "bg-cyan-500",
        "bg-yellow-500",
    ]
    const randomColorIndex = React.useMemo(() => Math.floor(Math.random() * colors.length), [])
    const randomColor = React.useMemo(() => colors[randomColorIndex], [randomColorIndex])
    const randomBgColor = React.useMemo(() => bgColors[randomColorIndex], [randomColorIndex])
    return (
        <motion.div
            ref={mouseRef}
            initial={{ opacity: 0, translateY: 100 }}
            animate={{ opacity: 1, translateY: 0 }}
            className={`absolute z-[9999]`}>
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="1"
                viewBox="0 0 16 16"
                className={`h-6 w-6 text-transparent transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] ${randomColor}`}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
            </svg>
            <div className={`w-fit ${randomBgColor} rounded-full px-3 py-1 text-sm`}>@ {name}</div>
        </motion.div>
    )
}

const ParticipantCard = React.memo(({ name, isAdmin, remove }: { name: string, isAdmin: boolean, remove: () => void }) => {
    const username = React.useMemo(() => name, [name])
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
            <div className='mt-2'>{username}</div>
            {isAdmin && <button onClick={() => isAdmin && remove()} className='absolute top-1 right-1 text-red-500 p-1 rounded-md hover:bg-red-950'>
                <XIcon size={24} />
            </button>}
        </motion.div>
    )
}, (prevProps, nextProps) => {
    return prevProps.name === nextProps.name
})

export default function Participants({ }: Props) {
    const maxParticipants = 100
    const [isAdmin, setIsAdmin] = React.useState(false)
    const [participants, setParticipants] = React.useState<Participant[]>([])
    const [copied, setCopied] = React.useState(false)
    const params = useParams()
    const { username, setUsername } = useUsername()
    const [currentUser, setCurrentUser] = React.useState<Participant | null>(null)
    const [isConnected, setIsConnected] = React.useState(socket.connected)
    const { id } = useParams<{ id: string }>()
    const [lastMoveTime, setLastMoveTime] = React.useState(Date.now())
    const [lastCollidedUser, setLastCollidedUser] = React.useState<Participant | null>(null)
    const [lastCollidedTime, setLastCollidedTime] = React.useState(Date.now())
    const navigate = useNavigate()
    React.useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
            navigate('/')
        }

        function onJoinedGame(data: string) {
            const { currentUser: user, participants }: { currentUser: Participant, participants: Participant[] } = JSON.parse(data)
            console.log({ user, participants })
            if (user.id === 1) {
                setIsAdmin(true)
            }
            setCurrentUser(user)
            setParticipants(participants)
        }

        function onCurrentPlayers(data: string) {
            console.log(data)
            const players = JSON.parse(data) satisfies Participant[] as Participant[]
            if (players.length === 0) {
                socket.disconnect()
                navigate('/')
            }
            setParticipants(players)
        }

        function onGameStart(data: string) {
            const { gameId }: { gameId: string } = JSON.parse(data)
            if (gameId !== id) return
            console.log('game started')
            navigate(`/games/${id}/test`)
        }

        function forceDisconnect() {
            console.log('force disconnect')
            socket.disconnect()
            navigate('/')
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('joinedGame', onJoinedGame)
        socket.on("currentPlayers", onCurrentPlayers)
        socket.on('gameStart', onGameStart)
        socket.on("forceDisconnect", forceDisconnect)
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('joinedGame', onJoinedGame)
            socket.off("currentPlayers", onCurrentPlayers)
            socket.off('gameStart', onGameStart)
            socket.off("forceDisconnect", forceDisconnect)
        };
    }, []);

    const areColliding = (a: Participant, b: Participant) => {
        const distance = Math.sqrt(Math.pow(a.x! - b.x!, 2) + Math.pow(a.y! - b.y!, 2));
        return distance < 50;
    }

    React.useEffect(() => {
        // Initialize lastMoveTime with the current time when the component mounts
        let lastMoveTime = Date.now();

        function sendMousePosition(e: MouseEvent) {
            if (!socket.connected) {
                navigate('/')
            }
            const currentTime = Date.now();
            // if (
            //     currentUser &&
            //     participants.some(p => areColliding(p, currentUser) &&
            //         (participants.find(p => areColliding(p, currentUser))?.id !== lastCollidedUser?.id))) {
            //     const collidedUser = participants.find(p => areColliding(p, currentUser))!
            //     setLastCollidedUser(collidedUser)
            //     setLastCollidedTime(currentTime)
            //     toast.warning(`You got bonked by ${collidedUser.name}! 😵 Collision! 🚨`)
            // }
            if (socket.connected && currentUser && (currentTime - lastMoveTime) > 50) {
                socket.emit('moveMouse', JSON.stringify({ gameId: id, id: currentUser.id, x: e.clientX, y: e.clientY }));
                setCurrentUser({ ...currentUser, x: e.clientX, y: e.clientY });
                lastMoveTime = currentTime; // Update lastMoveTime with the current time
            }
        }

        window.addEventListener('mousemove', sendMousePosition);

        return () => {
            window.removeEventListener('mousemove', sendMousePosition);
        };
    }, [socket, currentUser]);


    React.useEffect(function joinGameWithSocket() {
        if (username && username != "" && username !== "unknown") {
            socket.emit('joinGame', JSON.stringify({ gameId: id, name: username }));
        }
    }, [socket, id, username])

    React.useEffect(function GetCurrentUser() {
        const p = new Promise((resolve) => {
            setInterval(() => {
                if (socket.connected) {
                    resolve(socket.id)
                }
            }, 500)
        })
        p.then(() => {
            if (!username || username === '') {
                setUsername(localStorage.getItem('ZAHOOT_USERNAME') || 'unknown')
            }
        })
    }, [localStorage])

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
        <FollowerPointerCard title={`@ ${username}`} className='w-full h-screen flex flex-col justify-center items-center text-white'>
            {
                participants.sort((a, b) => a.id - b.id).filter(x => x.id !== currentUser?.id).map((participant, i) => (
                    <ParticipantMouse key={participant.id} participant={participant} />
                ))
            }
            <motion.div initial={{ scale: 0.2 }} animate={{ scale: 1 }} className='text-6xl mb-6 mt-2 font-bold font-zahoot text-white'>Zahoot!</motion.div>
            <div className='text-2xl bg-cyan-400 font-medium py-2 px-4 min-w-[200px] rounded-md text-black flex justify-between gap-4 items-center'>
                #{params.id}
                <button className='ml-2 cursor-pointer' onClick={copyToClipboard}>
                    {copied ? <CheckCheckIcon size={24} /> : <CopyIcon size={24} />}
                </button>
            </div>
            <div className='w-full flex justify-between max-w-6xl mt-4 px-8 border-b border-b-slate-600 py-4 border-t-slate-600 border-t items-center'>
                <div className={`flex-1 text-light text-xl ${isAdmin ? "text-left" : "text-center"}`}>Players: {participants.length}/{maxParticipants}</div>
                {isAdmin && <button onClick={() => socket.emit("gameStart", JSON.stringify({ gameId: id }))} className='py-2 px-2 w-[200px] text-cyan-900 bg-cyan-400 rounded-md font-medium flex justify-center items-center'>
                    <PlayIcon size={24} className='mr-2 fill-cyan-900' />
                    Start Game
                </button>}
            </div>
            <motion.div variants={containerMotion} className='flex flex-row justify-center h-96 p-2 overflow-y-auto items-center max-w-6xl flex-wrap gap-6 mt-4'>
                {participants.sort((a, b) => a.id - b.id).map((participant, i) => (<ParticipantCard key={participant.id} name={participant.name} isAdmin={isAdmin} remove={() => removeParticipant(i)} />))}
            </motion.div>
            <Toaster richColors />
        </FollowerPointerCard>
    )
}