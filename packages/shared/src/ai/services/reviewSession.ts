import type { TranscriptEvent } from "../../types";
import { sessionReviewOutputSchema, type SessionReviewOutput } from "../schemas/session-review-output";

type ReviewInput = {
  transcript: TranscriptEvent[];
};

function scoreAnswer(answer: string): number {
  let score = 60;

  if (answer.length > 140) {
    score += 10;
  }

  if (/\d/.test(answer)) {
    score += 12;
  }

  if (/I |I'|I’ve|I led|I built|I drove/i.test(answer)) {
    score += 8;
  }

  if (/because|so that|which/i.test(answer)) {
    score += 5;
  }

  return Math.min(score, 96);
}

export function reviewSession(input: ReviewInput): SessionReviewOutput {
  const questions = input.transcript.filter((event) => event.role === "INTERVIEWER");
  const answers = input.transcript.filter((event) => event.role === "CANDIDATE");

  const reviewedAnswers = answers.map((answer, index) => {
    const question = questions[index]?.text ?? "General response";
    const score = scoreAnswer(answer.text);
    const strengths = [
      /\d/.test(answer.text) ? "Includes a measurable outcome." : "Relevant example selection.",
      /I /i.test(answer.text) ? "Shows personal ownership." : "Reasonably direct response."
    ];
    const weaknesses = [
      !/\d/.test(answer.text) ? "Add a metric or business outcome." : "Could state the context faster.",
      answer.text.length < 100 ? "Answer is brief; add one more specific action detail." : "Could tighten the closing sentence."
    ];

    return {
      question,
      answer: answer.text,
      score,
      strengths,
      weaknesses,
      improvedAnswer: `${answer.text} I would frame it more clearly by linking the action to the decision and the final business outcome.`,
      starRewrite: `Situation: ${question} Task: explain your responsibility. Action: ${answer.text} Result: close with a concrete impact.`,
      conciseRewrite: answer.text.length > 180 ? `${answer.text.slice(0, 177)}...` : answer.text,
      executiveRewrite: `The core example is ${answer.text.replace(/\s+/g, " ").trim()}. The executive version should foreground the decision, the collaborators, and the measurable result.`
    };
  });

  const topStrengths = Array.from(new Set(reviewedAnswers.flatMap((item) => item.strengths))).slice(0, 3);
  const topImprovements = Array.from(new Set(reviewedAnswers.flatMap((item) => item.weaknesses))).slice(0, 3);

  return sessionReviewOutputSchema.parse({
    summary:
      reviewedAnswers.length > 0
        ? "The session shows credible examples and useful raw material. The next step is improving structure, specificity, and outcome framing."
        : "No spoken answers were captured. Use manual notes or transcript fallback and rerun the review.",
    topStrengths,
    topImprovements,
    fillerWordNotes: ["Review filler words manually in this MVP unless browser speech annotations are available."],
    answers: reviewedAnswers
  });
}
