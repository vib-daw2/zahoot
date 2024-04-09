import { Question } from '@/hooks/useQuestion';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Loader2Icon, PlayIcon } from 'lucide-react'
import React, { useRef } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {
    id: number;
    name: string;
    questions: Question[]
}

export default function PreviewSet({ id, name, questions }: Props) {
    const [open, setOpen] = React.useState(false)
    const [cookies, _] = useCookies(['accessToken'])
    const scrollRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = React.useState(false)
    const navigation = useNavigate()
    const { scrollYProgress, ...x } = useScroll({
        container: scrollRef,
        layoutEffect: true,
        axis: 'y',
        smooth: 0.2
    })

    React.useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                setOpen(false)
            }
        })
        return () => {
            document.removeEventListener("keydown", () => { })
        }
    }, [])

    const playGame = async () => {
        setLoading(true)
        const response = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + '/games/create', {
            method: 'POST',
            body: JSON.stringify({ questionSetId: id }),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + cookies.accessToken
            }
        })
        if (!response.ok) {
            toast.error(`Error creating game - ${response.status} - ${response.statusText}`)
            setLoading(false)
            return
        }
        const { pin } = await response.json()
        if (!pin) {
            toast.error('Error creating game - no game pin returned')
            setLoading(false)
            return
        }
        setLoading(false)
        navigation(`/games/${pin}`)
    }

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
            <AnimatePresence>
                {
                    open &&
                    <motion.div
                        onClick={() => setOpen(false)} className='fixed h-full w-full top-0 left-0 flex justify-center items-center bg-slate-900/30 backdrop-blur-sm z-50'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, translateY: 10 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            exit={{ opacity: 0, scale: 0.8, translateY: 10 }}
                            transition={{
                                ease: "easeOut",
                                duration: 0.1
                            }}
                            onClick={(e) => e.stopPropagation()} className='p-4 text-white rounded-md border border-slate-800 bg-slate-950 w-full max-w-7xl'>
                            <div className=' w-full flex justify-between py-2 border-b items-center h-fit'>
                                <div className=''>
                                    <div className=' text-xl font-zahoot'>
                                        {name}
                                    </div>
                                    <div className=' text-sm text-slate-200 px-4'>
                                        {questions.length} Questions
                                    </div>
                                </div>
                                <button disabled={loading} onClick={playGame} className=' px-4 py-2 text-cyan-900 h-full flex justify-center gap-3 bg-cyan-400 hover:bg-cyan-500 rounded-md items-center'>
                                    {loading
                                        ? <>
                                            <Loader2Icon className='w-6 h-6 animate-spin' />
                                            <div>Creating...</div>
                                        </>
                                        : <>
                                            <PlayIcon className='w-6 h-6 fill-cyan-900' />
                                            <div>Play</div>
                                        </>
                                    }
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
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )
}