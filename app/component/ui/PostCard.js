/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Bookmark,
  BookmarkCheck,
  Eye,
  Flag,
  Globe,
  MoreHorizontal,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  UserCircle,
  X,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { patch, remove } from "@/app/lib/apiClient";

export default function PostCard({ post, details = false, onDelete }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  /* ── Like / Dislike ───────────────────────────────────────────────────── */
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(post?.reactions?.likes ?? 0);
  const [dislikes, setDislikes] = useState(post?.reactions?.dislikes ?? 0);

  /* ── Edit state ──────────────────────────────────────────────────────── */
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const [currentTitle, setCurrentTitle] = useState(post.title);
  const [currentBody, setCurrentBody] = useState(post.body);
  const [editLoading, setEditLoading] = useState(false);

  /* ── Delete state ────────────────────────────────────────────────────── */
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ── Save state ──────────────────────────────────────────────────────── */
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const arr = JSON.parse(localStorage.getItem("purpl-saved-posts") || "[]");
      return arr.includes(post.id);
    } catch {
      return false;
    }
  });

  /* Click outside menu */
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Handlers ────────────────────────────────────────────────────────── */

  async function handleLike() {
    const newLiked = !liked;
    // Optimistic update
    setLiked(newLiked);
    if (disliked) setDisliked(false);
    setLikes((prev) => (newLiked ? prev + 1 : prev - 1));
    if (disliked) setDislikes((prev) => prev - 1);

    try {
      await patch(`/posts/${post.id}`, {
        reactions: {
          likes: newLiked ? likes + 1 : likes - 1,
          dislikes: disliked ? dislikes - 1 : dislikes,
        },
      });
    } catch (err) {
      console.error("Like failed:", err);
      // Revert on error
      setLiked(!newLiked);
      setLikes((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  }

  async function handleDislike() {
    const newDisliked = !disliked;
    // Optimistic update
    setDisliked(newDisliked);
    if (liked) setLiked(false);
    setDislikes((prev) => (newDisliked ? prev + 1 : prev - 1));
    if (liked) setLikes((prev) => prev - 1);

    try {
      await patch(`/posts/${post.id}`, {
        reactions: {
          likes: liked ? likes - 1 : likes,
          dislikes: newDisliked ? dislikes + 1 : dislikes - 1,
        },
      });
    } catch (err) {
      console.error("Dislike failed:", err);
      setDisliked(!newDisliked);
      setDislikes((prev) => (newDisliked ? prev - 1 : prev + 1));
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await remove(`/posts/${post.id}`);
      // Remove from parent Feed's list
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(false);
    }
  }

  async function handleSaveEdit() {
    setEditLoading(true);
    try {
      const updated = await patch(`/posts/${post.id}`, {
        title: editTitle,
        body: editBody,
      });
      // Update local display state
      setCurrentTitle(updated?.title || editTitle);
      setCurrentBody(updated?.body || editBody);
      setEditing(false);
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Failed to edit post. Please try again.");
    } finally {
      setEditLoading(false);
    }
  }

  function handleSavePost() {
    try {
      const arr = JSON.parse(localStorage.getItem("purpl-saved-posts") || "[]");
      let updated;
      if (saved) {
        updated = arr.filter((id) => id !== post.id);
      } else {
        updated = [...arr, post.id];
      }
      localStorage.setItem("purpl-saved-posts", JSON.stringify(updated));
      setSaved(!saved);
    } catch {
      // ignore
    }
    setOpenMenu(false);
  }

  function handleReport() {
    alert("Post reported. Thanks for letting us know.");
    setOpenMenu(false);
  }

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl bg-white shadow-sm relative">
      {/* ── Header ── */}
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

        {/* ── Dropdown menu ── */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full hover:bg-primary/10 transition"
          >
            <MoreHorizontal size={18} />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-10 xs:top-11 sm:top-12 z-50 w-44 xs:w-48 sm:w-52 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
              <button
                onClick={() => {
                  setEditing(true);
                  setOpenMenu(false);
                }}
                className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm hover:bg-gray-50"
              >
                <Pencil size={15} /> Edit Post
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(true);
                  setOpenMenu(false);
                }}
                className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm text-red-600 hover:bg-gray-50"
              >
                <Trash2 size={15} /> Delete Post
              </button>
              <button
                onClick={handleSavePost}
                className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm hover:bg-gray-50"
              >
                {saved ? (
                  <BookmarkCheck size={15} className="text-brand" />
                ) : (
                  <Bookmark size={15} />
                )}
                {saved ? "Unsave Post" : "Save Post"}
              </button>
              <button
                onClick={handleReport}
                className="flex w-full items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm hover:bg-gray-50"
              >
                <Flag size={15} /> Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Inline delete confirm ── */}
      {confirmDelete && (
        <div className="mx-3 xs:mx-4 sm:mx-5 mb-3 xs:mb-4 p-3 xs:p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700 mb-3 font-medium">
            Are you sure you want to delete this post?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-60 transition-all"
            >
              {deleteLoading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2 size={12} />
              )}
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-all"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Title & Body (or Edit mode) ── */}
      {editing ? (
        <div className="px-3 xs:px-4 sm:px-5 space-y-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border border-primary/20 rounded-xl px-3 py-2 text-sm xs:text-base font-semibold text-primary outline-none focus:border-brand transition-all"
            placeholder="Post title"
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={4}
            className="w-full border border-primary/20 rounded-xl px-3 py-2 text-xs xs:text-sm text-primary outline-none focus:border-brand resize-none transition-all"
            placeholder="Post body"
          />
          <div className="flex gap-2 pb-2">
            <button
              onClick={handleSaveEdit}
              disabled={editLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-xs xs:text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {editLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditTitle(currentTitle);
                setEditBody(currentBody);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs xs:text-sm font-medium hover:bg-gray-50 transition-all"
            >
              <X size={13} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-3 xs:px-4 sm:px-5">
            <h1
              className={`font-bold leading-tight text-primary break-words w-full ${
                details
                  ? "text-xl xs:text-2xl sm:text-3xl md:text-4xl"
                  : "text-lg xs:text-xl sm:text-2xl md:text-3xl"
              }`}
            >
              {currentTitle}
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
              {currentBody}
            </p>
          </div>
        </>
      )}

      {/* ── Media ── */}
      {post.mediaPreview && post.mediaType && (
        <div className="px-3 xs:px-4 sm:px-5 pt-3 xs:pt-4">
          <div className="overflow-hidden rounded-xl xs:rounded-2xl">
            {post.mediaType === "video" ? (
              <video
                src={post.mediaPreview}
                controls
                playsInline
                className="w-full max-h-full object-cover"
                onError={() => console.error("Video failed to load")}
              />
            ) : (
              <img
                src={post.mediaPreview}
                alt="post media"
                className="w-full max-h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Tags ── */}
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

      {/* ── Reactions ── */}
      <div className="border-t border-gray-100 px-3 xs:px-4 sm:px-5 py-3 xs:py-4">
        <div className="flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 xs:gap-4 sm:gap-6">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 xs:gap-2 transition-all ${
                liked ? "scale-110" : "hover:scale-105"
              }`}
            >
              <div
                className={`h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-colors ${
                  liked
                    ? "bg-brand text-white"
                    : "bg-brand/50 text-brand hover:bg-brand/70"
                }`}
              >
                <ThumbsUp size={14} fill={liked ? "currentColor" : "none"} />
              </div>
              <span className="text-xs xs:text-sm sm:text-base">{likes}</span>
            </button>

            {/* Dislike */}
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1.5 xs:gap-2 transition-all ${
                disliked ? "scale-110" : "hover:scale-105"
              }`}
            >
              <div
                className={`h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-colors ${
                  disliked
                    ? "bg-red-600 text-white"
                    : "bg-red-400/20 text-red-700 hover:bg-red-400/40"
                }`}
              >
                <ThumbsDown
                  size={14}
                  fill={disliked ? "currentColor" : "none"}
                />
              </div>
              <span className="text-xs xs:text-sm sm:text-base">
                {dislikes}
              </span>
            </button>

            {/* Views */}
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
