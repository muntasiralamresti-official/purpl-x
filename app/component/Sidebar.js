// app/component/Sidebar.js

"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

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

  const pathname = usePathname();

  const menuItems = [
    {
      icon: <Home size={22} />,
      label: "Feed",
      href: "/",
    },

    {
      icon: <Users size={22} />,
      label: "Friends",
      href: "/friends",
    },

    {
      icon: <LayoutDashboard size={22} />,
      label: "Dashboard",
      href: "/dashboard",
    },

    {
      icon: <Clock3 size={22} />,
      label: "Memories",
      href: "/memories",
    },

    {
      icon: <Bookmark size={22} />,
      label: "Saved",
      href: "/saved",
    },

    {
      icon: <MessageCircle size={22} />,
      label: "Messages",
      href: "/messages",
    },

    {
      icon: <Bell size={22} />,
      label: "Notifications",
      href: "/notifications",
    },

    {
      icon: <Images size={22} />,
      label: "Media",
      href: "/media",
    },

    {
      icon: <Settings size={22} />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <aside
      className="
        hidden lg:block
        w-[300px]
        sticky
        top-[100px]
        h-[calc(100vh-120px)]
        overflow-y-auto
        shrink-0
        pr-5
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
        
        {menuItems.map((item, index) => {

          const active =
            pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`
                w-full
                flex items-center gap-4
                px-5 py-4
                rounded-2xl
                border
                transition-all duration-300

                ${
                  active
                    ? `
                      bg-gradient-to-r
                      from-purple-500/20
                      to-blue-500/20
                      border-purple-500/30
                      text-white
                    `
                    : `
                      bg-white/5
                      border-transparent
                      text-gray-300
                      hover:border-purple-500/30
                      hover:bg-white/10
                      hover:text-white
                    `
                }
              `}
            >
              
              {/* ICON */}
              <div
                className={`
                  ${
                    active
                      ? "text-white"
                      : "text-purple-400"
                  }
                `}
              >
                {item.icon}
              </div>

              {/* LABEL */}
              <span className="text-[16px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}