import { Suspense } from "react";
import Sidebar from "./component/Sidebar";
import Feed from "./component/ui/Feed";
import { get } from "./lib/apiClient";

export default async function Home() {
  const limit = 20;
  let data = { posts: [], total: 0 };

  try {
    data = await get(`/posts?limit=${limit}&skip=0`, {
      revalidate: 60,
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    // Return with fallback empty data
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto pt-6 px-4 flex gap-8">
        <Sidebar />

        <Suspense fallback={<div className="flex-1 animate-pulse bg-gray-100 rounded-2xl min-h-screen" />}>
          <Feed serverPosts={data?.posts || []} total={data?.total || 0} />
        </Suspense>
      </div>
    </main>
  );
}

