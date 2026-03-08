import { z } from "zod";

export const storySchema = z.object({
  title: z.string(),
  category: z.enum([
    "LEADERSHIP",
    "DELIVERY",
    "ANALYTICS",
    "STAKEHOLDER_MANAGEMENT",
    "OWNERSHIP",
    "CONFLICT",
    "FAILURE",
    "CUSTOMER_FOCUS",
    "AMBIGUITY"
  ]),
  tags: z.array(z.string()).default([]),
  scenario: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
  evidence: z.string(),
  exampleQuestions: z.array(z.string()).default([])
});

export const storyOutputSchema = z.object({
  stories: z.array(storySchema).default([])
});

export type StoryOutput = z.infer<typeof storyOutputSchema>;
