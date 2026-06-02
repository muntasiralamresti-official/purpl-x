"use client";

import { useState } from "react";

import { MessageCircleIcon, Search, User2 } from "lucide-react";

import Link from "next/link";

import Image from "next/image";
import Notification from "./ui/Notification";
import MessagePopup from "./ui/MessagePopup";
import ProfilePopup from "./ui/ProfilePopup";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav
      className="
        w-full
        sticky
        top-0
        z-50
        border-b
        border-primary/10
        bg-white
        backdrop-blur-xl
        shadow-sm
      "
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div
          className="
            h-20
            flex
            items-center
            justify-between
          "
        >
          {/* LOGO */}
          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              cursor-pointer
            "
          >
            <Image
              src="/purpl-x-logo.png"
              width={160}
              height={40}
              alt="Purpl Logo"
              className="object-contain"
            />
          </Link>

          {/* SEARCH */}
          <div
            className="
              hidden md:flex
              flex-1
              justify-center
              px-6
            "
          >
            <div
              className="
                relative
                w-full
                max-w-xl
              "
            >
              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-primary/40
                "
              />

              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  bg-[#f5f5f7]
                  border
                  border-primary/10
                  rounded-full
                  pl-11
                  pr-4
                  py-3
                  text-sm
                  text-primary
                  placeholder:text-primary/40
                  outline-none
                  focus:border-[#4285f4]
                  focus:bg-white
                  transition-all
                "
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* Notification */}

            {/* <Notification className=" w-11 h-11 rounded-full"/> */}
            <Notification />
            {/* MESSAGE */}
            {/* <Link
              href="/message"
              className="
                w-11
                h-11
                rounded-full
                bg-[#4285f4]
                border
                border-primary/10
                flex
                items-center
                justify-center
                text-white
                hover:scale-105
                transition-all
                shadow-sm
              "
            >

              <MessageCircleIcon
                size={23}
              />
            </Link> */}
            <MessagePopup />

            {/* USER */}
            {/* <Link
              href="/login"
              className="
                w-11
                h-11
                rounded-full
                bg-[#4285f4]
                flex
                items-center
                justify-center
                text-white
                cursor-pointer
                hover:scale-105
                transition-all
                shadow-sm
              "
            >

              <User2 size={22} />
            </Link> */}
            <ProfilePopup />
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-primary/40
              "
            />

            <input
              type="text"
              placeholder="Search posts..."
              className="
                w-full
                bg-[#f5f5f7]
                border
                border-primary/10
                rounded-full
                pl-11
                pr-4
                py-3
                text-sm
                text-primary
                placeholder:text-primary/40
                outline-none
                focus:border-[#4285f4]
              "
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
