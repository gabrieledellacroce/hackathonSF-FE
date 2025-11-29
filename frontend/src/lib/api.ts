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
  params?: Record<string, unknown>,
  apiKey?: string
): Promise<unknown> {
  if (useMock()) return mockRunModel(modelId, file, params);
  const form = new FormData();
  form.append("image", file);
  if (params) {
    form.append("params", JSON.stringify(params));
  }
  const base = getBackendUrl();
  const res = await fetch(`${base}/models/${encodeURIComponent(modelId)}`, {
    method: "POST",
    body: form,
    headers: {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Inference failed: ${res.status}`);
  return res.json();
}

export async function getOrCreateApiKey(userId: string): Promise<string> {
  const cacheKey = `mm_api_key_${userId}`;
  const cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
  if (cached) return cached;
  const base = getBackendUrl();
  // try get
  const getRes = await fetch(`${base}/apikey/get?userId=${encodeURIComponent(userId)}`, {
    cache: "no-store",
  });
  if (getRes.ok) {
    const j = (await getRes.json()) as { apiKey: string };
    if (j?.apiKey) {
      if (typeof window !== "undefined") localStorage.setItem(cacheKey, j.apiKey);
      return j.apiKey;
    }
  }
  // create
  const createRes = await fetch(`${base}/apikey/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stackauthUserId: userId }),
  });
  if (!createRes.ok) {
    throw new Error(`API key create failed: ${createRes.status}`);
  }
  const c = (await createRes.json()) as { apiKey: string };
  if (!c?.apiKey) throw new Error("API key not returned");
  if (typeof window !== "undefined") localStorage.setItem(cacheKey, c.apiKey);
  return c.apiKey;
}


