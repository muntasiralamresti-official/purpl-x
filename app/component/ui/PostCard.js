"use client"
import { Bookmark, Eye, Flag, Globe, MoreHorizontal, Pencil, ThumbsDown, ThumbsUp, Trash2, UserCircle } from "lucide-react";
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
    <div className="rounded-3xl overflow-hidden bg-white shadow-sm relative backdrop-blur-2xl">
      <div className="flex items-start justify-between p-5">
 
        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center text-white">
            <UserCircle size={35} />
          </div>
          <div>
            <h2 className="text-primary text-lg font-semibold">User {post.userId}</h2>
            <div className="flex items-center gap-1 text-primary/80 text-sm">
              <span>{(post.userId % 12) + 1}h ago</span>
              <span>•</span>
              <Globe size={13} />
            </div>
          </div>
        </div>
 
        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="w-10 h-10 rounded-full hover:bg-primary/70 flex items-center justify-center text-primary transition-all"
          >
            <MoreHorizontal size={22} />
          </button>
 
          {openMenu && (
            <div className="absolute right-0 top-12 w-56 rounded-3xl bg-white backdrop-blur-2xl shadow-sm overflow-hidden z-50">
              <button className="w-full flex items-center gap-3 px-5 py-4 text-primary/90 hover:bg-primary/20 transition-all">
                <Pencil size={18} /> Edit Post
              </button>
              <button className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-primary/20 transition-all">
                <Trash2 size={18} /> Delete Post
              </button>
              <button className="w-full flex items-center gap-3 px-5 py-4 text-primary/90 hover:bg-primary/20 transition-all">
                <Bookmark size={18} /> Save Post
              </button>
              <button className="w-full flex items-center gap-3 px-5 py-4 text-primary/90 hover:bg-primary/20 transition-all">
                <Flag size={18} /> Report Post
              </button>
            </div>
          )}
        </div>
      </div>
 
      {/* Title */}
      <div className="px-5">
        <h1 className={`font-bold text-primary leading-tight ${details ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
          {post.title}
        </h1>
      </div>
 
      {/* Body */}
      <div className="px-5 pt-5">
        <p className={`text-primary/90 ${details ? "leading-9 text-lg" : "leading-8 text-base md:text-lg"}`}>
          {post.body}
        </p>
      </div>
 
      {/* Media (locally created posts) */}
      {post.mediaPreview && (
        <div className="px-5 pt-3">
          <div className="rounded-2xl overflow-hidden">
            {post.mediaType === "video" ? (
              <video src={post.mediaPreview} controls className="w-full max-h-72 object-cover" />
            ) : (
              <img src={post.mediaPreview} alt="post media" className="w-full max-h-72 object-cover" />
            )}
          </div>
        </div>
      )}
 
      {/* Tags */}
      <div className="flex flex-wrap gap-3 px-5 py-6">
        {post.tags?.map((tag, index) => (
          <div key={index} className="text-primary text-sm">#{tag}</div>
        ))}
      </div>
 
      {/* Stats */}
      <div className="flex items-center justify-between px-5 pt-3 pb-5 border-t border-white/10 text-primary/80">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-brand/50 text-brand flex items-center justify-center">
              <ThumbsUp size={18} fill="currentColor" />
            </div>
            <span>{post?.reactions?.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-red-400 text-red-700 flex items-center justify-center">
              <ThumbsDown size={18} fill="currentColor" />
            </div>
            <span>{post?.reactions?.dislikes}</span>
          </div>
        </div>
 
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-primary/80">
            <Eye size={18} />
            <span>{post.views}</span>
          </div>
          {!details && post.id <= 251 && (
            <Link
              href={`/post/${post.id}`}
              className="px-4 py-2 rounded-lg text-white text-sm bg-brand font-medium hover:opacity-90 transition-all"
            >
              View Post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
