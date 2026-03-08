import { parsedResumeSchema, type ParsedResume } from "../schemas/parsed-resume";
import { splitLines } from "../../utils/text";

const SKILL_HINTS = ["sql", "python", "roadmap", "stakeholder", "analytics", "tableau", "jira", "figma", "experimentation", "agile"];

export function parseResume(rawText: string): ParsedResume {
  const lines = splitLines(rawText);
  const summaryIndex = lines.findIndex((line) => /^summary$/i.test(line));
  const experienceIndex = lines.findIndex((line) => /^experience$/i.test(line));
  const skillsIndex = lines.findIndex((line) => /^skills$/i.test(line));
  const educationIndex = lines.findIndex((line) => /^education$/i.test(line));
  const certIndex = lines.findIndex((line) => /^certifications?$/i.test(line));
  const projectIndex = lines.findIndex((line) => /^projects?$/i.test(line));

  const section = (start: number, end: number) => (start >= 0 ? lines.slice(start + 1, end > start ? end : undefined) : []);

  const nextIndices = [experienceIndex, skillsIndex, educationIndex, certIndex, projectIndex].filter((value) => value >= 0);
  const firstBodyIndex = summaryIndex >= 0 ? summaryIndex : 1;

  const summary = summaryIndex >= 0 ? section(summaryIndex, nextIndices.find((value) => value > summaryIndex) ?? lines.length).join(" ") : lines.slice(2, 4).join(" ");
  const experienceLines = section(experienceIndex, [skillsIndex, educationIndex, certIndex, projectIndex].filter((value) => value > experienceIndex).sort((a, b) => a - b)[0] ?? lines.length);
  const skillLines = section(skillsIndex, [educationIndex, certIndex, projectIndex].filter((value) => value > skillsIndex).sort((a, b) => a - b)[0] ?? lines.length);
  const educationLines = section(educationIndex, [certIndex, projectIndex].filter((value) => value > educationIndex).sort((a, b) => a - b)[0] ?? lines.length);
  const certificationLines = section(certIndex, projectIndex > certIndex ? projectIndex : lines.length);
  const projectLines = section(projectIndex, lines.length);

  const experience: ParsedResume["experience"] = [];
  let currentExperience: ParsedResume["experience"][number] | null = null;

  for (const line of experienceLines) {
    if (!line.startsWith("-")) {
      if (currentExperience) {
        experience.push(currentExperience);
      }

      const [title, company] = line.split(",").map((value) => value.trim());
      currentExperience = {
        title: title ?? "",
        company: company ?? "",
        bullets: []
      };
      continue;
    }

    currentExperience?.bullets.push(line.replace(/^-+\s*/, ""));
  }

  if (currentExperience) {
    experience.push(currentExperience);
  }

  const achievements = experience.flatMap((item) =>
    item.bullets.filter((bullet) => /\d+%|\d+[kKmM+]|reduced|improved|increased|grew|launched|shipped/i.test(bullet))
  );

  const skillPool = skillLines.join(", ").split(/[,|]/).map((entry) => entry.trim()).filter(Boolean);
  const skills = Array.from(new Set(skillPool));
  const tools = skills.filter((skill) => /(jira|figma|tableau|looker|excel|power bi|salesforce|hubspot|amplitude|mixpanel)/i.test(skill));

  if (!skills.length) {
    const inferredSkills = lines.filter((line) => SKILL_HINTS.some((hint) => line.toLowerCase().includes(hint)));
    skills.push(...inferredSkills);
  }

  return parsedResumeSchema.parse({
    headline: lines[1] ?? lines[0] ?? "",
    summary: summary || lines.slice(firstBodyIndex, firstBodyIndex + 2).join(" "),
    experience,
    achievements,
    skills,
    tools,
    education: educationLines,
    certifications: certificationLines,
    projects: projectLines
  });
}
