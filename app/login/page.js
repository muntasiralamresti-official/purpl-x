// app/login/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { post } from "@/app/lib/apiClient";
import { useAuth } from "@/app/lib/AuthContext";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  /* LOGIN */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);

      // Use apiClient.post() instead of raw fetch
      const data = await post("/auth/login", {
        username,
        password,
        expiresInMins: 60 * 24 * 7,
      });

      /* INVALID response */
      if (!data?.id) {
        throw new Error("Invalid username or password");
      }

      /* SAVE via AuthContext (handles localStorage + cookie) */
      login(data);

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(error.message || "Login failed 😵");
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
              <Image
                src="/purpl-x-logo.png"
                alt="Purpl-x"
                width={160}
                height={40}
                className="object-contain"
              />
            </div>

            {/* ERROR */}
            {errorMsg && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
                {errorMsg}
              </div>
            )}

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
                    outline-none
                    focus:border-brand
                    transition-all
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
                    outline-none
                    focus:border-brand
                    transition-all
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
                  disabled:opacity-60
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
              DummyJSON auth ✨ — try{" "}
              <span className="font-mono text-brand">emilys / emilyspass</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
