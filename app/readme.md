"use client";

import Image from "next/image";
import { Plus, Sparkles, X, Upload, Send, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

/_ ─────────────────────────────────────────────
DATA FETCHING HOOK
───────────────────────────────────────────── _/
function useStories() {
const [stories, setStories] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
async function fetchStories() {
try {
setLoading(true);

    const [usersData, postsData] =
      await Promise.all([
        get(
          "/users?limit=12&select=id,firstName,lastName,username,image"
        ),
        get("/posts?limit=12"),
      ]);

    const users = usersData?.users ?? [];
    const posts = postsData?.posts ?? [];

    const mapped = users.map((user, i) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      username: `@${user.username}`,
      image: user.image,
      story: user.image,
      type: "image",
      caption: posts[i]?.title ?? "",
      viewed: false,
      isOwn: i === 0,
    }));

    setStories(mapped);

} catch (err) {
setError(err.message);
console.error(err);
} finally {
setLoading(false);
}
}

    fetchStories();

}, []);

return { stories, setStories, loading, error };
}

/_ ─────────────────────────────────────────────
SKELETON CARD
───────────────────────────────────────────── _/
function SkeletonCard() {
return (

<div className="relative min-w-[112px] h-[190px] rounded-[22px] flex-shrink-0 overflow-hidden bg-white/5 animate-pulse">
{/_ fake avatar _/}
<div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/10" />
{/_ fake name bar _/}
<div className="absolute bottom-4 left-3 right-3 h-2 rounded-full bg-white/10" />
<div className="absolute bottom-9 left-3 w-3/4 h-2 rounded-full bg-white/[0.07]" />
</div>
);
}

/_ ─────────────────────────────────────────────
STORY VIEWER MODAL
───────────────────────────────────────────── _/
function StoryViewer({ stories, startIndex, onClose }) {
const [idx, setIdx] = useState(startIndex);
const [progress, setProgress] = useState(0);
const intervalRef = useRef(null);
const nextRef = useRef(null);
const DURATION = 5000;
const story = stories[idx];

const next = useCallback(() => {
if (idx < stories.length - 1) { setIdx((i) => i + 1); setProgress(0); }
else onClose();
}, [idx, stories.length, onClose]);

const prev = useCallback(() => {
if (idx > 0) { setIdx((i) => i - 1); setProgress(0); }
}, [idx]);

// keep ref in sync so interval always calls the latest next()
useEffect(() => { nextRef.current = next; }, [next]);

useEffect(() => {
clearInterval(intervalRef.current);
let current = 0;
setProgress(0);
intervalRef.current = setInterval(() => {
current += 100 / (DURATION / 100);
if (current >= 100) {
clearInterval(intervalRef.current);
setProgress(100);
nextRef.current?.();
} else {
setProgress(Math.min(current, 99));
}
}, 100);
return () => clearInterval(intervalRef.current);
}, [idx]);

useEffect(() => {
const onKey = (e) => {
if (e.key === "ArrowRight") next();
if (e.key === "ArrowLeft") prev();
if (e.key === "Escape") onClose();
};
window.addEventListener("keydown", onKey);
return () => window.removeEventListener("keydown", onKey);
}, [next, prev, onClose]);

if (!story) return null;

return (

<div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/85 backdrop-blur-lg"
      onClick={onClose}
    >
<div
className="relative w-[340px] h-[600px] rounded-[32px] overflow-hidden shadow-2xl"
onClick={(e) => e.stopPropagation()} >
{/_ media _/}
{story.type === "video" ? (
<video src={story.story} autoPlay loop className="absolute inset-0 w-full h-full object-cover" />
) : (
<Image
sizes="340px"
src={story.story}
alt={story.name}
fill
className="object-cover"
unoptimized // DummyJSON URLs are external — skip Next.js image optimisation
/>
)}

        {/* gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/50" />

        {/* progress bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%",
                  transition: i === idx ? "none" : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
              <Image
                src={story.image}
                alt={story.name}
                width={36}
                height={36}
                unoptimized
                className="rounded-full object-cover w-full h-full border-2 border-primary"
              />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">{story.name}</p>
              <p className="text-white/50 text-xs mt-0.5">
                {story.username ?? "Just now"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary/40 hover:bg-primary/70 flex items-center justify-center text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* caption */}
        {story.caption && (
          <div className="absolute bottom-16 left-4 right-4 text-center">
            <p className="text-white text-sm bg-primary/40 backdrop-blur-sm rounded-xl px-3 py-2 line-clamp-2">
              {story.caption}
            </p>
          </div>
        )}

        {/* prev / next tap zones */}
        <button
          onClick={prev}
          className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-3 opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center">
            <ChevronLeft size={16} className="text-white" />
          </div>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-3 opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center">
            <ChevronRight size={16} className="text-white" />
          </div>
        </button>
      </div>
    </div>

);
}

/_ ─────────────────────────────────────────────
UPLOAD MODAL
───────────────────────────────────────────── _/
function UploadModal({ onClose, onPost }) {
const [file, setFile] = useState(null);
const [preview, setPreview] = useState(null);
const [fileType, setFileType] = useState(null);
const [caption, setCaption] = useState("");
const [dragOver, setDragOver] = useState(false);
const [posting, setPosting] = useState(false);
const fileInputRef = useRef(null);

const applyFile = useCallback((f) => {
if (!f) return;
const isVideo = f.type.startsWith("video");
if (!f.type.startsWith("image") && !isVideo) return;
setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(f); });
setFile(f);
setFileType(isVideo ? "video" : "image");
}, []);

const handleDrop = useCallback((e) => {
e.preventDefault();
setDragOver(false);
applyFile(e.dataTransfer.files?.[0]);
}, [applyFile]);

const handlePost = useCallback(async () => {
if (!file) return;
setPosting(true);
await new Promise((r) => setTimeout(r, 900));
onPost({
id: Date.now(),
name: "You",
username: "@you",
image: "/purpl-x.png",
story: preview,
type: fileType,
caption,
isOwn: true,
});
setPosting(false);
onClose();
}, [file, preview, fileType, caption, onPost, onClose]);

const reset = () => {
if (preview) URL.revokeObjectURL(preview);
setFile(null); setPreview(null); setFileType(null); setCaption("");
};

return (

<div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-primary/80 backdrop-blur-lg"
      onClick={onClose}
    >
<div
className="relative w-full max-w-sm mx-4 rounded-[28px] border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden"
onClick={(e) => e.stopPropagation()} >
{/_ header _/}
<div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
<h2 className="text-white font-semibold text-sm">Create Story</h2>
<button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
<X size={15} />
</button>
</div>

        <div className="p-5 space-y-4">
          {!preview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-12 ${
                dragOver
                  ? "border-purple-500/70 bg-purple-500/10"
                  : "border-white/10 hover:border-white/25 hover:bg-white/5"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Upload size={24} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium">Drop your file here</p>
                <p className="text-gray-500 text-xs mt-1">
                  or <span className="text-secondary/80 underline underline-offset-2">browse</span> to choose
                </p>
              </div>
              <div className="flex gap-2 mt-1">
                {["JPG", "PNG", "GIF", "MP4", "MOV"].map((ext) => (
                  <span key={ext} className="text-[10px] text-primary/80 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-primary" style={{ aspectRatio: "9/16", maxHeight: 320 }}>
                {fileType === "video" ? (
                  <video src={preview} autoPlay muted loop className="w-full h-full object-cover" />
                ) : (
                  <Image src={preview} alt="Preview" fill sizes="384px" className="object-cover" unoptimized />
                )}
                <div className="absolute top-2 left-2 text-[10px] font-semibold text-white bg-primary/50 backdrop-blur-sm rounded-lg px-2 py-1 capitalize flex items-center gap-1">
                  {fileType === "video" ? <Play size={10} /> : <Sparkles size={10} />}
                  {fileType}
                </div>
                <button
                  onClick={reset}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary/60 hover:bg-primary/80 flex items-center justify-center text-white transition-all"
                >
                  <X size={13} />
                </button>
                <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white/60 bg-primary/40 backdrop-blur-sm rounded-lg px-2 py-1 truncate">
                  {file?.name}
                </div>
              </div>

              <input
                type="text"
                placeholder="Add a caption… (optional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={100}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => applyFile(e.target.files?.[0])}
          />

          <div className="flex gap-2">
            {preview && (
              <button
                onClick={reset}
                className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
              >
                Change
              </button>
            )}
            <button
              onClick={preview ? handlePost : () => fileInputRef.current?.click()}
              disabled={posting}
              className="flex-1 h-11 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {posting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting…</>
              ) : preview ? (
                <><Send size={15} /> Share Story</>
              ) : (
                <><Upload size={15} /> Choose File</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>

);
}

/_ ─────────────────────────────────────────────
STORY CARD
───────────────────────────────────────────── _/
function StoryCard({ story, isAddCard, onClick }) {
return (

<div
onClick={onClick}
className="relative min-w-[112px] h-[190px] rounded-[22px] overflow-hidden cursor-pointer flex-shrink-0 group transition-all duration-300 hover:-translate-y-1"
style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }} >
{/_ background _/}
{isAddCard ? (
<div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-[#0f172a]" />
) : story.type === "video" ? (
<video
          src={story.story}
          muted
          loop
          autoPlay
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
) : (
<Image
src={story.story}
alt={story.name}
fill
sizes="112px"
unoptimized // external DummyJSON URLs
className="object-cover transition-transform duration-700 group-hover:scale-110"
/>
)}

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/25" />

      {/* shimmer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* hover ring */}
      <div className="absolute inset-0 rounded-[22px] ring-0 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all duration-300" />

      {/* avatar / icon */}
      <div className="absolute top-3 left-3">
        {isAddCard ? (
          <div className="w-9 h-9 rounded-full bg-brand shadow-lg shadow-brand/40 flex items-center justify-center ring-2 ring-white/20">
            <Plus size={18} className="text-white" />
          </div>
        ) : story.isOwn ? (
          <div className="w-9 h-9 rounded-full p-[2.5px] bg-brand shadow-lg">
            <Image
              src={story.image}
              alt={story.name}
              width={36}
              height={36}
              unoptimized
              className="rounded-full object-cover w-full h-full border-[2px] border-[#0f172a]"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full p-[2.5px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg">
            <Image
              src={story.image}
              alt={story.name}
              width={36}
              height={36}
              unoptimized
              className="rounded-full object-cover w-full h-full border-[2px] border-[#0f172a]"
            />
          </div>
        )}
      </div>

      {/* badge */}
      {!isAddCard && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-0.5 text-[9px] font-bold text-white bg-brand/80 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            {story.type === "video" ? <Play size={7} /> : <Sparkles size={7} />}
            {story.isOwn ? "YOU" : story.type === "video" ? "VID" : "NEW"}
          </span>
        </div>
      )}

      {/* name */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
        <p className="text-white font-semibold text-[11px] truncate leading-snug drop-shadow-lg">
          {isAddCard ? "Add Story" : story.isOwn ? "Your Story" : story.name}
        </p>
        {!isAddCard && (
          <p className="text-white/40 text-[9px] mt-0.5">Tap to view</p>
        )}
      </div>
    </div>

);
}

/_ ─────────────────────────────────────────────
MAIN
───────────────────────────────────────────── _/
export default function StorySection() {
const { stories, setStories, loading, error } = useStories();
const [uploadOpen, setUploadOpen] = useState(false);
const [viewerIndex, setViewerIndex] = useState(null);

const handlePost = useCallback((newStory) => {
setStories((prev) => [newStory, ...prev]);
}, [setStories]);

const handleCardClick = useCallback((story, index) => {
setViewerIndex(index);
}, []);

return (
<>
{uploadOpen && (
<UploadModal onClose={() => setUploadOpen(false)} onPost={handlePost} />
)}

      {viewerIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-0.5">

        {/* Add story card — always first, never viewable */}
        <StoryCard isAddCard onClick={() => setUploadOpen(true)} />

        {/* Loading skeletons — show 8 placeholders */}
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}

        {/* Error state */}
        {error && (
          <div className="flex items-center px-4 text-white/40 text-xs">
            Failed to load stories.
          </div>
        )}

        {/* All stories from DummyJSON — including own uploaded ones */}
        {!loading && stories.map((story, i) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => handleCardClick(story, i)}
          />
        ))}
      </div>
    </>

);
}
