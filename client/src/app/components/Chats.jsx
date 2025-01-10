"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Chats = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState("");
    const messagesEndRef = useRef(null);
    const socket = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setUserName(localStorage.getItem("username"))
    }, [])

    useEffect(() => {
        socket.current = io("https://chat-app-9yq9.onrender.com/");
        socket.current.on("message", (msg) => {
            console.log(msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
            // if (msg.userName != userName) {
            //     const audio = new Audio("/notification.mp3");
            //     audio.play();
            // }
        });
        socket.current.on("typing", (userName) => {
            console.log(`${userName} is typing...`);
        });
        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = (e) => {
        console.log(userName);

        e.preventDefault();
        if (message.trim()) {
            socket.current.emit("message", {
                message,
                userName,
                time: new Date().toLocaleString(),
            });
            setMessage("");
        }
    };

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            socket.current.emit("typing", userName);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "DELETE",

            });
            if (!res.ok) {
                toast.error("Somthing went wrong")
                return
            }

            localStorage.removeItem("username");
            socket.current.disconnect(userName);
            setUserName("");
            toast.success("User loged out sucessfully...")
        } catch (error) {
            toast.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen max-h-screen bg-gray-100">
            <div className="w-full bg-white shadow-md p-4 rounded-lg">
                <h1 className="text-center text-2xl font-bold text-gray-800">Chat Room</h1>
                <button
                    onClick={handleLogout}
                    className="mt-2 bg-red-500 px-4 py-2 rounded-md text-white text-lg focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Logout
                </button>
            </div>
            <div className="flex flex-col gap-2 bg-white max-w-[90%] md:max-w-[32rem] p-4 rounded-xl border border-gray-300 shadow-lg h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence>
                        {messages.map((msg, index) => {
                            const isSentByUser = msg.userName === userName;
                            return (
                                <motion.div
                                    key={index}
                                    className={`max-w-[100%] flex ${isSentByUser ? "justify-end" : "justify-start"} m-2`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className={`max-w-[90%] flex flex-col p-2 rounded-lg ${isSentByUser
                                            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                                            : "bg-gradient-to-l from-gray-200 to-gray-300 text-black"
                                            }`}
                                    >
                                        <span className="text-sm font-semibold text-gray-400">{msg.userName}</span>
                                        <span className="text-lg break-words">{msg.message}</span>
                                        <span className="text-xs text-right text-gray-400">{msg.time}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="flex gap-2 justify-center mt-2">
                    <input
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            handleTyping();
                        }}
                        type="text"
                        className="border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:border-[3px] p-2 flex-grow"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 px-4 py-2 rounded-md text-white text-lg focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chats;
