"use client"
import React from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';

const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
};

const Page = () => {
    async function handleSubmitForgotPassForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        console.log(formObject);
        e.target.reset();

    }
    return (
        <div className="flex items-center justify-center min-h-screen  bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-4 text-center">Login Here</h1>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ duration: 0.1 }}
                >
                    <form onSubmit={(e) => handleSubmitForgotPassForm(e)}>
                        <motion.label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            Email:
                        </motion.label>
                        <motion.input
                            type="text"
                            id="email"
                            name="email"
                            required
                            className="cursor-pointer mt-1 block w-full border border-gray-300 rounded-md p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                        />

                        <motion.input
                            type="submit"
                            value="Login"
                            className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                    </form>
                </motion.div>
                <motion.div
                    className="mt-4 text-center" initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1 }}>
                    <Link href="/login" className="text-blue-500 hover:text-blue-700">Remembered? Login</Link>
                </motion.div>
            </div>
        </div>
    )
}

export default Page