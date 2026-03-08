import type { CoachingHints, TranscriptEvent } from "../../types";
import type { ParsedResume } from "../schemas/parsed-resume";
import type { ParsedJobDescription } from "../schemas/parsed-job";

type CoachingContext = {
  transcript: TranscriptEvent[];
  resume: ParsedResume;
  job?: ParsedJobDescription | null;
};

export function generateCoachingHints(context: CoachingContext): CoachingHints {
  const latestQuestion = [...context.transcript].reverse().find((event) => event.role === "INTERVIEWER");
  const latestAnswer = [...context.transcript].reverse().find((event) => event.role === "CANDIDATE");
  const skills = context.resume.skills.slice(0, 3);
  const achievements = context.resume.achievements.slice(0, 2);
  const requiredSkills = context.job?.requiredSkills.slice(0, 3) ?? [];

  const mentionsMetric = /\d/.test(latestAnswer?.text ?? "");

  return {
    questionIntent: latestQuestion
      ? `The interviewer is likely testing ${requiredSkills[0] ?? "role fit"} and how specifically you can connect evidence to the question.`
      : "Waiting for the next interviewer prompt.",
    answerStructure: [
      "Open with the context in one sentence.",
      "Describe your decision or contribution clearly.",
      "Close with a concrete outcome or learning."
    ],
    resumeEvidence: achievements.length ? achievements : skills,
    starReminders: [
      "Situation: one sentence of context.",
      "Task: define your responsibility.",
      "Action: emphasize what you personally did.",
      "Result: include a metric if you have one."
    ],
    followUps: [
      "How did you measure success?",
      "What trade-offs did you consider?",
      "What would you do differently next time?"
    ],
    nudges: [
      mentionsMetric ? "You already have a metric. Tie it back to the decision you made." : "Be more specific and mention a metric or visible outcome.",
      latestAnswer && latestAnswer.text.length < 120 ? "Add more detail on the action you personally led." : "Keep the answer structured and avoid too much scene-setting."
    ]
  };
}
