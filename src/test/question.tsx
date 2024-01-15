import { containerMotion, itemMotion } from '@/utils/motion'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { CheckIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useParams } from 'react-router'

type Props = {
}

const questionMotion = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        rotate: [0, 3, -3, 0]
    },
}

type SolutionItemProps = {
    text: string,
    ref?: React.Ref<HTMLDivElement>,
    position: number,
    isCorrect: boolean | null
    solution: number
    setSolution?: React.Dispatch<React.SetStateAction<number>>
}

const SolutionItem = ({ text, position, isCorrect, setSolution, solution }: SolutionItemProps) => {
    const baseHover = { scale: 1.1, zIndex: 99 }
    const colors = ['bg-red-600', 'bg-blue-600', 'bg-yellow-600', 'bg-green-600']
    const modifiedHovers = [{ ...baseHover, rotate: -3 }, { ...baseHover, rotate: 3 }, { ...baseHover, rotateZ: 3 }, { ...baseHover, rotateZ: -3 }]
    const isSolved = isCorrect !== null
    return (
        <motion.div
            onClick={() => setSolution && setSolution(position)}
            variants={itemMotion}
            transition={{ duration: .25 }}
            whileHover={isSolved ? {} : modifiedHovers[position]}
            className={`w-full relative h-48 z-50 flex justify-center items-center ${colors[position]} ${isSolved ? (isCorrect ? "bg-opacity-100" : "bg-opacity-30") : "bg-opacity-100"}`}>
            {text}
            {isSolved && isCorrect && <div className='absolute -top-4 -right-4 w-10 flex justify-center items-center h-10 rounded-full bg-green-600 '>
                <CheckIcon className='text-white' />
            </div>}
            {
                isSolved && !isCorrect && solution == position && <div className='absolute -top-4 -right-4 w-10 flex justify-center items-center h-10 rounded-full bg-red-600 '>
                    <XIcon className='text-white' />
                </div>
            }
        </motion.div>
    )

}

export default function Question({ }: Props) {
    const { id, num } = useParams()
    const solutions = ['Respuesta A', 'Respuesta B', 'Respuesta C', 'Respuesta D']
    const correctSolution = 2
    const [solution, setSolution] = React.useState<number>(-1)

    return (
        <div className='w-2/3 h-screen mx-auto flex flex-col justify-center items-center'>
            <div className='text-2xl font-bold text-center'>Question {num}</div>
            <div className='text-4xl'>¿Cuál es la solución?</div>
            <div className='w-full h-72 rounded-lg bg-slate-600 mt-4 z-50'></div>
            <motion.div variants={containerMotion} initial="hidden" animate="visible" className='grid grid-rows-2 grid-cols-2 w-full gap-3 mt-4 text-white text-xl'>
                <AnimatePresence>
                    {solutions.map((item, n) => (
                        <SolutionItem
                            key={`solution_${n}`}
                            text={item}
                            position={n}
                            isCorrect={solution === -1 ? null : n == correctSolution}
                            solution={solution}
                            setSolution={solution === -1 ? setSolution : undefined}
                        />))}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}