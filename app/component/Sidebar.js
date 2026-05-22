// app/component/Sidebar.js

"use client";

import {
  Users,
  LayoutDashboard,
  Clock3,
  Bookmark,
  MessageCircle,
  UserCircle2,
  Home,
  Bell,
  Settings,
  Images,
} from "lucide-react";

export default function Sidebar() {

  const menuItems = [
    {
      icon: <Home size={22} />,
      label: "Feed",
    },

    {
      icon: <Users size={22} />,
      label: "Friends",
    },

    {
      icon: <LayoutDashboard size={22} />,
      label: "Dashboard",
    },

    {
      icon: <Clock3 size={22} />,
      label: "Memories",
    },

    {
      icon: <Bookmark size={22} />,
      label: "Saved",
    },

    {
      icon: <MessageCircle size={22} />,
      label: "Messages",
    },

    {
      icon: <Bell size={22} />,
      label: "Notifications",
    },

    {
      icon: <Images size={22} />,
      label: "Media",
    },

    {
      icon: <Settings size={22} />,
      label: "Settings",
    },
  ];

  return (
    <aside
      className="
        hidden lg:block
        fixed left-0 top-[90px]
        w-[300px]
        h-[calc(100vh-100px)]
        overflow-y-auto
        px-4 pb-10
      "
    >
      
      {/* PROFILE */}
      <div
        className="
          flex items-center gap-4
          p-4
          rounded-3xl
          bg-white/5
          border border-white/10
          backdrop-blur-xl
          mb-5
        "
      >
        
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
          <UserCircle2 size={34} />
        </div>

        {/* INFO */}
        <div>
          <h2 className="text-white font-semibold text-lg">
            Muntasir Resti
          </h2>

          <p className="text-gray-400 text-sm">
            @purpl_user
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="space-y-2">
        
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="
              w-full
              flex items-center gap-4
              px-5 py-4
              rounded-2xl
              bg-white/5
              border border-transparent
              hover:border-purple-500/30
              hover:bg-white/10
              transition-all duration-300
              text-gray-300
              hover:text-white
            "
          >
            
            {/* ICON */}
            <div className="text-purple-400">
              {item.icon}
            </div>

            {/* LABEL */}
            <span className="text-[16px] font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}