import { ParticipantRole, PracticeRoomStatus, SessionStatus } from "@prisma/client";
import { generateCoachingHints, parsedJobDescriptionSchema, parsedResumeSchema, reviewSession, type TranscriptEvent } from "@mockroom/shared";
import { db } from "../db";

function randomRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createPracticeRoom(ownerId: string, input: { title: string; durationMinutes: number; role: ParticipantRole; displayName: string }) {
  const room = await db.practiceRoom.create({
    data: {
      ownerId,
      title: input.title,
      durationMinutes: input.durationMinutes,
      roomCode: randomRoomCode(),
      participants: {
        create: {
          userId: ownerId,
          displayName: input.displayName,
          role: input.role
        }
      }
    },
    include: {
      participants: true
    }
  });

  return room;
}

export async function joinPracticeRoom(
  input: { roomId?: string; roomCode?: string; displayName: string; role: ParticipantRole; userId?: string | null }
) {
  const room = await db.practiceRoom.findFirst({
    where: input.roomId ? { id: input.roomId } : { roomCode: input.roomCode },
    include: {
      participants: {
        orderBy: { joinedAt: "asc" }
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!room) {
    throw new Error("Practice room not found.");
  }

  const existing = room.participants.find(
    (participant) =>
      (!participant.leftAt && participant.userId && input.userId && participant.userId === input.userId) ||
      (!participant.leftAt && !participant.userId && participant.displayName === input.displayName && participant.role === input.role)
  );

  if (!existing) {
    await db.roomParticipant.create({
      data: {
        roomId: room.id,
        userId: input.userId ?? null,
        displayName: input.displayName,
        role: input.role
      }
    });
  }

  return getPracticeRoomState(room.id);
}

export async function startPracticeSession(roomId: string, actorUserId: string) {
  const room = await db.practiceRoom.findFirst({
    where: {
      id: roomId,
      ownerId: actorUserId
    },
    include: {
      participants: {
        orderBy: { joinedAt: "asc" }
      },
      sessions: {
        where: {
          status: {
            not: SessionStatus.ENDED
          }
        },
        take: 1
      }
    }
  });

  if (!room) {
    throw new Error("Practice room not found.");
  }

  const candidateParticipant = room.participants.find((participant) => participant.role === ParticipantRole.CANDIDATE);
  const interviewerParticipant = room.participants.find((participant) => participant.role === ParticipantRole.INTERVIEWER);

  const session =
    room.sessions[0] ??
    (await db.session.create({
      data: {
        roomId,
        candidateUserId: candidateParticipant?.userId ?? null,
        interviewerUserId: interviewerParticipant?.userId ?? null,
        status: SessionStatus.LIVE,
        startedAt: new Date(),
        transcriptJson: []
      }
    }));

  await db.practiceRoom.update({
    where: { id: roomId },
    data: {
      status: PracticeRoomStatus.LIVE,
      startedAt: room.startedAt ?? new Date()
    }
  });

  if (session.status !== SessionStatus.LIVE) {
    await db.session.update({
      where: { id: session.id },
      data: {
        status: SessionStatus.LIVE,
        startedAt: session.startedAt ?? new Date()
      }
    });
  }

  return getPracticeRoomState(roomId);
}

export async function getPracticeRoomState(roomId: string) {
  return db.practiceRoom.findUnique({
    where: { id: roomId },
    include: {
      participants: {
        orderBy: { joinedAt: "asc" }
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          questions: true,
          answers: true,
          feedbackReport: true
        }
      }
    }
  });
}

export async function addTranscriptEvent(input: { sessionId: string; event: TranscriptEvent }) {
  const session = await db.session.findUnique({
    where: { id: input.sessionId },
    include: {
      questions: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!session) {
    throw new Error("Session not found.");
  }

  const currentTranscriptJson = (session.transcriptJson as TranscriptEvent[] | null) ?? [];
  const transcriptJson = [...currentTranscriptJson, input.event];
  const transcript = transcriptJson.map((event) => `${event.speakerLabel}: ${event.text}`).join("\n");

  await db.session.update({
    where: { id: session.id },
    data: {
      transcript,
      transcriptJson
    }
  });

  if (input.event.role === "INTERVIEWER" || input.event.text.trim().endsWith("?")) {
    await db.sessionQuestion.create({
      data: {
        sessionId: session.id,
        text: input.event.text,
        timestampMs: input.event.timestampMs,
        detectedTopic: input.event.text.split(" ").slice(0, 4).join(" ")
      }
    });
  }

  if (input.event.role === "CANDIDATE") {
    await db.sessionAnswer.create({
      data: {
        sessionId: session.id,
        questionId: session.questions[0]?.id,
        speakerLabel: input.event.speakerLabel,
        text: input.event.text
      }
    });
  }

  return { ok: true };
}

export async function getCoachingForSession(sessionId: string, userId?: string | null) {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      room: true
    }
  });

  if (!session) {
    throw new Error("Session not found.");
  }

  const roomOwnerId = session.room.ownerId;
  const effectiveUserId = userId ?? roomOwnerId;

  const [resume, latestAnalysis] = await Promise.all([
    db.resume.findFirst({
      where: { userId: effectiveUserId },
      orderBy: { updatedAt: "desc" }
    }),
    db.analysisReport.findFirst({
      where: { userId: effectiveUserId },
      orderBy: { createdAt: "desc" },
      include: { jobDescription: true }
    })
  ]);

  if (!resume) {
    throw new Error("Resume not found for coaching.");
  }

  const hints = generateCoachingHints({
    transcript: (session.transcriptJson as TranscriptEvent[] | null) ?? [],
    resume: parsedResumeSchema.parse(resume.parsedJson),
    job: latestAnalysis ? parsedJobDescriptionSchema.parse(latestAnalysis.jobDescription.parsedJson) : null
  });

  return hints;
}

export async function endPracticeSession(sessionId: string, actorUserId: string) {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      room: true,
      answers: true,
      questions: true
    }
  });

  if (!session || session.room.ownerId !== actorUserId) {
    throw new Error("Session not found.");
  }

  const transcript = (session.transcriptJson as TranscriptEvent[] | null) ?? [];
  const review = reviewSession({ transcript });

  await db.session.update({
    where: { id: sessionId },
    data: {
      status: SessionStatus.ENDED,
      endedAt: new Date()
    }
  });

  await db.practiceRoom.update({
    where: { id: session.roomId },
    data: {
      status: PracticeRoomStatus.ENDED,
      endedAt: new Date()
    }
  });

  const answers = await db.sessionAnswer.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" }
  });

  for (const [index, item] of review.answers.entries()) {
    const existing = answers[index];

    if (existing) {
      await db.sessionAnswer.update({
        where: { id: existing.id },
        data: {
          score: item.score,
          strengths: item.strengths,
          weaknesses: item.weaknesses,
          improvedAnswer: item.improvedAnswer,
          starRewrite: item.starRewrite,
          conciseRewrite: item.conciseRewrite,
          executiveRewrite: item.executiveRewrite
        }
      });
    }
  }

  await db.feedbackReport.upsert({
    where: { sessionId },
    update: {
      summary: review.summary,
      topStrengths: review.topStrengths,
      topImprovements: review.topImprovements,
      fillerWordNotes: review.fillerWordNotes
    },
    create: {
      sessionId,
      summary: review.summary,
      topStrengths: review.topStrengths,
      topImprovements: review.topImprovements,
      fillerWordNotes: review.fillerWordNotes
    }
  });

  return review;
}
