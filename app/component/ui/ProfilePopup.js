"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Bookmark,
  Users,
  LogOut,
  LogIn,
  ChevronRight,
  Loader2,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";

export default function ProfilePopup() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  const { user, logout, mounted } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-brand/20 animate-pulse" />
    );
  }

  /* If not logged in, show Login button */
  if (!user) {
    return (
      <Link
        href="/login"
        className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full bg-brand text-white flex items-center justify-center hover:opacity-90 transition-all border-2 border-transparent"
        aria-label="Login"
        title="Login"
      >
        <LogIn size={20} className="text-white" />
      </Link>
    );
  }

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
          <div className="w-full h-full bg-brand flex items-center justify-center">
            <UserCircle2 size={22} className="text-white" />
          </div>
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
          {/* User Card */}
          <div className="p-3 xs:p-4">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block bg-[#f5f7fb] rounded-2xl xs:rounded-3xl p-3 xs:p-4 hover:bg-[#eef2ff] transition-all"
            >
              <div className="flex items-center gap-3 xs:gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <UserCircle2 size={28} className="text-white" />
                  </div>
                )}

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
              onClick={() => setOpen(false)}
              className="mt-2 xs:mt-3 block text-center text-sm xs:text-base text-brand font-medium"
            >
              View Profile
            </Link>
          </div>

          <div className="border-t border-primary/10" />

          {/* Menu */}
          <div className="p-2 xs:p-3 space-y-1 xs:space-y-2">
            {[
              { href: "/people", icon: Users, label: "Friends" },
              { href: "/saved", icon: Bookmark, label: "Saved" },
              { href: "/settings", icon: Settings, label: "Settings" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-xl xs:rounded-2xl hover:bg-red-50 text-red-500 transition-all text-sm xs:text-base"
            >
              <LogOut size={18} className="xs:size-5 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
