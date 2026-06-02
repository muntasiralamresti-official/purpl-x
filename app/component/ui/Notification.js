"use client";

import { get } from "@/app/lib/apiClient";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const popupRef = useRef(null);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);

      try {
        const data = await get("/users?limit=4");
        console.log("NOTIFICATION DATA:", data);

        if (!data?.users || !Array.isArray(data.users)) {
          setNotifications([]);
          return;
        }

        const types = [
          "like",
          "comment",
          "follow",
          "comment",
        ];

        const texts = {
          like: "liked your post ❤️",
          comment: "commented on your post 💬",
          follow: "started following you 👋",
        };

        const times = [
          "3m ago",
          "10m ago",
          "2h ago",
          "8h ago",
        ];

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
        console.error(
          "Failed to fetch notifications:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Close Popup Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
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

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  const TypeIcon = ({ type }) => {
    if (type === "like") {
      return (
        <Heart
          size={18}
          className="text-red-500 shrink-0"
        />
      );
    }

    if (type === "comment") {
      return (
        <MessageCircle
          size={18}
          className="text-brand shrink-0"
        />
      );
    }

    return (
      <UserPlus
        size={18}
        className="text-green-500 shrink-0"
      />
    );
  };

  return (
    <div
      className="relative"
      ref={popupRef}
    >
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center shadow-sm hover:opacity-90 transition-all"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 top-14 w-[380px] bg-white rounded-3xl overflow-hidden z-50 shadow-xl border border-primary/10">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-primary/10">
            <h2 className="text-2xl font-bold text-primary">
              Notifications
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="py-10 text-center text-primary/70">
                Loading...
              </div>
            )}

            {!loading &&
              notifications.length === 0 && (
                <div className="py-10 text-center text-primary/60">
                  No notifications found
                </div>
              )}

            {!loading &&
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <Image
                    src={item.avatar}
                    alt={item.user}
                    width={56}
                    height={56}
                    className="rounded-full object-cover w-14 h-14 shrink-0"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-primary">
                      <span className="font-semibold">
                        {item.user}
                      </span>{" "}
                      {item.text}
                    </p>

                    <span className="text-xs text-primary/50">
                      {item.time}
                    </span>
                  </div>

                  <TypeIcon type={item.type} />
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-primary/10">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center py-3 rounded-2xl bg-brand text-white font-medium hover:bg-brand/90 transition-all"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}