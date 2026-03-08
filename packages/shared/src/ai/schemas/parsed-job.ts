import { z } from "zod";

export const parsedJobDescriptionSchema = z.object({
  roleTitle: z.string().default(""),
  company: z.string().default(""),
  seniority: z.string().default(""),
  responsibilities: z.array(z.string()).default([]),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  toolsPlatforms: z.array(z.string()).default([]),
  businessDomain: z.string().default(""),
  behavioralTraits: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([])
});

export type ParsedJobDescription = z.infer<typeof parsedJobDescriptionSchema>;
