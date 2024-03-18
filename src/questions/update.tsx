import { PlusIcon, SaveIcon, XIcon } from 'lucide-react'
import React from 'react'
import useQuestion from '@/hooks/useQuestion'
import SaveDialog from '@/components/set/save-dialog'
import { useQuery } from 'react-query'
import { redirect, useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { FormattedQuestion, formatQuestion, unformatQuestion } from '@/utils/sets/create'

type Props = {
    action: "edit" | "create"
}

export default function UpdateQuestions({ action = "create" }: Props) {
    const { questions, addQuestion, updateQuestion, removeQuestion, setQuestions } = useQuestion()
    const [selectedQuestion, setSelectedQuestion] = React.useState<number | null>(questions.length === 0 ? null : 0)
    const [setName, setSetName] = React.useState('')
    const [setDescription, setSetDescription] = React.useState('')
    const { id } = useParams<{ id?: string }>()
    const [cookies,] = useCookies(['accessToken'])
    const { data, isLoading } = useQuery('questions', async () => {
        if (!cookies.accessToken) {
            redirect("/login")
            return null
        }
        if (action === "create") {
            return null
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/sets/${id}`, {
            headers: {
                "Authorization": `Bearer ${cookies.accessToken}`,
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            return null
        }
        const values = await response.json()
        console.log({ values })
        return values as { name: string, description: string, questions: FormattedQuestion[] }
    })

    React.useEffect(() => {
        if (questions.length === 0 || selectedQuestion === -1) {
            setSelectedQuestion(null)
        }
        if (selectedQuestion !== null && selectedQuestion >= questions.length && questions.length > 0) {
            setSelectedQuestion(questions.length - 1)
        }
        if (selectedQuestion === null && questions.length > 0) {
            setSelectedQuestion(0)
        }
        if (selectedQuestion === -1) {
            setSelectedQuestion(null)
        }
    }, [questions])

    React.useEffect(() => {
        if (data) {
            console.log({ data })
            console.log({ name: data.name, description: data.description })
            setQuestions(data.questions.map(unformatQuestion))
            setSetName(data.name)
            setSetDescription(data.description)
        }
    }, [data])

    function deleteQuestion(index: number) {
        removeQuestion(index)
    }

    return (
        <>
            <div className='flex flex-col absolute max-h-[calc(100vh - 4 rem)] overflow-x-hidden gap-2 overflow-y-auto text-white pt-16 px-4 inset-0 w-96 border-r border-r-white'>
                <button onClick={() => { addQuestion() }} className='w-full bg-transparent py-2 text-emerald-500 hover:bg-emerald-500/20 ring ring-emerald-500 rounded-md'>
                    <PlusIcon className='w-6 h-6 m-auto' />
                </button>
                <div className={`${questions.length > 25 ? "text-red-500" : ""} text-center py-1`}>{questions.length} / 25 Questions</div>
                {
                    questions.map((question, index) => (
                        <div onClick={() => setSelectedQuestion(index)} className={`text-gray-300 group w-full cursor-pointer relative hover:bg-gray-600 p-2 pr-6 rounded-md ${selectedQuestion === index ? "border border-gray-700 bg-gray-800" : ""}`} key={index}>
                            <div>{question.question.slice(0, 70)}{question.question.length > 70 && "..."}</div>
                            <button onClick={() => deleteQuestion(index)} className='hidden w-fit h-fit group-hover:block absolute top-2 right-2'>
                                <XIcon className='w-6 h-6 text-red-500' />
                            </button>
                        </div>
                    ))
                }
            </div>
            <SaveDialog defaultName={setName} defaultDescription={setDescription} id={id} />
            {selectedQuestion !== null && <div className='ml-96 relative w-[calc(100%-24rem)] px-8 mx-auto h-screen flex flex-col gap-4 justify-center items-center'>
                <div className='mx-auto w-full flex flex-col justify-center items-center gap-3 max-w-3xl'>

                    <input
                        placeholder='Question' value={selectedQuestion !== null ? questions[selectedQuestion]?.question : ""}
                        onChange={e => selectedQuestion !== null && updateQuestion(selectedQuestion, { ...questions[selectedQuestion], question: e.currentTarget.value })}
                        type="text"
                        className='w-full p-2 bg-transparent border-b border-b-white focus:ring-0 text-white text-lg focus:outline-none' />
                    <div className='flex flex-col gap-2 justify-center items-start w-full'>
                        {
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={`sol_${index}`} className='flex gap-3 w-full'>
                                    <input type="radio" name="solution" id={`sol_${index}`} checked={questions[selectedQuestion].solution === index ? true : false} onChange={() => selectedQuestion !== null && updateQuestion(selectedQuestion, { ...questions[selectedQuestion], solution: index })} className='w-6' />
                                    <input
                                        type="text"
                                        name="solution-text"
                                        id={`sol_${index}_text`}
                                        value={questions[selectedQuestion]?.answers[index] ?? ""}
                                        onChange={e => {
                                            const newAnswers = questions[selectedQuestion].answers
                                            newAnswers[index] = e.currentTarget.value
                                            updateQuestion(selectedQuestion, { ...questions[selectedQuestion], answers: newAnswers })
                                        }}
                                        className='w-full py-1 px-2 bg-transparent border-b border-b-white focus:ring-0 text-white focus:outline-none'
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>}
        </>
    )
}

