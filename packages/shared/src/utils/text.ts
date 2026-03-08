export function normalizeText(input: string): string {
  return input.replace(/\r/g, "").replace(/\u0000/g, "").trim();
}

export function splitLines(input: string): string[] {
  return normalizeText(input)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function tokenizeKeywords(input: string): string[] {
  return Array.from(
    new Set(
      normalizeText(input)
        .toLowerCase()
        .split(/[^a-z0-9#+.]+/i)
        .filter((token) => token.length > 2)
    )
  );
}

export function sentenceChunks(input: string): string[] {
  return normalizeText(input)
    .split(/(?<=[.!?])\s+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
