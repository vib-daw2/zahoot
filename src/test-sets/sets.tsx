import { CopyIcon, MessageCircleQuestion } from 'lucide-react'
import React from 'react'

type Props = {}

const CardSet = ({ id }: { id: number }) => {
    return (
        <div className='w-full h-fit border border-slate-800 rounded-md flex flex-col group'>
            <div className='h-36 bg-slate-900/80 flex rounded-t-md justify-center items-center text-white'>
                <MessageCircleQuestion className='w-16 h-16 m-auto' />
            </div>
            <div className='h-36 flex flex-col justify-between items-start bg-slate-950 text-white p-4 rounded-b-md group-hover:bg-slate-800'>
                <div className='w-full flex justify-between border-b border-b-slate-800 pb-1 items-baseline'>
                    <div className='font-zahoot  text-lg'>Exam Test #{id + 1}</div>
                    <div className='text-sm'>25 Questions</div>
                </div>
                <div className='pt-1 text-slate-300'>Exam Questions collected randomly</div>
                <div className='h-fit w-full flex justify-end gap-3'>
                    <button className='hover:bg-slate-950 p-2 rounded-md'>
                        <CopyIcon className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    )

}

export default function Sets({ }: Props) {
    return (
        <div className='pt-16 px-8 '>
            <div className='text-white pb-2 border-b'>
                <h1 className=' text-2xl font-zahoot text-white'>Question Sets</h1>
                <h2 >Select one of our custom sets to get started</h2>
            </div>
            <div className='w-full grid grid-cols-3 gap-3 py-4'>
                {
                    Array(9).fill(0).map((_, i) => <CardSet id={i} key={i} />)
                }
            </div>
        </div>
    )
}