export type UserSummary = {
  id: number;
  email: string;
  full_name: string;
  headline: string;
  xp_balance: number;
  current_level: number;
};

export type Badge = {
  badge_code: string;
  badge_name: string;
  description: string;
  unlocked_at: string;
};

export type PhaseProgress = {
  phase_key: string;
  phase_name: string;
  completed_days: number;
  total_days: number;
  progress_percent: number;
};

export type SkillNode = {
  skill: string;
  completed_days: number;
  total_days: number;
  progress_percent: number;
};

export type DaySummary = {
  day_number: number;
  phase_key: string;
  phase_name: string;
  topic: string;
  skill_area: string;
  xp_reward: number;
  status: "completed" | "unlocked" | "locked";
};

export type DayDetail = DaySummary & {
  lesson: string;
  practical_task: string;
  reflection_question: string;
  mentor_prompt: string;
  previous_reflection?: string | null;
  previous_answer?: string | null;
};

export type Artifact = {
  id: number;
  title: string;
  kind: string;
  summary?: string | null;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type DashboardSummary = {
  user: UserSummary;
  streak_count: number;
  badges: Badge[];
  skill_tree: SkillNode[];
  phase_progress: PhaseProgress[];
  next_day?: DaySummary | null;
  completed_days: number;
  total_days: number;
  artifacts: Artifact[];
  leaderboard: Array<{
    name: string;
    headline: string;
    xp_balance: number;
    current_level: number;
  }>;
};

export type MentorResponse = {
  mode: string;
  provider: string;
  response: string;
};

export type SimulationScenario = {
  key: string;
  title: string;
  summary: string;
  challenge: string;
  business_context: string;
  options: Array<{ key: string; label: string; description: string }>;
  recommended_focus: string;
};

export type AnalyticsPayload = {
  metrics: Array<{ label: string; value: number; delta: number }>;
  funnel: Array<{ stage: string; users: number }>;
  cohorts: Array<Record<string, string | number>>;
  retention: Array<{ day: string; retention: number }>;
  ab_tests: Array<{ experiment: string; variant_a: number; variant_b: number; winner: string }>;
  sample_events: Array<Record<string, string | number>>;
};

export type CommunityOverview = {
  posts: Array<{
    id: number;
    topic: string;
    body: string;
    likes: number;
    created_at: string;
    author_name: string;
  }>;
  weekly_challenges: Array<{ week: number; title: string; xp_reward: number }>;
  leaderboard: DashboardSummary["leaderboard"];
  progress_feed: Array<{ type: string; timestamp: string; message: string }>;
};

export type ResourcePayload = {
  resources: Array<{
    category: string;
    title: string;
    description: string;
    url: string;
    format: string;
  }>;
};
