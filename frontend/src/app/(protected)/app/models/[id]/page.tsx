"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { runModelInference, getOrCreateApiKey, getModels } from "@/lib/api";
import { useUser } from "@stackframe/stack";

type RunResult = {
  id: string;
  fileName: string;
  imageUrl: string;
  params: { threshold: number; topK: number };
  latencyMs: number;
  output: any;
  at: string;
  feedback?: "up" | "down";
};

function bytesToReadable(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function ModelPage({ params }: { params: { id: string } }) {
  const user = useUser();
  const userId = (user as any)?.id || (user as any)?.userId || null;
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string>(params.id);
  const [modelName, setModelName] = useState<string>("Model");

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [topK, setTopK] = useState<number>(3);
  const [autoRun, setAutoRun] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [output, setOutput] = useState<any>(null);
  const [history, setHistory] = useState<RunResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const { models } = await getModels();
        const found = models.find((m: any) => m.id === params.id);
        if (found) {
          setModelName(found.name || "Model");
        }
      } catch {}
    })();
  }, [params.id]);

  // URL params
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t = qs.get("threshold");
    const k = qs.get("topK");
    const a = qs.get("auto");
    if (t) setThreshold(Math.max(0, Math.min(1, Number(t))));
    if (k) setTopK(Math.max(1, Math.min(5, Number(k))));
    if (a) setAutoRun(a === "1");
  }, []);
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    qs.set("threshold", String(threshold));
    qs.set("topK", String(topK));
    qs.set("auto", autoRun ? "1" : "0");
    window.history.replaceState(null, "", `${window.location.pathname}?${qs.toString()}`);
  }, [threshold, topK, autoRun]);

  const clear = () => {
    setFile(null);
    setImageUrl(null);
    setOutput(null);
    setLatencyMs(null);
  };

  const onPick = () => fileInputRef.current?.click();
  const onFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
  }, []);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };
  const onPaste = async (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
    if (!item) return;
    const blob = item.getAsFile();
    if (!blob) return;
    const f = new File([blob], "pasted.png", { type: blob.type });
    onFiles({ 0: f, length: 1, item: (i: number) => (i === 0 ? f : null) } as unknown as FileList);
  };
  const useSample = async () => {
    clear();
    const url =
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=600&auto=format&fit=crop";
    const res = await fetch(url);
    const blob = await res.blob();
    const f = new File([blob], "sample-apple.jpg", { type: blob.type });
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
  };

  const run = useCallback(async () => {
    if (!file) return;
    setRunning(true);
    setOutput(null);
    const t0 = performance.now();
    try {
      let key = apiKey;
      if (!key && userId) {
        try {
          key = await getOrCreateApiKey(userId);
          setApiKey(key);
        } catch (e) {
          console.warn("api key error", e);
        }
      }
      const out = await runModelInference(modelId, file, { threshold, topK }, key || undefined);
      const t1 = performance.now();
      const latency = Math.max(0, Math.round(t1 - t0));
      setLatencyMs(latency);
      setOutput(out);
      const rec: RunResult = {
        id: `${Date.now()}`,
        fileName: file.name,
        imageUrl: imageUrl || "",
        params: { threshold, topK },
        latencyMs: latency,
        output: out,
        at: new Date().toISOString(),
      };
      setHistory((h) => [rec, ...h].slice(0, 6));
    } catch (e) {
      console.error(e);
      setOutput({ error: String(e) });
    } finally {
      setRunning(false);
    }
  }, [file, threshold, topK, imageUrl, apiKey, userId, modelId]);

  useEffect(() => {
    if (file && autoRun) void run();
  }, [file, autoRun, run]);

  const predicted = useMemo(() => {
    if (!output) return null;
    const top = (output.topK || output.top || output.results || []) as Array<any>;
    if (Array.isArray(top) && top.length) {
      const first = top[0];
      const label = first.class || first.label || first.name || "unknown";
      const conf = first.confidence || first.score || first.prob || 0;
      return { label, conf };
    }
    const cls = output.class || output.label;
    const conf = output.confidence || output.score;
    if (cls) return { label: cls, conf };
    return null;
  }, [output]);

  const copy = (text: string) => navigator.clipboard.writeText(text);
  const downloadJson = (obj: unknown, name: string) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportReport = () => {
    const report = {
      modelId,
      when: new Date().toISOString(),
      params: { threshold, topK },
      latencyMs,
      output,
    };
    downloadJson(report, "model-report.json");
  };
  const setFeedback = (id: string, fb: "up" | "down") => {
    setHistory((h) => h.map((r) => (r.id === id ? { ...r, feedback: fb } : r)));
  };

  return (
    <main className="space-y-8" onPaste={onPaste}>
      <header className="flex items-end justify-between">
        <div>
          <h1
            className="text-3xl font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {modelName}
          </h1>
          <p className="text-sm text-muted">Upload un’immagine e ottieni la classe con confidenza.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-white"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
            />
            Auto-run
          </label>
          <button
            className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
            onClick={exportReport}
          >
            Export report
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div
          className="lg:col-span-2 rounded-xl border border-white/10 p-6 min-h-[260px] flex flex-col items-center justify-center text-center hover:bg-white/5 transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {imageUrl ? (
            <div className="w-full grid gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="preview"
                className="max-h-[360px] mx-auto rounded-md border border-white/10 object-contain"
              />
              <div className="flex items-center justify-center gap-3 text-xs text-muted">
                <span>{file?.name}</span>
                {file && <span>· {bytesToReadable(file.size)}</span>}
                {latencyMs != null && <span>· {latencyMs} ms</span>}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  onClick={run}
                  disabled={running || !file}
                >
                  TEST
                </button>
                <button
                  className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  onClick={onPick}
                >
                  Choose another
                </button>
                <button
                  className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  onClick={clear}
                >
                  Clear
                </button>
                {!autoRun && (
                  <button
                    className="px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                    onClick={run}
                    disabled={running}
                  >
                    {running ? "Running…" : "Run model"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted">
                Drag & drop un’immagine, incolla ⌘V o carica un file.
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  onClick={onPick}
                >
                  Choose file
                </button>
                <button
                  className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/5 text-sm"
                  onClick={useSample}
                >
                  Use sample
                </button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>

        <div className="rounded-xl border border-white/10 p-6">
          <div className="text-sm text-muted mb-4">Parameters</div>
          <div className="space-y-4">
            <label className="block">
              <div className="text-xs text-muted mb-1">Threshold: {threshold.toFixed(2)}</div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="block">
              <div className="text-xs text-muted mb-1">Top‑K: {topK}</div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full"
              />
            </label>
            <div className="text-xs text-muted">
              I parametri sono salvati nell’URL. Condividi la pagina per riprodurre la stessa
              configurazione.
            </div>
          </div>
        </div>
      </section>

      {/* Output & Recent (copiato dal fruit-classifier) */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted">Output</div>
            <div className="flex gap-2">
              <button
                className="text-xs px-2 py-1 border border-white/10 rounded hover:bg-white/5"
                onClick={() => copy(JSON.stringify(output, null, 2))}
                disabled={!output}
              >
                Copy JSON
              </button>
              <button
                className="text-xs px-2 py-1 border border-white/10 rounded hover:bg-white/5"
                onClick={() => downloadJson(output, "inference.json")}
                disabled={!output}
              >
                Download JSON
              </button>
            </div>
          </div>
          {output ? (
            <div className="grid gap-4">
              {predicted && (
                <div className="text-xl">
                  Predicted: <span className="font-semibold">{predicted.label}</span>{" "}
                  <span className="text-muted">({Math.round((predicted.conf || 0) * 100)}%)</span>
                </div>
              )}
              <pre className="text-xs bg-white/5 rounded p-4 overflow-auto">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-sm text-muted">Nessun risultato ancora.</div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 p-6">
          <div className="text-sm text-muted mb-3">Recent</div>
          <div className="space-y-3">
            {history.length === 0 && (
              <div className="text-sm text-muted">Le ultime esecuzioni appariranno qui.</div>
            )}
            {history.map((r) => (
              <div
                key={r.id}
                className="rounded border border-white/10 p-3 grid grid-cols-[64px_1fr] gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.imageUrl}
                  alt={r.fileName}
                  className="w-16 h-16 rounded object-cover border border-white/10"
                />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-muted">{new Date(r.at).toLocaleString()}</div>
                    <div className="text-muted">{r.latencyMs} ms</div>
                  </div>
                  <div className="mt-1 break-words">
                    <span className="text-muted">File:</span> {r.fileName}
                  </div>
                    <div className="mt-1">
                    <span className="text-muted">Params:</span> t={r.params.threshold.toFixed(2)} ·
                    k={r.params.topK}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className={`px-2 py-1 rounded border text-[11px] ${
                        r.feedback === "up" ? "border-white bg-white/10" : "border-white/10 hover:bg-white/5"
                      }`}
                      onClick={() => setFeedback(r.id, "up")}
                    >
                      👍 Correct
                    </button>
                    <button
                      className={`px-2 py-1 rounded border text-[11px] ${
                        r.feedback === "down" ? "border-white bg-white/10" : "border-white/10 hover:bg-white/5"
                      }`}
                      onClick={() => setFeedback(r.id, "down")}
                    >
                      👎 Wrong
                    </button>
                    <button
                      className="ml-auto px-2 py-1 rounded border border-white/10 hover:bg-white/5 text-[11px]"
                      onClick={() => {
                        setImageUrl(r.imageUrl);
                        setOutput(r.output);
                        setLatencyMs(r.latencyMs);
                      }}
                    >
                      Load
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


