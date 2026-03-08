import { parseJob, parsedJobDescriptionSchema } from "@mockroom/shared";
import { db } from "../db";

export async function createJobDescription(userId: string, input: { title?: string; company?: string; rawText: string }) {
  const parsed = parseJob(input.rawText);

  const job = await db.jobDescription.create({
    data: {
      userId,
      title: input.title?.trim() || parsed.roleTitle || "Untitled Job Description",
      company: input.company?.trim() || parsed.company || null,
      rawText: input.rawText,
      parsedJson: parsed
    }
  });

  return { job, parsed };
}

export async function updateJobDescription(
  userId: string,
  jobId: string,
  input: { title: string; company?: string; rawText: string; parsedJson?: unknown }
) {
  const parsed = parsedJobDescriptionSchema.parse(input.parsedJson);

  const existing = await db.jobDescription.findFirst({
    where: {
      id: jobId,
      userId
    }
  });

  if (!existing) {
    throw new Error("Job description not found.");
  }

  return db.jobDescription.update({
    where: { id: jobId },
    data: {
      title: input.title,
      company: input.company || parsed.company || null,
      rawText: input.rawText,
      parsedJson: parsed
    }
  });
}
