"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function LoginError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Login failed</h2>
        <p className="text-primary/60 mb-6">
          {error?.message || "An error occurred during login."}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg hover:opacity-90 transition-all"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
}
