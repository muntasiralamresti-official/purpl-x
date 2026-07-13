"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, UserCheck, UserPlus } from "lucide-react";

const STORAGE_KEY = "purpl-friends";

function getFriendsFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function FriendGrid({ users }) {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function init() {
      setFriends(getFriendsFromStorage());
      setMounted(true);
    }
    init();
  }, []);

  function toggleFriend(userId) {
    setFriends((prev) => {
      let updated;
      if (prev.includes(userId)) {
        updated = prev.filter((id) => id !== userId);
      } else {
        updated = [...prev, userId];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  // Filter users by name
  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          u.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <>
      {/* Search bar for People page */}
      <div className="mb-5 xs:mb-6 relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
        />
        <input
          type="text"
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 xs:h-11 rounded-xl bg-white border border-primary/10 pl-9 pr-4 text-sm text-primary outline-none placeholder:text-primary/40 focus:border-brand transition-all shadow-sm"
        />
      </div>

      {/* Results count when searching */}
      {searchQuery && (
        <p className="mb-4 text-sm text-primary/60">
          {filteredUsers.length} result{filteredUsers.length !== 1 ? "s" : ""}{" "}
          for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
        {filteredUsers.map((user) => {
          const isFriend = mounted && friends.includes(user.id);

          return (
            <div
              key={user.id}
              className="bg-white rounded-xl xs:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="h-28 xs:h-32 sm:h-36 md:h-40 overflow-hidden">
                <Image
                  src={user.image}
                  alt={user.firstName}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="px-3 xs:px-4 sm:px-5 py-3 xs:py-4 sm:py-5 text-start">
                <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-primary truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-[11px] xs:text-xs sm:text-sm text-primary/60 mt-0.5 xs:mt-1">
                  {(user.id % 40) + 6} mutual friends
                </p>

                {/* Single toggle button */}
                <div className="mt-3 xs:mt-4 sm:mt-5">
                  <button
                    onClick={() => toggleFriend(user.id)}
                    className={`w-full py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl text-xs xs:text-sm sm:text-base font-medium transition-all flex items-center justify-center gap-2 ${
                      isFriend
                        ? "bg-green-50 hover:bg-red-50 text-green-700 hover:text-red-600 border border-green-200 hover:border-red-200"
                        : "bg-brand hover:bg-brand/80 text-white"
                    }`}
                  >
                    {isFriend ? (
                      <>
                        <UserCheck size={14} className="xs:size-4" />
                        <span>Friends</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} className="xs:size-4" />
                        <span>Add Friend</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16 text-primary/40">
          <Search size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No people found</p>
        </div>
      )}
    </>
  );
}
