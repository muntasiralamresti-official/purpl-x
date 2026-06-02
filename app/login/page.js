// app/login/page.js

"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  /* LOGIN */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      /* INVALID */
      if (data.message) {
        alert("Invalid username or password 😵");

        return;
      }

      /* SAVE USER */
      localStorage.setItem("purpl-user", JSON.stringify(data));

      alert(`Welcome ${data.firstName} 🚀`);

      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert("Login failed 😵");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-white
        px-4
      "
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full">
        <div
          className="
            relative
            px-6
            py-10
            border
            border-2
            bg-white
            shadow-2xl
            rounded-3xl
            sm:p-10
          "
        >
          <div className="max-w-md mx-auto">
            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <img src="/purpl-x.png" alt="Purpl-x" className="w-[160px]" />
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* USERNAME */}
              <div>
                <label
                  className="
                    font-semibold
                    text-sm
                    text-gray-700
                    block
                    mb-2
                  "
                >
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    border-primary/40
                    text-primary
                  "
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  className="
                    font-semibold
                    text-sm
                    text-gray-700
                    block
                    mb-2
                  "
                >
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    border-primary/40
                    text-primary
                  "
                />
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-brand
                  text-white
                  font-semibold
                  hover:opacity-90
                  transition-all
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* DEMO TEXT */}
            <div
              className="
                mt-6
                text-center
                text-sm
                text-gray-500
              "
            >
              DummyJSON auth✨
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
