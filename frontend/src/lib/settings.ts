export type ResponseFormat = "json" | "text";

export interface AppSettings {
  defaultModelId: string | null;
  temperature: number; // 0 - 2
  topP: number; // 0 - 1
  maxTokens: number; // 1 - 8192 (depending on model)
  seed: number | null; // null to randomize
  responseFormat: ResponseFormat;
}

const SETTINGS_STORAGE_KEY = "appSettings";

export function getDefaultSettings(): AppSettings {
  return {
    defaultModelId: null,
    temperature: 0.7,
    topP: 1.0,
    maxTokens: 512,
    seed: null,
    responseFormat: "json",
  };
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return getDefaultSettings();
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return getDefaultSettings();
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...getDefaultSettings(), ...parsed };
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}


