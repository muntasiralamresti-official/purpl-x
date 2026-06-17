"use client";

import { get } from "@/app/lib/apiClient";
import { Bell, Heart,MessageCircle, UserPlus, X,} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const popupRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);

      try {
        const data = await get("/users?limit=4");
        console.log("NOTIFICATION DATA:", data);

        // Check if data is error response
        if (!data || data.success === false) {
          throw new Error(data?.message || "Failed to fetch notifications");
        }

        if (!data?.users || !Array.isArray(data.users)) {
          setNotifications([]);
          return;
        }

        const types = ["like", "comment", "follow", "comment"];

        const texts = {
          like: "liked your post ❤️",
          comment: "commented on your post 💬",
          follow: "started following you 👋",
        };

        const times = ["3m ago", "10m ago", "2h ago", "8h ago"];

        const mapped = data.users.map((user, i) => ({
          id: user.id,
          type: types[i % types.length],
          user: `${user.firstName} ${user.lastName}`,
          text: texts[types[i % types.length]],
          time: times[i % times.length],
          avatar: user.image,
          read: false,
        }));

        setNotifications(mapped);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]); // Fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const TypeIcon = ({ type }) => {
    if (type === "like") return <Heart size={16} className="text-red-500 shrink-0 xs:size-[18px]" />;
    if (type === "comment") return <MessageCircle size={16} className="text-brand shrink-0 xs:size-[18px]" />;
    return <UserPlus size={16} className="text-green-500 shrink-0 xs:size-[18px]" />;
  };

  return (
    <div className="relative" ref={popupRef}>

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-brand text-white flex items-center justify-center shadow-sm hover:opacity-90 transition-all"
      >
        <Bell size={20} className="w-5 h-5 sm:w-6 sm:h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-red-500 text-white text-[10px] xs:text-xs font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute -right-26 sm:right-0 top-11 xs:top-12 sm:top-14 z-50 w-[calc(100vw-24px)] xs:w-[320px] sm:w-[380px] max-w-[380px] bg-white rounded-2xl xs:rounded-3xl overflow-hidden shadow-xl border border-primary/10">

          {/* Header */}
          <div className="flex items-center justify-between px-3 xs:px-4 sm:px-5 py-3 xs:py-4 sm:py-5 border-b border-primary/10">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-primary">
              Notifications
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 xs:w-8 xs:h-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-all"
            >
              <X size={14} className="xs:hidden" />
              <X size={16} className="hidden xs:block" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[280px] xs:max-h-[360px] sm:max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="py-8 xs:py-10 text-center text-sm xs:text-base text-primary/70">
                Loading...
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-8 xs:py-10 text-center text-sm xs:text-base text-primary/60">
                No notifications found
              </div>
            )}

            {!loading &&
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <Image
                    src={item.avatar}
                    alt={item.user}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs xs:text-sm text-primary leading-snug">
                      <span className="font-semibold">{item.user}</span>{" "}
                      {item.text}
                    </p>
                    <span className="text-[10px] xs:text-xs text-primary/50">
                      {item.time}
                    </span>
                  </div>

                  <TypeIcon type={item.type} />
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="p-3 xs:p-4 border-t border-primary/10">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center py-2 xs:py-3 rounded-xl xs:rounded-2xl bg-brand text-white text-sm xs:text-base font-medium hover:bg-brand/90 transition-all"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}