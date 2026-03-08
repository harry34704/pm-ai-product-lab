import type { ParsedResume } from "../schemas/parsed-resume";
import { storyOutputSchema, type StoryOutput } from "../schemas/story-output";

function inferCategory(line: string): StoryOutput["stories"][number]["category"] {
  if (/stakeholder|partner|aligned|workshop/i.test(line)) {
    return "STAKEHOLDER_MANAGEMENT";
  }

  if (/metric|sql|analytics|dashboard|experiment|analysis/i.test(line)) {
    return "ANALYTICS";
  }

  if (/deliver|ship|launch|release/i.test(line)) {
    return "DELIVERY";
  }

  if (/customer|user|onboarding|support/i.test(line)) {
    return "CUSTOMER_FOCUS";
  }

  if (/ambigu|uncertain|unknown/i.test(line)) {
    return "AMBIGUITY";
  }

  return "OWNERSHIP";
}

export function extractStories(resume: ParsedResume): StoryOutput {
  const bullets = resume.experience.flatMap((entry) =>
    entry.bullets.map((bullet) => ({
      title: entry.title,
      company: entry.company,
      bullet
    }))
  );

  const stories = bullets.slice(0, 8).map(({ title, company, bullet }) => ({
    title: `${title} at ${company}`.trim(),
    category: inferCategory(bullet),
    tags: bullet
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 4)
      .slice(0, 4),
    scenario: `In the ${title} role at ${company}, there was a need to improve performance or execution.`,
    task: "Clarify the problem, set the target, and align the right people.",
    action: bullet,
    result: bullet,
    evidence: resume.achievements.find((item) => bullet.includes(item) || item.includes(bullet)) ?? bullet,
    exampleQuestions: [
      "Tell me about a time you drove impact.",
      "Describe a project where you had to influence others."
    ]
  }));

  return storyOutputSchema.parse({ stories });
}
