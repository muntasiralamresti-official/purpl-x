"use client";

import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import StorySection from "./StorySection";
import { CreatePost } from "./CreatePost";

import { get } from "@/app/lib/apiClient";

export default function Feed({ serverPosts, total }) {
  const [posts, setPosts] = useState(serverPosts || []);
  const [skip, setSkip] = useState(20);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;
    if (skip >= total) return;

    setLoading(true);

    try {
      const data = await get(`/posts?limit=20&skip=${skip}`);

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniquePosts = data.posts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniquePosts];
      });

      setSkip((prev) => prev + 20);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skip, loading]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newPost.id);
      if (exists) return prev;
      return [newPost, ...prev];
    });
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[680px] lg:max-w-[1120px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 py-4 xs:py-5 sm:py-6 space-y-4 xs:space-y-5 sm:space-y-6">

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Story */}
        <StorySection />

        {/* Posts */}
        <div className="space-y-4 xs:space-y-5 sm:space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-6 xs:py-8 text-primary/70 text-sm xs:text-base">
            Loading more posts...
          </div>
        )}

        {/* End */}
        {skip >= total && (
          <div className="text-center py-6 xs:py-8 text-primary/50 text-sm xs:text-base">
            🎉 No more posts available
          </div>
        )}
      </div>
    </div>
  );
}