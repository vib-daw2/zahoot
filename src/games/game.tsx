import React from 'react'
import { useParams } from 'react-router-dom'
import Participants from './participants'
import Exam from './question'
import { socket } from '@/lib/socket'
import { Participant } from '@/utils/schemas/participants'

type Props = {}
type Phase = "LOBBY" | "IN_GAME" | "RESULTS" | "END"

export default function Game({ }: Props) {
    const params = useParams()
    const [phase, setPhase] = React.useState<Phase>("LOBBY")
    const [isAdmin, setIsAdmin] = React.useState(false)

    React.useEffect(() => {
        function onJoinedGame(data: string) {
            const { currentUser: user, participants }: { currentUser: Participant, participants: Participant[] } = JSON.parse(data)
            console.log({ user, participants })
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
            return <Exam isAdmin={isAdmin} />
        default:
            return null
    }
}