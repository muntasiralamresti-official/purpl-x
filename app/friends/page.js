// app/friends/page.js

import Image from "next/image";

import {
  UserPlus,
  Users,
  MapPin,
  Briefcase,
  MessageCircle,
  UserCheck,
} from "lucide-react";

import Sidebar from "../component/Sidebar";

import { get } from "../lib/apiClient";

async function getUsers() {

  return await get(
    "/users?limit=20",
    {
      revalidate: 60 * 5,
    }
  );
}

export default async function FriendsPage() {

  const data = await getUsers();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0B1120] to-[#111827]">

      {/* MAIN CONTAINER */}
      <div
        className="
          container
          mx-auto
          px-4
          pt-6
          flex
          gap-8
        "
      >

        {/* SIDEBAR */}
        <Sidebar />

        {/* CONTENT */}
        <div className="flex-1">

          {/* TITLE */}
          <div className="mb-8">

            <div className="flex items-center gap-4">

              {/* ICON */}
              <div
                className="
                  w-16 h-16
                  rounded-3xl
                  
                  flex items-center justify-center
                  text-white
                  
                "
              >
                <Users size={40} />
              </div>

              {/* TEXT */}
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Friends
                </h1>

                
              </div>
            </div>
          </div>

          {/* FRIENDS GRID */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {data?.users?.map((user) => (

              <div
                key={user.id}
                className="
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-2xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.37)]
                  overflow-hidden
                  hover:border-purple-500/30
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >

                {/* COVER */}
                <div
                  className="
                    h-28
                    bg-white
                  "
                />

                {/* CONTENT */}
                <div className="px-6 pb-6 relative">

                  {/* PROFILE IMAGE */}
                  <div
                    className="
                      absolute
                      -top-12
                      left-6
                      w-24 h-24
                      rounded-full
                      border-4 border-[#111827]
                      overflow-hidden
                      shadow-xl
                      bg-blue-500
                    "
                  >
                   <img
  src={user.image}
  alt={user.firstName}
  className="
    w-full
    h-full
    object-cover
  "
/>
                  </div>

                  {/* USER INFO */}
                  <div className="pt-16">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h2 className="text-white text-2xl font-bold">
                          {user.firstName} {user.lastName}
                        </h2>

                        <p className="text-purple-300 text-sm mt-1">
                          @{user.username}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div
                        className="
                          px-3 py-1
                          rounded-full
                          bg-green-500/10
                          border border-green-500/20
                          text-green-400
                          text-sm
                          flex items-center gap-1
                        "
                      >
                        <UserCheck size={14} />

                        Active
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-3 mt-5">

                      {/* COMPANY */}
                      <div className="flex items-center gap-3 text-gray-300">

                        <Briefcase
                          size={18}
                          className="text-blue-400"
                        />

                        <span>
                          {user.company?.title}
                        </span>
                      </div>

                      {/* LOCATION */}
                      <div className="flex items-center gap-3 text-gray-300">

                        <MapPin
                          size={18}
                          className="text-pink-400"
                        />

                        <span>
                          {user.address?.city},{" "}
                          {user.address?.state}
                        </span>
                      </div>

                      {/* EMAIL */}
                      <div className="flex items-center gap-3 text-gray-300">

                        <MessageCircle
                          size={18}
                          className="text-purple-400"
                        />

                        <span className="truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="grid grid-cols-2 gap-3 mt-6">

                      {/* ADD FRIEND */}
                      <button
                        className="
                          flex items-center justify-center gap-2
                          rounded-2xl
                          py-3
                          bg-blue-800
                          font-medium
                          hover:opacity-90
                          transition-all
                        "
                      >
                        <UserPlus size={18} />

                        Add Friend
                      </button>

                      {/* MESSAGE */}
                      <button
                        className="
                          flex items-center justify-center gap-2
                          rounded-2xl
                          py-3
                          bg-white/5
                          border border-white/10
                          text-gray-300
                          hover:bg-white/10
                          transition-all
                        "
                      >
                        <MessageCircle size={18} />

                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}