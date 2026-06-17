"use client";

import { useState } from "react";

import { Search,} from "lucide-react";

import Link from "next/link";

import Image from "next/image";
import Notification from "./ui/Notification";
import MessagePopup from "./ui/MessagePopup";
import ProfilePopup from "./ui/ProfilePopup";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav
      className=" w-full sticky top-0 z-50  border-b border-primary/10 bg-white backdrop-blur-xl shadow-sm " >
      <div className="container mx-auto px-4 lg:px-6">
        <div
          className=" h-20 flex items-center justify-between " >
          {/* LOGO */}
          <Link
            href="/"
            className=" flex items-center gap-3 cursor-pointer  " >
            <Image
              src="/purpl-x-logo.png"
              width={160}
              height={40}
              alt="Purpl Logo"
              className="object-contain w-[90px] sm:w-[140px] md:w-[160px] h-auto"
            />
          </Link>

          {/* SEARCH */}
          <div className="  hidden md:flex flex-1 justify-center px-6  " >
            <div className=" relative w-full max-w-xl " >
              <Search size={18} className=" absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 " />

              <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)}
                className=" w-full bg-white/80 border border-primary/10 rounded-full pl-11 pr-4 py-3  text-sm text-primary placeholder:text-primary/40 outline-none focus:border-brand focus:bg-white transition-all "
              />
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className=" flex items-center gap-3 ">
            {/* Notification */}

            <Notification />

            {/* Message */}

            <MessagePopup />

            {/* USER */}

            <ProfilePopup />
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search size={18}className=" absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 " />

            <input type="text" placeholder="Search posts..."
              className=" w-full bg-white/80 border border-primary/10 rounded-full pl-11 pr-4 py-3 text-sm text-primary placeholder:text-primary/40 outline-none focus:border-brand " />
          </div>
        </div>
      </div>
    </nav>
  );
}
