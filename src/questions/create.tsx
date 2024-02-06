import { PlusIcon, XIcon } from 'lucide-react'
import React from 'react'
import useQuestion from '@/hooks/useQuestion'
import FileUpload from '@/components/file-upload'
import { AnimatePresence, MotionValue, Reorder, motion, useMotionValue } from 'framer-motion'
import useRaisedShadow from '@/hooks/useRaisedShadow'

type Props = {}

export default function Create({ }: Props) {
    const { questions, addQuestion, updateQuestion, removeQuestion, setQuestions } = useQuestion(Array.from({ length: 24 }).map(_ => ({
        question: 'A company is planning to run a global marketing application in the AWS Cloud. The application will feature videos that can be viewed by users. The company must ensure that all users can view these videos with low latency.\nWhich AWS service should the company use to meet this requirement?',
        solution: 1,
        answers: []
    })))
    const [selectedQuestion, setSelectedQuestion] = React.useState<number | null>(questions.length === 0 ? null : 0)

    return (
        <>
            <div className='flex flex-col absolute max-h-[calc(100vh - 4 rem)] gap-2 overflow-y-auto text-white pt-16 px-4 inset-0 w-96 border-r border-r-white'>
                <button onClick={() => { addQuestion(); setSelectedQuestion(questions.length - 1) }} className='w-full bg-transparent py-2 text-emerald-500 hover:bg-emerald-500/20 ring ring-emerald-500 rounded-md'>
                    <PlusIcon className='w-6 h-6 m-auto' />
                </button>
                <div className={`${questions.length > 25 ? "text-red-500" : ""} text-center py-1`}>{questions.length} / 25 Questions</div>
                {
                    questions.map((question, index) => (
                        <div onClick={() => setSelectedQuestion(index)} className={`text-gray-300 group cursor-pointer relative hover:bg-gray-600 p-2 rounded-md ${selectedQuestion === index ? "border border-gray-700 bg-gray-800" : ""}`} key={index}>
                            {question.question.slice(0, 70)}...
                            <button onClick={() => removeQuestion(index)} className='hidden group-hover:block absolute top-2 right-2'>
                                <XIcon className='w-6 h-6 text-red-500' />
                            </button>
                        </div>
                    ))
                }
            </div>
            <div className='pl-96 w-2/3 mx-auto h-screen flex flex-col gap-4 justify-center items-center'>
                <input
                    placeholder='Question' value={selectedQuestion ? questions[selectedQuestion].question : ""}
                    onChange={e => selectedQuestion && updateQuestion(selectedQuestion, { ...questions[selectedQuestion], question: e.currentTarget.value })}
                    type="text"
                    className='w-full p-2 bg-transparent border-b border-b-white focus:ring-0 text-white text-lg focus:outline-none' />
                <div className='flex flex-col gap-2 justify-center items-start w-full'>
                    {
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={`sol_${index}`} className='flex gap-3 w-full'>
                                <input type="radio" name="solution" id={`sol_${index}`} checked={selectedQuestion === index ? true : false} onChange={() => selectedQuestion && updateQuestion(selectedQuestion, { ...questions[selectedQuestion], solution: index })} className='w-6' />
                                <input type="text" name="solution-text" id={`sol_${index}_text`} className='w-full py-1 px-2 bg-transparent border-b border-b-white focus:ring-0 text-white focus:outline-none' />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

