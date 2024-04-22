import { Loader2Icon, PlusIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { getSetByIdResponse } from '~/types/routes/sets/getSetByIdResponse'
import CardSet from './card-set'
import { Link } from 'react-router-dom'

export default function Sets() {
    const [cookies,] = useCookies(['accessToken'])

    const fetchMySets = async () => {
        const res = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + '/sets/mine', {
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

    return (
        <div className='pt-16 px-8 '>
            <div className='text-white pb-2 border-b'>
                <h1 className=' text-2xl font-zahoot text-white'>Question Sets</h1>
                <h2 >Select one of our custom sets to get started</h2>
            </div>
            <div className={`w-full ${data && data.length ? "grid grid-cols-3" : "flex flex-col justify-center items-center"} gap-3 py-4`}>
                {
                    isLoading
                        ? <div className=' w-full flex justify-center items-center h-[75vh] gap-3 mx-auto text-white'>
                            <Loader2Icon className='w-8 h-8 animate-spin' />
                            <div className=' font-zahoot text-3xl uppercase font-semibold animate-pulse'>Loading...</div>
                        </div>
                        : data && data?.length
                            ? data.map((set) => <CardSet id={set.id} key={set.id} set={set} />)
                            : isError
                                ? <div className='flex flex-col justify-center items-center h-[75vh]'>
                                    <div className='flex justify-center items-center'>
                                        <XIcon className='w-8 h-8 text-red-500' />
                                        <div className='text-red-500 font-zahoot text-3xl uppercase font-semibold'>Error</div>
                                    </div>
                                    <div className=' text-red-200'>{(error as Error).message}</div>
                                </div>
                                : <div className=' w-full flex flex-col justify-center items-center h-[75vh] text-lg text-white z-50'>
                                    <div>No sets found</div>
                                    <Link to={"/sets/create"} className='px-4 cursor-pointer h-10 flex gap-4 hover:bg-cyan-300 font-medium w-[250px] justify-between bg-cyan-400 text-cyan-900 items-center rounded-md mt-2'>
                                        <PlusIcon className='w-6 h-6' />
                                        Create a new set
                                    </Link>
                                </div>
                }
            </div>
        </div>
    )
}