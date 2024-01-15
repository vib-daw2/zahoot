import React from 'react'

type Props = {}

export default function Navbar({ }: Props) {
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)
    const joinRef = React.useRef<HTMLDivElement>(null)
    const createRef = React.useRef<HTMLDivElement>(null)
    const aboutRef = React.useRef<HTMLDivElement>(null)
    const loginRef = React.useRef<HTMLDivElement>(null)
    return (
        <div className='fixed top-3 left-0 w-full flex justify-center items-center z-40'>
            <div className='w-fit min-w-1/2 flex justify-between relative bg-white border-black border-2 rounded-full'>
                <div ref={joinRef} className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>Join</div>
                <div ref={createRef} className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>Create</div>
                <div ref={aboutRef} className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>About</div>
                <div ref={loginRef} className='px-6 min-w-24 text-center hover:bg-gray-200 rounded-full py-2'>Log In</div>
                <div className='absolute min-w-32 bg-gray-200 top-0 left-0 h-10 rounded-full'></div>
            </div>
        </div>
    )
}