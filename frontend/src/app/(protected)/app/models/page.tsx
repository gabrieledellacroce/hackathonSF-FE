import React from "react";
import Link from "next/link";
import { getModels } from "@/lib/api";
import AddModelButton from "./AddModelButton";

export default async function ModelsPage() {
  const { models } = await getModels();
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl font-light"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Models
        </h1>
        <AddModelButton />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <Link
            key={m.id}
            href={`/app/models/${m.id}`}
            className="rounded-lg border border-white/10 p-4 hover:border-white/20 transition block"
          >
            <div className="text-sm text-muted">{m.id}</div>
            <div className="text-lg font-medium mt-1">{m.name}</div>
            <p className="text-sm text-muted mt-2">{m.description}</p>
            <div className="text-xs text-muted mt-4">Created on {m.createdAt}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}


