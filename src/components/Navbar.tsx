"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-mantle border-b border-surface0 py-4 px-8 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-mauve">
          BMI Tracker
        </Link>
        <div className="flex gap-6">
          <Link href="/dashboard" className="hover:text-mauve transition-colors">
            Dashboard
          </Link>
          <Link href="/history" className="hover:text-mauve transition-colors">
            History
          </Link>
          <Link href="/reports" className="hover:text-mauve transition-colors">
            Reports
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <span className="text-subtext0">
              {session.user.name || session.user.email}
            </span>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
}
