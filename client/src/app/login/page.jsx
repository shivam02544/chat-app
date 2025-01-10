"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
import { io } from "socket.io-client";
const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
};

const Page = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    async function handleSubmitLoginForm(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        const res = await fetch(`/api/userData?email=${formObject.username}&password=${formObject.password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'applicatiofn/json',
            },

        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            toast.error(data.message);
            return;
        }
        const token = data.token;
        if (token) {
            localStorage.setItem('token', token);
            let decode = jwt.decode(token)
            localStorage.setItem('username', decode.userName)
            const socket = io("https://chat-app-9yq9.onrender.com/");
            socket.emit("user joined", decode.userName);
            router.push("/")
        } else {
            router.push('Login failed. Please check your credentials.');
            setLoading(false)
            return
        }
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
                    <form onSubmit={(e) => handleSubmitLoginForm(e)}>
                        <motion.label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            Username:
                        </motion.label>
                        <motion.input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mt-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            Password:
                        </motion.label>
                        <motion.input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.input
                            type="submit"
                            value={loading ? "Loading..." : "Login"}
                            disabled={loading}
                            className={`cursor-pointer mt-4 w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white font-bold py-2 rounded hover:bg-blue-600`}
                            whileHover={!loading ? { scale: 1.1 } : {}}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                    </form>
                </motion.div>
                <motion.div
                    className="mt-4 text-center" initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1 }}>
                    <div className='flex flex-col'>
                        <Link href="/signup" className="text-blue-500 hover:text-blue-700">Don't have an account? Sign Up</Link>
                        <Link href="/forgot-password" className="text-blue-500 hover:text-blue-700 mt-2">Forgot Password?</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Page