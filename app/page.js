import PostCard from "./component/ui/PostCard";

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
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0B1120] to-[#111827] py-8 px-4">
      
      <div className="mx-auto max-w-6xl space-y-6">

        {/* POSTS */}
        {data?.posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}

        {/* RANDOM BUTTON */}
        <div className="flex justify-center pt-8">
          
          <RandomPostButton
            total={data.total}
            limit={limit}
          />
        </div>
      </div>
    </main>
  );
}