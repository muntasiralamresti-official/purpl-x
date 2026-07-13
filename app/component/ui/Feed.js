"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import PostCard from "./PostCard";
import StorySection from "./StorySection";
import { CreatePost } from "./CreatePost";

import { get } from "@/app/lib/apiClient";

export default function Feed({ serverPosts, total }) {
  const [posts, setPosts] = useState(serverPosts || []);
  const [skip, setSkip] = useState(20);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Client-side filter by title/body
  const filteredPosts = searchQuery
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.body.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  const loadMore = useCallback(async () => {
    if (loading) return;
    if (skip >= total) return;

    setLoading(true);

    try {
      const data = await get(`/posts?limit=20&skip=${skip}`);

      // Validate data structure
      if (!data?.posts || !Array.isArray(data.posts)) {
        throw new Error("Invalid response structure");
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniquePosts = data.posts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniquePosts];
      });

      setSkip((prev) => prev + 20);
    } catch (error) {
      console.error("Failed to load more posts:", error);
      alert("Failed to load more posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [skip, total, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newPost.id);
      if (exists) return prev;
      return [newPost, ...prev];
    });
  };

  /* Called by PostCard when a post is deleted */
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="w-full max-w-[680px] lg:max-w-[1120px] mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 py-4 xs:py-5 sm:py-6 space-y-4 xs:space-y-5 sm:space-y-6">
        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Story */}
        <StorySection />

        {/* Search result header */}
        {searchQuery && (
          <div className="px-1 text-sm xs:text-base text-primary/70">
            Search results for{" "}
            <span className="font-semibold text-brand">&ldquo;{searchQuery}&rdquo;</span>
            {" — "}
            <span>{filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found</span>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4 xs:space-y-5 sm:space-y-6">
          {filteredPosts.length === 0 && searchQuery ? (
            <div className="text-center py-12 text-primary/50">
              No posts found for &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
              />
            ))
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-6 xs:py-8 text-primary/70 text-sm xs:text-base">
            Loading more posts...
          </div>
        )}

        {/* End */}
        {!searchQuery && skip >= total && (
          <div className="text-center py-6 xs:py-8 text-primary/50 text-sm xs:text-base">
            🎉 No more posts available
          </div>
        )}
      </div>
    </div>
  );
}
