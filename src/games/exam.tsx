import { socket } from "@/lib/socket";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import Question from "./question";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { GameQuestion } from "@/utils/schemas/participants";

type Props = {
    isAdmin: boolean;
    userId?: number;
    question: GameQuestion | null;
    allResponded: boolean;
}

type CorrectStatus = "CORRECT" | "INCORRECT" | "UNANSWERED"

export default function Exam({ isAdmin, userId, question, allResponded }: Props) {
    const [solution, setSolution] = React.useState(-1)
    const [questionNumber, setQuestionNumber] = React.useState(1)
    const [isCorrect, setIsCorrect] = React.useState<CorrectStatus>("UNANSWERED")
    const [roundEnded, setRoundEnded] = React.useState(false)
    const { id } = useParams<{ id: string }>()

    React.useEffect(() => {
        if (allResponded) {
            setRoundEnded(true)
        }
    }, [allResponded])

    React.useEffect(() => {
        console.log({ solution, isCorrect })
    }, [solution, isCorrect])

    const validateSolution = React.useCallback((correctSolution: number) => {
        if (correctSolution === solution) {
            setIsCorrect("CORRECT")
        } else {
            setIsCorrect("INCORRECT")
        }
    }, [solution])

    React.useEffect(() => {

        function onCorrectSolution(data: string) {
            const correctSolution = JSON.parse(data) as number
            if (isAdmin && roundEnded) {
                setSolution(correctSolution)
                setIsCorrect("CORRECT")
            } else {
                validateSolution(correctSolution)
            }
        }

        socket.on('correctSolution', onCorrectSolution)
        return () => {
            socket.off('correctSolution', onCorrectSolution)
        }
    }, [solution, roundEnded])

    React.useEffect(function resolveQuestion() {
        if (solution != -1 && userId && !isAdmin) {
            socket.emit('solution', JSON.stringify({ gameId: id, questionId: questionNumber, solution, userId }))
        }
    }, [solution])

    const finishRound = () => {
        setRoundEnded(true)
        setTimeout(() => {
            socket.emit("roundEnd", JSON.stringify({ gameId: id }))
        }, 5000)
    }

    return (
        <AnimatePresence mode='wait'>
            <div className="h-full min-h-screen flex flex-col justify-center items-center w-full">


                <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ ease: "easeInOut" }}
                    className='xl:w-2/3 lg:w-3/4 w-5/6  h-full mx-auto flex md:flex-row flex-col md:justify-between justify-center items-center text-white'
                >
                    {question && <Question
                        isAdmin={isAdmin && !allResponded}
                        status={isCorrect}
                        num={questionNumber}
                        selectedOption={solution}
                        question={{ question: question.question, solutions: question.choices.map(x => x.choice) }}
                        setSelectedOption={setSolution}
                    />}
                </motion.div>
                {isAdmin && <button disabled={allResponded || roundEnded} onClick={finishRound} className="w-full h-9 mt-4 max-w-lg mx-auto bg-cyan-400 text-cyan-900 hover:bg-cyan-300 disabled:bg-cyan-600 disabled:hover:bg-cyan-600 rounded-md flex justify-center items-center gap-3">
                    {allResponded || roundEnded
                        ?
                        <>
                            <div>
                                All players answered
                            </div>
                            <Loader2Icon className=" animate-spin" size={24} />

                        </>
                        :
                        <>
                            <div>
                                Next Question
                            </div>
                            <ArrowRightIcon size={24} />

                        </>
                    }

                </button>}
            </div>

        </AnimatePresence>
    )

}