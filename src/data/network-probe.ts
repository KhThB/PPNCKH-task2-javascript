/** Filled by scripts/probe-images.mjs after a browser pass. Null until then. */
export type ProbeRun = {
  version: "a" | "b";
  scenario: "desktop1" | "mobile2";
  viewport: string;
  imageBytes: number;
  requestCount: number;
  lcpMs: number | null;
  lcpUrl: string | null;
  requests: { url: string; encoded: number }[];
};

export type NetworkProbe = {
  takenAt: string;
  note: string;
  runs: ProbeRun[];
};

export const networkProbe: NetworkProbe | null = null;
