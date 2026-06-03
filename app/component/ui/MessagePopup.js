"use client"

import { MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MessagePopup(){

  const [open, setOpen] = useState(false);

  const popupRef = useRef(null);

  const chats =[
    {
      id: 1,
      name: "Elias Sir",
      image: "/elias.jpg",
      message: "Ajke class hobe na...",
      time: "2m",
      unread: 2,
    },
    {
      id: 2,
      name: "Ekramul Islam",
      image: "/ekramul.jpg",
      message: "Project ta dekho.",
      time: "10m",
      unread: 1,
    },
    {
      id: 3,
      name: "Amir Hamza",
      image: "/amir.jpg",
      message: "Assalamu Alaikum",
      time: "1h",
      unread:0,
    },
    {
      id: 4,
      name: "Rashed Bro",
      image: "/rashed.jpg",
      message: "Chada pai nai Ajke",
      time: "3h",
      unread: 4,
    },
  ];

  useEffect(() => {
  const handleClickOutside = () => {
    console.log("clicked");
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);

  const totalUnread = chats.reduce(
    (sum, chat) => sum + chat.unread, 0
  );


  return (
    <div className="relative" ref={popupRef}>

      {/* icon */}
      <button onClick={() => setOpen(!open)} className="relative w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center shadow-sm">
        <MessageCircle size={22}/>

        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-xs font-bold flex items-center justify-center">{totalUnread}</span>
        )}
      </button>

      {/* POPUP */}

      {open && (
        <div className="absolute right-0 top-14 w-[380px] bg-white rounded-3xl shadow-primary/5 border border-primary/10 overflow-hidden z-50">

          {/* Header */}
          <div className="p-5 border-b border-primary/10">
            <h2 className="text-2xl font-bold text-primary">Chats</h2>
            <div className="mt-4 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"/>
              <input type="text" placeholder="Search Messenger" className="w-full h-11 rounded-full bg-white/80 pl-11 pr-4 text-sm outline-none"/>
            </div>
          </div>

          {/* Chats */}

          <div className="max-h-[420px] overflow-y-auto">
            {chats.map((chat) => (
              <Link key={chat.id} href="/message" onClick={() =>setOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white transition-all">
                <Image src={chat.image} alt={chat.name} width={56} height={56} className="rounded-full object-cover w-14 h-14"/>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{chat.name}</h3>
                  <p className="text-sm text-primary/60 truncate">{chat.message}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-primary/50">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="mt-1 w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center">{chat.unread}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Lower */}
          <div className="p-4 border-t border-primary/10">
          <Link href="/message" onClick={() => setOpen(false)} className="block text-center py-3 rounded-2xl bg-brand text-white font-medium hover:bg-brand/80 transition-all">View All Messages</Link>
          </div>
        </div>
      )}
    </div>
  );
}