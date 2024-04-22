import React from 'react'
import { motion } from "framer-motion"


type Props = {}

export default function FileUpload({ }: Props) {
    const [headerFile, setHeaderFile] = React.useState<File | null>(null)
    return (
        <>
            <input name='head-img' id='head-img' type="file" className='hidden' onChange={e => setHeaderFile(e.currentTarget.files ? e.currentTarget.files[0] : null)} />
            {headerFile
                ? <ImageDisplay file={headerFile} />
                : <label htmlFor="head-img" className='w-full border border-black mt-2 mb-6 p-4 flex justify-center items-center'>Press or drop to add a header image</label>
            }
        </>
    )
}

function ImageDisplay({ file }: { file: File }) {
    const [isDraggable, setIsDraggable] = React.useState(false)
    const imgRef = React.useRef<HTMLImageElement>(null)
    return (
        <div className='w-full h-full relative max-h-48'>
            <motion.img
                ref={imgRef}
                src={URL.createObjectURL(file)}
                drag
                dragSnapToOrigin
                draggable={isDraggable}
                onDragStart={(e) => e.preventDefault()}
                onDragEnd={(e, info) => {
                    const parent = imgRef.current?.parentElement?.getBoundingClientRect()
                    if (imgRef.current && parent) {
                        const maxX = parent.width
                        const maxY = parent.height
                        const minX = 0
                        const minY = 0

                        const x = info.offset.x
                        const y = info.offset.y

                        const newX = x > maxX ? maxX : x < minX ? minX : x
                        const newY = y > maxY ? maxY : y < minY ? minY : y

                        imgRef.current.classList.remove('object-left-top')
                        imgRef.current.style.objectPosition = `${newX}px ${newY}px`
                    }
                }}
                alt=""
                className='object-cover max-h-48 w-full object-left-top'
            />
            <div className='absolute top-2 right-2 flex flex-row items-start'>
                <button
                    onClick={() => setIsDraggable(v => !v)}
                    className='text-xs bg-slate-200 px-2 py-1 rounded-l-lg border border-gray-400 drop-shadow-lg hover:bg-slate-300 active:scale-95'
                >
                    Reposition
                </button>
                <button
                    onClick={() => setIsDraggable(v => !v)}
                    className='text-xs bg-red-600 px-2 text-white py-1 rounded-r-lg border border-gray-400 border-l-0 drop-shadow-lg hover:bg-red-500 active:scale-95'
                >
                    Delete
                </button>
            </div>
        </div>
    )
}