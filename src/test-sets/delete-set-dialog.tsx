import { motion } from "framer-motion"
import { Trash2Icon } from "lucide-react"
import React from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

const DeleteSetDialog = ({ id, name, questionNumber }: { id: number, name: string, questionNumber: number }) => {
    const [cookies,] = useCookies(['accessToken'])
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()

    const deleteSet = async () => {
        const res = await fetch((import.meta.env.VITE_API_URL ?? "http://localhost:3000/api") + `/sets/${id}`, {
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
        <>
            <div onClick={() => setOpen(true)} className='relative group/borrar'>
                <div className='absolute top-8 left-0 text-xs w-full justify-center items-center hidden group-hover/borrar:flex'>
                    <div className='text-white'>Delete</div>
                </div>
                <button className='hover:bg-slate-950 p-2 rounded-md'>
                    <Trash2Icon className='w-4 h-4' />
                </button>
            </div>
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
                    <div className=" font-zahoot py-2 border-b border-b-slate-600">{name}</div>
                    <div className='text-white mt-2'>Are you sure you want to delete this question set?</div>
                    <div className='flex justify-end gap-3 mt-4'>
                        <button className='hover:bg-slate-700 border border-slate-700 w-[75px] p-2 rounded-md' onClick={() => navigate('/sets')}>Cancel</button>
                        <button
                            className='bg-red-500 hover:bg-red-600 p-2 w-[75px] rounded-md transition-colors' onClick={deleteSet}>
                            Delete
                        </button>
                    </div>
                </motion.div>
            </motion.div>}
        </>
    )
}

export default DeleteSetDialog