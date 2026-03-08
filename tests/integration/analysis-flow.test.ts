import { beforeEach, describe, expect, it, vi } from "vitest";

const resumeRecord = {
  id: "resume-1",
  userId: "user-1",
  title: "PM Resume",
  rawText: "Raw resume",
  parsedJson: {
    headline: "Product Manager",
    summary: "PM with experimentation experience",
    experience: [{ title: "PM", company: "Orbit", bullets: ["Improved onboarding by 20%."] }],
    achievements: ["Improved onboarding by 20%."],
    skills: ["SQL", "Experimentation", "Stakeholder management"],
    tools: [],
    education: [],
    certifications: [],
    projects: []
  }
};

const jobRecord = {
  id: "job-1",
  userId: "user-1",
  title: "Senior PM",
  rawText: "Raw job",
  parsedJson: {
    roleTitle: "Senior PM",
    company: "Acme",
    seniority: "Senior",
    responsibilities: ["Lead roadmap"],
    requiredSkills: ["SQL", "Experimentation"],
    preferredSkills: ["Pricing"],
    toolsPlatforms: [],
    businessDomain: "SaaS",
    behavioralTraits: ["Ownership"],
    keywords: ["sql", "experimentation", "pricing"]
  }
};

const analysisCreate = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ id: "analysis-1", ...data }));
const resumeFindFirst = vi.fn(async () => resumeRecord);
const jobFindFirst = vi.fn(async () => jobRecord);

vi.mock("../../apps/web/lib/db", () => ({
  db: {
    resume: {
      findFirst: resumeFindFirst
    },
    jobDescription: {
      findFirst: jobFindFirst
    },
    analysisReport: {
      create: analysisCreate
    }
  }
}));

describe("analysis flow integration", () => {
  beforeEach(() => {
    analysisCreate.mockClear();
    resumeFindFirst.mockClear();
    jobFindFirst.mockClear();
  });

  it("creates and persists an analysis report from saved resume and job records", async () => {
    const { createAnalysisReport } = await import("../../apps/web/lib/server/analysis");
    const report = await createAnalysisReport("user-1", "resume-1", "job-1");

    expect(resumeFindFirst).toHaveBeenCalled();
    expect(jobFindFirst).toHaveBeenCalled();
    expect(analysisCreate).toHaveBeenCalled();
    expect(report.matchScore).toBeGreaterThan(50);
    expect(report.matchedKeywords as string[]).toContain("Sql");
  });
});
