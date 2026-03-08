import { analyzeMatch, parsedJobDescriptionSchema, parsedResumeSchema } from "@mockroom/shared";
import { db } from "../db";

export async function createAnalysisReport(userId: string, resumeId: string, jobDescriptionId: string) {
  const [resume, job] = await Promise.all([
    db.resume.findFirst({ where: { id: resumeId, userId } }),
    db.jobDescription.findFirst({ where: { id: jobDescriptionId, userId } })
  ]);

  if (!resume || !job) {
    throw new Error("Resume or job description not found.");
  }

  const result = analyzeMatch(parsedResumeSchema.parse(resume.parsedJson), parsedJobDescriptionSchema.parse(job.parsedJson));

  return db.analysisReport.create({
    data: {
      userId,
      resumeId,
      jobDescriptionId,
      matchScore: result.matchScore,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      strengths: result.strengths,
      gapFraming: result.gapFraming,
      likelyQuestions: {
        themes: result.likelyInterviewThemes,
        recruiter: result.likelyRecruiterQuestions,
        hiringManager: result.likelyHiringManagerQuestions,
        behavioral: result.likelyBehavioralQuestions
      },
      intro30: result.intro30,
      intro60: result.intro60,
      intro90: result.intro90
    }
  });
}
