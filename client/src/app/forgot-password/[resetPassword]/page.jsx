"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { verifyToken } from '@/helper/jwtToken';
import { useParams, useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter()
    const params = useParams()
    const [email, setEmail] = useState("")
    useEffect(() => {
        async function get() {
            if (!params || !params.resetPassword) return;
            const result = await verifyToken(params.resetPassword)
            if (!result.isValid) {
                router.push('/login')
            } else
                setEmail(result.data.data)
        }
        get()

    }, [])
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        const res = await fetch(`/api/resetPassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: newPassword }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            toast.error(data.message);
            return;
        }
        toast.success(data.message);
        router.push('/login');
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password </h2>
                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} transition={{ duration: 0.1 }}>
                    <form onSubmit={handleSubmit}>
                        <motion.input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-4 block w-full border border-gray-300 rounded-md p-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1 }}
                        />
                        <motion.button
                            type="submit"
                            className={`mt-4 w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white font-bold py-2 rounded hover:bg-blue-600`}
                            whileHover={{ scale: loading ? 1 : 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Reset Password'}
                        </motion.button>
                    </form>
                </motion.div>
                <motion.div className="mt-4 text-center" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }}>
                    <Link href="/login" className="text-blue-500 hover:text-blue-700">Already have an account? Login</Link>
                </motion.div>
            </div>
        </div>
    );
};

export default page;