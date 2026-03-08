import { ProviderRouter } from "@mockroom/shared";
import { db } from "../db";

const defaultSettings = {
  aiProviderPriority: ["mock", "openai", "groq", "openrouter", "ollama"],
  defaultModel: "mock-1",
  transcriptionProvider: "browser",
  coachingLevel: "balanced",
  localOnlyMode: true,
  storeAudio: false,
  darkMode: true
};

export async function getOrCreateSettings(userId: string) {
  const settings = await db.userSettings.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      ...defaultSettings
    }
  });

  return settings;
}

export async function updateSettings(userId: string, input: Partial<typeof defaultSettings>) {
  return db.userSettings.upsert({
    where: { userId },
    update: {
      aiProviderPriority: input.aiProviderPriority,
      defaultModel: input.defaultModel,
      transcriptionProvider: input.transcriptionProvider,
      coachingLevel: input.coachingLevel,
      localOnlyMode: input.localOnlyMode,
      storeAudio: input.storeAudio,
      darkMode: input.darkMode
    },
    create: {
      userId,
      aiProviderPriority: input.aiProviderPriority ?? defaultSettings.aiProviderPriority,
      defaultModel: input.defaultModel ?? defaultSettings.defaultModel,
      transcriptionProvider: input.transcriptionProvider ?? defaultSettings.transcriptionProvider,
      coachingLevel: input.coachingLevel ?? defaultSettings.coachingLevel,
      localOnlyMode: input.localOnlyMode ?? defaultSettings.localOnlyMode,
      storeAudio: input.storeAudio ?? defaultSettings.storeAudio,
      darkMode: input.darkMode ?? defaultSettings.darkMode
    }
  });
}

export async function deleteUserData(userId: string) {
  await db.feedbackReport.deleteMany({
    where: {
      session: {
        room: {
          ownerId: userId
        }
      }
    }
  });

  await db.sessionAnswer.deleteMany({
    where: {
      session: {
        room: {
          ownerId: userId
        }
      }
    }
  });

  await db.sessionQuestion.deleteMany({
    where: {
      session: {
        room: {
          ownerId: userId
        }
      }
    }
  });

  await db.session.deleteMany({
    where: {
      room: {
        ownerId: userId
      }
    }
  });

  await db.roomParticipant.deleteMany({
    where: {
      room: {
        ownerId: userId
      }
    }
  });

  await db.practiceRoom.deleteMany({ where: { ownerId: userId } });
  await db.analysisReport.deleteMany({ where: { userId } });
  await db.story.deleteMany({ where: { userId } });
  await db.resumeSection.deleteMany({
    where: {
      resume: {
        userId
      }
    }
  });
  await db.resume.deleteMany({ where: { userId } });
  await db.jobDescription.deleteMany({ where: { userId } });

  return getOrCreateSettings(userId);
}

export async function getProviderStatus(userId: string) {
  const settings = await getOrCreateSettings(userId);
  const router = new ProviderRouter({
    priority: (settings.aiProviderPriority as string[]) as ("mock" | "openai" | "groq" | "openrouter" | "ollama")[]
  });

  const health = await router.healthCheck();
  return { settings, health };
}
