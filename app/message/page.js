/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ArrowLeft,
  CheckCheck,
  ImageIcon,
  Info,
  Mic,
  MoreVertical,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  X,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";

/* ── Static chat data ──────────────────────────────────────────────────── */
const CHATS = [
  {
    id: 1,
    name: "Elias Sir",
    image: "/elias.jpg",
    lastMsg: "Ajke class hobe na...",
    time: "2m",
    unread: 2,
    status: "online",
  },
  {
    id: 2,
    name: "Ekramul Islam",
    image: "/ekramul.jpg",
    lastMsg: "Project ta dekho vai",
    time: "10m",
    unread: 1,
    status: "online",
  },
  {
    id: 3,
    name: "Amir Hamza",
    image: "/amir.jpg",
    lastMsg: "Assalamu Alaikum 🙂",
    time: "1h",
    unread: 0,
    status: "offline",
  },
  {
    id: 4,
    name: "Rashed Bro",
    image: "/rashed.jpg",
    lastMsg: "Chada pai nai ajke",
    time: "3h",
    unread: 4,
    status: "online",
  },
  {
    id: 5,
    name: "Tushar",
    image: "/tushar.jpg",
    lastMsg: "Ok, thik ache 👍",
    time: "5h",
    unread: 0,
    status: "offline",
  },
];

/* ── Auto-reply map ────────────────────────────────────────────────────── */
const AUTO_REPLIES = {
  hi: "Hey there! 👋",
  hello: "Hello! How can I help?",
  hey: "Hey! Kemon acho? 😄",
  "how are you": "Alhamdulillah, ভালো আছি! তুমি?",
  "sir kalke ki class hobe": "No, kalke asar dorkar nai 😊",
  "class hobe": "Ha, class hobe — time 10 AM",
  ok: "👍",
  okay: "Sure thing!",
  thanks: "You're welcome! 😊",
  "thank you": "No problem at all! 🙌",
};

/* ── Avatar helper ─────────────────────────────────────────────────────── */
function Avatar({ src, name, size = "md", status }) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };
  const dotMap = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
  };

  return (
    <div className="relative shrink-0">
      <div
        className={`${sizeMap[size]} rounded-full overflow-hidden bg-gradient-to-br from-brand to-secondary flex items-center justify-center shrink-0`}
      >
        <Image
          src={src}
          alt={name}
          width={56}
          height={56}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${dotMap[size]} rounded-full border-2 border-white ${
            status === "online" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      )}
    </div>
  );
}

/* ── Typing indicator ──────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-secondary/30 flex items-center justify-center shrink-0">
        <span className="text-[10px] text-white">•</span>
      </div>
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

/* ── Message bubble ────────────────────────────────────────────────────── */
function MessageBubble({ msg, isMe }) {
  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/60 to-secondary/30 shrink-0 flex items-center justify-center">
          <span className="text-[9px] text-white font-bold">U</span>
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[72%] sm:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`
            px-4 py-2.5 text-sm leading-relaxed
            ${
              isMe
                ? "bg-gradient-to-br from-brand to-blue-600 text-white rounded-2xl rounded-br-md shadow-md shadow-brand/20"
                : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
            }
          `}
        >
          {msg.text}
        </div>

        <div className={`flex items-center gap-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-400">{msg.time}</span>
          {isMe && <CheckCheck size={11} className="text-brand/60" />}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function MessagePage() {
  const { user } = useAuth();

  /* ── State ── */
  const [chats] = useState(CHATS);
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);
  const [messages, setMessages] = useState({
    1: [{ id: 1, sender: "them", text: "Hi! Kemon acho? 😊", time: "09:00 AM" }],
    2: [{ id: 1, sender: "them", text: "Project ta dekho vai", time: "09:10 AM" }],
    3: [{ id: 1, sender: "them", text: "Assalamu Alaikum 🙂", time: "10:00 AM" }],
    4: [{ id: 1, sender: "them", text: "Chada pai nai ajke 😭", time: "11:00 AM" }],
    5: [{ id: 1, sender: "them", text: "Ok, thik ache 👍", time: "01:00 PM" }],
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false); // mobile nav
  const [showInfo, setShowInfo] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ── Scroll to bottom ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, selectedChat]);

  /* ── Focus input on chat select ── */
  useEffect(() => {
    if (showChat) inputRef.current?.focus();
  }, [showChat, selectedChat]);

  /* ── Filter chats ── */
  const filteredChats = searchQuery
    ? chats.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  /* ── Current conversation messages ── */
  const currentMessages = messages[selectedChat.id] || [];

  /* ── Send message ── */
  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), sender: "me", text, time: now };

    setMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg],
    }));
    setInput("");
    setTyping(true);

    const delay = Math.random() * 2000 + 800;
    setTimeout(() => {
      const key = text.toLowerCase();
      const reply =
        AUTO_REPLIES[key] ||
        Object.entries(AUTO_REPLIES).find(([k]) => key.includes(k))?.[1] ||
        "Okay 😎";

      const replyMsg = {
        id: Date.now() + 1,
        sender: "them",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), replyMsg],
      }));
      setTyping(false);
    }, delay);
  }

  /* ── Select chat ── */
  function handleSelectChat(chat) {
    setSelectedChat(chat);
    setShowChat(true);
    setShowInfo(false);
  }

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <main className="h-[calc(100vh-80px)] bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">

        {/* ──────────────────── LEFT SIDEBAR ──────────────────── */}
        <aside
          className={`
            w-full sm:w-[320px] lg:w-[360px] flex-shrink-0
            bg-white border-r border-gray-100
            flex flex-col
            ${showChat ? "hidden sm:flex" : "flex"}
          `}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <button className="w-9 h-9 rounded-full bg-brand/10 hover:bg-brand/20 flex items-center justify-center text-brand transition-all">
                <Plus size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-xl bg-gray-100 pl-9 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-brand/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
                <Search size={24} className="opacity-30" />
                No conversations found
              </div>
            )}

            {filteredChats.map((chat) => {
              const isActive = selectedChat.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all relative group ${
                    isActive
                      ? "bg-brand/8 border-r-2 border-brand"
                      : "hover:bg-gray-50 border-r-2 border-transparent"
                  }`}
                >
                  <Avatar src={chat.image} name={chat.name} size="lg" status={chat.status} />

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`font-semibold text-sm truncate ${isActive ? "text-brand" : "text-gray-800"}`}>
                        {chat.name}
                      </h3>
                      <span className="text-[11px] text-gray-400 shrink-0 ml-2">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate">{chat.lastMsg}</p>
                      {chat.unread > 0 && (
                        <span className="ml-2 shrink-0 min-w-[18px] h-[18px] rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center px-1">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ──────────────────── CHAT PANEL ──────────────────── */}
        <div
          className={`
            flex-1 flex overflow-hidden
            ${showChat ? "flex" : "hidden sm:flex"}
          `}
        >
          {/* Main chat column */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">

            {/* ── Chat Header ── */}
            <div className="h-[64px] px-4 flex items-center justify-between border-b border-gray-100 bg-white shadow-sm shrink-0 z-10">
              <div className="flex items-center gap-3">
                {/* Back — mobile */}
                <button
                  onClick={() => setShowChat(false)}
                  className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition text-gray-600 shrink-0"
                >
                  <ArrowLeft size={18} />
                </button>

                <Avatar
                  src={selectedChat.image}
                  name={selectedChat.name}
                  size="lg"
                  status={selectedChat.status}
                />

                <div>
                  <h2 className="font-semibold text-gray-900 text-sm leading-tight">
                    {selectedChat.name}
                  </h2>
                  <p className={`text-xs ${selectedChat.status === "online" ? "text-green-500" : "text-gray-400"}`}>
                    {selectedChat.status === "online" ? "Active now" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all">
                  <Phone size={17} />
                </button>
                <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all">
                  <Video size={17} />
                </button>
                <button
                  onClick={() => setShowInfo((p) => !p)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    showInfo ? "bg-brand/10 text-brand" : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <Info size={17} />
                </button>
                <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all">
                  <MoreVertical size={17} />
                </button>
              </div>
            </div>

            {/* ── Messages Area ── */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-gray-50/50">
              {/* Date divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 font-medium px-2">Today</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {currentMessages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isMe={msg.sender === "me"} />
              ))}

              {typing && <TypingIndicator />}

              <div ref={chatEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                {/* Attach */}
                <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-all shrink-0">
                  <ImageIcon size={17} />
                </button>

                {/* Input box */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Message ${selectedChat.name}...`}
                    className="w-full h-10 rounded-full bg-gray-100 px-4 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                    <Smile size={16} />
                  </button>
                </div>

                {/* Mic / Send toggle */}
                {input.trim() ? (
                  <button
                    onClick={handleSend}
                    className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white hover:bg-brand/80 transition-all shadow-md shadow-brand/30 shrink-0"
                  >
                    <Send size={16} />
                  </button>
                ) : (
                  <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-all shrink-0">
                    <Mic size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ──────────── Info Panel (collapsible) ──────────── */}
          {showInfo && (
            <aside className="hidden lg:flex w-[280px] flex-col bg-white border-l border-gray-100 overflow-y-auto">
              {/* Profile section */}
              <div className="flex flex-col items-center px-6 pt-8 pb-6 border-b border-gray-100">
                <Avatar
                  src={selectedChat.image}
                  name={selectedChat.name}
                  size="xl"
                  status={selectedChat.status}
                />
                <h3 className="mt-3 font-bold text-gray-900 text-base">{selectedChat.name}</h3>
                <p className={`text-xs mt-0.5 ${selectedChat.status === "online" ? "text-green-500" : "text-gray-400"}`}>
                  {selectedChat.status === "online" ? "Active now" : "Offline"}
                </p>

                {/* Quick actions */}
                <div className="flex gap-3 mt-5">
                  {[
                    { icon: Phone, label: "Call" },
                    { icon: Video, label: "Video" },
                    { icon: Mic, label: "Mute" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-11 h-11 rounded-full bg-brand/10 hover:bg-brand/20 flex items-center justify-center text-brand transition-all">
                        <Icon size={17} />
                      </div>
                      <span className="text-[11px] text-gray-500">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat info */}
              <div className="px-5 py-5 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Chat Info
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "Nickname", value: selectedChat.name.split(" ")[0] },
                      { label: "Members", value: "2 people" },
                      { label: "Created", value: "Jan 2024" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-gray-500">{label}</span>
                        <span className="text-xs font-medium text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared media placeholder */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Shared Media
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                      >
                        <ImageIcon size={14} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Options
                  </h4>
                  <div className="space-y-1">
                    {["Block User", "Delete Conversation", "Report"].map((opt) => (
                      <button
                        key={opt}
                        className="w-full text-left py-2 px-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
