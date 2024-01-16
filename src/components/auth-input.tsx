import { ForwardRefComponent, HTMLMotionProps, MotionProps, motion } from 'framer-motion'
import React from 'react'

export const itemMotion = {
    initial: { translateX: 400, opacity: 0 },
    animate: { translateX: 0, opacity: 1 },
    exit: { translateX: -400, opacity: 0 },
    transition: { delay: 0.3 }
}

type Props = MotionProps & {
    type?: string
    placeholder?: string
    className?: string
    value?: string
    onValueChange?: (v: string) => void
}

export function Input({ ...props }: Props) {
    return (
        <motion.input
            {...itemMotion}
            {...props}
            className='pr-2 text-right pl-12 bg-slate-100 placeholder:font-bold w-full py-3 border-2 border-gray-200' />
    )
}
