"use client";

import { useState, useRef, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Settings,
  Bookmark,
  Users,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function ProfilePopup() {
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const popupRef = useRef(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("https://dummyjson.com/users/1");

        const data = await res.json();

        setUser(data);
      } catch (error) {
        console.error(error);
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
      {/* BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="
          w-11
          h-11
          rounded-full
          overflow-hidden
          border-2
          border-[#4285f4]
        "
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={user.firstName}
            className="
              w-full
              h-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              w-full
              h-full
              bg-[#4285f4]
            "
          />
        )}
      </button>

      {/* POPUP */}

      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            w-[370px]
            bg-white
            rounded-3xl
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            border
            border-primary/10
            overflow-hidden
            z-50
          "
        >
          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : (
            <>
              {/* USER CARD */}

              <div className="p-4">
                <Link
                  href="/profile"
                  className="
                    block
                    bg-[#f5f7fb]
                    rounded-3xl
                    p-4
                    hover:bg-[#eef2ff]
                    transition-all
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="
                        w-16
                        h-16
                        rounded-full
                        object-cover
                      "
                    />

                    <div>
                      <h2
                        className="
                          text-lg
                          font-bold
                          text-primary
                        "
                      >
                        {user.firstName} {user.lastName}
                      </h2>

                      <p
                        className="
                          text-gray-500
                          text-sm
                        "
                      >
                        @{user.username}
                      </p>

                      <p
                        className="
                          text-xs
                          text-gray-400
                          mt-1
                        "
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/profile"
                  className="
                    mt-3
                    block
                    text-center
                    text-[#4285f4]
                    font-medium
                  "
                >
                  View Profile
                </Link>
              </div>

              <div className="border-t border-primary/10" />

              {/* MENU */}

              <div className="p-3 space-y-2">
                <Link
                  href="/friends"
                  className="
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-2xl
                    hover:bg-[#f5f7fb]
                    transition-all
                  "
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} />
                    <span>Friends</span>
                  </div>

                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/saved"
                  className="
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-2xl
                    hover:bg-[#f5f7fb]
                    transition-all
                  "
                >
                  <div className="flex items-center gap-3">
                    <Bookmark size={20} />
                    <span>Saved</span>
                  </div>

                  <ChevronRight size={18} />
                </Link>

                <Link
                  href="/settings"
                  className="
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-2xl
                    hover:bg-[#f5f7fb]
                    transition-all
                  "
                >
                  <div className="flex items-center gap-3">
                    <Settings size={20} />
                    <span>Settings</span>
                  </div>

                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="border-t border-primary/10" />

              {/* LOGOUT */}

              <div className="p-3">
                <button
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    hover:bg-red-50
                    text-red-500
                    transition-all
                  "
                >
                  <LogOut size={20} />
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
