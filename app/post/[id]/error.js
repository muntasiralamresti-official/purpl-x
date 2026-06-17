'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function PostError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Failed to load post</h2>
        <p className="text-primary/60 mb-6">{error?.message || 'Could not load the post. Please try again.'}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg hover:opacity-90 transition-all"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-2 border border-primary/20 text-primary rounded-lg hover:bg-primary/5 transition-all">
            <Home size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
