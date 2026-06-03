// Shared model list — imported by both the UI (client) and the API routes (server).
// Keep this free of server-only code so it can be imported into client components.

export type ModelOption = {
  id: string;
  label: string;
  sub: string;
};

// Order shown in the Profile drawer. Default is Opus 4.6.
export const MODELS: ModelOption[] = [
  { id: "claude-opus-4-6", label: "Opus 4.6", sub: "Default · balanced Opus" },
  { id: "claude-opus-4-7", label: "Opus 4.7", sub: "Sharper writing" },
  { id: "claude-opus-4-8", label: "Opus 4.8", sub: "Most capable · priciest" },
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6", sub: "Fast · cheapest" },
];

export const DEFAULT_MODEL = "claude-opus-4-6";

const MODEL_IDS = new Set(MODELS.map((m) => m.id));

// Server-side guard: only ever send a model from the allowlist to the API.
// Anything unknown (or missing) falls back to the default.
export function resolveModel(requested?: unknown): string {
  return typeof requested === "string" && MODEL_IDS.has(requested)
    ? requested
    : DEFAULT_MODEL;
}
