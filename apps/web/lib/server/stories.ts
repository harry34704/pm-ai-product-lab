import { StoryCategory } from "@prisma/client";
import { extractStories, parsedResumeSchema } from "@mockroom/shared";
import { db } from "../db";

export async function extractStoriesForUser(userId: string, resumeId?: string) {
  const resume = await db.resume.findFirst({
    where: {
      userId,
      ...(resumeId ? { id: resumeId } : {})
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  if (!resume) {
    throw new Error("Resume not found.");
  }

  const output = extractStories(parsedResumeSchema.parse(resume.parsedJson));

  await db.story.createMany({
    data: output.stories.map((story) => ({
      userId,
      title: story.title,
      category: story.category as StoryCategory,
      tags: story.tags,
      scenario: story.scenario,
      task: story.task,
      action: story.action,
      result: story.result,
      evidence: story.evidence,
      exampleQuestions: story.exampleQuestions
    }))
  });

  return db.story.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function updateStory(userId: string, storyId: string, input: Record<string, unknown>) {
  const story = await db.story.findFirst({ where: { id: storyId, userId } });

  if (!story) {
    throw new Error("Story not found.");
  }

  return db.story.update({
    where: { id: storyId },
    data: {
      title: String(input.title ?? story.title),
      category: (String(input.category ?? story.category).toUpperCase() as StoryCategory) ?? story.category,
      tags: (input.tags as string[] | undefined) ?? (story.tags as string[]),
      scenario: String(input.scenario ?? story.scenario),
      task: String(input.task ?? story.task),
      action: String(input.action ?? story.action),
      result: String(input.result ?? story.result),
      evidence: String(input.evidence ?? story.evidence),
      exampleQuestions: (input.exampleQuestions as string[] | undefined) ?? (story.exampleQuestions as string[])
    }
  });
}
