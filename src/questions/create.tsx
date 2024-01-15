import { XIcon } from 'lucide-react'
import React from 'react'

type Props = {}

type Question = {
    question: string,
    image: File | null,
    answers: string[]
    solution: number
}

export default function Create({ }: Props) {
    const [questions, setQuestions] = React.useState<Question[]>([])
    const addQuestion = () => {
        setQuestions([...questions, {
            question: '',
            image: null,
            answers: Array.from({ length: 4 }, () => ''),
            solution: 0
        }])
    }

    const updateQuestion = (index: number, question: Question) => {
        const newQuestions = [...questions]
        newQuestions[index] = question
        setQuestions(newQuestions)
    }

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions]
        newQuestions.splice(index, 1)
        setQuestions(newQuestions)
    }

    return (
        <div className='w-2/3 flex flex-col gap-3 z-50 justify-start items-start pt-24 mx-auto pb-4'>
            <div className='text-4xl font-bold'>New Test</div>
            <input type="file" className='mt-2' />
            {
                questions.map((question, i) => (
                    <div className='flex relative flex-col gap-3 p-3 bg-white bg-opacity-75 rounded-lg border drop-shadow-lg w-full'>
                        <button onClick={() => removeQuestion(i)} className='absolute -right-4 -top-4 w-10 h-10 rounded-full bg-red-500 flex justify-center items-center text-white'>
                            <XIcon />
                        </button>
                        <input type="file" name="img" id="img" />
                        <input tabIndex={i * 5 + 1} type="text" placeholder='Question' className='mt-2 text-lg px-3 py-1 bg-transparent border-b border-b-black' value={question.question} onChange={(e) => updateQuestion(i, { ...question, question: e.currentTarget.value })} />
                        {
                            question.answers.map((answer, j) => (
                                <div className='flex items-center gap-2 py-2'>
                                    <input tabIndex={-1} type="radio" name={`question-${i}`} id={`question-${i}-answer-${j}`} />
                                    <input
                                        tabIndex={(i * 5) + (j + 2)}
                                        type="text"
                                        placeholder='Answer'
                                        value={answer}
                                        onChange={(e) => {
                                            const newQuestion = { ...question }
                                            newQuestion.answers[j] = e.currentTarget.value
                                            updateQuestion(i, newQuestion)
                                        }}
                                        className='w-full py-1 px-2 bg-opacity-0 bg-transparent border-b active:border-b border-b-black ' />
                                </div>

                            ))
                        }
                    </div>
                ))
            }
            <div className='flex flex-row gap-2 justify-end items-center w-full mt-4'>
                <button className=' min-w-36 px-4 py-2 bg-yellow-50 hover:bg-yellow-200 font-medium text-black border border-black rounded-lg' onClick={addQuestion}>Add Question</button>
                <button className=' min-w-36 px-4 py-2 bg-slate-900 text-white font-medium border border-black rounded-lg'>Create Test</button>
            </div>
        </div>
    )
}