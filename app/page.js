// app/page.js

import Sidebar from "./component/Sidebar";

import PostCard from "./component/ui/PostCard";

import CreatePost from "./component/ui/CreatePost";

import RandomPostButton from "./component/ui/RandomPostButton";

import { get } from "./lib/apiClient";

export default async function Home({
  searchParams,
}) {

  const params = await searchParams;

  const skip =
    Number(params?.skip) || 0;

  const limit = 20;

  /* FETCH POSTS */
  const data = await get(
    `/posts?limit=${limit}&skip=${skip}`,
    {
      revalidate: 60,
    }
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0B1120] to-[#111827]">

      {/* MAIN CONTAINER */}
      <div
        className="
          max-w-[1400px]
          mx-auto
          pt-6
          px-4
          flex
          gap-8
        "
      >

        {/* SIDEBAR */}
        <Sidebar />

        {/* FEED */}
        <div
          className="
            flex-1
            max-w-[1100px]
            mx-auto
            space-y-6
          "
        >

          {/* CREATE POST */}
          <CreatePost />

          {/* POSTS */}
          {data?.posts?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}

          {/* RANDOM BUTTON */}
          <div className="flex justify-center pt-8 pb-10">

            <RandomPostButton
              total={data.total}
              limit={limit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}