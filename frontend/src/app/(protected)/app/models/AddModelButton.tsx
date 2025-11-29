"use client";

import React from "react";
import { uploadModel } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";

export default function AddModelButton() {
  const router = useRouter();
  const user = useUser();
  const userId = (user as any)?.id || (user as any)?.userId || null;

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [inputType, setInputType] = React.useState("image");
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onPick = () => {
    document.getElementById("add-model-file")?.click();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!file) {
      setError("Model file is required");
      return;
    }
    setSubmitting(true);
    try {
      await uploadModel({
        file,
        name: name.trim(),
        description: description.trim(),
        inputType,
        userId,
      });
      setOpen(false);
      setName("");
      setDescription("");
      setInputType("image");
      setFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
        onClick={() => setOpen(true)}
        aria-label="Add model"
        title="Add model"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !submitting && setOpen(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <form
              onSubmit={onSubmit}
              className="w-full max-w-lg rounded-xl border border-white/10 bg-black/70 backdrop-blur p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <h2
                  className="text-xl font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Add new model
                </h2>
                <button
                  type="button"
                  className="px-2 py-1 text-sm rounded-md border border-white/10 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Close
                </button>
              </div>

              {error && (
                <div className="text-sm text-red-400">{error}</div>
              )}

              <label className="block">
                <div className="text-xs text-muted mb-1">Name</div>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fruit Classifier"
                />
              </label>

              <label className="block">
                <div className="text-xs text-muted mb-1">Description</div>
                <textarea
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                />
              </label>

              <label className="block">
                <div className="text-xs text-muted mb-1">Input type</div>
                <select
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                >
                  <option value="image">image</option>
                </select>
              </label>

              <div className="grid gap-2">
                <div className="text-xs text-muted">Model file (.keras, .h5, .pt, .onnx)</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                    onClick={onPick}
                    disabled={submitting}
                  >
                    Choose file
                  </button>
                  <div className="text-xs text-muted truncate">
                    {file ? file.name : "No file selected"}
                  </div>
                </div>
                <input
                  id="add-model-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  disabled={submitting}
                >
                  {submitting ? "Uploading…" : "Create model"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


