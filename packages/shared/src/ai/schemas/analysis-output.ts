import { z } from "zod";

export const analysisOutputSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  matchedKeywords: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  gapFraming: z.array(z.string()).default([]),
  likelyInterviewThemes: z.array(z.string()).default([]),
  likelyRecruiterQuestions: z.array(z.string()).default([]),
  likelyHiringManagerQuestions: z.array(z.string()).default([]),
  likelyBehavioralQuestions: z.array(z.string()).default([]),
  intro30: z.string(),
  intro60: z.string(),
  intro90: z.string()
});

export type AnalysisOutput = z.infer<typeof analysisOutputSchema>;
