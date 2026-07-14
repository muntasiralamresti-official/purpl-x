"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, MessageCircle, UserCircle2, Home, Bell } from "lucide-react";
import { useAuth } from "@/app/lib/AuthContext";

export default function MobileFooterBar() {
  const pathname = usePathname();
  const { user, mounted } = useAuth();

  if (!mounted) return null;

  const mobileTabItems = [
    { icon: <Home size={24} />, label: "Home", href: "/" },
    { icon: <Users size={24} />, label: "Friends", href: "/people" },
    { icon: <MessageCircle size={24} />, label: "Messages", href: "/message" },
    { icon: <Bell size={24} />, label: "Notifications", href: "/notifications" },
    { icon: <UserCircle2 size={24} />, label: "Profile", href: "/profile" },
  ];

  return (
    <nav
      className="
        lg:hidden
        fixed bottom-0 left-0 right-0
        z-50
        bg-white
        border-t border-gray-200
        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
        h-[60px]
        flex items-center
        px-2
      "
    >
      {mobileTabItems.map((item, index) => {
        const active = pathname === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            className="
              flex-1
              flex flex-col items-center justify-center
              gap-0.5
              py-1
              transition-all duration-200
            "
          >
            {item.label === "Profile" ? (
              <div
                className={`
                  w-7 h-7 rounded-full overflow-hidden
                  flex items-center justify-center
                  ${active ? "ring-2 ring-brand ring-offset-1" : ""}
                `}
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2
                    size={24}
                    className={active ? "text-brand" : "text-gray-500"}
                  />
                )}
              </div>
            ) : (
              <div
                className={`
                  transition-all duration-200
                  ${active ? "text-brand scale-110" : "text-gray-500"}
                `}
              >
                {item.icon}
              </div>
            )}

            <span
              className={`
                text-[10px] font-medium leading-none
                transition-colors duration-200
                ${active ? "text-brand" : "text-gray-500"}
              `}
            >
              {item.label}
            </span>

            {active && (
              <span className="w-1 h-1 rounded-full bg-brand mt-0.5" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}