// app/profile/page.js

import Image from "next/image";

import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  User2,
  Calendar,
} from "lucide-react";

async function getUser() {

  const res = await fetch(
    "https://dummyjson.com/users/1",
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return res.json();
}

export default async function ProfilePage() {

  const user = await getUser();

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#050816]
        via-[#0B1120]
        to-[#111827]
        py-8
        px-4
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
          space-y-6
        "
      >

        {/* COVER */}
        {/* COVER SECTION */}
{/* FACEBOOK STYLE COVER */}
<div
  className="
    relative
    rounded-b-3xl
    overflow-hidden
    border
    border-white/10
    bg-[#1c1c1d]
    mb-8
  "
>

  {/* COVER */}
  <div className="relative h-[420px]">

    <Image
      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
      alt="cover"
      fill
      priority
      className="object-cover"
    />

    {/* OVERLAY */}
    <div className="absolute inset-0 bg-black/20" />

    {/* EDIT COVER */}
    <button
      className="
        absolute
        bottom-5
        right-5
        px-5
        h-11
        rounded-xl
        bg-white
        text-black
        text-sm
        font-medium
        flex
        items-center
        gap-2
        hover:bg-gray-200
        transition-all
      "
    >
      📷 Edit cover photo
    </button>
  </div>

  {/* PROFILE SECTION */}
  <div
    className="
      px-10
      pb-6
      pt-5
      flex
      items-end
      justify-between
      flex-wrap
      gap-6
      relative
    "
  >

    {/* LEFT */}
    <div className="flex items-end gap-6">

      {/* PROFILE IMAGE */}
      <div
        className="
          relative
          -mt-24
          w-44
          h-44
          rounded-full
          overflow-hidden
          border-[5px]
          border-[#1c1c1d]
          shrink-0
        "
      >

        <Image
          src={user.image}
          alt={user.firstName}
          fill
          className="object-cover"
        />
      </div>

      {/* USER INFO */}
      <div className="pb-2">

        <h1
          className="
            text-5xl
            font-bold
            text-white
            leading-tight
          "
        >
          {user.firstName}{" "}
          {user.lastName}
        </h1>

        <p
          className="
            text-white/70
            text-lg
            mt-1
          "
        >
          5.5K followers • 1K following
        </p>

        {/* BIO */}
        <p
          className="
            text-white/80
            mt-3
            text-[17px]
          "
        >
          He knows what is in every heart. 🌻✨
        </p>

        {/* EXTRA INFO */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-2
            mt-3
            text-white/70
            text-sm
          "
        >

          <span>📍 Gazipur</span>

          <span>💼 WordPress</span>

          <span>🎓 Engineering Student</span>

          <span>📸 @mun_tas_0</span>
        </div>
      </div>
    </div>

    {/* RIGHT BUTTONS */}
    <div className="flex items-center gap-3 pb-2">

      <button
        className="
          px-6
          h-12
          rounded-xl
          bg-brand
          text-white
          font-semibold
          hover:opacity-90
          transition-all
        "
      >
        Dashboard
      </button>

      <button
        className="
          px-6
          h-12
          rounded-xl
          bg-white/10
          text-white
          font-semibold
          hover:bg-white/20
          transition-all
        "
      >
        Edit
      </button>

      <button
        className="
          w-12
          h-12
          rounded-xl
          bg-white/10
          text-white
          text-xl
          hover:bg-white/20
          transition-all
        "
      >
        ⋯
      </button>
    </div>
  </div>
</div>

        {/* CONTENT */}
        <div
          className="
            grid
            lg:grid-cols-[350px_1fr]
            gap-6
          "
        >

          {/* LEFT */}
          <div className="space-y-6">

            {/* ABOUT */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-6
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                  text-white
                  mb-5
                "
              >
                About
              </h2>

              <div className="space-y-4">

                <div className="flex gap-3">

                  <User2
                    size={18}
                    className="text-pink-400"
                  />

                  <p className="text-gray-300">
                    {user.gender}
                  </p>
                </div>

                <div className="flex gap-3">

                  <Mail
                    size={18}
                    className="text-blue-400"
                  />

                  <p className="text-gray-300">
                    {user.email}
                  </p>
                </div>

                <div className="flex gap-3">

                  <Phone
                    size={18}
                    className="text-green-400"
                  />

                  <p className="text-gray-300">
                    {user.phone}
                  </p>
                </div>

                <div className="flex gap-3">

                  <MapPin
                    size={18}
                    className="text-red-400"
                  />

                  <p className="text-gray-300">
                    {user.address.city},{" "}
                    {user.address.state}
                  </p>
                </div>

                <div className="flex gap-3">

                  <Calendar
                    size={18}
                    className="text-yellow-400"
                  />

                  <p className="text-gray-300">
                    Age: {user.age}
                  </p>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-6
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                  text-white
                  mb-5
                "
              >
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">

                {[
                  "React",
                  "Next.js",
                  "UI Design",
                  "Tailwind",
                  "Node.js",
                  "Figma",
                ].map((skill) => (

                  <span
                    key={skill}
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-white/5
                      border
                      border-white/10
                      text-gray-300
                      text-sm
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* BIO */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-6
              "
            >

              <h2
                className="
                  text-2xl
                  font-semibold
                  text-white
                  mb-4
                "
              >
                Bio
              </h2>

              <p
                className="
                  text-gray-300
                  leading-8
                "
              >
                Passionate frontend developer
                building modern social media
                experiences with React,
                Next.js, and Tailwind CSS 🌌
              </p>
            </div>

            {/* EXPERIENCE */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-6
              "
            >

              <h2
                className="
                  text-2xl
                  font-semibold
                  text-white
                  mb-5
                "
              >
                Experience
              </h2>

              <div className="space-y-5">

                <div
                  className="
                    flex gap-4
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-pink-500/20
                      flex
                      items-center
                      justify-center
                      text-pink-400
                    "
                  >
                    <Briefcase size={20} />
                  </div>

                  <div>

                    <h3
                      className="
                        text-white
                        font-medium
                      "
                    >
                      Frontend Developer
                    </h3>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >
                      Purpl-x Team
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex gap-4
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-blue-500/20
                      flex
                      items-center
                      justify-center
                      text-blue-400
                    "
                  >
                    <GraduationCap
                      size={20}
                    />
                  </div>

                  <div>

                    <h3
                      className="
                        text-white
                        font-medium
                      "
                    >
                      Computer Science
                    </h3>

                    <p
                      className="
                        text-gray-400
                        text-sm
                      "
                    >
                      Diploma Student
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-xl
                p-6
              "
            >

              <h2
                className="
                  text-2xl
                  font-semibold
                  text-white
                  mb-5
                "
              >
                Website
              </h2>

              <a
                href="https://dummyjson.com"
                target="_blank"
                className="
                  flex
                  items-center
                  gap-3
                  text-blue-400
                  hover:text-pink-400
                  transition-all
                "
              >

                <Globe size={20} />

                dummyjson.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}