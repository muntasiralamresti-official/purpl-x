"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Bookmark,
  Users,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { get } from "@/app/lib/apiClient";

export default function ProfilePopup() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const popupRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await get("/users/1");

        // Validate data structure - don't check just for .id
        if (!data || typeof data !== "object") {
          throw new Error("Invalid user data");
        }

        if (data.success === false) {
          throw new Error(data.message || "Failed to fetch user");
        }

        if (data?.id) {
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
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

  return (
    <div className="relative" ref={popupRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-brand shrink-0"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={user?.firstName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand" />
        )}
      </button>

      {/* Popup */}
      {open && (
        <div
          className="
            absolute right-0 top-11 xs:top-12 sm:top-14 z-50
            w-[calc(100vw-24px)] xs:w-[300px] sm:w-[370px]
            max-w-[370px]
            bg-white rounded-2xl xs:rounded-3xl
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            border border-primary/10
            overflow-hidden
          "
        >
          {loading ? (
            <div className="p-8 xs:p-10 flex justify-center">
              <Loader2 size={24} className="animate-spin xs:size-7" />
            </div>
          ) : (
            <>
              {/* User Card */}
              <div className="p-3 xs:p-4">
                <Link
                  href="/profile"
                  className="block bg-[#f5f7fb] rounded-2xl xs:rounded-3xl p-3 xs:p-4 hover:bg-[#eef2ff] transition-all"
                >
                  <div className="flex items-center gap-3 xs:gap-4">
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                    />

                    <div className="min-w-0">
                      <h2 className="text-base xs:text-lg font-bold text-primary truncate">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-500 text-xs xs:text-sm truncate">
                        @{user.username}
                      </p>
                      <p className="text-[10px] xs:text-xs text-gray-400 mt-0.5 xs:mt-1 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/profile"
                  className="mt-2 xs:mt-3 block text-center text-sm xs:text-base text-brand font-medium"
                >
                  View Profile
                </Link>
              </div>

              <div className="border-t border-primary/10" />

              {/* Menu */}
              <div className="p-2 xs:p-3 space-y-1 xs:space-y-2">
                {[
                  { href: "/friends", icon: Users, label: "Friends" },
                  { href: "/saved", icon: Bookmark, label: "Saved" },
                  { href: "/settings", icon: Settings, label: "Settings" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between p-2.5 xs:p-3 rounded-xl xs:rounded-2xl hover:bg-[#f5f7fb] transition-all"
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <Icon size={18} className="xs:size-5 shrink-0" />
                      <span className="text-sm xs:text-base">{label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="xs:size-[18px] text-gray-400"
                    />
                  </Link>
                ))}
              </div>

              <div className="border-t border-primary/10" />

              {/* Logout */}
              <div className="p-2 xs:p-3">
                <button className="w-full flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-xl xs:rounded-2xl hover:bg-red-50 text-red-500 transition-all text-sm xs:text-base">
                  <LogOut size={18} className="xs:size-5 shrink-0" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
