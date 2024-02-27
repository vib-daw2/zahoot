import { socket } from '@/lib/socket'
import React from 'react'
import { useParams } from 'react-router-dom';

type Props = {}

export default function Leaderboard({ }: Props) {

    return (
        <div className='p-4 w-full h-screen flex justify-center items-center text-white'>Leaderboard</div>
    )
}