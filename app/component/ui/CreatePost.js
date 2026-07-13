/* eslint-disable @next/next/no-img-element */
"use client"
import {
  Bookmark, Check, ChevronDown, Eye, Flag, Globe,
  Hash, ImageIcon, Loader2, Lock, MapPin, MoreHorizontal,
  Pencil, Send, Smile, ThumbsDown, ThumbsUp, Trash2,
  UserCircle, Users, Video, X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { post } from "@/app/lib/apiClient";
 
// ─── CreatePost ────────────────────────────────────────────────────────────────
 
const MAX_CHARS = 300;
 
const AUDIENCES = [
  { label: "Public",  icon: Globe,  value: "public"   },
  { label: "Friends", icon: Users,  value: "friends"  },
  { label: "Only me", icon: Lock,   value: "only_me"  },
];
 
const TOPICS = ["Design", "Tech", "Life", "Travel", "Music", "Art", "Food", "News"];
 
const QUICK_BUTTONS = [
  { key: "feeling",  label: "Feeling",  icon: Smile,  color: "text-yellow-500" },
  { key: "location", label: "Location", icon: MapPin, color: "text-brand"       },
];
 
function charCountColor(len) {
  if (len > MAX_CHARS)            return "text-red-500";
  if (len > MAX_CHARS * 0.9)      return "text-yellow-500";
  return "text-primary/50";
}
 
export function CreatePost({ onPostCreated }) {
  const [body,        setBody]        = useState("");
  const [audienceIdx, setAudienceIdx] = useState(0);
  const [attachments, setAttachments] = useState(new Set());
  const [topics,      setTopics]      = useState(new Set());
  const [topicOpen,   setTopicOpen]   = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [posted,      setPosted]      = useState(false);
 
  const [file,        setFile]        = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType,    setFileType]    = useState(null);
 
  const textareaRef   = useRef(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
 
  const handleBodyChange = useCallback((e) => {
    setBody(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, []);
 
  const applyFile = useCallback((f, type) => {
    if (!f) return;
    setFilePreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(f); });
    setFile(f);
    setFileType(type);
  }, []);
 
  const removeFile = useCallback((revoke = true) => {
    setFilePreview((prev) => { if (prev && revoke) URL.revokeObjectURL(prev); return null; });
    setFile(null);
    setFileType(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  }, []);
 
  const handlePhotoChange = useCallback((e) => { const f = e.target.files?.[0]; if (f) applyFile(f, "image"); }, [applyFile]);
  const handleVideoChange = useCallback((e) => { const f = e.target.files?.[0]; if (f) applyFile(f, "video"); }, [applyFile]);
 
  const toggleAttachment = useCallback((key) => {
    setAttachments((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  }, []);
 
  const toggleTopic = useCallback((topic) => {
    setTopics((prev) => { const next = new Set(prev); next.has(topic) ? next.delete(topic) : next.add(topic); return next; });
  }, []);
 
  const cycleAudience = useCallback(() => setAudienceIdx((i) => (i + 1) % AUDIENCES.length), []);
 
  const handleCreatePost = useCallback(async () => {
    if (!body.trim() || body.length > MAX_CHARS) return;
    try {
      setLoading(true);
      setPosted(false);
 
      const data = await post("/posts/add", { title: "New Post", body, userId: 5 });
 
      // Capture before removeFile() revokes the blob URL
      const savedPreview = filePreview;
      const savedType    = fileType;
 
      const newPost = {
        ...data,
        id:           Date.now(),
        title:        "",
        tags:         ["new", "purpl-x", ...Array.from(topics)],
        reactions:    { likes: 0, dislikes: 0 },
        views:        1,
        userId:       9,
        mediaPreview: savedPreview,
        mediaType:    savedType,
      };
 
      onPostCreated?.(newPost);
 
      setBody("");
      setAttachments(new Set());
      setTopics(new Set());
      setTopicOpen(false);
      removeFile(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong ☠️");
    } finally {
      setLoading(false);
    }
  }, [body, topics, filePreview, fileType, removeFile, onPostCreated]);
 
  const charLen     = body.length;
  const canPost     = charLen > 0 && charLen <= MAX_CHARS && !loading;
  const AudienceIcon = AUDIENCES[audienceIdx].icon;
 
  return (
    <>
      {/* Success notice */}
      {posted && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
          <div className="flex items-center gap-3 min-w-[300px] rounded-2xl border border-green-500/20 bg-primary/90 backdrop-blur-2xl px-5 py-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
              <Check size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Post published</p>
              <p className="text-white text-xs mt-0.5">Your post is now live</p>
            </div>
          </div>
        </div>
      )}
 
      {/* Hidden file inputs */}
      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
 
      {/* Composer card */}
      <div className="rounded-3xl bg-white backdrop-blur-2xl shadow-sm p-4 space-y-2">
        <div className="flex items-start gap-3 w-full">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center text-white shrink-0">
            <UserCircle size={28} />
          </div>
 
          <div className="flex-1">
            {/* Name + audience */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary text-base font-semibold">You</span>
              <button
                type="button"
                onClick={cycleAudience}
                className="flex items-center gap-1.5 text-primary/70 bg-white hover:bg-white/10 rounded-full px-3 py-1 transition-all"
              >
                <AudienceIcon size={14} />
                {AUDIENCES[audienceIdx].label}
                <ChevronDown size={13} />
              </button>
            </div>
 
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              placeholder="What's on your mind"
              value={body}
              rows={1}
              onChange={handleBodyChange}
              className="w-full bg-transparent border-none outline-none resize-none text-primary placeholder:text-primary/50 text-base leading-relaxed overflow-hidden"
              style={{ minHeight: "32px", maxHeight: "120px" }}
            />
 
            {/* Media preview */}
            {filePreview && (
              <div className="relative mt-2 rounded-2xl overflow-hidden bg-primary/30">
                {fileType === "video" ? (
                  <video src={filePreview} controls className="w-full max-h-full object-cover rounded-2xl" />
                ) : (
                  <img src={filePreview} alt="Preview" className="w-full max-h-full object-cover rounded-2xl" />
                )}
                <div className="absolute bottom-2 left-2 text-xs text-white/80 bg-primary/50 rounded-lg px-2 py-1 backdrop-blur-2xl capitalize">
                  {fileType === "image" ? "Image" : "Video"} · {file?.name}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary/60 hover:bg-primary/80 flex items-center justify-center text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            )}
 
            {/* Topic pills */}
            {topics.size > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(topics).map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-secondary/80 text-white rounded-full px-3 py-1">
                    <Hash size={11} />{t}
                    <button type="button" onClick={() => toggleTopic(t)} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
 
            {/* Attachment pills */}
            {attachments.size > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(attachments).map((key) => {
                  const btn  = QUICK_BUTTONS.find((b) => b.key === key);
                  const Icon = btn.icon;
                  return (
                    <span key={key} className="flex items-center gap-1.5 text-xs bg-white text-primary/40 border border-white/10 px-3 py-1 rounded-full">
                      <Icon size={12} className={btn.color} />
                      {btn.label} added
                      <button type="button" onClick={() => toggleAttachment(key)} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
                        <X size={11} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
 
        <div className="h-px bg-white/10" />
 
        {/* Topic picker */}
        {topicOpen && (
          <div className="flex flex-wrap gap-2 pb-1">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTopic(t)}
                className={`text-xs rounded-full px-3 py-1.5 transition-all ${topics.has(t) ? "bg-brand text-white" : "bg-white text-primary/70 hover:bg-white/10"}`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
 
        {/* Toolbar */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Photo */}
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className={`flex items-center gap-1.5 text-base rounded-xl px-3 py-2 transition-all ${fileType === "image" ? "bg-white/10 text-primary/20" : "text-primary/50 hover:bg-white/5 hover:text-primary"}`}
          >
            <ImageIcon size={24} className={fileType === "image" ? "text-green-400" : "text-green-500"} />
            <span className="hidden sm:inline">Photo</span>
          </button>
 
          {/* Video */}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className={`flex items-center gap-1.5 text-base rounded-xl px-3 py-2 transition-all ${fileType === "video" ? "bg-white/10 text-primary/20" : "text-primary/50 hover:bg-white/5 hover:text-primary"}`}
          >
            <Video size={24} className={fileType === "video" ? "text-red-400" : "text-red-500"} />
            <span className="hidden sm:inline">Video</span>
          </button>
 
          {/* Feeling / Location */}
          {QUICK_BUTTONS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleAttachment(key)}
              className={`flex items-center gap-1.5 text-base rounded-xl px-3 py-2 transition-all ${attachments.has(key) ? "bg-white/10 text-primary" : "text-primary hover:bg-white/5 hover:text-primary/80"}`}
            >
              <Icon size={24} className={attachments.has(key) ? "text-white" : color} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
 
          {/* Topic */}
          <button
            type="button"
            onClick={() => setTopicOpen((o) => !o)}
            className={`flex items-center gap-1.5 text-base rounded-xl px-3 py-2 transition-all ${topicOpen || topics.size > 0 ? "bg-white/10 text-primary" : "text-primary hover:bg-white/5 hover:text-primary/80"}`}
          >
            <Hash size={20} className={topicOpen || topics.size > 0 ? "text-white" : "text-brand"} />
            <span className="hidden sm:inline">Topic</span>
            {topics.size > 0 && (
              <span className="w-5 h-5 rounded-full bg-secondary/50 text-white text-xs flex items-center justify-center font-semibold">
                {topics.size}
              </span>
            )}
          </button>
 
          {/* Char count + Send */}
          <div className="ml-auto flex items-center gap-3">
            {charLen > 0 && (
              <span className={`text-xs tabular-nums ${charCountColor(charLen)}`}>
                {charLen}/{MAX_CHARS}
              </span>
            )}
            <button
              type="button"
              onClick={handleCreatePost}
              disabled={!canPost}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Posting...</>
              ) : posted ? (
                <><Check size={15} /> Done</>
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}