// app/component/ui/PostCard.js

"use client";

import { useState, useRef, useEffect } from "react";

import Link from "next/link";

import {
  Globe,
  ThumbsUp,
  ThumbsDown,
  Eye,
  UserCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Flag,
  Bookmark,
} from "lucide-react";

export default function PostCard({
  post,
  details = false,
}) {

  const [openMenu, setOpenMenu] =
    useState(false);

  const menuRef = useRef(null);

  /* CLOSE MENU OUTSIDE CLICK */
  useEffect(() => {

    function handleClickOutside(event) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setOpenMenu(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.37)]
        relative
      "
    >
      
      {/* TOP */}
      <div className="flex items-start justify-between p-5">
        
        {/* USER */}
        <div className="flex items-center gap-3">
          
          {/* AVATAR */}
          <div
            className="
              w-14 h-14
              rounded-full
              bg-gradient-to-br
              from-blue-500
              via-indigo-500
              to-purple-600
              shadow-lg shadow-purple-500/30
              flex items-center justify-center
              text-white
            "
          >
            <UserCircle size={35} />
          </div>

          {/* INFO */}
          <div>
            <h2 className="text-white text-lg font-semibold">
              User {post.userId}
            </h2>

            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span>2h ago</span>

              <span>•</span>

              <Globe size={13} />
            </div>
          </div>
        </div>

        {/* MENU */}
        <div
          className="relative"
          ref={menuRef}
        >
          
          {/* BUTTON */}
          <button
            onClick={() =>
              setOpenMenu(!openMenu)
            }
            className="
              w-10 h-10
              rounded-full
              hover:bg-white/10
              flex items-center justify-center
              text-gray-400
              transition-all
            "
          >
            <MoreHorizontal size={22} />
          </button>

          {/* DROPDOWN */}
          {openMenu && (
            <div
              className="
                absolute
                right-0
                top-12
                w-56
                rounded-2xl
                border border-white/10
                bg-[#111827]/95
                backdrop-blur-2xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              
              {/* EDIT */}
              <button
                className="
                  w-full
                  flex items-center gap-3
                  px-5 py-4
                  text-gray-300
                  hover:bg-white/5
                  transition-all
                "
              >
                <Pencil size={18} />

                Edit Post
              </button>

              {/* DELETE */}
              <button
                className="
                  w-full
                  flex items-center gap-3
                  px-5 py-4
                  text-red-400
                  hover:bg-red-500/10
                  transition-all
                "
              >
                <Trash2 size={18} />

                Delete Post
              </button>

              {/* SAVE */}
              <button
                className="
                  w-full
                  flex items-center gap-3
                  px-5 py-4
                  text-gray-300
                  hover:bg-white/5
                  transition-all
                "
              >
                <Bookmark size={18} />

                Save Post
              </button>

              {/* REPORT */}
              <button
                className="
                  w-full
                  flex items-center gap-3
                  px-5 py-4
                  text-gray-300
                  hover:bg-white/5
                  transition-all
                "
              >
                <Flag size={18} />

                Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TITLE */}
      <div className="px-5">
        <h1
          className={`
            font-bold text-white leading-tight
            ${
              details
                ? "text-3xl md:text-4xl"
                : "text-2xl md:text-3xl"
            }
          `}
        >
          {post.title}
        </h1>
      </div>

      {/* BODY */}
      <div className="px-5 pt-5">
        <p
          className={`
            text-gray-300
            ${
              details
                ? "leading-9 text-lg"
                : "leading-8 text-[15px] md:text-lg"
            }
          `}
        >
          {post.body}
        </p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-3 px-5 py-6">
        
        {post.tags?.map((tag, index) => (
          <div
            key={index}
            className="
              px-4 py-2
              rounded-2xl
              border border-purple-400/20
              bg-purple-500/10
              backdrop-blur-md
              text-purple-200
              text-sm
            "
          >
            #{tag}
          </div>
        ))}
      </div>

      {/* STATS */}
      <div className="flex items-center justify-between px-5 pt-3 pb-5 border-t border-white/10 text-gray-300">
        
        {/* LEFT */}
        <div className="flex items-center gap-5">
          
          {/* LIKE */}
          <div className="flex items-center gap-2">
            
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <ThumbsUp
                size={18}
                fill="currentColor"
              />
            </div>

            <span>
              {post.reactions.likes}
            </span>
          </div>

          {/* DISLIKE */}
          <div className="flex items-center gap-2">
            
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <ThumbsDown
                size={18}
                fill="currentColor"
              />
            </div>

            <span>
              {post.reactions.dislikes}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          
          {/* VIEWS */}
          <div className="flex items-center gap-2 text-gray-400">
            <Eye size={18} />

            <span>
              {post.views}
            </span>
          </div>

          {/* BUTTON */}
          {!details && (
            <Link
              href={`/${post.id}`}
              className="
                px-4 py-2
                rounded-xl
                bg-gradient-to-r
                from-blue-500
                to-purple-600
                text-white
                text-sm
                font-medium
                hover:opacity-90
                transition-all
              "
            >
              View Post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}