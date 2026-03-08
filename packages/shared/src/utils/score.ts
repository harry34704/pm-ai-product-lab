export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function overlapScore(matches: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return clamp(Math.round((matches / total) * 100));
}
