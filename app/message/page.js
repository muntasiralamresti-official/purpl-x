"use client";

import { CheckCheck, ImageIcon, Info, Mic, Phone, Search, Send, Smile, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function MessagePage() {
  // User
  const chats = [
    {
      id: 1,
      name: "Elias Sir",
      image: "/elias.jpg",
    },

    {
      id: 2,
      name: "Ekramul Islam",
      image: "/ekramul.jpg",
    },

    {
      id: 3,
      name: "Amir Hamza",
      image: "/amir.jpg",
    },

    {
      id: 4,
      name: "Rashed",
      image: "/rashed.jpg",
    },

    {
      id: 5,
      name: "Tushar",
      image: "/tushar.jpg",
    },
  ];

  // ONLINE USER
  const [onlineUsers] = useState([1, 3, 4]);

  // ACTIVE CHAT
  const [selectedUser, setSelectedUser] = useState(chats[0]);

  // MESSAGE
  const [message, setMessage] = useState("");

  // TYPING
  const [typing, setTyping] = useState(false);

  // CHAT END REF
  const chatEndRef = useRef(null);

  // AUTO REPLIES
  const autoReplies = {
    Hello: "Hey",
    Hi: "Hii, Muntasir",
    Hey: "Hii, Kemon Aco",
    "How Are you": "Alhamdulillah, Valo",
    "Sir Kalke Ki Class Hobe": "No, Kalke Asar Dorkar Nai",
    "Sir Home Work 3 ta diye den, Please": "Na Dewa Jabe na",
  };

  // CHAT MESSAGES
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "them",
      text: "Hi",
    },
  ]);

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  // SEND MESSAGE
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

    /* STORE CURRENT MESSAGE */
    const currentMessage = message;

    setMessage("");

    // TYPING
    setTyping(true);

    // RANDOM DELAY
    const randomDelay = Math.floor(Math.random() * 3000) + 1200;

    setTimeout(() => {
      /* FIND REPLY */
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

  return (
    <main className="min-h-screen bg-primary p-6">
      <div className="container mx-auto h-[calc(100vh-110px)] rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl overflow-hidden grid grid-cols-[350px_1fr]">
        {/* Sidebar */}
        <div className="border-r border-white/20 flex flex-col">
          {/* TOP */}
          <div className="p-5">
            <h1 className="text-3xl font-bold text-white mb-5"> Messages </h1>

            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 "
              />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full h-10 rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 text-white outline-none placeholder:text-white/40"
              />
            </div>
          </div>

          {/* USER LIST */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedUser(chat)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  selectedUser.id === chat.id
                    ? `bg-brand border border-brand/40`
                    : `hover:bg-white/5`
                }`}
              >
                {/*     image */}
                <div className="relative">
                  <Image
                    src={chat.image}
                    alt={chat.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {onlineUsers.includes(chat.id) && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-primary" />
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 text-left">
                  <h2 className="font-semibold text-white ">{chat.name}</h2>
                  <p className="text-sm text-white/60 "> Tap to chat 💬</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Box */}

        <div className="flex flex-col h-full overflow-hidden">

          {/* Header */}

          <div className="h-24 border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20 bg-primary/90 backdrop-blur-xl shrink-0">

           {/* User */}

            <div className="flex items-center gap-4">
              <Image src={selectedUser.image} alt={selectedUser.name} width={60} height={60} className="rounded-full object-cover w-14 h-14"/>
              <div>
                <h2 className="text-white text-lg font-semibold">{selectedUser.name}</h2>
                <p className={`text-sm ${ onlineUsers.includes(selectedUser.id) ? "text-green-500" : "text-white/40"}`}>
                  {onlineUsers.includes(selectedUser.id) ? "Active now" : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {[Phone, Video , Info].map((Icon, i) =>(
                <button key={i} className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">

  {messages.map((msg) => (

    <div
      key={msg.id}
      className={`
        flex flex-col
        ${
          msg.sender === "me"
            ? "items-end"
            : "items-start"
        }
      `}
    >

      {/* MESSAGE BUBBLE */}
      <div
        className={` max-w-[420px] px-5 py-2 rounded-[28px] text-smleading-7 shadow-lg

          ${
            msg.sender === "me"
              ? "bg-brand text-white"
              : "bg-secondary border border-white/10 text-white"
          }
        `}
      >

        <p>{msg.text}</p>

      </div>

      {/* TIME BELOW */}
      <div
        className={` mt-1 px-2 text-[12px] flex items-center gap-1

          ${
            msg.sender === "me"
              ? "text-white/50"
              : "text-white/30"
          }
        `}
      >

        <span>{msg.time}</span>

        {msg.sender === "me" && (
          <CheckCheck size={12}/>
        )}

      </div>
    </div>
  ))}

  {/* TYPING */}
  {typing && (

    <div className="flex justify-start">

      <div
        className=" bg-secondary border border-white/10 px-5 py-3 rounded-3xl flex items-center gap-2 "
      >

        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce"/>

        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-100"/>

        <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-200"/>

      </div>
    </div>
  )}

  <div ref={chatEndRef}/>
</div>

          {/* INPUT */}

          <div className="p-5 border-t border-white/10 sticky bottom-0 bg-primary/90 backdrop-blur-xl shrink-0">
            <div className="flex gap-3">
              {/* EMOJI */}
              <button className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white">
                <Smile size={22}/>
              </button>

              {/* IMAGE */}
              <button className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white">
                <ImageIcon size={22}/>
              </button>

              {/* INPUT */}

              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") { handleSendMessage();}}}
              placeholder={`Message ${selectedUser.name}...`} className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 px-5 text-white outline-none placeholder:text-white/80 focus:border-secondary/70"
              />

              {/* MIC */}
              
              <button className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white">
                <Mic size={22}/>
              </button>

              {/* SEND */}

              <button onClick={handleSendMessage} className="w-14 h-14 rounded-2xl bg-brand hover:bg-white/10 flex items-center justify-center text-white hover:opacity-90 transition-all">
                <Send size={22}/>
              </button>
              
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
