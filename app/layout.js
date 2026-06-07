import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Navbar from "./component/Navbar";
import MobileFooterBar from "./component/MobileFooterBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Purpl-x",

  description:
    "Post Sharing Website",

  /* OPEN GRAPH */
  openGraph: {
    title: "Purpl-x",

    description:
      "Post Sharing Website",

    images: [
      {
        url: "/purpl.png",
        width: 1200,
        height: 630,
        alt: "Purpl Logo",
      },
    ],
  },

  /* TWITTER */
  twitter: {
    card: "summary_large_image",

    title: "Purpl-x",

    description:
      "Post Sharing Website",

    images: ["/purpl-x-logo.png"],
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#050816] text-white">
        
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main>
          {children}
        </main>

        <MobileFooterBar/>
      </body>
    </html>
  );
}