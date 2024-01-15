import React from 'react'

type Props = {}

export default function Navbar({ }: Props) {
    return (
        <div className='fixed top-3 left-0 w-full flex justify-center items-center z-40'>
            <div className='w-fit min-w-1/2 flex justify-between bg-white border-black border-2 rounded-full'>
                <div className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>Join</div>
                <div className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>Create</div>
                <div className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>About</div>
                <div className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>Log In</div>
            </div>
        </div>
    )
}