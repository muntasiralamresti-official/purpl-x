// app/page.js

import {
  ImageIcon,
  Smile,
  MapPin,
  Video,
  UserCircle,
} from "lucide-react";

import PostCard from "./component/ui/PostCard";

import RandomPostButton from "./component/ui/RandomPostButton";

import { get } from "./lib/apiClient";
import Sidebar from "./component/Sidebar";

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
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0B1120] to-[#111827] py-8 px-4 flex justify-between">
      
      <Sidebar/>

      <div className="mx-auto max-w-5xl space-y-6">

        {/* CREATE POST */}
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            backdrop-blur-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.37)]
            p-5
          "
        >
          
          {/* TOP */}
          <div className="flex items-center gap-4">
            
            {/* AVATAR */}
            <div
              className="
                w-14 h-14
                rounded-full
                bg-gradient-to-br
                from-blue-500
                via-indigo-500
                to-purple-600
                flex items-center justify-center
                text-white
              "
            >
              <UserCircle size={34} />
            </div>

            {/* INPUT */}
            <button
              className="
                flex-1
                h-14
                rounded-full
                bg-white/5
                border border-white/10
                text-left
                px-6
                text-gray-400
                hover:bg-white/10
                transition-all
              "
            >
              {"What's on your mind?"}
            </button>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-white/10 my-5" />

          {/* OPTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* PHOTO */}
            <button
              className="
                flex items-center justify-center gap-2
                rounded-2xl
                py-4
                bg-white/5
                hover:bg-white/10
                transition-all
                text-gray-300
              "
            >
              <ImageIcon
                size={20}
                className="text-green-400"
              />

              <span>Photo</span>
            </button>

            {/* VIDEO */}
            <button
              className="
                flex items-center justify-center gap-2
                rounded-2xl
                py-4
                bg-white/5
                hover:bg-white/10
                transition-all
                text-gray-300
              "
            >
              <Video
                size={20}
                className="text-red-400"
              />

              <span>Video</span>
            </button>

            {/* FEELING */}
            <button
              className="
                flex items-center justify-center gap-2
                rounded-2xl
                py-4
                bg-white/5
                hover:bg-white/10
                transition-all
                text-gray-300
              "
            >
              <Smile
                size={20}
                className="text-yellow-400"
              />

              <span>Feeling</span>
            </button>

            {/* LOCATION */}
            <button
              className="
                flex items-center justify-center gap-2
                rounded-2xl
                py-4
                bg-white/5
                hover:bg-white/10
                transition-all
                text-gray-300
              "
            >
              <MapPin
                size={20}
                className="text-blue-400"
              />

              <span>Location</span>
            </button>
          </div>
        </div>

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