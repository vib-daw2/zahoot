import React from 'react'
import { useParams } from 'react-router-dom'
import Participants from './participants'
import Question from './question'

type Props = {}
type Phase = "LOBBY" | "IN_GAME" | "RESULTS" | "END"

export default function Game({ }: Props) {
    const params = useParams()
    const [phase, setPhase] = React.useState<Phase>("LOBBY")
    switch (phase) {
        case "LOBBY":
            return <Participants startGame={() => setPhase("IN_GAME")} />
        case "IN_GAME":
            return <Question />
        default:
            return null
    }
}