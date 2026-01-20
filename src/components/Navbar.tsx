"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="glass sticky top-0 z-50 py-4 px-8 flex justify-between items-center backdrop-blur-md">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-black text-gradient-mauve tracking-tight">
          BMI Tracker
        </Link>
        <div className="flex gap-8">
          <Link href="/dashboard" className="text-subtext1 hover:text-mauve font-medium transition-all hover:scale-105">
            Dashboard
          </Link>
          <Link href="/history" className="text-subtext1 hover:text-mauve font-medium transition-all hover:scale-105">
            History
          </Link>
          <Link href="/reports" className="text-subtext1 hover:text-mauve font-medium transition-all hover:scale-105">
            Reports
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        {session?.user && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-mauve to-blue flex items-center justify-center text-base font-bold text-white uppercase">
                {session.user.name?.[0] || session.user.email?.[0]}
              </div>
              <span className="text-subtext1 font-medium">
                {session.user.name || session.user.email?.split('@')[0]}
              </span>
            </div>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
}
