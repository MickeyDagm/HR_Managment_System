import React from "react";
import { HelpCircleIcon } from "lucide-react";

export const Help: React.FC = () => {
    return (

       <div>
        <style>
            {`
        .chat-button-text {
            display: none;
            white-space: nowrap;
          }
          .chat-button:hover .chat-button-text {
            display: inline;
            margin-left: 8px;
          }
          .chat-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          .chat-button:hover {
            width: 160px;
            border-radius: 24px;
          }
          `}
        </style>
            <div className="fixed left-12 bottom-4 z-50">
                <button className="chat-button w-48 h-14 px-4 border border-gray-300 rounded-full flex items-center space-x-4 shadow-md hover:shadow-lg hover:bg-[#5ca520] transition duration-200 bg-[#72c02c]">
                        <HelpCircleIcon className="w-6 h-6 text-white" strokeWidth={3} />
                          <span className="chat-button-text text-white font-bold">Help</span>
                </button>
                
            </div>
       </div>
    )
}