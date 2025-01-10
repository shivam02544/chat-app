"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getToken } from '@/helper/jwtToken';

const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
};


const Page = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    async function handleSubmitForgotPassForm(e) {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        const res = await fetch(`/api/emailSender?email=${formObject.email}&type=forgot-password`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message);
            setLoading(false)
            return;
        }
        const otp = prompt("Enter the OTP sent to your email:");
        if (otp === data.otp) {
            toast.success("OTP verified successfully. Please proceed to reset your password.");
            setLoading(false)
            const token = await getToken(formObject.email);
            router.push(`/forgot-password/${token}`)

        } else {
            toast.error("Invalid OTP. Please try again.");
            setLoading(false)
        }
        setLoading(false)
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
                            disabled={loading}
                            value={loading ? "Loading..." : "Login"}
                            className={`mt-4 w-full ${loading ? 'bg-gray-400 cursor-wait' : 'bg-blue-500'} text-white  font-bold py-2 rounded hover:bg-blue-600`}
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