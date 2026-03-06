from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=8, max_length=255)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserSummary(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    headline: str
    xp_balance: int
    current_level: int
    model_config = ConfigDict(from_attributes=True)


class BadgeSummary(BaseModel):
    badge_code: str
    badge_name: str
    description: str
    unlocked_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SkillNode(BaseModel):
    skill: str
    completed_days: int
    total_days: int
    progress_percent: float


class PhaseProgress(BaseModel):
    phase_key: str
    phase_name: str
    completed_days: int
    total_days: int
    progress_percent: float


class DaySummary(BaseModel):
    day_number: int
    phase_key: str
    phase_name: str
    topic: str
    skill_area: str
    xp_reward: int
    status: str
    model_config = ConfigDict(from_attributes=True)


class DayDetail(BaseModel):
    day_number: int
    phase_key: str
    phase_name: str
    topic: str
    skill_area: str
    lesson: str
    practical_task: str
    reflection_question: str
    mentor_prompt: str
    xp_reward: int
    status: str
    previous_reflection: Optional[str] = None
    previous_answer: Optional[str] = None


class DailyCompletionRequest(BaseModel):
    reflection_response: str = Field(min_length=8)
    challenge_answer: str = Field(min_length=8)


class DailyCompletionResponse(BaseModel):
    status: str
    xp_balance: int
    current_level: int
    unlocked_badges: List[str]


class LeaderboardEntry(BaseModel):
    name: str
    headline: str
    xp_balance: int
    current_level: int


class ArtifactCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    kind: str = Field(min_length=2, max_length=80)
    summary: Optional[str] = None
    content: str = Field(min_length=8)
    metadata: Dict = Field(default_factory=dict)


class ArtifactGenerateRequest(BaseModel):
    product_name: str
    audience: str
    problem: str
    outcome: str
    context: Optional[str] = None


class ArtifactResponse(BaseModel):
    id: int
    title: str
    kind: str
    summary: Optional[str]
    content: str
    metadata: Dict
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class MentorRequest(BaseModel):
    prompt: str = Field(min_length=2)
    context: Optional[str] = None
    mode: str = "coach"


class ReviewRequest(BaseModel):
    content: str = Field(min_length=12)


class InterviewRequest(BaseModel):
    question: str = Field(min_length=8)
    answer: str = Field(min_length=8)


class MentorResponse(BaseModel):
    mode: str
    provider: str
    response: str


class SimulationOption(BaseModel):
    key: str
    label: str
    description: str


class SimulationScenario(BaseModel):
    key: str
    title: str
    summary: str
    challenge: str
    business_context: str
    options: List[SimulationOption]
    recommended_focus: str


class SimulationAttemptRequest(BaseModel):
    selected_option: str
    rationale: str = Field(min_length=8)


class SimulationAttemptResponse(BaseModel):
    score: float
    feedback: str
    xp_balance: int


class DiscussionPostCreate(BaseModel):
    topic: str = Field(min_length=3, max_length=255)
    body: str = Field(min_length=8)


class DiscussionPostResponse(BaseModel):
    id: int
    topic: str
    body: str
    likes: int
    created_at: datetime
    author_name: str


class ResourceItem(BaseModel):
    category: str
    title: str
    description: str
    url: str
    format: str


class AnalyticsMetric(BaseModel):
    label: str
    value: float
    delta: float


class AnalyticsResponse(BaseModel):
    metrics: List[AnalyticsMetric]
    funnel: List[Dict]
    cohorts: List[Dict]
    retention: List[Dict]
    ab_tests: List[Dict]
    sample_events: List[Dict]


class DashboardResponse(BaseModel):
    user: UserSummary
    streak_count: int
    badges: List[BadgeSummary]
    skill_tree: List[SkillNode]
    phase_progress: List[PhaseProgress]
    next_day: Optional[DaySummary]
    completed_days: int
    total_days: int
    artifacts: List[ArtifactResponse]
    leaderboard: List[LeaderboardEntry]
