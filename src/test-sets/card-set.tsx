import useQuestion from "@/hooks/useQuestion";
import { FormattedQuestion, unformatQuestion } from "@/utils/sets/create";
import { MessageCircleQuestion } from "lucide-react";
import React from "react";
import { getSetByIdResponse } from "~/types/routes/sets/getSetByIdResponse";
import SetOptions from "./set-options";

const CardSet = ({ id, set }: { id: number, set: getSetByIdResponse }) => {
    console.log({ set })
    const { setQuestions } = useQuestion()
    const formattedQuestions = set.questions.map(x => unformatQuestion(x as FormattedQuestion))

    return (
        <div className='w-full h-fit border border-slate-800 rounded-md flex flex-col group'>
            <div className='h-36 bg-slate-900/80 flex rounded-t-md justify-center items-center text-white'>
                <MessageCircleQuestion className='w-16 h-16 m-auto' />
            </div>
            <div className='h-36 flex flex-col justify-between items-start bg-slate-950 text-white p-4 rounded-b-md group-hover:bg-slate-800'>
                <div className='w-full flex justify-between border-b border-b-slate-800 pb-1 items-baseline'>
                    <div className='font-zahoot  text-lg'>{set.name}</div>
                </div>
                <div className='pt-1 text-slate-300'>{set.description}</div>
                <SetOptions setQuestions={setQuestions} formattedQuestions={formattedQuestions} id={id} />
            </div>
        </div>
    )
}

export default CardSet