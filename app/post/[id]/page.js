// app/[id]/page.js

import { MessageCircle, UserCircle, ThumbsUp } from "lucide-react";

import { notFound } from "next/navigation";

import PostCard from "../../component/ui/PostCard";

import { get } from "../../lib/apiClient";

export default async function PostDetails({ params }) {
  /* GET ID */
  const { id } = await params;

  /* INVALID ID */
  if (!id) {
    notFound();
  }

  let post = null;
  let comments = null;

  try {
    /* FETCH POST */
    post = await get(`/posts/${id}`, {
      revalidate: 60,
    });

    /* FETCH COMMENTS */
    comments = await get(`/posts/${id}/comments`, {
      revalidate: 60,
    });
  } catch (error) {
    /* SHOW 404 */
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0B1120] to-[#111827] py-8 px-4">
      {/* CONTAINER */}
      <div className="container mx-auto space-y-6">
        {/* POST CARD */}
        <PostCard post={post} details={true} />

        {/* COMMENTS */}
        <div className="space-y-4">
          {/* TITLE */}
          <div className="flex items-center gap-2 text-white text-2xl font-semibold">
            <MessageCircle />
            Comments
          </div>

          {/* NO COMMENTS */}
          {(!comments?.comments || comments.comments.length === 0) && (
            <div
              className="
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                p-10
                text-center
              "
            >
              <div
                className="
                  w-20 h-20
                  mx-auto
                  rounded-full
                  bg-gradient-to-br
                  from-purple-500
                  to-brand
                  flex items-center justify-center
                  text-white
                  mb-5
                "
              >
                <MessageCircle size={36} />
              </div>

              <h2 className="text-white text-2xl font-bold mb-2">
                No Comments Yet
              </h2>

              <p className="text-gray-400">
                This post is peacefully floating through space 🌌
              </p>
            </div>
          )}

          {/* COMMENTS LIST */}
          {comments?.comments?.map((comment) => (
            <div
              key={comment.id}
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                p-5
              "
            >
              {/* USER */}
              <div className="flex items-center gap-3 mb-4">
                {/* AVATAR */}
                <div
                  className="
                    w-12 h-12
                    rounded-full
                    bg-brand
                    flex items-center justify-center
                    text-white
                  "
                >
                  <UserCircle size={28} />
                </div>

                {/* INFO */}
                <div>
                  <h2 className="text-white font-medium">
                    {comment.user.fullName}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    @{comment.user.username}
                  </p>
                </div>
              </div>

              {/* COMMENT BODY */}
              <p className="text-gray-300 leading-7">{comment.body}</p>

              {/* LIKES */}
              <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
                <ThumbsUp size={15} />

                <span>{comment.likes || 0} Likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
