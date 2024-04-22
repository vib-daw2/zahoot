import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Participants from './participants'
import { socket } from '@/lib/socket'
import { GameQuestion, Participant } from '@/utils/schemas/participants'
import Exam from './exam'
import Leaderboard from './leaderboard'

type Props = {}
type Phase = "LOBBY" | "IN_GAME" | "RESULTS" | "END"



export default function Game({ }: Props) {
    const params = useParams()
    const [phase, setPhase] = React.useState<Phase>("LOBBY")
    const [isAdmin, setIsAdmin] = React.useState(false)
    const [user, setUser] = React.useState<Participant | null>(null)
    const [players, setPlayers] = React.useState<Participant[]>([])
    const [question, setQuestion] = React.useState<GameQuestion | null>(null)
    const [allResponded, setAllResponded] = React.useState(false)
    const [participants, setParticipants] = React.useState<Participant[]>([])

    const navigate = useNavigate()

    React.useEffect(() => {
        function onJoinedGame(data: string) {
            const { currentUser: user, participants }: { currentUser: Participant, participants: Participant[] } = JSON.parse(data)
            setUser(user)
            if (user.id === 1) {
                setIsAdmin(true)
            }
            setParticipants(participants)
        }

        function onFinishRound(data: string) {
            const players = JSON.parse(data) as Participant[]
            setPlayers(players)
            setPhase("RESULTS")
        }

        function onNextQuestion(data: string) {
            const question = JSON.parse(data) as GameQuestion
            setQuestion(question)
            setPhase("IN_GAME")
            setAllResponded(false)
        }

        function forceDisconnect() {
            socket.disconnect()
            navigate('/')
        }

        function onGameStart(data: string) {
            const question = JSON.parse(data) as GameQuestion
            setQuestion(question)
            setPhase("IN_GAME")
            //navigate(`/games/${id}/test`)
        }

        function onAllResponded() {
            setAllResponded(true)
        }

        function onDisconnect() {
            navigate('/')
        }

        function onCurrentPlayers(data: string) {
            const players = JSON.parse(data) satisfies Participant[] as Participant[]
            if (players.length === 0) {
                socket.disconnect()
                navigate('/')
            }
            setParticipants(players)
        }

        socket.on('joinedGame', onJoinedGame)
        socket.on('roundEnd', onFinishRound)
        socket.on('nextQuestion', onNextQuestion)
        socket.on('gameStart', onGameStart)
        socket.on('gameEnd', () => setPhase("END"))
        socket.on('allResponded', onAllResponded)
        socket.on('disconnect', onDisconnect)
        socket.on('forceDisconnect', forceDisconnect)
        socket.on("currentPlayers", onCurrentPlayers)
        return () => {
            socket.off('joinedGame', onJoinedGame)
            socket.off('roundEnd', onFinishRound)
            socket.off('nextQuestion', onNextQuestion)
            socket.off('gameStart', onGameStart)
            socket.off('gameEnd')
            socket.off('allResponded', onAllResponded)
            socket.off('disconnect', onDisconnect)
            socket.off('forceDisconnect', forceDisconnect)
            socket.off("currentPlayers", onCurrentPlayers)
        }
    }, [])

    switch (phase) {
        case "LOBBY":
            return <Participants isAdmin={isAdmin} participants={participants} setParticipants={setParticipants} />
        case "IN_GAME":
            return <Exam allResponded={allResponded} isAdmin={isAdmin} userId={user?.id} question={question} />
        case "RESULTS":
            return <Leaderboard initialPlayers={players.filter(x => x.id !== 1)} isAdmin={isAdmin} />
        case "END":
            return <Leaderboard initialPlayers={players.filter(x => x.id !== 1)} isAdmin={isAdmin} ended />
        default:
            return null
    }
}