import { Input, itemMotion } from '@/components/auth-input'
import { MotionProps, motion } from 'framer-motion'
import { AtSignIcon, LockIcon, LockKeyholeIcon, MailIcon, UserRoundIcon } from 'lucide-react'
import React, { RefAttributes } from 'react'
import { Link } from 'react-router-dom'

type Props = {}



type MotionInput = MotionProps & {
    type?: string
    placeholder?: string
    className?: string
    value?: string
    onValueChange?: (v: string) => void
}



export default function Signup({ }: Props) {

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ ease: "easeInOut" }}

            className='max-w-[350px] w-full border border-gray-200 drop-shadow-lg space-y-4 h-fit p-4 bg-white flex flex-col justify-center items-center rounded-lg'>
            <div className=' text-2xl text-left w-full'>Log In</div>
            <motion.div {...itemMotion} transition={{ delay: .1 }} className='relative w-full'>
                <div className='h-full absolute z-50 top-0 left-0 w-12 flex justify-center items-center'>
                    <UserRoundIcon size={24} className='text-gray-400' />
                </div>
                <Input

                    placeholder='name'
                />
            </motion.div>
            <motion.div {...itemMotion} transition={{ delay: .2 }} className='relative w-full'>
                <div className='h-full absolute z-50 top-0 left-0 w-12 flex justify-center items-center'>
                    <AtSignIcon size={24} className='text-gray-400' />
                </div>
                <Input
                    placeholder='username'
                />
            </motion.div>
            <motion.div {...itemMotion} transition={{ delay: .3 }} className='relative w-full'>
                <div className='h-full absolute z-50 top-0 left-0 w-12 flex justify-center items-center'>
                    <MailIcon size={24} className='text-gray-400' />
                </div>
                <Input

                    placeholder='email'
                    type='email'
                />
            </motion.div>
            <motion.div {...itemMotion} transition={{ delay: .4 }} className='relative w-full'>
                <div className='h-full absolute z-50 top-0 left-0 w-12 flex justify-center items-center'>
                    <LockIcon size={24} className='text-gray-400' />
                </div>
                <Input

                    placeholder='password'
                    type='password'
                />
            </motion.div>
            <motion.div {...itemMotion} transition={{ delay: .5 }} className='relative w-full'>
                <div className='h-full absolute z-50 top-0 left-0 w-12 flex justify-center items-center'>
                    <LockKeyholeIcon size={24} className='text-gray-400' />
                </div>
                <Input

                    placeholder='repeat password'
                    type='password'
                />
            </motion.div>

            <motion.button
                {...itemMotion}
                transition={{ delay: .6 }}
                className='px-6 py-3 bg-gray-900 text-white text-lg font-semibold rounded-sm w-full'>Sign Up</motion.button>
            <motion.div
                {...itemMotion}
                transition={{ delay: .7 }}
            >
                <Link to={"/login"}>Log In</Link>
            </motion.div>
        </motion.div>
    )
}