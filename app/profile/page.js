import {
  Briefcase,
  Calendar,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User2,
} from "lucide-react";
import Image from "next/image";

async function getUser() {
  try {
    const res = await fetch("https://dummyjson.com/users/1", {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Failed with status ${res.status}`);

    const user = await res.json();

    // Validate required fields
    if (!user?.id || !user?.address?.city || !user?.address?.state) {
      throw new Error("Invalid user data structure");
    }

    return user;
  } catch (error) {
    throw error; // Let Next.js handle with error.js boundary
  }
}

export default async function Profile() {
  const user = await getUser();

  return (
    <main className="min-h-screen bg-white pb-6 px-0 xs:px-2 sm:px-4">
      <div className="container mx-auto space-y-4 xs:space-y-5 sm:space-y-6">
        {/* Cover / Profile Section */}
        <div className="relative rounded-b-3xl xs:rounded-b-4xl overflow-hidden shadow-sm bg-white mb-6 xs:mb-8">
          {/* Cover */}
          <div className="relative h-[180px] xs:h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
            <Image
              src="/cover.jpg"
              alt="cover"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20" />
            <button className="absolute bottom-3 right-3 xs:bottom-4 xs:right-4 sm:bottom-5 sm:right-5 px-3 xs:px-4 sm:px-5 h-8 xs:h-9 sm:h-11 rounded-lg xs:rounded-xl bg-white text-primary text-xs xs:text-sm sm:text-base font-medium flex items-center gap-1.5 xs:gap-2 hover:bg-primary/10 hover:text-white transition-all">
              📷 <span className="hidden xs:inline">Edit cover photo</span>
              <span className="xs:hidden">Edit</span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="px-3 xs:px-5 sm:px-8 md:px-10 pb-4 xs:pb-5 sm:pb-6 pt-3 xs:pt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 xs:gap-5 sm:gap-6 relative">
            {/* Left */}
            <div className="flex flex-col xs:flex-row xs:items-end gap-3 xs:gap-4 sm:gap-6">
              {/* Profile Image */}
              <div className="relative -mt-12 xs:-mt-16 sm:-mt-20 md:-mt-24 w-24 h-24 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-brand bg-primary shrink-0">
                <Image
                  src={user.image}
                  alt={user.firstName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* User Info */}
              <div className="pb-0 xs:pb-1 sm:pb-2">
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-primary/80 text-sm xs:text-base sm:text-lg mt-0.5 xs:mt-1">
                  2.3K followers • 64 following
                </p>
                <p className="text-primary/80 mt-1.5 xs:mt-2 sm:mt-3 text-sm xs:text-base sm:text-lg">
                  This Project Created By
                  <span className="text-brand font-semibold">
                    {" "}
                    Muntasir Alam Resti
                  </span>
                </p>
              </div>
            </div>

            {/* Right — Action Buttons */}
            <div className="flex items-center gap-2 xs:gap-3 pb-0 sm:pb-2">
              <button className="px-3 xs:px-4 sm:px-6 h-9 xs:h-10 sm:h-12 rounded-lg xs:rounded-xl bg-brand text-white text-xs xs:text-sm sm:text-base font-semibold hover:opacity-90 transition-all">
                Dashboard
              </button>
              <button className="px-3 xs:px-4 sm:px-6 h-9 xs:h-10 sm:h-12 rounded-lg xs:rounded-xl hover:bg-primary/80 text-white text-xs xs:text-sm sm:text-base font-semibold bg-primary transition-all">
                Edit
              </button>
              <button className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl hover:bg-primary/80 text-white text-base xs:text-lg sm:text-xl font-semibold bg-primary transition-all">
                ⋯
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[350px_1fr] gap-4 xs:gap-5 sm:gap-6 px-2 xs:px-0">
          {/* Left Column */}
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* About */}
            <div className="rounded-2xl xs:rounded-3xl bg-white shadow-sm p-4 xs:p-5 sm:p-6">
              <h2 className="text-lg xs:text-xl font-semibold text-primary mb-3 xs:mb-4 sm:mb-5">
                About
              </h2>
              <div className="space-y-3 xs:space-y-4">
                <div className="flex gap-2 xs:gap-3 items-center">
                  <User2
                    size={16}
                    className="text-secondary/60 shrink-0 xs:size-[18px]"
                  />
                  <p className="text-primary/80 capitalize text-sm xs:text-base">
                    {user.gender}
                  </p>
                </div>
                <div className="flex gap-2 xs:gap-3 items-center">
                  <Mail
                    size={16}
                    className="text-brand shrink-0 xs:size-[18px]"
                  />
                  <p className="text-primary/80 text-sm xs:text-base break-all">
                    {user.email}
                  </p>
                </div>
                <div className="flex gap-2 xs:gap-3 items-center">
                  <Phone
                    size={16}
                    className="text-green-600 shrink-0 xs:size-[18px]"
                  />
                  <p className="text-primary/80 text-sm xs:text-base">
                    {user.phone}
                  </p>
                </div>
                <div className="flex gap-2 xs:gap-3 items-center">
                  <MapPin
                    size={16}
                    className="text-red-600 shrink-0 xs:size-[18px]"
                  />
                  <p className="text-primary/80 text-sm xs:text-base">
                    {user.address.city}, {user.address.state}
                  </p>
                </div>
                <div className="flex gap-2 xs:gap-3 items-center">
                  <Calendar
                    size={16}
                    className="text-yellow-400 shrink-0 xs:size-[18px]"
                  />
                  <p className="text-primary/80 text-sm xs:text-base">
                    Age: {user.age}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white shadow-sm rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6">
              <h2 className="text-lg xs:text-xl font-semibold text-primary mb-3 xs:mb-4 sm:mb-5">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 xs:gap-3">
                {[
                  "React",
                  "Next.js",
                  "Tailwind",
                  "WordPress",
                  "UI Design",
                  "Digital Marketing",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-white/5 border border-gray-200 text-primary/80 text-xs xs:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            {/* Bio */}
            <div className="rounded-2xl xs:rounded-3xl bg-white shadow-sm p-4 xs:p-5 sm:p-6">
              <h2 className="text-xl xs:text-2xl font-semibold text-primary mb-3 xs:mb-4">
                Bio
              </h2>
              <p className="text-primary/90 leading-7 xs:leading-8 text-sm xs:text-base">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
            </div>

            {/* Experience */}
            <div className="rounded-2xl xs:rounded-3xl bg-white shadow-sm p-4 xs:p-5 sm:p-6">
              <h2 className="text-xl xs:text-2xl font-semibold text-primary mb-4 xs:mb-5">
                Experience
              </h2>
              <div className="space-y-4 xs:space-y-5">
                <div className="flex gap-3 xs:gap-4 items-center">
                  <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-xl xs:rounded-2xl bg-secondary/40 flex items-center justify-center text-primary shrink-0">
                    <Briefcase size={18} className="sm:size-5" />
                  </div>
                  <div>
                    <h3 className="text-primary font-medium text-sm xs:text-base">
                      Frontend Developer
                    </h3>
                    <p className="text-primary/70 text-xs xs:text-sm">Team-Y</p>
                  </div>
                </div>

                <div className="flex gap-3 xs:gap-4 items-center">
                  <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-xl xs:rounded-2xl bg-brand/80 flex items-center justify-center text-primary shrink-0">
                    <GraduationCap size={18} className="sm:size-5" />
                  </div>
                  <div>
                    <h3 className="text-primary font-medium text-sm xs:text-base">
                      Computer Science
                    </h3>
                    <p className="text-primary/70 text-xs xs:text-sm">
                      University-Y
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Link */}
            <div className="rounded-2xl xs:rounded-3xl bg-white shadow-sm p-4 xs:p-5 sm:p-6">
              <h2 className="text-xl xs:text-2xl font-semibold text-primary mb-4 xs:mb-5">
                Links
              </h2>

              <a
                href="https://muntasiralamresti.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 xs:gap-3 text-brand hover:text-primary transition-all text-sm xs:text-base break-all"
              >
                <Globe size={18} className="shrink-0 sm:size-5" />
                muntasiralamresti.vercel.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
