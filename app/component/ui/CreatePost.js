"use client";
import {
  Check,
  ChevronDown,
  Globe,
  Loader2,
  Lock,
  Send,
  UserCircle,
  Users,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { post } from "@/app/lib/apiClient";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_CHARS = 300;

const AUDIENCES = [
  { label: "Public", icon: Globe, value: "public" },
  { label: "Friends", icon: Users, value: "friends" },
  { label: "Only me", icon: Lock, value: "only_me" },
];

// ─── CreatePost ───────────────────────────────────────────────────────────────

export function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audienceIdx, setAudienceIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);

  const textareaRef = useRef(null);

  const handleBodyChange = useCallback((e) => {
    setBody(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, []);

  const cycleAudience = useCallback(
    () => setAudienceIdx((i) => (i + 1) % AUDIENCES.length),
    [],
  );

  const handleCreatePost = useCallback(async () => {
    if (!body.trim() || body.length > MAX_CHARS) return;

    const postPayload = {
      title: title.trim() || "New Post",
      body,
      userId: 5,
      audience: AUDIENCES[audienceIdx].value,
    };

    console.log("Creating post:", postPayload);

    try {
      setLoading(true);
      setPosted(false);

      const data = await post("/posts/add", {
        title: postPayload.title,
        body: postPayload.body,
        userId: postPayload.userId,
      });

      console.log("Post created successfully:", data);

      // Validate response before using
      if (!data?.id || data?.success === false) {
        throw new Error(data?.message || "Post creation failed");
      }

      const newPost = {
        ...data,
        id: data.id || Date.now(),
        title: postPayload.title,
        reactions: { likes: 0, dislikes: 0 },
        views: 1,
        userId: postPayload.userId,
      };

      console.log("New post object:", newPost);

      onPostCreated?.(newPost);

      setTitle("");
      setBody("");
      setAudienceIdx(0);
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
    } catch (err) {
      console.error("Post creation failed:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [title, body, audienceIdx, onPostCreated]);

  const charLen = body.length;
  const canPost = charLen > 0 && charLen <= MAX_CHARS && !loading;
  const AudienceIcon = AUDIENCES[audienceIdx].icon;

  return (
    <>
      {/* Success toast */}
      {posted && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="flex items-center gap-3 min-w-[280px] rounded-2xl border border-green-500/20 bg-primary/90 backdrop-blur-2xl px-5 py-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
              <Check size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Post published</p>
              <p className="text-white/60 text-xs mt-0.5">
                Your post is now live
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Composer card */}
      <div className="rounded-3xl bg-white shadow-sm p-4 space-y-3">
        {/* Header: avatar + name + audience */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white shrink-0">
            <UserCircle size={26} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm font-semibold">You</span>
            <button
              type="button"
              onClick={cycleAudience}
              className="flex items-center gap-1 text-xs text-primary/60 bg-gray-100 hover:bg-gray-200 rounded-full px-2.5 py-1 transition-all"
            >
              <AudienceIcon size={12} />
              {AUDIENCES[audienceIdx].label}
              <ChevronDown size={11} />
            </button>
          </div>
        </div>

        {/* Title input */}
        <input
          type="text"
          placeholder="Post title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-primary/40 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-all"
        />

        {/* Body textarea */}
        <textarea
          ref={textareaRef}
          placeholder="What's on your mind?"
          value={body}
          rows={2}
          onChange={handleBodyChange}
          className="w-full bg-transparent border-none outline-none resize-none text-primary placeholder:text-primary/40 text-sm leading-relaxed"
          style={{ minHeight: "48px", maxHeight: "160px" }}
        />

        <div className="h-px bg-gray-100" />

        {/* Footer: char count + Post button */}
        <div className="flex items-center justify-end gap-3">
          {charLen > 0 && (
            <span
              className={`text-xs tabular-nums ${charLen > MAX_CHARS ? "text-red-500" : charLen > MAX_CHARS * 0.9 ? "text-yellow-500" : "text-primary/40"}`}
            >
              {charLen}/{MAX_CHARS}
            </span>
          )}
          <button
            type="button"
            onClick={handleCreatePost}
            disabled={!canPost}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Posting...
              </>
            ) : posted ? (
              <>
                <Check size={14} /> Done
              </>
            ) : (
              <>
                <Send size={14} /> Post
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
