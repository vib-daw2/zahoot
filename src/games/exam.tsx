import { socket } from "@/lib/socket";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useParams } from "react-router-dom";
import Question from "./question";
import { toast } from "sonner";
import { ArrowRightIcon } from "lucide-react";

type Props = {
    isAdmin: boolean;
    userId?: number;
}

type CorrectStatus = "CORRECT" | "INCORRECT" | "UNANSWERED"

export default function Exam({ isAdmin, userId }: Props) {
    const [solution, setSolution] = React.useState(-1)
    const [questionNumber, setQuestionNumber] = React.useState(1)
    const [isCorrect, setIsCorrect] = React.useState<CorrectStatus>("UNANSWERED")
    const [correctSolution, setCorrectSolution] = React.useState(-1)
    const { id } = useParams<{ id: string }>()

    React.useEffect(() => {
        console.log({ correctSolution, solution })
        if (correctSolution !== -1) {
            if (correctSolution === solution) setIsCorrect("CORRECT")
            else setIsCorrect("INCORRECT")
        } else {
            setIsCorrect("UNANSWERED")
        }
    }, [correctSolution, solution])


    React.useEffect(() => {

        function onNextQuestion() {
            console.log('next question')
            setQuestionNumber(i => i + 1)
            setSolution(-1)
            setIsCorrect("UNANSWERED")
            setCorrectSolution(-1)
        }

        function onGameEnd() {
            console.log('game end')
            toast.info('Game has ended')
        }

        function onCorrectSolution(data: string) {
            const correctSolution = JSON.parse(data) as number
            console.log({ correctSolution, solution })
            if (correctSolution === solution) {
                toast.success('Correct answer!')
                setIsCorrect("CORRECT")
            }
            else {
                setIsCorrect("INCORRECT")
                toast.error('Incorrect answer!')
            }
            console.log({ correctSolution })
        }

        socket.on('nextQuestion', onNextQuestion)
        socket.on('correctSolution', onCorrectSolution)
        return () => {
            socket.off('nextQuestion', onNextQuestion)
            socket.off('correctSolution', onCorrectSolution)
        }
    }, [])

    React.useEffect(function resolveQuestion() {
        if (solution != -1 && userId) {
            socket.emit('solution', JSON.stringify({ gameId: id, questionId: questionNumber, solution, userId }))
        }
    }, [solution])

    const question = 'A company is planning to run a global marketing application in the AWS Cloud. The application will feature videos that can be viewed by users. The company must ensure that all users can view these videos with low latency.\nWhich AWS service should the company use to meet this requirement?'
    const solutions = [
        'A. AWS Auto Scaling',
        'B. Amazon Kinesis Video Streams',
        'C. Elastic Load Balancing',
        'D. Amazon CloudFront']

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
                    <Question
                        isAdmin={isAdmin}
                        status={isCorrect}
                        num={questionNumber}
                        selectedOption={solution}
                        question={{ question, solutions }}
                        setSelectedOption={setSolution}
                    />
                </motion.div>
                {isAdmin && <button onClick={() => socket.emit("nextQuestion", JSON.stringify({ gameId: id }))} className="w-full h-9 mt-4 max-w-lg mx-auto bg-cyan-400 text-cyan-900 hover:bg-cyan-300 rounded-md flex justify-center items-center gap-3">
                    <div>
                        Next Question
                    </div>
                    <ArrowRightIcon size={24} />
                </button>}
            </div>

        </AnimatePresence>
    )

}