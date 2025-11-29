import React from "react";
import { AccountSettings } from "@stackframe/stack";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-[100svh] grid place-items-center px-6">
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-surface/50 p-6">
        <h1
          className="text-3xl font-light mb-6"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Profilo
        </h1>
        <AccountSettings />
        <div className="mt-8 flex justify-end">
          <Link
            href="/handler/sign-out"
            className="px-4 py-2 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-sm"
          >
            Sign out
          </Link>
        </div>
      </div>
    </main>
  );
}


