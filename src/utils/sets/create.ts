import { Question } from "@/hooks/useQuestion"
import { redirect } from "react-router-dom"

type CreateSetResponse = {
    success: boolean
    message: string
    id: number
}

export type FormattedQuestion = {
    question: string;
    choices: FormattedChoice[]
    type?: string
}
type FormattedChoice = {
    choice: string
    isCorrect: boolean
}

export function formatQuestion(question: Question): FormattedQuestion {
    return {
        question: question.question,
        type: "multipleAnswer",
        choices: question.answers.map((answer, i) => (
            {
                choice: answer,
                isCorrect: i === question.solution
            }
        ))
    }
}

export function unformatQuestion(question: FormattedQuestion): Question {
    return {
        question: question.question,
        answers: question.choices.map(x => x.choice),
        solution: question.choices.map(x => x.isCorrect).indexOf(true)
    }
}

export async function createSet(
    { name, description, token } : { name: string, description: string, token: string}
) : Promise<CreateSetResponse | null>
{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sets`, {
        method: "POST",
        body: JSON.stringify({ name, description }),
        headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }
    })
    if (response.status === 401 || response.status === 403){
        redirect("/login")
    }
    if (!response.ok){
        return null
    }
    return await response.json() satisfies CreateSetResponse as CreateSetResponse
}

export async function uploadQuestions({ id, questions, token } : { id: number, questions: Question[], token: string}): Promise<boolean>{
    const formattedQuestions = questions.map(formatQuestion)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, {
        method: "POST",
        body: JSON.stringify({questions : formattedQuestions}),
        headers: {
            "Authorization" : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }
    })
    return response.ok
}