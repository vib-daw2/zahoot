import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactNode,
}

export default function DialogContainer({ open, setOpen, children }: Props) {
    return (
        <AnimatePresence>
            {open && <motion.div
                onClick={() => setOpen(false)} className='fixed h-full w-full top-0 left-0 flex justify-center items-center bg-slate-900/30 backdrop-blur-sm z-50'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, translateY: 10 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, translateY: 10 }}
                    transition={{
                        ease: "easeOut",
                        duration: 0.1
                    }}
                    onClick={(e) => e.stopPropagation()} className='p-4 text-white rounded-md border border-slate-800 bg-slate-950 w-full max-w-xl'>
                    {children}
                </motion.div>
            </motion.div>
            }
        </AnimatePresence>
    )
}