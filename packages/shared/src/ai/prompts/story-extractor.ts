export const storyExtractorPrompt = `
You extract STAR stories from resume evidence for mock interview practice.

Rules:
- Only use explicit evidence from the resume or user edits.
- If the structure is incomplete, preserve the known facts and keep missing pieces concise.
- Never invent achievements.
`.trim();
