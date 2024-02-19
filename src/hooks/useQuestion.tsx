import React from 'react'

type Question = {
    question: string,
    answers: string[]
    solution: number
}

export default function useQuestion(q: Question[] = []) {
    const [questions, setQuestions] = React.useState<Question[]>(q)
    const addQuestion = () => {
        const ind = questions.length
        setQuestions([...questions, {
            question: `Question ${ind + 1}`,
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