import React, { useState } from "react";
import { X, Send, MessageCircleMore } from "lucide-react"; 
import { useAuth } from "../contexts/AuthContext";

const Messeging: React.FC = () => {
    const { user } = useAuth();
    const [showMessaging, setShowMessaging] = useState(false);

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowMessaging(!showMessaging)}
                    className="w-48 h-14 px-4  border border-gray-300 rounded-full flex items-center space-x-4 shadow-md hover:shadow-lg hover:bg-[#5ca520] transition duration-200 bg-[#72c02c]"
                >
                     <div className="relative">
                        <MessageCircleMore className="w-6 h-6 text-white" strokeWidth={3} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                            2
                        </span>
                    </div>
                    <span className="text-white font-bold">Messaging...</span>
                </button>
            </div>

            {/* Chat Popup */}
            {showMessaging && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b ">
                        <span className="font-semibold text-gray-700">Messages</span>
                        <button onClick={() => setShowMessaging(false)}>
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-4 overflow-y-auto text-gray-600 text-sm bg-gray-100">
                        <p>No messages yet.</p>
                        {/* You can add actual chat threads here later */}
                    </div>

                    {/* Footer (optional) */}
                    <div className="p-2 border-t ">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Send a message..."
                                className="w-full pr-10 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring focus:border-[#72c02c]"
                            />
                            <button className="absolute inset-y-0 right-2 flex items-center text-[#72c02c] hover:text-[#5ca520]">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Messeging;


