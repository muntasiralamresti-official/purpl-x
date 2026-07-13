import { Settings } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Settings — Purpl-x",
  description: "Manage your Purpl-x account settings",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 xs:w-24 xs:h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <Settings size={36} className="text-secondary xs:size-11" />
        </div>

        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary mb-3">
          Settings
        </h1>
        <p className="text-primary/60 text-sm xs:text-base mb-8 leading-relaxed">
          Account settings and preferences are coming soon.
          <br />
          We&apos;re working hard to bring you a great experience!
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
