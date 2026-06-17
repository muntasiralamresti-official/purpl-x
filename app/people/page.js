import { User } from "lucide-react";
import Sidebar from "../component/Sidebar";
import { get } from "../lib/apiClient";
import Image from "next/image";

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

          {/* Grid */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
            {data?.users?.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl xs:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="h-28 xs:h-32 sm:h-36 md:h-40 overflow-hidden">
                  <Image
                    src={user.image}
                    alt={user.firstName}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="px-3 xs:px-4 sm:px-5 py-3 xs:py-4 sm:py-5 text-start">
                  <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-primary truncate">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-[11px] xs:text-xs sm:text-sm text-primary/60 mt-0.5 xs:mt-1">
                    {user.id % 40 + 6} mutual friends
                  </p>

                  {/* Buttons */}
                  <div className="mt-3 xs:mt-4 sm:mt-5 space-y-1.5 xs:space-y-2">
                    <button className="w-full py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl bg-brand hover:bg-brand/80 text-white text-xs xs:text-sm sm:text-base font-medium transition-all">
                      Add Friend
                    </button>
                    <button className="w-full py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-primary text-xs xs:text-sm sm:text-base font-medium transition-all">
                      Remove
                    </button>
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

// Update Next:- Usable Add Friend and Remove Button