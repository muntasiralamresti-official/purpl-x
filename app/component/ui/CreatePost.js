"use client";

import { useState } from "react";

import {
  ImageIcon,
  Smile,
  MapPin,
  Video,
  UserCircle,
  Loader2,
} from "lucide-react";

import PostCard from "./PostCard";

export default function CreatePost() {

  const [body, setBody] = useState("");

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [posts, setPosts] = useState([]);

  /* CREATE POST */
  const handleCreatePost = async () => {

    /* VALIDATION */
    if (!body.trim()) {

      alert("Please write something 🚀");

      return;
    }

    try {

      setLoading(true);

      setSuccess(false);

      const response = await fetch(
        "https://dummyjson.com/posts/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: "New Post",
            body,
            userId: 5,
          }),
        }
      );

      const data = await response.json();

      console.log("POST CREATED:", data);

      /* ADD POST TO UI */
      setPosts((prev) => [
        {
          ...data,

          id: Date.now(),

          title: "New Post",

          tags: ["new", "purpl-x"],

          reactions: {
            likes: 0,
            dislikes: 0,
          },

          views: 1,

          userId: 5,
        },

        ...prev,
      ]);

      /* RESET */
      setBody("");

      /* SUCCESS */
      setSuccess(true);

      /* AUTO HIDE */
      setTimeout(() => {

        setSuccess(false);

      }, 3000);

    } catch (error) {

      console.error(error);

      alert("Something went wrong 😵");

    } finally {

      setLoading(false);
    }
  };

  return (
    <>

      {/* SUCCESS TOAST */}
      {success && (
        <div
          className="
            fixed
            top-28
            left-1/2
            -translate-x-1/2
            z-[9999]
            animate-[toast_.35s_ease]
          "
        >
          <div
            className="
              relative
              overflow-hidden
              flex items-center gap-4
              min-w-[420px]
              rounded-[28px]
              border border-green-500/20
              bg-[#0f172a]/95
              backdrop-blur-2xl
              px-6 py-5
              shadow-[0_20px_80px_rgba(0,0,0,0.55)]
            "
          >

            {/* GLOW */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-green-500/10
                to-emerald-500/5
                pointer-events-none
              "
            />

            {/* ICON */}
            <div
              className="
                relative
                w-14 h-14
                rounded-2xl
                bg-gradient-to-br
                from-green-400
                to-emerald-600
                flex items-center justify-center
                text-white text-2xl
                shadow-lg
                shadow-green-500/30
                shrink-0
              "
            >
              ✨
            </div>

            {/* TEXT */}
            <div className="relative flex-1">

              <h2 className="text-white text-xl font-bold">
                Post Created Successfully
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                Your post is now floating inside Purpl-x 🚀
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST */}
      <div
        className="
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.37)]
          p-5
        "
      >

        {/* TOP */}
        <div className="flex items-start gap-4">

          {/* AVATAR */}
          <div
            className="
              w-14 h-14
              rounded-full
              bg-brand
              flex items-center justify-center
              text-white
              shrink-0
            "
          >
            <UserCircle size={34} />
          </div>

          {/* INPUT AREA */}
          <div className="flex-1 space-y-4">

            {/* TEXTAREA */}
            <textarea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) =>
                setBody(e.target.value)
              }
              className="
                w-full
                rounded-3xl
                bg-white/5
                border border-white/10
                px-5 pt-5
                text-white
                placeholder:text-gray-500
                outline-none
                resize-none
                focus:border-purple-500/50
                transition-all
              "
            />

            {/* OPTIONS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {/* PHOTO */}
              <button
                type="button"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  py-4
                  bg-white/5
                  hover:bg-white/10
                  transition-all
                  text-gray-300
                "
              >
                <ImageIcon
                  size={20}
                  className="text-green-400"
                />

                <span>Photo</span>
              </button>

              {/* VIDEO */}
              <button
                type="button"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  py-4
                  bg-white/5
                  hover:bg-white/10
                  transition-all
                  text-gray-300
                "
              >
                <Video
                  size={20}
                  className="text-red-400"
                />

                <span>Video</span>
              </button>

              {/* FEELING */}
              <button
                type="button"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  py-4
                  bg-white/5
                  hover:bg-white/10
                  transition-all
                  text-gray-300
                "
              >
                <Smile
                  size={20}
                  className="text-yellow-400"
                />

                <span>Feeling</span>
              </button>

              {/* LOCATION */}
              <button
                type="button"
                className="
                  flex items-center justify-center gap-2
                  rounded-2xl
                  py-4
                  bg-white/5
                  hover:bg-white/10
                  transition-all
                  text-gray-300
                "
              >
                <MapPin
                  size={20}
                  className="text-blue-400"
                />

                <span>Location</span>
              </button>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleCreatePost}
              disabled={loading}
              className="
                w-full
                h-14
                rounded-2xl
                bg-brand
                text-white
                font-semibold
                hover:opacity-90
                transition-all
                disabled:opacity-50
                flex items-center justify-center gap-2
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Posting...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LOCAL POSTS */}
      {posts.length > 0 && (
        <div className="space-y-6 mt-6">

          {posts.map((post) => (

            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}
    </>
  );
}