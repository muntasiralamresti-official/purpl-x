"use client";

import {
  Bookmark,
  Eye,
  Flag,
  Globe,
  MoreHorizontal,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function PostCard({ post, details = false }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl bg-white shadow-sm relative">
      <div className="flex items-start justify-between gap-2 p-3 xs:p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-2 xs:gap-3">
          <div className="h-10 w-10 xs:h-11 xs:w-11 sm:h-14 sm:w-14 shrink-0 rounded-full bg-brand flex items-center justify-center text-white">
            <UserCircle size={details ? 30 : 24} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm xs:text-base sm:text-lg font-semibold text-primary">
              User {post.userId}
            </h2>
            <div className="flex items-center gap-1 text-[11px] xs:text-xs sm:text-sm text-primary/80">
              <span>{(post.userId % 12) + 1}h ago</span>
              <span>•</span>
              <Globe size={11} />
            </div>
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-primary/10 transition"
          >
            <MoreHorizontal size={18} />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-10 xs:top-11 sm:top-12 z-50 w-44 xs:w-48 sm:w-52 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
              <button className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm hover:bg-gray-50">
                <Pencil size={15} /> Edit Post
              </button>
              <button className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm text-red-600 hover:bg-gray-50">
                <Trash2 size={15} /> Delete Post
              </button>
              <button className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm hover:bg-gray-50">
                <Bookmark size={15} /> Save Post
              </button>
              <button className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm hover:bg-gray-50">
                <Flag size={15} /> Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 xs:px-4 sm:px-5">
        <h1
          className={`font-bold leading-tight text-primary break-words w-full ${
            details
              ? "text-xl xs:text-2xl sm:text-3xl md:text-4xl"
              : "text-lg xs:text-xl sm:text-2xl md:text-3xl"
          }`}
        >
          {post.title}
        </h1>
      </div>

      <div className="px-3 xs:px-4 sm:px-5 pt-2 xs:pt-3 sm:pt-4">
        <p
          className={`text-primary/90 break-words w-full ${
            details
              ? "text-sm xs:text-base sm:text-lg leading-6 xs:leading-7 sm:leading-9"
              : "text-xs xs:text-sm sm:text-base md:text-lg leading-6 xs:leading-7 sm:leading-8 line-clamp-3 xs:line-clamp-4 sm:line-clamp-none"
          }`}
        >
          {post.body}
        </p>
      </div>

      {post.mediaPreview && post.mediaType && (
        <div className="px-3 xs:px-4 sm:px-5 pt-3 xs:pt-4">
          <div className="overflow-hidden rounded-xl xs:rounded-2xl">
            {post.mediaType === "video" ? (
              <video
                src={post.mediaPreview}
                controls
                playsInline
                className="w-full max-h-full  object-cover"
                onError={() => console.error("Video failed to load")}
              />
            ) : (
              <img
                src={post.mediaPreview}
                alt="post media"
                className="w-full max-h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none"; // Hide broken image
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 xs:gap-2 px-3 xs:px-4 sm:px-5 py-3 xs:py-4">
        {post.tags?.map((tag, index) => (
          <span
            key={index}
            className="text-[11px] xs:text-xs sm:text-sm text-primary"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="border-t border-gray-100 px-3 xs:px-4 sm:px-5 py-3 xs:py-4">
        <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 xs:gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 xs:gap-2">
              <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-full bg-brand/50 text-brand flex items-center justify-center">
                <ThumbsUp size={14} fill="currentColor" />
              </div>
              <span className="text-xs xs:text-sm sm:text-base">
                {post?.reactions?.likes}
              </span>
            </div>

            <div className="flex items-center gap-1.5 xs:gap-2">
              <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-full bg-red-400/20 text-red-700 flex items-center justify-center">
                <ThumbsDown size={14} fill="currentColor" />
              </div>
              <span className="text-xs xs:text-sm sm:text-base">
                {post?.reactions?.dislikes}
              </span>
            </div>

            <div className="flex items-center gap-1.5 xs:gap-2 text-primary/80">
              <Eye size={14} />
              <span className="text-xs xs:text-sm sm:text-base">
                {post.views}
              </span>
            </div>
          </div>

          {!details && post.id <= 251 && (
            <Link
              href={`/post/${post.id}`}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-brand px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-white transition hover:opacity-90"
            >
              View Post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
