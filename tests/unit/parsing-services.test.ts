import { analyzeMatch, extractStories, parseJob, parseResume } from "../../packages/shared/src";

describe("parsing services", () => {
  it("parses a resume into structured sections", () => {
    const parsed = parseResume(`Taylor Moyo
Product Manager
Summary
Product manager with analytics and experimentation experience.
Experience
Product Manager, Horizon Labs
- Improved conversion by 18%.
Skills
SQL, experimentation, stakeholder management
Education
BCom`);

    expect(parsed.headline).toBe("Product Manager");
    expect(parsed.skills).toContain("SQL");
    expect(parsed.achievements[0]).toContain("18%");
  });

  it("parses a job description and calculates a match report", () => {
    const resume = parseResume(`Casey Lee
Business Analyst
Summary
Business analyst with SQL and stakeholder management experience.
Experience
Business Analyst, Delta Ops
- Reduced reporting turnaround by 30%.
Skills
SQL, stakeholder management, analytics`);
    const job = parseJob(`Senior Business Analyst
North Grid
Responsibilities
- Partner with operations and finance.
Required skills
- SQL
- Analytics
- Stakeholder management`);

    const analysis = analyzeMatch(resume, job);

    expect(analysis.matchScore).toBeGreaterThan(0);
    expect(analysis.matchedKeywords.join(" ")).toMatch(/Sql|Analytics|Stakeholder/i);
  });

  it("extracts STAR-style stories from resume bullets", () => {
    const resume = parseResume(`Sam Reed
Product Manager
Experience
Product Manager, Orbit
- Led experiment that improved activation by 12%.
Skills
SQL, experimentation`);

    const stories = extractStories(resume);

    expect(stories.stories.length).toBeGreaterThan(0);
    expect(stories.stories[0].result).toContain("12%");
  });
});
