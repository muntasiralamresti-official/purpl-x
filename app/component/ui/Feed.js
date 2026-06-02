"use client";

import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import StorySection from "./StorySection";
import { CreatePost } from "./CreatePost";

import { get } from "@/app/lib/apiClient";

export default function Feed({
  serverPosts,
  total,
}) {
  const [posts, setPosts] = useState(serverPosts || []);

  const [skip, setSkip] = useState(20);

  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;

    if (skip >= total) return;

    setLoading(true);

    try {
      const data = await get(
        `/posts?limit=20&skip=${skip}`
      );

      setPosts((prev) => {
  const existingIds = new Set(
    prev.map((p) => p.id)
  );

  const uniquePosts = data.posts.filter(
    (p) => !existingIds.has(p.id)
  );

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
      if (
        window.innerHeight +
          window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        loadMore();
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, [skip, loading]);

  const handlePostCreated = (newPost) => {
  setPosts((prev) => {
    const exists = prev.some(
      (p) => p.id === newPost.id
    );

    if (exists) return prev;

    return [newPost, ...prev];
  });
};

  return (
    <div className="flex-1 max-w-[1120px] mx-auto space-y-6">
      {/* Create Post */}
      <CreatePost
        onPostCreated={handlePostCreated}
      />

      {/* Story */}
      <StorySection />

      {/* Posts */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8 text-primary/70">
          Loading more posts...
        </div>
      )}

      {/* End */}
      {skip >= total && (
        <div className="text-center py-8 text-primary/50">
          🎉 No more posts available
        </div>
      )}
    </div>
  );
}