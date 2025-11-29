import React from "react";
import { AccountSettings } from "@stackframe/stack";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-[100svh] grid place-items-center px-6">
      <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-surface/50 p-8">
        {/* Back to app */}
        <div className="mb-4">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-white transition"
          >
            <span className="text-lg">←</span>
            <span>Torna all’app</span>
          </Link>
        </div>
        <div className="flex items-end justify-between mb-4">
          <h1
            className="text-3xl font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Profilo
          </h1>
        </div>
        <div className="overflow-x-auto">
          <AccountSettings />
        </div>
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


