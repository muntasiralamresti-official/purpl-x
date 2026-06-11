"use client";

import { MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MessagePopup() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  const chats = [
    { id: 1, name: "Elias Sir", image: "/elias.jpg", message: "Ajke class hobe na...", time: "2m", unread: 2 },
    { id: 2, name: "Ekramul Islam", image: "/ekramul.jpg", message: "Project ta dekho.", time: "10m", unread: 1 },
    { id: 3, name: "Amir Hamza", image: "/amir.jpg", message: "Assalamu Alaikum", time: "1h", unread: 0 },
    { id: 4, name: "Rashed Bro", image: "/rashed.jpg", message: "Chada pai nai Ajke", time: "3h", unread: 4 },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unread, 0);

  return (
    <div className="relative" ref={popupRef}>

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-brand text-white flex items-center justify-center shadow-sm"
      >
        <MessageCircle size={20} className="w-5 h-5 sm:w-6 sm:h-6" />

        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-red-600 text-white text-[10px] xs:text-xs font-bold flex items-center justify-center">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Popup */}
      {open && (
        <div
          className="
            absolute -right-12 sm:right-0 top-12 xs:top-13 sm:top-14 z-50
            w-[calc(100vw-24px)] xs:w-[240px] sm:w-[380px]
            max-w-[380px]
            bg-white rounded-2xl xs:rounded-3xl
            shadow-lg border border-primary/10
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="p-3 xs:p-4 sm:p-5 border-b border-primary/10">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-primary">Chats</h2>
            <div className="mt-3 xs:mt-4 relative">
              <Search
                size={16}
                className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-primary/40"
              />
              <input
                type="text"
                placeholder="Search Messenger"
                className="
                  w-full h-9 xs:h-10 sm:h-11
                  rounded-full bg-gray-100
                  pl-9 xs:pl-11 pr-4
                  text-xs xs:text-sm
                  outline-none
                  focus:ring-2 focus:ring-brand/20
                "
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="max-h-[300px] xs:max-h-[360px] sm:max-h-[420px] overflow-y-auto">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href="/message"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="relative shrink-0">
                  <Image
                    src={chat.image}
                    alt={chat.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary text-sm xs:text-base truncate">
                    {chat.name}
                  </h3>
                  <p className="text-xs xs:text-sm text-primary/60 truncate">
                    {chat.message}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] xs:text-xs text-primary/50 whitespace-nowrap">
                    {chat.time}
                  </span>
                  {chat.unread > 0 && (
                    <span className="mt-1 w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-brand text-white text-[10px] xs:text-xs flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 xs:p-4 border-t border-primary/10">
            <Link
              href="/message"
              onClick={() => setOpen(false)}
              className="block text-center py-2 xs:py-3 rounded-xl xs:rounded-2xl bg-brand text-white text-sm xs:text-base font-medium hover:bg-brand/80 transition-colors"
            >
              View All Messages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}