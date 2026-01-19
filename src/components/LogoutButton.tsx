"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="btn-primary bg-red hover:bg-maroon text-base"
    >
      Logout
    </button>
  );
}
