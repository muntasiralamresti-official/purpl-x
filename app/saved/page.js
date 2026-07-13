import { Bookmark } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Saved Posts — Purpl-x",
  description: "Your saved posts on Purpl-x",
};

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-6">
          <Bookmark size={36} className="text-brand xs:size-11" />
        </div>

        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary mb-3">
          Saved Posts
        </h1>
        <p className="text-primary/60 text-sm xs:text-base mb-8 leading-relaxed">
          This feature is coming soon. Your saved posts will appear here.
          <br />
          You can already save posts from the Feed using the bookmark icon!
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand text-white text-sm xs:text-base font-medium hover:opacity-90 transition-all"
        >
          Back to Feed
        </Link>
      </div>
    </main>
  );
}
