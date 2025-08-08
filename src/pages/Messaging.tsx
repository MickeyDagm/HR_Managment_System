import React, { useState, useCallback, useEffect } from "react";
import { X, Send, MessageCircleMore, ArrowLeft } from "lucide-react"; 
import { useAuth } from "../contexts/AuthContext";
import { mockMessages, mockEmployees, mockDepartment } from "../data/mockData";
import { Message, User } from "../types";

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedDept, setSelectedDept] = useState(mockDepartment[0]?.name || '');

  // Mark messages as read when a user's chat is opened
  useEffect(() => {
    if (selectedUserId) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.receiverId === user?.id && msg.senderId === selectedUserId && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  }, [selectedUserId, user?.id]);

  const handleDeptSelect = useCallback((deptName: string) => {
    setSelectedDept(deptName);
    setSelectedUserId(null); // Reset selected user when changing department
  }, []);

  const getChatUsers = () => {
    const selectedDeptId = mockDepartment.find(dept => dept.name === selectedDept)?.id || '';
    return mockEmployees.filter(u => u.department === selectedDeptId && u.id !== user?.id); 
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const newMsg: Message = {
      id: `${messages.length + 1}`,
      senderId: user?.id || "",
      receiverId: selectedUserId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const getUserById = (id: string): User | undefined => {
    return mockEmployees.find(u => u.id === id);
  };

  const getLastMessage = (otherUserId: string) => {
    const userMessages = messages
      .filter(msg => 
        (msg.senderId === user?.id && msg.receiverId === otherUserId) || 
        (msg.senderId === otherUserId && msg.receiverId === user?.id)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return userMessages[0]?.content || "";
  };

  const getUnreadCountForUser = (otherUserId: string) => {
    return messages.filter(
      msg => msg.receiverId === user?.id && msg.senderId === otherUserId && !msg.read
    ).length;
  };

  const getUnreadCountForDept = (deptId: string) => {
    const deptUsers = mockEmployees.filter(u => u.department === deptId && u.id !== user?.id);
    return deptUsers.reduce((count, u) => 
      count + messages.filter(
        msg => msg.receiverId === user?.id && msg.senderId === u.id && !msg.read
      ).length, 0);
  };

  const getTotalUnreadCount = () => {
    return messages.filter(msg => msg.receiverId === user?.id && !msg.read).length;
  };

  const getUniqueSendersCount = () => {
    const uniqueSenders = new Set(
      messages
        .filter(msg => msg.receiverId === user?.id && !msg.read)
        .map(msg => msg.senderId)
    );
    return uniqueSenders.size;
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
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
          .dept-list {
            display: flex;
            overflow-x: auto;
            white-space: nowrap;
          }
          .dept-item {
            flex: 0 0 auto;
            min-width: 100px;
            position: relative;
          }
          @media (min-width: 641px) {
            .dept-list {
              display: flex;
              overflow-x: ${mockDepartment.length > 4 ? 'auto' : 'hidden'};
              white-space: nowrap;
            }
            .dept-item {
              flex: 1;
              min-width: ${mockDepartment.length > 4 ? '120px' : 'auto'};
            }
          }
        `}
      </style>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowMessaging(!showMessaging)}
          className="chat-button w-48 h-14 px-4 border border-gray-300 rounded-full flex items-center space-x-4 shadow-md hover:shadow-lg hover:bg-[#5ca520] transition duration-200 bg-[#72c02c]"
        >
          <div className="relative">
            <MessageCircleMore className="w-6 h-6 text-white" strokeWidth={3} />
            {getTotalUnreadCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                {getUniqueSendersCount()}
              </span>
            )}
          </div>
          <span className="chat-button-text text-white font-bold">Messaging...</span>
        </button>
      </div>

      {/* Chat Popup */}
      {showMessaging && (
        <div className="fixed bottom-20 right-4 w-[600px] h-[500px] bg-white border border-gray-300 rounded-xl shadow-lg z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
            <span className="font-semibold text-gray-700">Messages ({getUniqueSendersCount()} unread)</span>
            <button onClick={() => setShowMessaging(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chat List (Left Side, Hidden when a user is selected) */}
            {!selectedUserId && (
              <div className="w-full bg-gray-50 overflow-y-auto hide-scrollbar">
                {/* Department Tabs */}
                <div className="dept-list flex justify-between shadow-md sticky top-0 z-10 bg-gray-50">
                  {mockDepartment.map((dept) => (
                    <li 
                      key={dept.id}
                      className={`dept-item list-none relative px-auto py-3 cursor-pointer w-full flex align-center justify-center ${selectedDept === dept.name ? 'text-[#72c02c] bg-[#def8ca]' : 'text-gray-600 hover:text-[#72c02c]'}`}
                      onClick={() => handleDeptSelect(dept.name)}
                    >
                      <div className="flex items-center">
                        {dept.name}
                        {getUnreadCountForDept(dept.id) > 0 && (
                          <span className="ml-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                            {getUnreadCountForDept(dept.id)}
                          </span>
                        )}
                      </div>
                      {selectedDept === dept.name && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#72c02c]"></div>
                      )}
                    </li>
                  ))}
                </div>

                {/* User List */}
                {getChatUsers().length > 0 ? (
                  getChatUsers().map((chatUser) => {
                    const lastMessage = getLastMessage(chatUser.id);
                    const lastMessageTimestamp = lastMessage
                      ? messages.find(msg => msg.content === lastMessage)?.timestamp
                      : null;
                    const unreadCount = getUnreadCountForUser(chatUser.id);

                    return (
                      <div
                        key={chatUser.id}
                        className="flex items-center p-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 transition duration-150 hide-scrollbar"
                        onClick={() => setSelectedUserId(chatUser.id)}
                      >
                        <div className="relative w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
                          {chatUser.avatar ? (
                            <img src={chatUser.avatar} alt={chatUser.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            chatUser.name[0]
                          )}
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium text-gray-800">{chatUser.name}</div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">
                                {lastMessageTimestamp
                                  ? new Date(lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500 truncate">
                            {lastMessage || "Start conversation"}
                            {unreadCount > 0 && (
                                <div className="text-xs text-white bg-red-500 rounded-full px-2 py-1 mt-1 inline-flex items-center justify-center">
                                  {unreadCount} 
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-gray-600 text-sm">No employees in this department.</div>
                )}
              </div>
            )}

            {/* Chat Messages (Full Width when a user is selected) */}
            {selectedUserId && (
              <div className="flex-1 flex flex-col">
                {/* Chat Header with Back Arrow */}
                <div className="flex items-center p-3 border-b bg-gray-50">
                  <button onClick={() => setSelectedUserId(null)} className="mr-2">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
                    {getUserById(selectedUserId)?.avatar ? (
                      <img src={getUserById(selectedUserId)?.avatar} alt={getUserById(selectedUserId)?.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getUserById(selectedUserId)?.name[0]
                    )}
                  </div>
                  <span className="ml-2 font-semibold text-gray-700">{getUserById(selectedUserId)?.name}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-100 hide-scrollbar">
                  {messages
                    .filter(msg => 
                      (msg.senderId === user?.id && msg.receiverId === selectedUserId) || 
                      (msg.senderId === selectedUserId && msg.receiverId === user?.id)
                    )
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-2`}
                      >
                        <div
                          className={`max-w-[70%] p-2 rounded-lg ${
                            msg.senderId === user?.id
                              ? 'bg-[#72c02c] text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          {msg.content}
                          <div className="text-xs mt-1 opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-2 border-t bg-white">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Send a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full pr-10 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring focus:border-[#72c02c]"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="absolute inset-y-0 right-2 flex items-center text-[#72c02c] hover:text-[#5ca520]"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Messaging;