"use client";

import React from "react";
import { getModels } from "@/lib/api";
import type { Model } from "@/lib/mock";
import {
  AppSettings,
  clamp,
  getDefaultSettings,
  loadSettings,
  saveSettings,
} from "@/lib/settings";

export default function SettingsPage() {
  const [models, setModels] = React.useState<Model[]>([]);
  const [settings, setSettings] = React.useState<AppSettings | null>(null);
  const [loadingModels, setLoadingModels] = React.useState<boolean>(true);

  React.useEffect(() => {
    setSettings(loadSettings());
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { models } = await getModels();
        if (!cancelled) {
          setModels(models);
          setLoadingModels(false);
        }
      } catch {
        if (!cancelled) {
          setModels([]);
          setLoadingModels(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function update(partial: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...(prev ?? getDefaultSettings()), ...partial };
      saveSettings(next);
      return next;
    });
  }

  function reset() {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    saveSettings(defaults);
  }

  return (
    <section>
      <h1
        className="text-3xl font-light mb-6"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Settings
      </h1>

      <div className="grid gap-6 max-w-2xl">
        {/* Default Model */}
        <div className="rounded-lg border border-white/10 p-4">
          <div className="text-sm text-muted mb-2">Default model</div>
          {loadingModels ? (
            <div className="text-sm text-muted">Loading models…</div>
          ) : (
            <select
              className="w-full bg-transparent border border-white/10 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-white/20"
              value={settings?.defaultModelId ?? ""}
              onChange={(e) =>
                update({ defaultModelId: e.target.value || null })
              }
            >
              <option value="">— None selected —</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          {!!settings?.defaultModelId && (
            <div className="text-xs text-muted mt-2">
              Selected: {settings.defaultModelId}
            </div>
          )}
        </div>

        {/* Inference Parameters */}
        <div className="rounded-lg border border-white/10 p-4">
          <div className="text-sm text-muted mb-4">Inference parameters</div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Temperature */}
            <label className="block">
              <div className="text-xs text-muted mb-2">
                Temperature ({settings?.temperature.toFixed(2) ?? "0.70"})
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.05}
                value={settings?.temperature ?? 0.7}
                onChange={(e) =>
                  update({ temperature: clamp(parseFloat(e.target.value), 0, 2) })
                }
                className="w-full"
              />
            </label>

            {/* Top-p */}
            <label className="block">
              <div className="text-xs text-muted mb-2">
                Top-p ({settings?.topP.toFixed(2) ?? "1.00"})
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings?.topP ?? 1}
                onChange={(e) =>
                  update({ topP: clamp(parseFloat(e.target.value), 0, 1) })
                }
                className="w-full"
              />
            </label>

            {/* Max tokens */}
            <label className="block">
              <div className="text-xs text-muted mb-2">Max tokens</div>
              <input
                type="number"
                min={1}
                max={8192}
                inputMode="numeric"
                className="w-full bg-transparent border border-white/10 rounded-md p-2"
                value={settings?.maxTokens ?? 512}
                onChange={(e) =>
                  update({
                    maxTokens: Math.max(
                      1,
                      Math.min(8192, parseInt(e.target.value || "1", 10))
                    ),
                  })
                }
              />
            </label>

            {/* Seed */}
            <label className="block">
              <div className="text-xs text-muted mb-2">Seed (optional)</div>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="Random if empty"
                className="w-full bg-transparent border border-white/10 rounded-md p-2"
                value={settings?.seed ?? ""}
                onChange={(e) => {
                  const raw = e.target.value.trim();
                  update({ seed: raw === "" ? null : Math.max(0, parseInt(raw, 10) || 0) });
                }}
              />
            </label>
          </div>
        </div>

        {/* Response format */}
        <div className="rounded-lg border border-white/10 p-4">
          <div className="text-sm text-muted mb-2">Response format</div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="response-format"
                checked={(settings?.responseFormat ?? "json") === "json"}
                onChange={() => update({ responseFormat: "json" })}
              />
              JSON
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="response-format"
                checked={settings?.responseFormat === "text"}
                onChange={() => update({ responseFormat: "text" })}
              />
              Text
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 rounded-md border border-white/10 hover:border-white/20 transition text-sm"
          >
            Reset to defaults
          </button>
          <div className="text-xs text-muted">
            Changes are saved automatically on edit.
          </div>
        </div>
      </div>
    </section>
  );
}

