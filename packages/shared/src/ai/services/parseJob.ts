import { parsedJobDescriptionSchema, type ParsedJobDescription } from "../schemas/parsed-job";
import { sentenceChunks, splitLines, tokenizeKeywords } from "../../utils/text";

function findSection(lines: string[], heading: RegExp, fallbackHeading: RegExp[] = []): string[] {
  const start = lines.findIndex((line) => heading.test(line));
  if (start < 0) {
    return [];
  }

  const nextHeaders = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line, index }) => index > start && fallbackHeading.some((pattern) => pattern.test(line)))
    .map(({ index }) => index);

  const end = nextHeaders.length ? Math.min(...nextHeaders) : lines.length;
  return lines
    .slice(start + 1, end)
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .filter(Boolean);
}

export function parseJob(rawText: string): ParsedJobDescription {
  const lines = splitLines(rawText);
  const responsibilities = findSection(lines, /^responsibilities$/i, [/^required skills$/i, /^preferred skills$/i, /^tools/i, /^behavioral/i]);
  const requiredSkills = findSection(lines, /^required skills$/i, [/^preferred skills$/i, /^tools/i, /^behavioral/i]);
  const preferredSkills = findSection(lines, /^preferred skills$/i, [/^tools/i, /^behavioral/i]);
  const toolsPlatforms = findSection(lines, /^tools|platforms$/i, [/^behavioral/i, /^keywords$/i]);
  const behavioralTraits = findSection(lines, /^behavioral traits$/i, [/^keywords$/i]);
  const keywordSource = [requiredSkills, preferredSkills, responsibilities, toolsPlatforms, behavioralTraits].flat().join(" ");

  const seniority = lines.find((line) => /(intern|junior|mid|senior|lead|principal|director|vp)/i.test(line)) ?? "";

  return parsedJobDescriptionSchema.parse({
    roleTitle: lines[0] ?? "",
    company: lines[1] ?? "",
    seniority,
    responsibilities: responsibilities.length ? responsibilities : sentenceChunks(rawText).slice(0, 5),
    requiredSkills,
    preferredSkills,
    toolsPlatforms,
    businessDomain: lines.find((line) => /(saas|fintech|health|retail|operations|cloud|enterprise)/i.test(line)) ?? "",
    behavioralTraits,
    keywords: Array.from(new Set(tokenizeKeywords(keywordSource))).slice(0, 24)
  });
}
