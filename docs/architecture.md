# Architecture

## App Structure

- `apps/web`: Next.js App Router UI and internal API routes
- `apps/desktop`: Electron shell with a secure preload bridge
- `packages/shared`: AI provider router, prompts, schemas, and deterministic services
- `prisma`: database schema and seed data
- `tests`: unit, integration, and e2e coverage

## Desktop Runtime Model

1. Electron starts a visible `BrowserWindow`.
2. In development it loads `http://localhost:3000`.
3. In production it can load the built Next.js standalone server output.
4. The preload bridge exposes only:
   - app metadata
   - file dialog helpers
   - file reading helpers
   - microphone permission requests
5. Node integration stays disabled in the renderer and context isolation stays enabled.

## Provider Router Design

- `ProviderRouter` accepts a priority order and registered providers.
- Each provider implements:
  - `generateText`
  - `generateStructured`
  - `transcribeAudio`
  - `healthCheck`
- Router behavior:
  - attempts providers in priority order
  - logs fallback events
  - skips unavailable providers
  - returns graceful errors if all providers fail
- `MockProvider` is included so local MVP flows work without external keys.

## Session Lifecycle

1. Authenticated user creates a practice room.
2. Room owner shares the room code or URL.
3. Candidate and interviewer join with explicit roles.
4. Owner starts the session.
5. Clients request microphone access and acknowledge transcript consent.
6. Transcript events are saved incrementally.
7. The coaching panel polls for visible practice hints.
8. Ending the session generates question extraction, answer scoring, rewrites, and a feedback report.

## Data Model

Core persisted entities:

- `User`, `Profile`, `UserSettings`
- `Resume`, `ResumeSection`
- `JobDescription`, `AnalysisReport`
- `Story`
- `PracticeRoom`, `RoomParticipant`, `Session`
- `SessionQuestion`, `SessionAnswer`, `FeedbackReport`
