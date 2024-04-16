import React from 'react'
import { create } from "zustand"

type QuestionStore = {}

export type Question = {
    question: string,
    answers: string[]
    solution: number
}

interface QuestionState {
    questions: Question[]
    setQuestions: (questions: Question[]) => void,
    updateQuestion: (index: number, question: Question) => void
    removeQuestion: (index: number) => void
    addQuestion: () => void
    emptyQuestions: () => void
}

const useQuestion = create<QuestionState>()((set) => ({
    questions: [],
    setQuestions: (questions: Question[]) => set((state) => ({ questions: questions })),
    updateQuestion: (index: number, question: Question) => set((state) => {
        const newQuestions = [...state.questions]
        newQuestions[index] = question
        return { ...state, questions: newQuestions }
    }),
    addQuestion: () => set((state) => {
        const ind = state.questions.length
        return { ...state, questions: [...state.questions, { question: `Question ${ind + 1}`, answers: Array.from({ length: 4 }, () => ''), solution: 0 }] }
    }),
    removeQuestion: (index: number) => set((state) => {
        const newQuestions = [...state.questions]
        newQuestions.splice(index, 1)
        return { ...state, questions: newQuestions }
    }),

    emptyQuestions: () => set((state) => ({ questions: [] }))
}))

export default useQuestion
// export default function useQuestion(q: Question[] = []) {
//     const [questions, setQuestions] = React.useState<Question[]>(q)
//     const addQuestion = () => {
//         const ind = questions.length
//         setQuestions([...questions, {
//             question: `Question ${ind + 1}`,
//             answers: Array.from({ length: 4 }, () => ''),
//             solution: 0
//         }])
//     }

//     const updateQuestion = (index: number, question: Question) => {
//         const newQuestions = [...questions]
//         newQuestions[index] = question
//         setQuestions(newQuestions)
//     }

//     const removeQuestion = (index: number) => {
//         const newQuestions = [...questions]
//         newQuestions.splice(index, 1)
//         setQuestions(newQuestions)
//     }

//     return { questions, addQuestion, updateQuestion, removeQuestion, setQuestions }
// }