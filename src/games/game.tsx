import React from 'react'
import { useParams } from 'react-router-dom'
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

    React.useEffect(() => {
        function onJoinedGame(data: string) {
            const { currentUser: user, participants }: { currentUser: Participant, participants: Participant[] } = JSON.parse(data)
            console.log({ user, participants })
            setUser(user)
            if (user.id === 1) {
                setIsAdmin(true)
            }
        }

        function onFinishRound(data: string) {
            console.log(data)
            const players = JSON.parse(data) as Participant[]
            setPlayers(players)
            setPhase("RESULTS")
        }

        function onNextQuestion(data: string) {
            console.log(data)
            const question = JSON.parse(data) as GameQuestion
            setQuestion(question)
            setPhase("IN_GAME")
            setAllResponded(false)
        }

        function onGameStart(data: string) {
            const question = JSON.parse(data) as GameQuestion
            setQuestion(question)
            console.log('game started')
            setPhase("IN_GAME")
            //navigate(`/games/${id}/test`)
        }

        function onAllResponded() {
            setAllResponded(true)
        }

        socket.on('joinedGame', onJoinedGame)
        socket.on('roundEnd', onFinishRound)
        socket.on('nextQuestion', onNextQuestion)
        socket.on('gameStart', onGameStart)
        socket.on('gameEnd', () => setPhase("END"))
        socket.on('allResponded', onAllResponded)
        return () => {
            socket.off('joinedGame', onJoinedGame)
            socket.off('roundEnd', onFinishRound)
            socket.off('nextQuestion', onNextQuestion)
            socket.off('gameStart', onGameStart)
            socket.off('gameEnd')
            socket.off('allResponded', onAllResponded)
        }
    }, [])

    switch (phase) {
        case "LOBBY":
            return <Participants isAdmin={isAdmin} />
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