import { CopyIcon, MessageCircleQuestion, PencilIcon, PlayIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { getSetByIdResponse } from '~/types/routes/sets/getSetByIdResponse'

const CardSet = ({ id, set }: { id: number, set: getSetByIdResponse }) => {
    // TODO Usar el parametro id para mostrar las preguntas de dentro del set o algo asi
    return (
        <div className='w-full h-fit border border-slate-800 rounded-md flex flex-col group'>
            <div className='h-36 bg-slate-900/80 flex rounded-t-md justify-center items-center text-white'>
                <MessageCircleQuestion className='w-16 h-16 m-auto' />
            </div>
            <div className='h-36 flex flex-col justify-between items-start bg-slate-950 text-white p-4 rounded-b-md group-hover:bg-slate-800'>
                <div className='w-full flex justify-between border-b border-b-slate-800 pb-1 items-baseline'>
                    <div className='font-zahoot  text-lg'>{set.name}</div>
                    {/* <div className='text-sm'>{set.questions.length} Questions</div> */}
                </div>
                <div className='pt-1 text-slate-300'>{set.description}</div>
                <div className='h-fit w-full flex justify-end gap-3'>
                    <div className='relative group/copy'>
                        <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/copy:flex'>
                            <div className='text-white'>Duplicate</div>
                        </div>
                        <button className='hover:bg-slate-950 p-2 rounded-md'>
                            <CopyIcon className='w-4 h-4' />
                        </button>
                        </div>
                    <div className='relative group/editar'>
                        <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/editar:flex'>
                            <div className='text-white'>Edit</div>
                        </div>
                        <button className='hover:bg-slate-950 p-2 rounded-md'>
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
        return await res.json() satisfies getSetByIdResponse[] as getSetByIdResponse[]
    }

    const { data, isLoading } = useQuery('mySets', fetchMySets)

    return (
        <div className='pt-16 px-8 '>
            <div className='text-white pb-2 border-b'>
                <h1 className=' text-2xl font-zahoot text-white'>Question Sets</h1>
                <h2 >Select one of our custom sets to get started</h2>
            </div>
            <div className='w-full grid grid-cols-3 gap-3 py-4'>
                {isLoading ? <div>Loading ...</div> : data?.map((set) => <CardSet id={set.id} key={set.id} set={set} />)}
            </div>
        </div>
    )
}