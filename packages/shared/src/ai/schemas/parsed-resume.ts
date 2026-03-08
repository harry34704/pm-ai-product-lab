import { z } from "zod";

export const parsedResumeSchema = z.object({
  headline: z.string().default(""),
  summary: z.string().default(""),
  experience: z.array(
    z.object({
      title: z.string().default(""),
      company: z.string().default(""),
      period: z.string().optional(),
      bullets: z.array(z.string()).default([])
    })
  ).default([]),
  achievements: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([])
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;
