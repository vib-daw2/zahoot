import useQuestion, { Question } from '@/hooks/useQuestion'
import { createSet, uploadQuestions } from '@/utils/sets/create'
import { Loader2Icon, SaveIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

type Props = {
    defaultName: string;
    defaultDescription: string;
    id?: string;
}

export default function SaveDialog({ defaultName, defaultDescription, id }: Props) {
    console.log({ defaultName, defaultDescription, id })
    const { questions } = useQuestion()
    const [cookie,] = useCookies(['accessToken'])
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState(defaultName)
    const [description, setDescription] = React.useState(defaultDescription)
    const [status, setStatus] = React.useState('')
    const [error, setError] = React.useState(false)
    const [nameValid, setNameValid] = React.useState(true)
    const navigate = useNavigate()

    React.useEffect(() => {
        setName(defaultName)
        setDescription(defaultDescription)
    }, [defaultName, defaultDescription])

    const save = async () => {
        console.log({ name, description, questions })
        if (!id) {
            setStatus("Creating set...")
            const setData = await createSet({ name, description, token: cookie.accessToken })
            if (!setData) {
                setError(true)
                return
            }
            console.log(setData)
            setStatus("Uploading questions...")
            const success = await uploadQuestions({ id: setData.id, questions: questions, token: cookie.accessToken })
            if (success) {
                setStatus("Done")
                navigate("/sets")
            } else {
                setError(true)
            }
        } else {
            setStatus("Uploading questions...")
            const success = await uploadQuestions({ id: parseInt(id), questions: questions, token: cookie.accessToken })
            if (success) {
                setStatus("Done")
                navigate("/sets")
            } else {
                setError(true)
            }
        }
    }

    const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
        setNameValid(e.currentTarget.value.length > 5)
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className=' absolute top-16 gap-3 hover:bg-slate-800 right-10 text-cyan-400 border border-cyan-400 px-4 py-2 flex justify-center items-center rounded-md'>
                <SaveIcon className=' text-cyan-400' />
                <div>Save Set</div>
            </button>
            {open && <div className='fixed w-full bg-slate-600 bg-opacity-20 backdrop-blur-sm z-[999] h-screen flex justify-center items-center' onClick={() => setOpen(false)}>
                <div onClick={e => e.stopPropagation()} className=' w-full flex flex-col gap-2 max-w-md text-white p-4 bg-slate-700 rounded-md'>
                    <div className=' font-zahoot text-white font-bold text-xl'>Save Set</div>
                    <input value={name} onChange={updateName} type="text" className={`w-full py-1 px-2 bg-transparent ${nameValid ? "border-b-slate-200" : "border-b-red-500"} border-b focus:outline-none text-white`} placeholder='Set Name' />
                    {!nameValid && <span className=' text-red-500'>Must have at least 5 characters</span>}
                    <textarea value={description} onChange={e => setDescription(e.currentTarget.value)} className=' bg-slate-900 text-white rounded-md p-2' name="description" id="description" rows={4} maxLength={254}></textarea>
                    {status && status !== "Done" &&
                        <div className='text-white font-zahoot flex items-center gap-3'>
                            <Loader2Icon className=' animate-spin' />
                            <div className=' text-slate-300 animate-pulse'>{status}</div>
                        </div>
                    }
                    {error && <div className=' text-red-500 flex items-center gap-3'>
                        <XIcon className='' />
                        <div>An error occured</div>
                    </div>}
                    <div className=' w-full flex justify-end mt-3'>
                        <button
                            disabled={name.length <= 5 || (status !== "" && status !== "Done")}
                            onClick={save}
                            className='flex justify-center items-center gap-3 px-3 py-2 rounded-md bg-cyan-400 text-black hover:bg-cyan-500 disabled:bg-cyan-600 disabled:text-cyan-800'
                        >
                            <SaveIcon />
                            <div>Save Set</div>
                        </button>
                    </div>
                </div>
            </div>}
        </>
    )
}