import PostCard from "@/app/component/ui/PostCard";
import { get } from "@/app/lib/apiClient";
import { notFound } from "next/navigation";
import CommentSection from "./CommentSection";

export default async function PostDetails({ params }) {
  // get id
  const { id } = await params;

  // Invalid id
  if (!id) {
    notFound();
  }

  let post = null;
  let comments = null;

  try {
    // fetch post
    post = await get(`/posts/${id}`, {
      revalidate: 60,
    });

    // Validate post response
    if (!post?.id) {
      throw new Error("Post not found");
    }

    // fetch comments
    comments = await get(`/posts/${id}/comments`, {
      revalidate: 60,
    });
  } catch (error) {
    console.error("Post fetch error:", error);
    notFound();
  }

  const initialComments =
    comments?.comments && Array.isArray(comments.comments)
      ? comments.comments
      : [];

  return (
    <main className="min-h-screen bg-white py-8 px-4">
      {/* Container */}
      <div className="container mx-auto space-y-6">
        {/* Post */}
        <PostCard post={post} details={true} />

        {/* Comments — client component handles form + list */}
        <CommentSection postId={id} initialComments={initialComments} />
      </div>
    </main>
  );
}
