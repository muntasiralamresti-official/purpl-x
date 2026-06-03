"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Repeat2,
  AtSign,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  ThumbsUp,
  Gift,
  Video,
  Image as ImageIcon,
  MoreHorizontal,
  Search,
  Filter,
  X,
} from "lucide-react";

/* ─── Notification types ─────────────────────── */
const TYPES = [
  {
    type: "like",
    icon: ThumbsUp,
    bg: "bg-blue-100",
    color: "text-blue-600",
    label: "liked your post",
  },
  {
    type: "love",
    icon: Heart,
    bg: "bg-red-100",
    color: "text-red-500",
    label: "loved your photo",
  },
  {
    type: "comment",
    icon: MessageCircle,
    bg: "bg-green-100",
    color: "text-green-600",
    label: "commented on your post",
  },
  {
    type: "follow",
    icon: UserPlus,
    bg: "bg-purple-100",
    color: "text-purple-600",
    label: "started following you",
  },
  {
    type: "repost",
    icon: Repeat2,
    bg: "bg-orange-100",
    color: "text-orange-500",
    label: "shared your post",
  },
  {
    type: "mention",
    icon: AtSign,
    bg: "bg-pink-100",
    color: "text-pink-600",
    label: "mentioned you in a post",
  },
  {
    type: "birthday",
    icon: Gift,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
    label: "has a birthday today 🎂",
  },
  {
    type: "video",
    icon: Video,
    bg: "bg-indigo-100",
    color: "text-indigo-600",
    label: "tagged you in a video",
  },
  {
    type: "photo",
    icon: ImageIcon,
    bg: "bg-teal-100",
    color: "text-teal-600",
    label: "tagged you in a photo",
  },
];

const FILTERS = ["All", "Unread", "Likes", "Comments", "Follows", "Mentions"];

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

function groupByTime(notifications) {
  const groups = { New: [], "Earlier today": [], "This week": [], Older: [] };
  const now = Date.now();
  notifications.forEach((n) => {
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
  return users.slice(0, 20).map((u, i) => {
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

/* ─── Skeleton ───────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-1 px-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded-full animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/2" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  );
}

/* ─── Single notification row ────────────────── */
function NotifRow({ notif, onRead, onDelete }) {
  const Icon = notif.icon;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
        notif.read ? "hover:bg-gray-100" : "bg-blue-50 hover:bg-blue-100/70"
      }`}
      onClick={() => onRead(notif.id)}
    >
      {/* avatar + icon badge */}
      <div className="relative shrink-0">
        <Image
          src={notif.avatar}
          alt={notif.name}
          width={56}
          height={56}
          className="rounded-full object-cover w-14 h-14"
        />
        <div
          className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full ${notif.bg} flex items-center justify-center shadow-sm border-2 border-white`}
        >
          <Icon size={13} className={notif.color} />
        </div>
      </div>

      {/* text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[14px] text-gray-800 leading-snug">
          <span className="font-semibold">{notif.name}</span>{" "}
          <span className={notif.read ? "text-primary/80" : "text-gray-800"}>
            {notif.label}
          </span>
        </p>
        {notif.excerpt && (
          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
            {notif.excerpt}
          </p>
        )}
        <p
          className={`text-xs mt-1 font-medium ${notif.read ? "text-gray-400" : "text-blue-500"}`}
        >
          {timeAgo(notif.time)}
        </p>
      </div>

      {/* right side */}
      <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
        {/* unread dot */}
        {!notif.read && (
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
        )}

        {/* more button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
          >
            <MoreHorizontal size={16} className="text-primary/80" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onRead(notif.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Check size={15} className="text-gray-500" />
                Mark as read
              </button>
              <button
                onClick={() => {
                  onDelete(notif.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} />
                Remove notification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  /* fetch */
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const [usersData, postsData] =
        await Promise.all([
          get("/users?limit=20"),
          get("/posts?limit=20"),
        ]);

      setNotifications(
        buildNotifications(
          usersData?.users || [],
          postsData?.posts || []
        )
      );

    } catch (error) {
      console.error(error);
      setError(
        "Failed to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotif = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /* filter + search */
  const filtered = notifications.filter((n) => {
    const matchFilter =
      filter === "All"
        ? true
        : filter === "Unread"
          ? !n.read
          : filter === "Likes"
            ? ["like", "love"].includes(n.type)
            : filter === "Comments"
              ? n.type === "comment"
              : filter === "Follows"
                ? n.type === "follow"
                : filter === "Mentions"
                  ? n.type === "mention"
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-6 px-2 sm:px-0">
      <aside className="hidden lg:block w-[280px] shrink-0 sticky top-20 h-fit">
        <Sidebar />
      </aside>
        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* ── Header ── */}
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                {unread > 0 && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {unread} new notification{unread > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* search toggle */}
                <button
                  onClick={() => {
                    setSearchOpen((o) => !o);
                    setSearch("");
                  }}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  {searchOpen ? (
                    <X size={16} className="text-primary/80" />
                  ) : (
                    <Search size={16} className="text-primary/80" />
                  )}
                </button>

                {/* mark all read */}
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* search bar */}
            {searchOpen && (
              <div className="relative mb-3">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search notifications…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            )}

            {/* filter chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                    filter === f
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-primary/80 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── Body ── */}
          <div className="py-2">
            {loading && <Skeleton />}

            {error && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <BellOff size={24} className="text-red-400" />
                </div>
                <p className="text-gray-500 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell size={28} className="text-gray-300" />
                </div>
                <p className="text-gray-800 font-semibold">No notifications</p>
                <p className="text-gray-400 text-sm text-center max-w-xs">
                  {search
                    ? `No results for "${search}"`
                    : "You're all caught up! Check back later."}
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              Object.entries(groups).map(([label, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={label}>
                    <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide px-5 pt-4 pb-1">
                      {label}
                    </h2>
                    <div className="px-2 space-y-0.5">
                      {items.map((n) => (
                        <NotifRow
                          key={n.id}
                          notif={n}
                          onRead={markRead}
                          onDelete={deleteNotif}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ── Footer ── */}
          {!loading && filtered.length > 0 && (
            <div className="border-t border-gray-100 px-5 py-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                See all previous notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
