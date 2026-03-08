import type { ParsedJobDescription } from "../schemas/parsed-job";
import type { ParsedResume } from "../schemas/parsed-resume";
import { analysisOutputSchema, type AnalysisOutput } from "../schemas/analysis-output";
import { overlapScore } from "../../utils/score";
import { titleCase } from "../../utils/text";

export function analyzeMatch(resume: ParsedResume, job: ParsedJobDescription): AnalysisOutput {
  const resumeKeywords = Array.from(
    new Set(
      [
        ...resume.skills,
        ...resume.tools,
        ...resume.achievements,
        ...resume.experience.flatMap((entry) => [entry.title, entry.company, ...entry.bullets])
      ]
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9#+.]+/i)
        .filter((token) => token.length > 2)
    )
  );

  const jobKeywords = Array.from(new Set(job.keywords.map((keyword) => keyword.toLowerCase())));
  const matchedKeywords = jobKeywords.filter((keyword) => resumeKeywords.includes(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resumeKeywords.includes(keyword));
  const matchScore = overlapScore(matchedKeywords.length, Math.max(jobKeywords.length, 1));

  const strengths = [
    resume.summary && "Resume shows a clear positioning statement aligned to the target role.",
    matchedKeywords.length >= 3 && `Strong overlap on ${matchedKeywords.slice(0, 3).join(", ")}.`,
    resume.achievements.length > 0 && "The resume contains measurable outcomes that are useful in interviews.",
    resume.experience.length > 0 && "Cross-functional experience is visible from the work history."
  ].filter(Boolean) as string[];

  const gapFraming = missingKeywords.length
    ? missingKeywords.slice(0, 4).map((keyword) => `If asked about ${keyword}, be explicit about adjacent experience and what evidence you do have.`)
    : ["The resume already covers most job keywords. Focus on depth and specificity instead of stretching claims."];

  const likelyInterviewThemes = [
    "Role fit and motivation",
    "Relevant impact stories",
    "Cross-functional collaboration",
    "Decision-making under ambiguity"
  ];

  const recruiterFocus = job.roleTitle || "this role";
  const likelyRecruiterQuestions = [
    `Why are you interested in ${recruiterFocus}?`,
    "Walk me through your background.",
    "Which parts of your experience are most relevant here?"
  ];

  const likelyHiringManagerQuestions = [
    `Tell me about a time you worked on ${matchedKeywords[0] ?? "a complex initiative"}.`,
    "How do you prioritize conflicting requests?",
    "What metrics do you use to judge success?"
  ];

  const likelyBehavioralQuestions = [
    "Describe a time you handled disagreement with stakeholders.",
    "Tell me about a time you had limited data.",
    "Describe a project that did not go to plan."
  ];

  const highlightMetric = resume.achievements[0] ?? resume.experience[0]?.bullets[0] ?? "measurable delivery outcomes";
  const title = resume.headline || resume.experience[0]?.title || "candidate";

  return analysisOutputSchema.parse({
    matchScore,
    matchedKeywords: matchedKeywords.map(titleCase),
    missingKeywords: missingKeywords.map(titleCase),
    strengths,
    gapFraming,
    likelyInterviewThemes,
    likelyRecruiterQuestions,
    likelyHiringManagerQuestions,
    likelyBehavioralQuestions,
    intro30: `I’m a ${title} with experience in ${resume.skills.slice(0, 3).join(", ")}, and I’m strongest when I can connect strategy to measurable outcomes.`,
    intro60: `I’m a ${title} with experience across ${resume.skills.slice(0, 4).join(", ")}. In recent work I’ve focused on ${highlightMetric}, which is why this role stood out to me.`,
    intro90: `I’m a ${title} whose background combines ${resume.skills.slice(0, 4).join(", ")} with hands-on delivery. The pattern across my experience is taking ambiguous problems, aligning stakeholders, and turning them into measurable outcomes such as ${highlightMetric}. That combination is why I’m a strong fit for this role.`
  });
}
