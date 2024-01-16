import React from 'react'

type Question = {
    question: string,
    image: File | null,
    answers: string[]
    solution: number
}

export default function useQuestion() {
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

    return { questions, addQuestion, updateQuestion, removeQuestion, setQuestions }
}