"use client"
import React, { useState } from 'react'

const GetUserName = ({ onNameSubmit }) => {
    const [userName, setUserName] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
        onNameSubmit(userName);
        setUserName("");
    }

    return (
        <div className='flex flex-col items-center'>
            <form onSubmit={handleSubmit} className="bg-slate-100 p-4 rounded-xl border-black border-[4px] m-4">
                <input
                    type="text"
                    placeholder="Enter your name"
                    className="border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 focus:border-[3px] p-2"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-cyan-600 px-6 py-2 rounded-md text-slate-100 text-xl focus:outline-none"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default GetUserName