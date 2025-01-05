"use client"
import React, { use, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import GetUserName from './GetUserName'
const socket = io("http://localhost:5000")
const Chats = () => {
    const [massage, setMassage] = useState("")
    const [massages, setMassages] = useState([])
    const [userName, setUserName] = useState("")
    const messagesEndRef = useRef(null);
    const sendMassage = (e) => {
        e.preventDefault()
        socket.emit("massage", {
            massage,
            userName,
            time: new Date().toLocaleString()
        })
        setMassage("")
    }
    useEffect(() => {
        socket.on("massage", (msg) => {
            setMassages((preMsg) => [...preMsg, msg])
            console.log(msg.userName);
            console.log(userName);


            if (msg.userName != userName) {
                const audio = new Audio("/notification.mp3");
                audio.play();
            }
        })
        return () => {
            socket.off("massage")
        }
    }, [userName])
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [massages]);
    function handleUserNameSubmit(name) {
        setUserName(name);
        // localStorage.setItem('userName', name);
        socket.emit("user joined", {
            userName: "system",
            massage: `${name} has joined.`,
            time: new Date().toLocaleString()
        });
    }
    return (
        <div className='flex flex-col gap-2 bg-slate-100 max-w-[32rem] p-4 rounded-xl border-black border-[4px]'>
            <h1 className=' text-center text-2xl font-extrabold text-gray-800'> Chat Room</h1>
            {
                !userName ? (
                    <GetUserName onNameSubmit={handleUserNameSubmit} />
                ) : (
                    <>
                        <div>
                            {/* Chat */}
                            <div className='h-96 overflow-scroll'>
                                {
                                    massages.map((msg, index) => {
                                        return (
                                            msg.userName != userName ?
                                                <div key={index} className='flex justify-start m-2 '>
                                                    <div className='max-w-[30%] flex flex-col p-2  '>
                                                        <span className='text-sm text-gray-400'>{msg.userName}</span>
                                                        <span className='text-lg font-bold'>{msg.massage}</span>
                                                        <span className='text-xs text-right text-gray-400'>{msg.time}</span>
                                                    </div>
                                                </div>
                                                :
                                                <div key={index} className='flex justify-end m-2 '>
                                                    <div className='max-w-[30%] flex flex-col p-2  '>
                                                        <span className='text-sm text-gray-400'>{msg.userName}</span>
                                                        <span className='text-lg font-bold'>{msg.massage}</span>
                                                        <span className='text-xs text-right text-gray-400'>{msg.time}</span>
                                                    </div>
                                                </div>
                                        )

                                    })
                                }
                                <div ref={messagesEndRef} />

                            </div>
                            <form onSubmit={sendMassage} className='flex gap-2 justify-center '>
                                <input value={massage} onChange={(e) => setMassage(e.target.value)} type="text" className='border-2 border-cyan-500 rounded-lg focus:outline-none focus:border-cyan-600 focus:border-[3px]' />
                                <button type='submit' className='bg-cyan-600 px-6 py-2 rounded-md text-slate-100 text-xl focus:outline-none'>Send</button>
                            </form>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Chats