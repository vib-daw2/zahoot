import { containerMotion, itemMotion } from '@/utils/motion'
import { motion } from 'framer-motion'
import { CheckCheckIcon, CheckIcon, XIcon } from 'lucide-react'
import React from 'react'


type ExamQuestion = {
    question: string,
    solutions: string[],
}

type QuestionProps = {
    num: number,
    question: ExamQuestion,
    selectedOption: number,
    setSelectedOption: React.Dispatch<React.SetStateAction<number>>,
    isAdmin: boolean,
    status?: CorrectStatus
}


type CorrectStatus = "CORRECT" | "INCORRECT" | "UNANSWERED"

export default function Question({ num, question: { question, solutions }, selectedOption, setSelectedOption, isAdmin, status = "UNANSWERED" }: QuestionProps) {
    const answerRadioStyles = (n: number) => {
        if (selectedOption === -1) {
            return 'w-7 h-7 bg-gray-200 min-w-7 min-h-7'
        } else if (selectedOption === n) {
            return "ring-2 ring-gray-200 bg-gray-900 min-w-7 min-h-7"
        } else {
            return 'w-8 h-8 bg-gray-200 opacity-75'
        }
    }

    const correctRadioStyles = () => {
        return 'w-7 h-7 bg-green-500 min-w-7 min-h-7'
    }

    const incorrectRadioStyles = () => {
        return 'w-7 h-7 bg-red-500 min-w-7 min-h-7'
    }

    const answerRadioDivStyles = (n: number, correct: boolean = false) => {
        let baseClass = 'flex flex-row text-lg gap-4  px-3 rounded-full py-2'
        if (selectedOption === -1) {
            return baseClass + ' hover:bg-gray-600 cursor-pointer'
        } else if (selectedOption === n) {
            return baseClass + "ring ring-2 ring-gray-200 bg-gray-900 cursor-pointer py-1"
        } else {
            return baseClass + ' text-gray-600'
        }
    }

    const correctRadioDivStyles = () => {
        return 'flex flex-row text-lg gap-4  px-3 rounded-full py-2 bg-green-500'
    }

    const incorrectRadioDivStyles = () => {
        return 'flex flex-row text-lg gap-4  px-3 rounded-full py-2 bg-red-500'
    }

    const radioStyles = (n: number, status: CorrectStatus) => {
        switch (status) {
            case 'CORRECT':
                return correctRadioStyles()
            case 'INCORRECT':
                return incorrectRadioStyles()
            default:
                return answerRadioStyles(n)
        }
    }

    const radioDivStyles = (n: number, status: CorrectStatus) => {
        switch (status) {
            case 'CORRECT':
                return correctRadioDivStyles()
            case 'INCORRECT':
                return incorrectRadioDivStyles()
            default:
                return answerRadioDivStyles(n)
        }
    }

    return (
        <>
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
                            onClick={() => selectedOption === -1 && !isAdmin && setSelectedOption(n)}
                            variants={itemMotion}
                            transition={{ duration: .25 }}
                            htmlFor={`q${n}`}
                            key={item}
                            className={radioDivStyles(n, selectedOption === n ? status : "UNANSWERED")}>
                            <div className={`rounded-full flex justify-center items-center ${radioStyles(n, selectedOption === n ? status : "UNANSWERED")}`}>
                                {selectedOption === n &&
                                    status === "UNANSWERED" ?
                                    <CheckIcon className='text-white' />
                                    : status === "CORRECT" ?
                                        <CheckCheckIcon className='text-white' />
                                        : status === "INCORRECT" ?
                                            <XIcon className='text-white' />
                                            : null
                                }
                            </div>
                            <label htmlFor={`q${n}`}>{item}</label>
                        </motion.label>
                    ))
                }
            </motion.div>
        </>
    )
}

