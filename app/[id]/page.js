import {
  MessageCircle,
  UserCircle,
  ThumbsUp,
} from "lucide-react";

import { get } from "../lib/apiClient";

import PostCard from "../component/ui/PostCard";

export default async function PostDetails({
  params,
}) {

  const { id } = await params;

  const post = await get(
    `/posts/${id}`,
    {
      revalidate: 60,
    }
  );

  const comments = await get(
    `/posts/${id}/comments`,
    {
      revalidate: 60,
    }
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0B1120] to-[#111827] py-8 px-4">
      
      <div className=" mx-auto max-w-6xl space-y-6">

        {/* POST CARD */}
        <PostCard
          post={post}
          details={true}
        />

        {/* COMMENTS */}
        {/* COMMENTS */}
<div className="space-y-4">
  
  {/* HEADING */}
  <div className="flex items-center gap-2 text-white text-2xl font-semibold">
    <MessageCircle />
    Comments
  </div>

  {/* IF COMMENTS EXIST */}
  {comments?.comments?.length > 0 ? (

    comments.comments.map((comment) => (
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
          
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <UserCircle size={28} />
          </div>

          <div>
            <h2 className="text-white font-medium">
              {comment.user.fullName}
            </h2>

            <p className="text-gray-400 text-sm">
              @{comment.user.username}
            </p>
          </div>
        </div>

        {/* COMMENT */}
        <p className="text-gray-300 leading-7">
          {comment.body}
        </p>

        {/* LIKES */}
        <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
          
          <ThumbsUp size={15} />

          <span>
            {comment.likes} Likes
          </span>
        </div>
      </div>
    ))

  ) : (

    /* NO COMMENTS */
    <div
      className="
        rounded-2xl
        border border-dashed border-white/10
        bg-white/5
        backdrop-blur-xl
        py-14
        px-6
        text-center
      "
    >
      
      <div className="flex justify-center mb-4 text-purple-400">
        <MessageCircle size={50} />
      </div>

      <h2 className="text-white text-2xl font-semibold">
        No Comments Yet
      </h2>

      <p className="text-gray-400 mt-2">
        This post is floating silently through the galaxy 🌌
      </p>
    </div>
  )}
</div>
      </div>
    </main>
  );
}