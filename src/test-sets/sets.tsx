import useQuestion from '@/hooks/useQuestion'
import { FormattedQuestion, unformatQuestion } from '@/utils/sets/create'
import { CopyIcon, Loader2Icon, MessageCircleQuestion, PencilIcon, PlayIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { getSetByIdResponse } from '~/types/routes/sets/getSetByIdResponse'

const CardSet = ({ id, set }: { id: number, set: getSetByIdResponse }) => {
    console.log({ set })
    const { setQuestions } = useQuestion()
    const navigate = useNavigate()
    const formattedQuestions = set.questions.map(x => unformatQuestion(x as FormattedQuestion))

    const copySet = (action: string) => {
        setQuestions(formattedQuestions)
        navigate(action)
    }
    // TODO Usar el parametro id para mostrar las preguntas de dentro del set o algo asi
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
                <div className='h-fit w-full flex justify-end gap-3'>
                    <div className='relative group/copy'>
                        <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/copy:flex'>
                            <div className='text-white'>Duplicate</div>
                        </div>
                        <button onClick={() => copySet('/create')} className='hover:bg-slate-950 p-2 rounded-md'>
                            <CopyIcon className='w-4 h-4' />
                        </button>
                    </div>
                    <div className='relative group/editar'>
                        <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/editar:flex'>
                            <div className='text-white'>Edit</div>
                        </div>
                        <button onClick={() => copySet(`/sets/${set.id}/edit`)} className='hover:bg-slate-950 p-2 rounded-md'>
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
            </div>
        </div>
    )

}

export default function Sets() {
    const [cookies,] = useCookies(['accessToken'])

    const fetchMySets = async () => {
        const res = await fetch(import.meta.env.VITE_API_URL + '/sets/mine', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + cookies.accessToken
            }
        })
        if (res.ok) {
            return await res.json() satisfies getSetByIdResponse[] as getSetByIdResponse[]
        }
        throw new Error(`Error fetching sets from the server - ${res.status} - ${res.statusText}`)
    }

    const { data, isLoading, isError, error } = useQuery('mySets', fetchMySets)

    React.useEffect(() => console.log(data), [data])

    return (
        <div className='pt-16 px-8 '>
            <div className='text-white pb-2 border-b'>
                <h1 className=' text-2xl font-zahoot text-white'>Question Sets</h1>
                <h2 >Select one of our custom sets to get started</h2>
            </div>
            <div className={`w-full ${data ? "grid grid-cols-3" : "flex flex-col justify-center items-center"} gap-3 py-4`}>
                {
                    isLoading
                        ? <div className=' w-full flex justify-center items-center h-[75vh] gap-3 mx-auto text-white'>
                            <Loader2Icon className='w-8 h-8 animate-spin' />
                            <div className=' font-zahoot text-3xl uppercase font-semibold animate-pulse'>Loading...</div>
                        </div>
                        : data
                            ? data.map((set) => <CardSet id={set.id} key={set.id} set={set} />)
                            : isError
                                ? <div className='flex flex-col justify-center items-center h-[75vh]'>
                                    <div className='flex justify-center items-center'>
                                        <XIcon className='w-8 h-8 text-red-500' />
                                        <div className='text-red-500 font-zahoot text-3xl uppercase font-semibold'>Error</div>
                                    </div>
                                    <div className=' text-red-200'>{(error as Error).message}</div>
                                </div>
                                : <div>Nothing</div>
                }
            </div>
        </div>
    )
}