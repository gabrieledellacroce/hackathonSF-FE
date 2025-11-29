import React from "react";
import { AccountSettings } from "@stackframe/stack";

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
      </div>
    </main>
  );
}


