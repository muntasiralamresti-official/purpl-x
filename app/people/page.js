import { User } from "lucide-react";
import Sidebar from "../component/Sidebar";
import { get } from "../lib/apiClient";
import FriendGrid from "./FriendGrid";

async function getUsers() {
  return await get("/users?limit=80", {
    revalidate: 60 * 5,
  });
}

export default async function FriendsPage() {
  let data = { users: [] };

  try {
    data = await getUsers();

    if (!data?.users || !Array.isArray(data.users)) {
      throw new Error("Failed to load friends");
    }
  } catch (error) {
    console.error("Friends fetch error:", error);
    // Return empty state page
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-2 xs:px-3 sm:px-4 pt-4 xs:pt-5 sm:pt-6 flex gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Friends */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-5 xs:mb-6 sm:mb-8">
            <div className="flex items-center gap-3 xs:gap-4">
              <div className="w-11 h-11 xs:w-13 xs:h-13 sm:w-16 sm:h-16 rounded-2xl xs:rounded-3xl bg-brand shadow-2xl flex items-center justify-center text-white shrink-0">
                <User size={22} className="xs:hidden" />
                <User size={28} className="hidden xs:block sm:hidden" />
                <User size={36} className="hidden sm:block" />
              </div>
              <div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary">
                  Friends
                </h1>
                <p className="text-primary/60 mt-0.5 xs:mt-1 text-xs xs:text-sm sm:text-base">
                  Connect with people around you
                </p>
              </div>
            </div>
          </div>

          {/* FriendGrid — client component handles search + friend toggle */}
          <FriendGrid users={data?.users || []} />
        </div>
      </div>
    </main>
  );
}
