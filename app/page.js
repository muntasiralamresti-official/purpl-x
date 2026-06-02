import Sidebar from "./component/Sidebar";
import Feed from "./component/ui/Feed";
import { get } from "./lib/apiClient";

export default async function Home() {
  const limit = 20;

  const data = await get(`/posts?limit=${limit}&skip=0`, {
    revalidate: 60,
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto pt-6 px-4 flex gap-8">
        <Sidebar />

        <Feed
          serverPosts={data?.posts || []}
          total={data?.total || 0}
        />
      </div>
    </main>
  );
}