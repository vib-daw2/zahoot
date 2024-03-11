import React from "react";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className='w-full h-screen flex flex-col justify-center items-center'>
            <p className='text-6xl mb-8 mt-2 font-bold font-zahoot text-white'>
                404
            </p>
            <p className='text-lg text-center text-white mb-2'>
                The page you are looking for does not exist. <br />
                Go back to <a href="/" className='text-cyan-400 hover:underline'>home</a>
            </p>
        </motion.div>
    )
}