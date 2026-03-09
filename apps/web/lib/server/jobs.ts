import { parseJob, parsedJobDescriptionSchema } from "@mockroom/shared";
import { db } from "../db";

export async function createJobDescription(
  userId: string,
  input: {
    title?: string;
    company?: string;
    originalFileName?: string;
    sourceMimeType?: string;
    fileSizeBytes?: number;
    storageProvider?: string;
    storageBucket?: string;
    storageKey?: string;
    storageUrl?: string | null;
    rawText: string;
  }
) {
  const parsed = parseJob(input.rawText);

  const job = await db.jobDescription.create({
    data: {
      userId,
      title: input.title?.trim() || parsed.roleTitle || "Untitled Job Description",
      company: input.company?.trim() || parsed.company || null,
      originalFileName: input.originalFileName ?? null,
      sourceMimeType: input.sourceMimeType ?? null,
      fileSizeBytes: input.fileSizeBytes ?? null,
      storageProvider: input.storageProvider ?? null,
      storageBucket: input.storageBucket ?? null,
      storageKey: input.storageKey ?? null,
      storageUrl: input.storageUrl ?? null,
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
