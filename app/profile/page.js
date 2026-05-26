import { User2 } from "lucide-react";
import Image from "next/image";

async function getUser() {
  const res = await fetch("https://dummyjson.com/users/1", {
    next: { revalidate: 60 },
  });

  return res.json();
}

export default async function Profile() {
  const user = await getUser();

  return (
    <main className="min-h-screen bg-primary/70 pb-6 px-4">
      <div className="container mx-auto space-y-6">
        {/* Cover/profile Section */}

        <div className="relative rounded-b-4xl overflow-hidden border border-white/10 bg-primary/50 mb-8">
          {/* Cover */}

          <div className="relative h-[400px]">
            <Image
              src="/cover.jpg"
              alt="cover"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20" />
            <button className="absolute bottom-5 right-5 px-5 h-11 rounded-xl bg-white text-black text-base font-medium flex items-center gap-2 hover:bg-primary/10 hover:text-white transition-all">
              📷 Edit cover photo
            </button>
          </div>

          {/* PROFILE SECTION */}

          <div className="px-10 pb-6 pt-4 flex items-end justify-between flex-wrap gap-6 relative">
            {/* left */}

            <div className="flex items-end gap-6">
              {/* Proflie Image */}
              <div className="relative -mt-24 w-44 h-44 rounded-full overflow-hidden border-4 border-brand bg-primary shrink-0">
                <Image
                  src={user.image}
                  alt={user.firstName}
                  fill
                  className="object-cover"
                />
              </div>
              {/* User Info */}

              <div className="pb-2">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-white/80 text-lg mt-1">
                 2.3K followers • 64 following
                </p>
                <p className="text-white/80 mt-3 text-lg">This Project Created By
                  <span className="text-brand font-semibold">
                    {" "}Muntasir Alam Resti
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3 pb-2">
                <button className="px-6 h-12 rounded-xl bg-brand text-white font-semibold hover:opacity-90 transition-all">
                  Dashboard
                </button>
                <button className="px-6 h-12 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20  transition-all">
                  Edit
                </button>
                <button className="w-12 h-12 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 text-xl transition-all">
                  ⋯
                </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-[350px_fr] gap-6">
            {/* LEFT */}
            <div className="space-y-6">
                {/* ABOUT */}
                <div className="rounded-3xl border border-white/10 bg-primary/70 backdrop-blur-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-5">About</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <User2 size={18} className="text-secondary/60"/>
                    <p className="text-primary/60">
                        {user.gender}
                    </p>
                  </div>
                </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
