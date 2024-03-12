import { Question } from "@/hooks/useQuestion"
import { CopyIcon, PencilIcon, PlayIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { useNavigate, useRevalidator } from "react-router-dom"
import DeleteSetDialog from "./delete-set-dialog"
import React from "react"

const SetOptions = ({ setQuestions, formattedQuestions, id }: { setQuestions: (questions: Question[]) => void, formattedQuestions: Question[], id: number }) => {
    const navigate = useNavigate()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const copySet = (action: string) => {
        setQuestions(formattedQuestions)
        navigate(action)
    }
    let revalidator = useRevalidator()

    return (
        <div className='h-fit w-full flex justify-end gap-3'>
            <div className='relative group/borrar'>
                <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/borrar:flex'>
                    <div className='text-white'>Delete</div>
                </div>
                <button className='hover:bg-slate-950 p-2 rounded-md' onClick={() => setOpenDeleteDialog(true)}>
                    <Trash2Icon className='w-4 h-4' />
                    {openDeleteDialog && <DeleteSetDialog id={id} close={() => {
                        setOpenDeleteDialog(false)
                        revalidator.revalidate()
                    }} />}
                </button>
            </div>
            <div className='relative group/copy'>
                <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/copy:flex'>
                    <div className='text-white'>Duplicate</div>
                </div>
                <button className='hover:bg-slate-950 p-2 rounded-md' onClick={() => copySet('/create')}>
                    <CopyIcon className='w-4 h-4' />
                </button>
            </div>
            <div className='relative group/editar'>
                <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/editar:flex'>
                    <div className='text-white'>Edit</div>
                </div>
                <button onClick={() => copySet(`/sets/${id}/edit`)} className='hover:bg-slate-950 p-2 rounded-md'>
                    <PencilIcon className='w-4 h-4' />
                </button>
            </div>
            <div className='relative group/play'>
                <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/play:flex'>
                    <div className='text-white'>Play</div>
                </div>
                <button className='hover:bg-slate-950 p-2 rounded-md'>
                    <PlayIcon className='w-4 h-4' />
                </button>
            </div>
        </div>
    )
}

export default SetOptions