"use client"
import React from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
};

const Page = () => {
    const [loading, setLoading] = React.useState(false);

    async function sendOtp(email) {
        const res = await fetch(`/api/emailSender?email=${email}&type=signup`)
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message);
            return false
        } else {
            toast.success(data.message);
            return data.otp
        }
    }



    async function handleSubmitSignupForm(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        const otpRes = await sendOtp(formObject.email)
        if (!otpRes) {
            setLoading(false);
            return
        }
        const otp = prompt("Enter your otp here.")
        if (otp != otpRes) {
            toast.error("Invalid otp")
            setLoading(false);
            return
        }
        const res = await fetch('api/userData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        })
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            toast.error(data.message)
            return
        }
        toast.success(data.message)



        e.target.reset();

    }
    return (
        <div className="flex items-center justify-center min-h-screen  bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-4 text-center">Sign Up Here</h1>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    transition={{ duration: 0.1 }}
                >
                    <form onSubmit={(e) => handleSubmitSignupForm(e)}>
                        <motion.label
                            htmlFor="fullname"
                            className="block text-sm font-medium text-gray-700"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            Full Name:
                        </motion.label>
                        <motion.input
                            type="text"
                            id="fullname"
                            name="fullname"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                        />


                        <motion.label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mt-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            Email:
                        </motion.label>
                        <motion.input
                            type="email"
                            id="email"
                            name="email"
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
                            value={loading ? "Loading..." : "Sign Up"}
                            className={`cursor-pointer mt-4 w-full ${loading ? 'bg-gray-400 cursor-wait' : 'bg-blue-500'} text-white font-bold py-2 rounded hover:bg-blue-600`}
                            whileHover={!loading ? { scale: 1.1 } : {}}
                            disabled={loading}
                        />
                    </form>
                </motion.div>
                <motion.div
                    className="mt-4 text-center" initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.1 }}>
                    <Link href="/login" className="text-blue-500 hover:text-blue-700">Already registered? Login here</Link>
                </motion.div>
            </div>
        </div>
    )
}

export default Page