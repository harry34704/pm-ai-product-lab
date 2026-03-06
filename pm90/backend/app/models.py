from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    headline = Column(String(255), nullable=False, default="Aspiring Product Manager")
    password_hash = Column(String(255), nullable=False)
    xp_balance = Column(Integer, nullable=False, default=0)
    current_level = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_active_date = Column(Date, nullable=True)

    progress_entries = relationship("DailyProgress", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    artifacts = relationship("Artifact", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("DiscussionPost", back_populates="user", cascade="all, delete-orphan")
    simulation_attempts = relationship("SimulationAttempt", back_populates="user", cascade="all, delete-orphan")


class DayContent(Base):
    __tablename__ = "day_content"

    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, unique=True, nullable=False, index=True)
    phase_key = Column(String(80), nullable=False, index=True)
    phase_name = Column(String(120), nullable=False)
    topic = Column(String(255), nullable=False)
    skill_area = Column(String(80), nullable=False, index=True)
    lesson = Column(Text, nullable=False)
    practical_task = Column(Text, nullable=False)
    reflection_question = Column(Text, nullable=False)
    mentor_prompt = Column(Text, nullable=False)
    xp_reward = Column(Integer, nullable=False, default=80)

    progress_entries = relationship("DailyProgress", back_populates="day")


class DailyProgress(Base):
    __tablename__ = "daily_progress"
    __table_args__ = (UniqueConstraint("user_id", "day_id", name="uq_user_day_progress"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    day_id = Column(Integer, ForeignKey("day_content.id"), nullable=False, index=True)
    reflection_response = Column(Text, nullable=True)
    challenge_answer = Column(Text, nullable=True)
    mentor_summary = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    completed = Column(Boolean, nullable=False, default=True)
    completed_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="progress_entries")
    day = relationship("DayContent", back_populates="progress_entries")


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = (UniqueConstraint("user_id", "badge_code", name="uq_user_badge"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    badge_code = Column(String(120), nullable=False, index=True)
    badge_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    unlocked_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="badges")


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    kind = Column(String(80), nullable=False, index=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    metadata_json = Column("metadata", JSON, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="artifacts")


class DiscussionPost(Base):
    __tablename__ = "discussion_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    topic = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    likes = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="posts")


class SimulationAttempt(Base):
    __tablename__ = "simulation_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scenario_key = Column(String(120), nullable=False, index=True)
    selected_option = Column(String(120), nullable=False)
    rationale = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="simulation_attempts")
