import React from 'react'
import { useParams } from 'react-router-dom'
import Participants from './participants'
import { socket } from '@/lib/socket'
import { Participant } from '@/utils/schemas/participants'
import Exam from './exam'

type Props = {}
type Phase = "LOBBY" | "IN_GAME" | "RESULTS" | "END"

export default function Game({ }: Props) {
    const params = useParams()
    const [phase, setPhase] = React.useState<Phase>("LOBBY")
    const [isAdmin, setIsAdmin] = React.useState(false)
    const [user, setUser] = React.useState<Participant | null>(null)

    React.useEffect(() => {
        function onJoinedGame(data: string) {
            const { currentUser: user, participants }: { currentUser: Participant, participants: Participant[] } = JSON.parse(data)
            console.log({ user, participants })
            setUser(user)
            if (user.id === 1) {
                setIsAdmin(true)
            }
        }
        socket.on('joinedGame', onJoinedGame)
        return () => {
            socket.off('joinedGame', onJoinedGame)
        }
    }, [])

    switch (phase) {
        case "LOBBY":
            return <Participants isAdmin={isAdmin} startGame={() => setPhase("IN_GAME")} />
        case "IN_GAME":
            return <Exam isAdmin={isAdmin} userId={user?.id} />
        default:
            return null
    }
}