import { Question } from '@/hooks/useQuestion';
import { motion, useScroll, useSpring } from 'framer-motion';
import { PlayIcon } from 'lucide-react'
import React, { useRef } from 'react'

type Props = {
    name: string;
    questions: Question[]
}

export default function PreviewSet({ name, questions }: Props) {
    const [open, setOpen] = React.useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress, ...x } = useScroll({
        container: scrollRef,
        layoutEffect: true,
        axis: 'y',
        smooth: 0.2
    })
    return (
        <>
            <div onClick={() => setOpen(true)} className='relative group/play'>
                <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/play:flex'>
                    <div className='text-white'>Play</div>
                </div>
                <button className='hover:bg-slate-950 p-2 rounded-md'>
                    <PlayIcon className='w-4 h-4' />
                </button>
            </div>
            {
                open &&
                <div onClick={() => setOpen(false)} className='fixed h-full w-full top-0 left-0 flex justify-center items-center bg-slate-900/30 backdrop-blur-sm z-50'>
                    <div onClick={(e) => e.stopPropagation()} className='p-4 text-white rounded-md border border-slate-800 bg-slate-950 w-full max-w-7xl'>
                        <div className=' w-full flex justify-between py-2 border-b items-center h-fit'>
                            <div className=''>
                                <div className=' text-xl font-zahoot'>
                                    {name}
                                </div>
                                <div className=' text-sm text-slate-200 px-4'>
                                    {questions.length} Questions
                                </div>
                            </div>
                            <button className=' px-4 py-2 text-cyan-900 h-full flex justify-center gap-3 bg-cyan-400 hover:bg-cyan-500 rounded-md items-center'>
                                <PlayIcon className='w-6 h-6 fill-cyan-900' />
                                <div>Play</div>
                            </button>
                        </div>
                        <motion.div style={{ scaleX: scrollYProgress }} className='h-1.5 rounded-full w-full max-w-7xl bg-cyan-400'></motion.div>
                        <div ref={scrollRef} className='relative flex flex-col min-h-fit max-h-[60vh] overflow-y-auto'>
                            {
                                questions.map(({ question, answers, solution }, i) => (
                                    <div key={question + i.toString()} className=' flex flex-row py-2 border-b last:border-b-0 border-b-slate-600'>
                                        <div className='flex-1 p-4'>
                                            <div className='uppercase text-sm text-gray-500 text-left'>Question {i + 1}</div>
                                            <div className='text-xl'>{question}</div>
                                        </div>
                                        <div className=' flex-1 flex flex-col border-l border-l-slate-800 p-4 gap-2'>
                                            {
                                                answers.map((answer, j) => (
                                                    <div className={`py-1 ${solution === j ? "border-l-4 border-l-emerald-500 bg-emerald-900/40 text-emerald-300 font-semibold pl-1" : "pl-2"}`}>{answer}</div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
        </>
    )
}