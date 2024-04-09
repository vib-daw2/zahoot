import { useUsername } from '@/hooks/useUsername'
import { socket } from '@/lib/socket'
import { containerMotion, itemMotion } from '@/utils/motion'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { CheckIcon, XIcon } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { useParams } from 'react-router'

const questionMotion = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        rotate: [0, 3, -3, 0]
    },
}


type ExamQuestion = {
    question: string,
    solutions: string[],
}

type QuestionProps = {
    num: number,
    question: ExamQuestion,
    selectedOption: number,
    setSelectedOption: React.Dispatch<React.SetStateAction<number>>,
    isAdmin: boolean
}

function Question({ num, question: { question, solutions }, selectedOption, setSelectedOption, isAdmin }: QuestionProps) {
    console.log("reloading")
    const { id } = useParams()

    const correctSolution = 2

    const radioStyles = (n: number) => {
        if (selectedOption === -1) {
            return 'w-7 h-7 bg-gray-200 min-w-7 min-h-7'
        } else if (selectedOption === n) {
            return "ring-2 ring-gray-200 bg-gray-900 min-w-7 min-h-7"
        } else {
            return 'w-8 h-8 bg-gray-200 opacity-75'
        }
    }

    const radioDivStyles = (n: number) => {
        let baseClass = 'flex flex-row text-lg gap-4  px-3 rounded-full py-2'
        if (selectedOption === -1) {
            return baseClass + ' hover:bg-gray-600 cursor-pointer'
        } else if (selectedOption === n) {
            return baseClass + "ring ring-2 ring-gray-200 bg-gray-900 cursor-pointer py-1"
        } else {
            return baseClass + ' text-gray-600'
        }
    }

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ ease: "easeInOut" }}
            className='xl:w-2/3 lg:w-3/4 w-5/6  min-h-screen h-full mx-auto flex md:flex-row flex-col md:justify-between justify-center items-center text-white'
        >
            <div className='md:flex-1 p-4'>
                <div className='uppercase text-sm text-gray-500 text-left'>Question {num}</div>
                <div className='text-xl'>{question}</div>
            </div>
            <motion.div
                variants={containerMotion}
                initial="hidden"
                animate="visible"
                className='flex md:border-l md:border-l-gray-500 md:border-t-0 border-t border-t-gray-500 flex-col p-4 md:flex-1 gap-2 md:w-fit w-full min-w-fit'>
                {
                    solutions.map((item, n) => (
                        <motion.label
                            onClick={() => selectedOption === -1 && !isAdmin && setSelectedOption && setSelectedOption(n)}
                            variants={itemMotion}
                            transition={{ duration: .25 }}
                            htmlFor={`q${n}`}
                            key={item}
                            className={radioDivStyles(n)}>
                            <div className={`rounded-full flex justify-center items-center ${radioStyles(n)}`}>
                                {selectedOption === n && <CheckIcon className='text-white' />}
                            </div>
                            <label htmlFor={`q${n}`}>{item}</label>
                        </motion.label>
                    ))
                }
            </motion.div>
        </motion.div >
    )
}

type Props = {
    isAdmin: boolean
}

export default function Exam({ isAdmin }: Props) {
    const [solution, setSolution] = React.useState(-1)
    const [questionNumber, setQuestionNumber] = React.useState(1)
    const { id } = useParams<{ id: string }>()

    React.useEffect(() => {

        function onNextQuestion() {
            console.log('next question')
            setQuestionNumber(i => i + 1)
            setSolution(-1)
        }

        socket.on('nextQuestion', onNextQuestion)
        return () => {
            socket.off('nextQuestion', onNextQuestion)
        }
    }, [])

    React.useEffect(function resolveQuestion() {
        if (solution != -1) {
            socket.emit('solution', JSON.stringify({ gameId: id, questionId: questionNumber, solution, userId: 1 }))
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
            <Question isAdmin={isAdmin} num={questionNumber} selectedOption={solution} question={{ question, solutions }} setSelectedOption={setSolution} />
        </AnimatePresence>
    )

}