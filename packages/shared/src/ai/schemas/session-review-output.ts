import { z } from "zod";

export const sessionReviewOutputSchema = z.object({
  summary: z.string(),
  topStrengths: z.array(z.string()).default([]),
  topImprovements: z.array(z.string()).default([]),
  fillerWordNotes: z.array(z.string()).default([]),
  answers: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      score: z.number().int().min(0).max(100),
      strengths: z.array(z.string()).default([]),
      weaknesses: z.array(z.string()).default([]),
      improvedAnswer: z.string(),
      starRewrite: z.string(),
      conciseRewrite: z.string(),
      executiveRewrite: z.string()
    })
  ).default([])
});

export type SessionReviewOutput = z.infer<typeof sessionReviewOutputSchema>;
