import { mockGetModels, mockRunModel, type Model } from "./mock";

export function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001";
}

export function useMock(): boolean {
  return (process.env.NEXT_PUBLIC_USE_MOCK || "").toLowerCase() === "true";
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getBackendUrl();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// High-level API using mocks when enabled
export async function getModels(): Promise<{ models: Model[] }> {
  if (useMock()) return mockGetModels();
  return fetchJson<{ models: Model[] }>("/models");
}

export async function runModelInference(
  modelId: string,
  file: File | Blob,
  params?: Record<string, unknown>
): Promise<unknown> {
  if (useMock()) return mockRunModel(modelId, file, params);
  const form = new FormData();
  form.append("file", file);
  if (params) {
    form.append("params", JSON.stringify(params));
  }
  const base = getBackendUrl();
  const res = await fetch(`${base}/model/${encodeURIComponent(modelId)}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Inference failed: ${res.status}`);
  return res.json();
}


