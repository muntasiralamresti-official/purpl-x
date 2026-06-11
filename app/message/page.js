"use client";

import {CheckCheck, ImageIcon, Info, Mic, Phone, Search, Send, Smile, Video, ArrowLeft} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function MessagePage() {
  const chats = [
    { id: 1, name: "Elias Sir", image: "/elias.jpg" },
    { id: 2, name: "Ekramul Islam", image: "/ekramul.jpg" },
    { id: 3, name: "Amir Hamza", image: "/amir.jpg" },
    { id: 4, name: "Rashed", image: "/rashed.jpg" },
    { id: 5, name: "Tushar", image: "/tushar.jpg" },
  ];

  const [onlineUsers] = useState([1, 3, 4]);
  const [selectedUser, setSelectedUser] = useState(chats[0]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  // Mobile: track which panel is visible
  const [showChat, setShowChat] = useState(false);

  const chatEndRef = useRef(null);

  const autoReplies = {
    Hello: "Hey",
    Hi: "Hii, Muntasir",
    Hey: "Hii, Kemon Aco",
    "How Are you": "Alhamdulillah, Valo",
    "Sir Kalke Ki Class Hobe": "No, Kalke Asar Dorkar Nai",
    "Sir Home Work 3 ta diye den, Please": "Na Dewa Jabe na",
  };

  const [messages, setMessages] = useState([
    { id: 1, sender: "them", text: "Hi" },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    const currentMessage = message;
    setMessage("");
    setTyping(true);

    const randomDelay = Math.floor(Math.random() * 3000) + 1200;

    setTimeout(() => {
      const reply = autoReplies[currentMessage] || "Okay 😎";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "them",
          text: reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setTyping(false);
    }, randomDelay);
  };

  const handleSelectUser = (chat) => {
    setSelectedUser(chat);
    setShowChat(true); // on mobile, switch to chat panel
  };

  return (
    <main className="min-h-screen bg-white p-2 xs:p-3 sm:p-4 md:p-6">
      <div
        className="
          container mx-auto
          h-[calc(100vh-32px)] xs:h-[calc(100vh-48px)] sm:h-[calc(100vh-64px)] md:h-[calc(100vh-110px)]
          rounded-2xl xs:rounded-3xl md:rounded-[32px]
          border border-primary/10
          bg-white
          shadow-xl
          overflow-hidden
          grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]
        "
      >

        {/* ── Sidebar ── */}
        <div
          className={`
            border-r border-primary/10 flex flex-col bg-white
            ${showChat ? "hidden md:flex" : "flex"}
          `}
        >
          {/* Top */}
          <div className="p-3 xs:p-4 sm:p-5">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-3 xs:mb-4 sm:mb-5">
              Messages
            </h1>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-primary/50"
              />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full h-10 xs:h-11 sm:h-12 rounded-xl xs:rounded-2xl bg-white border border-primary/10 pl-9 xs:pl-11 pr-4 text-sm xs:text-base text-primary outline-none placeholder:text-primary/40 focus:border-brand"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto px-2 xs:px-3 pb-4 space-y-1 xs:space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectUser(chat)}
                className={`w-full flex items-center gap-3 xs:gap-4 p-3 xs:p-4 rounded-xl xs:rounded-2xl transition-all ${
                  selectedUser.id === chat.id ? "bg-brand" : "hover:bg-primary/5"
                }`}
              >
                <div className="relative shrink-0">
                  <Image
                    src={chat.image}
                    alt={chat.name}
                    width={56}
                    height={56}
                    className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                  />
                  {onlineUsers.includes(chat.id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 xs:w-4 xs:h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <h2 className="font-semibold text-primary text-sm xs:text-base truncate">
                    {chat.name}
                  </h2>
                  <p className="text-xs xs:text-sm text-primary/60 truncate">
                    Tap to chat 💬
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat Box ── */}
        <div
          className={`
            flex flex-col h-full overflow-hidden
            ${showChat ? "flex" : "hidden md:flex"}
          `}
        >
          {/* Header */}
          <div className="h-16 xs:h-18 sm:h-20 md:h-24 px-3 xs:px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 bg-primary/10 backdrop-blur-xl shrink-0">

            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 min-w-0">
              {/* Back button — mobile only */}
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition shrink-0"
              >
                <ArrowLeft size={18} />
              </button>

              <Image
                src={selectedUser.image}
                alt={selectedUser.name}
                width={60}
                height={60}
                className="rounded-full object-cover w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-primary/80 text-sm xs:text-base sm:text-lg font-semibold truncate">
                  {selectedUser.name}
                </h2>
                <p
                  className={`text-xs xs:text-sm ${
                    onlineUsers.includes(selectedUser.id)
                      ? "text-green-500"
                      : "text-primary/40"
                  }`}
                >
                  {onlineUsers.includes(selectedUser.id) ? "Active now" : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
              {[Phone, Video, Info].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center text-secondary"
                >
                  <Icon size={20} className="w-5 h-5 sm:w-6 sm:h-6"  />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`
                    max-w-[80%] xs:max-w-[75%] sm:max-w-[420px]
                    px-3 xs:px-4 sm:px-5
                    py-2
                    rounded-[20px] xs:rounded-[24px] sm:rounded-[28px]
                    text-sm xs:text-base
                    leading-6 xs:leading-7
                    shadow-lg
                    ${msg.sender === "me" ? "bg-brand text-white" : "bg-secondary text-white"}
                  `}
                >
                  <p>{msg.text}</p>
                </div>

                <div
                  className={`mt-1 px-2 text-[10px] xs:text-[12px] flex items-center gap-1 ${
                    msg.sender === "me" ? "text-primary/50" : "text-primary/30"
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.sender === "me" && <CheckCheck size={10} className="xs:size-3" />}
                </div>
              </div>
            ))}

            {/* Typing */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-secondary px-4 xs:px-5 py-2.5 xs:py-3 rounded-3xl flex items-center gap-1.5 xs:gap-2">
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-white/40 animate-bounce" />
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-white/40 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-white/40 animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-2.5 xs:p-3 sm:p-5 sticky bottom-0 bg-primary/10 backdrop-blur-xl shrink-0">
            <div className="flex gap-1.5 xs:gap-2 sm:gap-3">

              {/* Emoji — hide on smallest */}
              <button className="hidden xs:flex w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 rounded-xl xs:rounded-2xl bg-primary/10 hover:bg-primary/15 items-center justify-center text-primary shrink-0">
                <Smile size={18} className="sm:hidden" />
                <Smile size={22} className="hidden sm:block" />
              </button>

              {/* Image — hide on smallest */}
              <button className="hidden xs:flex w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 rounded-xl xs:rounded-2xl bg-primary/10 hover:bg-primary/15 items-center justify-center text-primary shrink-0">
                <ImageIcon size={18} className="sm:hidden" />
                <ImageIcon size={22} className="hidden sm:block" />
              </button>

              {/* Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder={`Message ${selectedUser.name}...`}
                className="flex-1 h-10 xs:h-11 sm:h-14 rounded-xl xs:rounded-2xl bg-white/5 border border-white/10 px-3 xs:px-4 sm:px-5 text-sm xs:text-base text-primary outline-none placeholder:text-primary/80 focus:border-primary/70"
              />

              {/* Mic */}
              <button className="w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 rounded-xl xs:rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-primary shrink-0">
                <Mic size={18} className="sm:hidden" />
                <Mic size={22} className="hidden sm:block" />
              </button>

              {/* Send */}
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 xs:w-11 xs:h-11 sm:w-14 sm:h-14 rounded-xl xs:rounded-2xl bg-brand flex items-center justify-center text-white hover:opacity-90 transition-all shrink-0"
              >
                <Send size={16} className="sm:hidden" />
                <Send size={22} className="hidden sm:block" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}