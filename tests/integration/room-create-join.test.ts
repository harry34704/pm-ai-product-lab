import { beforeEach, describe, expect, it, vi } from "vitest";

type FakeParticipant = {
  id: string;
  roomId: string;
  userId: string | null;
  displayName: string;
  role: "CANDIDATE" | "INTERVIEWER";
  joinedAt: Date;
  leftAt: Date | null;
};

type FakeRoom = {
  id: string;
  ownerId: string;
  roomCode: string;
  title: string;
  status: "LOBBY";
  durationMinutes: number;
  createdAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
};

let roomStore: FakeRoom[] = [];
let participantStore: FakeParticipant[] = [];

const practiceRoomCreate = vi.fn(async ({ data }: { data: any }) => {
  const room: FakeRoom = {
    id: "room-1",
    ownerId: data.ownerId,
    roomCode: "ABC123",
    title: data.title,
    status: "LOBBY",
    durationMinutes: data.durationMinutes,
    createdAt: new Date(),
    startedAt: null,
    endedAt: null
  };

  const participant: FakeParticipant = {
    id: "participant-1",
    roomId: room.id,
    userId: data.participants.create.userId,
    displayName: data.participants.create.displayName,
    role: data.participants.create.role,
    joinedAt: new Date(),
    leftAt: null
  };

  roomStore.push(room);
  participantStore.push(participant);

  return {
    ...room,
    participants: [participant]
  };
});

const practiceRoomFindFirst = vi.fn(async ({ where }: { where: any }) => {
  const room = roomStore.find((item) => (where.id ? item.id === where.id : item.roomCode === where.roomCode));
  if (!room) {
    return null;
  }

  return {
    ...room,
    participants: participantStore.filter((participant) => participant.roomId === room.id),
    sessions: []
  };
});

const practiceRoomFindUnique = vi.fn(async ({ where }: { where: any }) => {
  const room = roomStore.find((item) => item.id === where.id);
  if (!room) {
    return null;
  }

  return {
    ...room,
    participants: participantStore.filter((participant) => participant.roomId === room.id),
    sessions: []
  };
});

const roomParticipantCreate = vi.fn(async ({ data }: { data: any }) => {
  const participant: FakeParticipant = {
    id: `participant-${participantStore.length + 1}`,
    roomId: data.roomId,
    userId: data.userId ?? null,
    displayName: data.displayName,
    role: data.role,
    joinedAt: new Date(),
    leftAt: null
  };

  participantStore.push(participant);
  return participant;
});

vi.mock("../../apps/web/lib/db", () => ({
  db: {
    practiceRoom: {
      create: practiceRoomCreate,
      findFirst: practiceRoomFindFirst,
      findUnique: practiceRoomFindUnique
    },
    roomParticipant: {
      create: roomParticipantCreate
    }
  }
}));

describe("practice room integration", () => {
  beforeEach(() => {
    roomStore = [];
    participantStore = [];
    practiceRoomCreate.mockClear();
    practiceRoomFindFirst.mockClear();
    practiceRoomFindUnique.mockClear();
    roomParticipantCreate.mockClear();
  });

  it("creates a room and allows a guest interviewer to join", async () => {
    const { createPracticeRoom, joinPracticeRoom } = await import("../../apps/web/lib/server/practice");

    const room = await createPracticeRoom("user-1", {
      title: "Room Test",
      durationMinutes: 15,
      role: "CANDIDATE" as any,
      displayName: "Room Owner"
    });

    const joined = await joinPracticeRoom({
      roomId: room.id,
      displayName: "Guest Interviewer",
      role: "INTERVIEWER" as any
    });

    expect(practiceRoomCreate).toHaveBeenCalled();
    expect(roomParticipantCreate).toHaveBeenCalled();
    expect(joined?.participants.length).toBe(2);
    expect(joined?.participants.some((participant: FakeParticipant) => participant.displayName === "Guest Interviewer")).toBe(true);
  });
});
