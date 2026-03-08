"use client";

import { AnswerScoreCard } from "./answer-score-card";

export function QuestionReviewAccordion({ answers }: { answers: any[] }) {
  return (
    <div className="space-y-4">
      {answers.map((answer) => (
        <details key={answer.id} className="rounded-2xl border border-border bg-slate-950/45 p-4">
          <summary className="cursor-pointer list-none font-medium">
            {answer.question?.text ?? "Question review"}
          </summary>
          <div className="mt-4">
            <AnswerScoreCard answer={answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
