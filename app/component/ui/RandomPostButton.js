"use client";

import { useRouter } from "next/navigation";

export default function RandomPostButton({
  total,
  limit,
}) {

  const router = useRouter();

  function handleRandomPosts() {

    const maxSkip =
      Math.max(total - limit, 0);

    const randomSkip =
      Math.floor(
        Math.random() * maxSkip
      );

    router.push(
      `/?skip=${randomSkip}`
    );
  }

  return (
    <button
      onClick={handleRandomPosts}
      className="
        px-6 py-4
        rounded-2xl
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        text-white
        hover:bg-white/10
        hover:border-purple-500/30
        transition-all duration-300
      "
    >
      Explore Random Posts ✨
    </button>
  );
}