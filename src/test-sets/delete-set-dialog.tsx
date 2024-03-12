import React from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

const DeleteSetDialog = ({ id, close }: { id: number, close: () => void }) => {
    const [cookies,] = useCookies(['accessToken'])
    const navigate = useNavigate()

    const deleteSet = async () => {
        const res = await fetch(import.meta.env.VITE_API_URL + `/sets/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + cookies.accessToken
            }
        }).then(res => res.json())

        if (res.success) {
            close()
            window.location.reload()
        }
    }

    return (
        <div className='fixed h-full w-full top-0 left-0 flex justify-center items-center bg-black/80 z-50'>
            <div className='bg-slate-900 p-10 rounded-md'>
                <div className='text-white'>Are you sure you want to delete this question set?</div>
                <div className='flex justify-end gap-3 mt-4'>
                    <button
                        className='hover:bg-red-500 p-2 rounded-md transition-colors' onClick={deleteSet}>
                        Yes
                    </button>
                    <button className='hover:bg-slate-950 p-2 rounded-md' onClick={() => navigate('/sets')}>No</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSetDialog