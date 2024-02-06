import { containerMotion, itemMotion } from '@/utils/motion'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { CheckIcon, XIcon } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { useParams } from 'react-router'

type Props = {
}

const questionMotion = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        rotate: [0, 3, -3, 0]
    },
}

type SolutionItemProps = {
    text: string,
    ref?: React.Ref<HTMLDivElement>,
    position: number,
    isCorrect: boolean | null
    solution: number
    setSolution?: React.Dispatch<React.SetStateAction<number>>
}

const SolutionItem = ({ text, position, isCorrect, setSolution, solution }: SolutionItemProps) => {
    const baseHover = { scale: 1.1, zIndex: 99 }
    const colors = ['bg-red-600', 'bg-blue-600', 'bg-yellow-600', 'bg-green-600']
    const modifiedHovers = [{ ...baseHover, rotate: -3 }, { ...baseHover, rotate: 3 }, { ...baseHover, rotateZ: 3 }, { ...baseHover, rotateZ: -3 }]
    const isSolved = isCorrect !== null
    return (
        <motion.div
            onClick={() => setSolution && setSolution(position)}
            variants={itemMotion}
            transition={{ duration: .25 }}
            whileHover={isSolved ? {} : modifiedHovers[position]}
            className={`w-full relative h-48 z-50 flex justify-center items-center ${colors[position]} ${isSolved ? (isCorrect ? "bg-opacity-100" : "bg-opacity-30") : "bg-opacity-100"}`}>
            {text}
            {isSolved && isCorrect && <div className='absolute -top-4 -right-4 w-10 flex justify-center items-center h-10 rounded-full bg-green-600 '>
                <CheckIcon className='text-white' />
            </div>}
            {
                isSolved && !isCorrect && solution == position && <div className='absolute -top-4 -right-4 w-10 flex justify-center items-center h-10 rounded-full bg-red-600 '>
                    <XIcon className='text-white' />
                </div>
            }
        </motion.div>
    )

}

function Question({ num, solution, setSolution }: { num: number, solution: number, setSolution: Dispatch<SetStateAction<number>> }) {
    console.log("reloading")
    const { id } = useParams()
    const question = 'A company is planning to run a global marketing application in the AWS Cloud. The application will feature videos that can be viewed by users. The company must ensure that all users can view these videos with low latency.\nWhich AWS service should the company use to meet this requirement?'
    const solutions = [
        'A. AWS Auto Scaling',
        'B. Amazon Kinesis Video Streams',
        'C. Elastic Load Balancing',
        'D. Amazon CloudFront']
    const correctSolution = 2

    const radioStyles = (n: number) => {
        if (solution === -1) {
            return 'w-8 h-8 bg-gray-200'
        } else if (solution === n) {
            if (correctSolution === n) {
                return 'bg-emerald-500 w-7 h-7 ring-offset-2 ring-2 ring-emerald-500'
            } else {
                return 'bg-red-500 w-7 h-7 ring-offset-2 ring-2 ring-red-500'
            }
        } else {
            return 'w-8 h-8 bg-gray-200 opacity-75'
        }
    }

    const radioDivStyles = (n: number) => {
        let baseClass = 'flex flex-row text-lg gap-4  px-3 rounded-full py-2'
        if (solution === -1) {
            return baseClass + ' hover:bg-gray-600 cursor-pointer'
        } else if (solution === n) {
            if (correctSolution === n) {
                return baseClass + ' bg-emerald-500'
            } else {
                return baseClass + ' bg-red-500'
            }
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
            className='w-2/3 h-screen mx-auto flex flex-row justify-between items-center text-white'
        >
            <div className='flex-1 p-4'>
                <div className='uppercase text-sm text-gray-500 text-left'>Question {num}</div>
                <div className='text-xl'>{question}</div>
            </div>
            <motion.div
                variants={containerMotion}
                initial="hidden"
                animate="visible"
                className='flex border-l border-l-gray-500 flex-col p-4 flex-1 gap-2'>
                {
                    solutions.map((item, n) => (
                        <motion.label
                            onClick={() => solution === -1 && setSolution && setSolution(n)}
                            variants={itemMotion}
                            transition={{ duration: .25 }}
                            htmlFor={`q${n}`}
                            key={item}
                            className={radioDivStyles(n)}>
                            <div className={`rounded-full flex justify-center items-center ${radioStyles(n)}`}>
                                {solution === n && n == correctSolution && <CheckIcon className='text-white' />}
                                {solution === n && n != correctSolution && <XIcon className='text-white' />}
                            </div>
                            <label htmlFor={`q${n}`}>{item}</label>
                        </motion.label>
                    ))
                }
            </motion.div>
        </motion.div >
    )
}

export default function Exam() {
    const [solution, setSolution] = React.useState(-1)
    const [questionNumber, setQuestionNumber] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(false);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    function animateBar() {

    }

    React.useEffect(() => {
        async function nextQuestion() {
            await delay(4000)
            setIsLoading(true)
            await delay(500)
            if (solution != -1) {
                setQuestionNumber(i => i + 1)
                setSolution(-1)
                setIsLoading(false)
            }
        }
        if (solution != -1) {
            nextQuestion()
        }
    }, [solution]);

    return (
        <AnimatePresence mode='wait'>
            {!isLoading && <Question num={questionNumber} solution={solution} setSolution={setSolution} />}
        </AnimatePresence>
    )

}