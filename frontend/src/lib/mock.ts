export type Model = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export async function mockGetModels(): Promise<{ models: Model[] }> {
  // simple static dataset for hackathon dev
  return {
    models: [
      {
        id: "fruit-classifier",
        name: "Fruit Classifier",
        description: "Detects fruit freshness and types from images.",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      {
        id: "dog-detector",
        name: "Dog Detector",
        description: "Binary classifier that detects dogs in images.",
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ],
  };
}

export async function mockRunModel(
  _modelId: string,
  _file: File | Blob,
  _params?: Record<string, unknown>
): Promise<unknown> {
  // emulate latency
  await new Promise((r) => setTimeout(r, 300));
  return {
    class: "fresh_apple",
    confidence: 0.98,
    latency_ms: 42,
  };
}


