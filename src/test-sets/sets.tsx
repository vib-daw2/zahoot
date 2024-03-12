import useQuestion, { Question } from '@/hooks/useQuestion'
import { FormattedQuestion, unformatQuestion } from '@/utils/sets/create'
import { CopyIcon, Loader2Icon, MessageCircleQuestion, PencilIcon, PlayIcon, Trash2Icon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { useNavigate, useRevalidator } from 'react-router-dom'
import { getSetByIdResponse } from '~/types/routes/sets/getSetByIdResponse'
import CardSet from './card-set'

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