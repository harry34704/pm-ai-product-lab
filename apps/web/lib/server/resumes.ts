import { ResumeSectionType } from "@prisma/client";
import { parseResume, parsedResumeSchema } from "@mockroom/shared";
import { db } from "../db";

function resumeSectionsFromParsed(parsed: ReturnType<typeof parseResume>) {
  const sections: { type: ResumeSectionType; heading: string; content: string; sortOrder: number }[] = [];
  let sortOrder = 0;

  const push = (type: ResumeSectionType, heading: string, items: string | string[]) => {
    const content = Array.isArray(items) ? items.join("\n") : items;
    if (!content) {
      return;
    }

    sections.push({ type, heading, content, sortOrder });
    sortOrder += 1;
  };

  push(ResumeSectionType.HEADLINE, "Headline", parsed.headline);
  push(ResumeSectionType.SUMMARY, "Summary", parsed.summary);
  push(
    ResumeSectionType.EXPERIENCE,
    "Experience",
    parsed.experience.flatMap((item) => [item.title, item.company, ...item.bullets]).filter(Boolean)
  );
  push(ResumeSectionType.ACHIEVEMENT, "Achievements", parsed.achievements);
  push(ResumeSectionType.SKILL, "Skills", parsed.skills);
  push(ResumeSectionType.TOOL, "Tools", parsed.tools);
  push(ResumeSectionType.EDUCATION, "Education", parsed.education);
  push(ResumeSectionType.CERTIFICATION, "Certifications", parsed.certifications);
  push(ResumeSectionType.PROJECT, "Projects", parsed.projects);

  return sections;
}

export async function createResume(
  userId: string,
  input: {
    title?: string;
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
  const parsed = parseResume(input.rawText);

  const resume = await db.resume.create({
    data: {
      userId,
      title: input.title?.trim() || parsed.headline || "Untitled Resume",
      originalFileName: input.originalFileName,
      sourceMimeType: input.sourceMimeType ?? null,
      fileSizeBytes: input.fileSizeBytes ?? null,
      storageProvider: input.storageProvider ?? null,
      storageBucket: input.storageBucket ?? null,
      storageKey: input.storageKey ?? null,
      storageUrl: input.storageUrl ?? null,
      rawText: input.rawText,
      parsedJson: parsed,
      sections: {
        create: resumeSectionsFromParsed(parsed)
      }
    },
    include: {
      sections: true
    }
  });

  return { resume, parsed };
}

export async function updateResume(userId: string, resumeId: string, input: { title: string; rawText: string; parsedJson?: unknown }) {
  const parsed = parsedResumeSchema.parse(input.parsedJson);

  const existing = await db.resume.findFirst({
    where: {
      id: resumeId,
      userId
    }
  });

  if (!existing) {
    throw new Error("Resume not found.");
  }

  const resume = await db.resume.update({
    where: { id: resumeId },
    data: {
      title: input.title,
      rawText: input.rawText,
      parsedJson: parsed,
      sections: {
        deleteMany: {},
        create: resumeSectionsFromParsed(parsed)
      }
    },
    include: {
      sections: true
    }
  });

  return resume;
}
