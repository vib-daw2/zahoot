import React from 'react'

type Props = {}

export default function About() {
    return (
        <div className=' text-white'>
            <h1 className='font-zahoot text-2xl'>About Zahoot</h1>
            <p className='mt-4'>
                Zahoot is a quiz app similiar to the original Kahoot (c)
                It is a project built by Albert Bru and Carlos Carpio as the end of year project for the 2023-24 school year.
            </p>
            <p className='mt-4'>
                The project has been built using React, TailwindCSS, and TypeScript on the frontend and Node.js, Express, Socket.io, with MySQL on the backend.
            </p>
            <p className='mt-4'>
                The project is open source and can be found on GitHub at
                <a href='https://github.com/vib-daw2/zahoot' className='text-cyan-400 hover:underline cursor-pointer'> this link</a>.
            </p>
        </div>
    )
}