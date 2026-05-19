"use client";

import { useState } from "react";
import { Search, Settings, User2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/10 bg-[#050816] backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/purpl.png"
              width={160}
              height={40}
              alt="Profile Pictur"
            />
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />

              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/10 border-2 border-purple-400 rounded-full pl-11 pr-4 py-3 text-sm text-white/40 placeholder:text-white/40 outline-none focus:border-purple-500 focus:bg-white/10 transition-all "
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* SETTINGS */}
            <button className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-black/30 flex items-center justify-center text-gray-300 hover:bg-black/70 hover:text-white transition-all">
              <Settings size={25} />
            </button>

            {/* USER ICON */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-gray-300 font-semibold cursor-pointer ring-2 ring-purple-500/30 hover:text-white">
              <User2 />
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search posts..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
