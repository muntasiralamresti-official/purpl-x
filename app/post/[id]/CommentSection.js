"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2, UserCircle } from "lucide-react";
import { post } from "@/app/lib/apiClient";
import { useAuth } from "@/app/lib/AuthContext";

export default function CommentSection({ postId, initialComments = [] }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setError("");
    setLoading(true);

    try {
      const newComment = await post("/comments/add", {
        postId: Number(postId),
        body: body.trim(),
        userId: user?.id || 1,
      });

      // Optimistic prepend — put new comment at top
      setComments((prev) => [
        {
          id: newComment?.id || Date.now(),
          body: newComment?.body || body.trim(),
          likes: 0,
          user: {
            fullName:
              newComment?.user?.fullName ||
              (user ? `${user.firstName} ${user.lastName}` : "You"),
          },
        },
        ...prev,
      ]);

      setBody("");
    } catch (err) {
      console.error("Comment submit failed:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2 text-primary text-2xl font-semibold">
        <MessageCircle />
        Comments
        {comments.length > 0 && (
          <span className="text-base font-normal text-primary/50">
            ({comments.length})
          </span>
        )}
      </div>

      {/* Comment form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white shadow-sm p-4 xs:p-5 space-y-3"
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            user ? "Write a comment..." : "Login to write a comment..."
          }
          disabled={!user || loading}
          rows={3}
          className="w-full border border-primary/15 rounded-xl px-4 py-3 text-sm xs:text-base text-primary resize-none outline-none focus:border-brand transition-all placeholder:text-primary/40 disabled:opacity-60 disabled:bg-gray-50"
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!user || loading || !body.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand text-white text-sm xs:text-base font-medium hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send size={15} />
                Post
              </>
            )}
          </button>
        </div>
      </form>

      {/* No comments */}
      {comments.length === 0 && (
        <div className="rounded-3xl bg-white shadow-sm p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-primary mb-5">
            <MessageCircle size={36} />
          </div>
          <h2 className="text-primary text-2xl font-bold mb-2">
            No Comments Yet
          </h2>
          <p className="text-primary/50 text-sm">Be the first to comment!</p>
        </div>
      )}

      {/* Comments list */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-2xl bg-white shadow-sm backdrop-blur-2xl p-5"
        >
          {/* User */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white">
              <UserCircle size={28} />
            </div>

            {/* Info */}
            <div>
              <h2 className="text-primary font-semibold">
                {comment.user?.fullName || "Anonymous"}
              </h2>
            </div>
          </div>

          {/* Comment Body */}
          <p className="text-primary/90 leading-7">{comment.body}</p>

          {/* Likes */}
          <div className="flex items-center gap-2 mt-4 text-primary/90 text-sm">
            <MessageCircle size={15} />
            <span>{comment.likes || 0} Likes</span>
          </div>
        </div>
      ))}
    </div>
  );
}
