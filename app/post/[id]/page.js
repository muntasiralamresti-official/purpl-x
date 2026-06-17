import PostCard from "@/app/component/ui/PostCard";
import { get } from "@/app/lib/apiClient";
import { MessageCircle, ThumbsUp, UserCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PostDetails({params}) {
  // get id
  const { id } = await params;

  // Invalid id
  if (!id) {notFound();}

  let post = null;
  let comments = null;

  try{
    // fetch post
    post = await get(`/posts/${id}`,{
      revalidate: 60,
    });

    // Validate post response
    if (!post?.id) {
      throw new Error("Post not found");
    }

    // fetch comments
    comments = await get(`/posts/${id}/comments`,{
      revalidate:60,
    });
  } catch (error) {
    console.error("Post fetch error:", error);
    notFound();
  }
  return(
    <main className="min-h-screen bg-white py-8 px-4">
      {/* Container */}
      <div className="container mx-auto space-y-6">
        {/* Post */}
        <PostCard post={post} details={true}/>
         {/* Comments */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary text-2xl font-semibold">
            <MessageCircle/>
            Comments
          </div>

          {/* NO Comments */}
          {(!comments?.comments || !Array.isArray(comments.comments) || comments.comments.length === 0) && (
            <div className="rounded-3xl bg-white backdrop-blur-2xl shadow-sm p-10 text-center">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-primary mb-5">
                <MessageCircle size={36}/>
              </div>
              <h2 className="text-primary text-2xl font-bold mb-2">No Comments Yet</h2>
            </div>
          )}
          {/* Comments List */}
          {comments?.comments && Array.isArray(comments.comments) && comments.comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-white shadow-sm backdrop-blur-2xl p-5">
              {/* User */}
               <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white">
                  <UserCircle size={28}/>
                </div>

                {/* Info */}
                <div>
                  <h2 className="text-primary font-semibold">{comment.user?.fullName || "Anonymous"}</h2>
                </div>
               </div>

               {/* Comment Body */}
               <p className="text-primary/90 leading-7">{comment.body}</p>

               {/* Likes */}
               <div className="flex items-center gap-2 mt-4 text-primary/90 text-sm">
                <ThumbsUp size={15}/>
                <span>{comment.likes || 0} Likes</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}