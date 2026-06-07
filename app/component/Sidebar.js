"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { Users, LayoutDashboard, Clock3, Bookmark, MessageCircle, UserCircle2, Home, Bell, Settings, Images,} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  const [user, setUser] = useState(null);

  /* LOAD USER */
  useEffect(() => {
    setMounted(true);

    try {
      const storedUser = localStorage.getItem("purpl-user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* PREVENT HYDRATION */
  if (!mounted) {
    return null;
  }

  /* MENU ITEMS */
  const menuItems = [
    {
      icon: <Home size={22} />,
      label: "Feed",
      href: "/",
    },

    {
      icon: <Users size={22} />,
      label: "Friends",
      href: "/people",
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
      href: "/message",
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
        w-[340px]
        sticky
        top-[95px]
        h-[calc(100vh-110px)]
        bg-white
        rounded-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.12)]
        p-4
        overflow-y-auto
        shrink-0
      "
    >
      {/* PROFILE */}
      <Link
        href="/profile"
        className="
          flex items-center gap-4
          p-4
          rounded-3xl
          bg-White/80
          border border-primary/20
          shadow-sm
          mb-5
          transition-all
          hover:bg-[#eeeeef]
        "
      >
        {/* USER IMAGE */}
        <div
          className="
            w-16 h-16
            rounded-full
            overflow-hidden
            bg-brand
            flex items-center
            justify-center
            shrink-0
          "
        >
          {user?.image ? (
            <img
              src={user.image}
              alt={user.firstName}
              className="
                w-full
                h-full
                object-cover
              "
            />
          ) : (
            <UserCircle2 size={38} className="text-white" />
          )}
        </div>

        {/* USER INFO */}
        <div className="overflow-hidden">
          <h2
            className="
              text-primary
              font-bold
              text-2xl
              leading-tight
              truncate
            "
          >
            {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
          </h2>

          <p
            className="
              text-[#6e6e73]
              text-base
              truncate
              mt-1
            "
          >
            {user?.username ? `@${user.username}` : "@guest"}
          </p>
        </div>
      </Link>

      {/* MENU */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const active = pathname === item.href;

          return (
            <Link
              key={index}
              href={item.href}
              className={`
                w-full
                flex items-center gap-5
                px-6 py-5
                rounded-[22px]
                border
                transition-all duration-300

                ${
                  active
                    ? `
                      bg-brand
                      border-brand/50
                      text-white
                      shadow-md
                    `
                    : `
                      bg-White/80
                      border-primary/20
                      text-[#1d1d1f]
                      hover:bg-[#ebebee]
                      hover:border-primary/30
                    `
                }
              `}
            >
              {/* ICON */}
              <div
                className={`
                  ${active ? "text-white" : "text-brand"}
                `}
              >
                {item.icon}
              </div>

              {/* LABEL */}
              <span
                className="
                  text-[18px]
                  font-medium
                "
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
