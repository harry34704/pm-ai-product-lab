import { db } from "../db";

export async function getDashboardSnapshot(userId: string) {
  const [resumes, jobs, analyses, sessions] = await Promise.all([
    db.resume.count({ where: { userId } }),
    db.jobDescription.count({ where: { userId } }),
    db.analysisReport.count({ where: { userId } }),
    db.session.count({ where: { candidateUserId: userId } })
  ]);

  return { resumes, jobs, analyses, sessions };
}
