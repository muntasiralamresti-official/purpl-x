// app/not-found.js

"use client";

import Link from "next/link";

import { Ghost, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#050816]
        via-[#0B1120]
        to-[#111827]
        flex
        items-center
        justify-center
        px-4
      "
    >
      {/* CARD */}
      <div
        className="
          max-w-xl
          w-full
          rounded-[40px]
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.37)]
          p-10
          text-center
        "
      >
        {/* ICON */}
        <div
          className="
            w-28 h-28
            mx-auto
            rounded-full
            bg-gradient-to-br
            from-purple-500
            to-brand
            flex
            items-center
            justify-center
            text-white
            shadow-lg
            shadow-purple-500/30
            mb-8
          "
        >
          <Ghost size={55} />
        </div>

        {/* 404 */}
        <h1
          className="
            text-7xl
            font-primary
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-secondary/80
            to-blue-400
            mb-4
          "
        >
          404
        </h1>

        {/* TITLE */}
        <h2
          className="
            text-3xl
            font-bold
            text-white
            mb-4
          "
        >
          Lost In The Purpl Universe 🌌
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            text-gray-400
            leading-8
            text-lg
            mb-10
          "
        >
          {"The page you're looking for doesn't exist."}
        </p>

        {/* BUTTONS */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
          "
        >
          {/* GO BACK */}
          <button
            onClick={() => window.history.back()}
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              px-6 py-4
              rounded-2xl
              bg-white/5
              border border-white/10
              text-gray-300
              hover:bg-white/10
              hover:text-white
              transition-all
            "
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* HOME */}
          <Link
            href="/"
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              px-6 py-4
              rounded-2xl
              bg-gradient-to-r
              from-purple-500
              to-brand
              text-white
              font-medium
              hover:opacity-90
              transition-all
            "
          >
            <Home size={18} />
            Back To Home
          </Link>
        </div>
      </div>
    </main>
  );
}
