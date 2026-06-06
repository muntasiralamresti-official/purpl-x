"use client";

import {AtSign, Bell, BellOff, Check, CheckCheck,Gift, ImageIcon, MessageCircle, MoreHorizontal, Repeat2, Search, ThumbsUp, Trash2, UserPlus, Video, X,} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { get } from "../lib/apiClient";
import Sidebar from "../component/Sidebar";

const TYPES = [
  { type: "like", icon: ThumbsUp, bg: "bg-brand/20", color: "text-brand", label: "liked your post" },
  { type: "comment", icon: MessageCircle, bg: "bg-green-100", color: "text-green-600", label: "commented on your post" },
  { type: "follow", icon: UserPlus, bg: "bg-secondary/20", color: "text-secondary", label: "started following you" },
  { type: "repost", icon: Repeat2, bg: "bg-orange-100", color: "text-orange-500", label: "shared your post" },
  { type: "mention", icon: AtSign, bg: "bg-pink-100", color: "text-pink-600", label: "mentioned you in a post" },
  { type: "birthday", icon: Gift, bg: "bg-yellow-100", color: "text-yellow-600", label: "has a birthday today 🎂" },
  { type: "video", icon: Video, bg: "bg-indigo-100", color: "text-indigo-600", label: "tagged you in a Video" },
  { type: "photo", icon: ImageIcon, bg: "bg-teal-100", color: "text-teal-600", label: "tagged you in a photo" },
];

const FILTERS = ["ALL", "Unread", "Likes", "Comments", "Follows", "Mentions"];

function timeAgo(ms) {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function groupByTime(notification) {
  const groups = { New: [], "Earlier today": [], "This week": [], Older: [] };
  const now = Date.now();
  notification.forEach((n) => {
    const diff = now - n.time;
    const h = diff / 3600000;
    const d = diff / 86400000;
    if (h < 3) groups["New"].push(n);
    else if (h < 24) groups["Earlier today"].push(n);
    else if (d < 7) groups["This week"].push(n);
    else groups["Older"].push(n);
  });
  return groups;
}

function buildNotifications(users, posts) {
  return users.slice(0, 30).map((u, i) => {
    const kind = TYPES[i % TYPES.length];
    const post = posts[i % posts.length];
    const hoursAgo = i * 1.3 + Math.random() * 2;
    return {
      id: u.id,
      type: kind.type,
      icon: kind.icon,
      bg: kind.bg,
      color: kind.color,
      label: kind.label,
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.image,
      excerpt: ["follow", "birthday"].includes(kind.type)
        ? null
        : post?.body?.slice(0, 60) + "…",
      time: Date.now() - hoursAgo * 3600000,
      read: i > 4,
    };
  });
}

function Skeleton() {
  return (
    <div className="space-y-1 px-3 xs:px-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-2 xs:gap-3 py-2.5 xs:py-3">
          <div className="w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 xs:h-3.5 bg-primary/10 rounded-full animate-pulse w-3/4" />
            <div className="h-2.5 xs:h-3 bg-primary/10 rounded-full animate-pulse w-1/2" />
          </div>
          <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  );
}

function NotifRow({ notif, onRead, onDelete }) {
  const Icon = notif.icon;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`group relative flex items-start gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 rounded-xl cursor-pointer transition-colors ${
        notif.read ? "hover:bg-primary/5" : "bg-brand/5 hover:bg-brand/10"
      }`}
      onClick={() => onRead(notif.id)}
    >
      {/* Avatar + icon badge */}
      <div className="relative shrink-0">
        <Image
          src={notif.avatar}
          alt={notif.name}
          width={56}
          height={56}
          className="rounded-full object-cover w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14"
        />
        <div
          className={`absolute -bottom-1 -right-1 w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full ${notif.bg} flex items-center justify-center shadow-sm border-2 border-white`}
        >
          <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs xs:text-sm text-primary leading-snug">
          <span className="font-semibold">{notif.name}</span>{" "}
          <span className={notif.read ? "text-primary" : "text-primary/90"}>
            {notif.label}
          </span>
        </p>

        {notif.excerpt && (
          <p className="text-[10px] xs:text-xs text-primary/60 mt-0.5 truncate max-w-[180px] xs:max-w-[240px] sm:max-w-xs">
            {notif.excerpt}
          </p>
        )}

        <p className={`text-[10px] xs:text-xs mt-1 font-medium ${notif.read ? "text-primary/40" : "text-brand"}`}>
          {timeAgo(notif.time)}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-center gap-1.5 xs:gap-2 shrink-0 pt-1">
        {!notif.read && (
          <div className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-brand shadow-sm" />
        )}

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-primary/5 hover:bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
          >
            <MoreHorizontal size={14} className="xs:hidden text-primary/80" />
            <MoreHorizontal size={16} className="hidden xs:block text-primary/80" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 xs:top-10 w-44 xs:w-52 bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 py-1 z-50 overflow-hidden"
            >
              <button
                onClick={() => { onRead(notif.id); setMenuOpen(false); }}
                className="flex items-center gap-2 xs:gap-3 w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm text-primary/60 hover:bg-gray-50 transition-colors"
              >
                <Check size={13} className="xs:hidden text-primary/40" />
                <Check size={15} className="hidden xs:block text-primary/40" />
                Mark as read
              </button>
              <button
                onClick={() => { onDelete(notif.id); setMenuOpen(false); }}
                className="flex items-center gap-2 xs:gap-3 w-full px-3 xs:px-4 py-2 xs:py-2.5 text-xs xs:text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} className="xs:hidden" />
                <Trash2 size={15} className="hidden xs:block" />
                Remove notification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [usersData, postsData] = await Promise.all([
          get("/users?limit=20"),
          get("/posts?limit=20"),
        ]);
        setNotifications(
          buildNotifications(usersData?.users || [], postsData?.posts || [])
        );
      } catch (error) {
        console.error(error);
        setError("Failed to load notification. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotif = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const filtered = notifications.filter((n) => {
    const matchFilter =
      filter === "ALL" ? true
      : filter === "Unread" ? !n.read
      : filter === "Likes" ? ["like", "love"].includes(n.type)
      : filter === "Comments" ? n.type === "comment"
      : filter === "Follows" ? n.type === "follow"
      : filter === "Mentions" ? n.type === "mention"
      : true;

    const matchSearch = search
      ? n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.label.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchFilter && matchSearch;
  });

  const unread = notifications.filter((n) => !n.read).length;
  const groups = groupByTime(filtered);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-5 sm:py-6 flex gap-4 xs:gap-5 sm:gap-6">

        {/* Sidebar */}
        <aside className="hidden lg:block w-[320px] shrink-0 sticky top-20 h-fit">
          <Sidebar />
        </aside>

        {/* Notifications */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full">

            {/* Header */}
            <div className="px-3 xs:px-4 sm:px-6 pt-4 xs:pt-5 sm:pt-6 pb-3 xs:pb-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary">
                    Notifications
                  </h1>
                  {unread > 0 && (
                    <p className="text-xs xs:text-sm text-primary/60 mt-0.5 xs:mt-1">
                      {unread} unread notifications
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
                  <button
  onClick={() => {
    setSearchOpen((o) => !o);
    setSearch("");
  }}
  className="
    w-8 h-8
    sm:w-10 sm:h-10
    rounded-full
    bg-gray-100
    hover:bg-gray-200
    flex items-center justify-center
    transition-colors
  "
>
  {searchOpen ? (
    <X className="w-4 h-4 sm:w-5 sm:h-5" />
  ) : (
    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
  )}
</button>

                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full bg-brand/10 text-brand font-medium hover:bg-brand/20 transition-colors text-[11px] xs:text-xs sm:text-sm whitespace-nowrap"
                    >
                      <span className="hidden xs:inline">Mark all read</span>
                      <span className="xs:hidden">Mark read</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              {searchOpen && (
                <div className="mt-3 xs:mt-4">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 xs:size-4" />
                    <input
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search notifications..."
                      className="w-full pl-8 xs:pl-9 pr-4 py-2 xs:py-2.5 rounded-full bg-gray-100 text-xs xs:text-sm text-primary placeholder:text-primary/40 outline-none focus:ring-2 focus:ring-brand/30 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Filter Tabs */}
              <div className="mt-3 xs:mt-4 flex gap-1.5 xs:gap-2 overflow-x-auto scrollbar-hide pb-1">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-full text-[11px] xs:text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      filter === f
                        ? "bg-brand text-white shadow-sm"
                        : "bg-gray-100 text-primary/60 hover:bg-gray-200"
                    }`}
                  >
                    {f}
                    {f === "Unread" && unread > 0 && (
                      <span className={`ml-1 xs:ml-1.5 text-[10px] xs:text-xs px-1 xs:px-1.5 py-0.5 rounded-full ${
                        filter === f ? "bg-white/30 text-white" : "bg-brand/10 text-brand"
                      }`}>
                        {unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 text-xs xs:text-sm text-red-500 bg-red-50 mx-3 xs:mx-4 mb-3 xs:mb-4 rounded-xl">
                {error}
              </div>
            )}

            {/* Body */}
            <div className="py-1 xs:py-2">
              {loading && <Skeleton />}

              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 xs:py-16 text-primary/40">
                  <Bell size={32} className="mb-2 xs:mb-3 opacity-30 xs:size-10" />
                  <p className="text-xs xs:text-sm font-medium">No notifications found</p>
                </div>
              )}

              {!loading && filtered.length > 0 &&
                Object.entries(groups).map(([label, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={label}>
                      <h3 className="px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 text-[10px] xs:text-xs uppercase font-bold text-primary/50 tracking-wider">
                        {label}
                      </h3>
                      {items.map((n) => (
                        <NotifRow
                          key={n.id}
                          notif={n}
                          onRead={markRead}
                          onDelete={deleteNotif}
                        />
                      ))}
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}