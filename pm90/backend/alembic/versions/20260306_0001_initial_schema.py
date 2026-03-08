"""initial schema"""

from alembic import op
import sqlalchemy as sa


revision = "20260306_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("headline", sa.String(length=255), nullable=False, server_default="Aspiring Product Manager"),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("xp_balance", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("current_level", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("last_active_date", sa.Date(), nullable=True),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"], unique=False)

    op.create_table(
        "day_content",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("day_number", sa.Integer(), nullable=False),
        sa.Column("phase_key", sa.String(length=80), nullable=False),
        sa.Column("phase_name", sa.String(length=120), nullable=False),
        sa.Column("topic", sa.String(length=255), nullable=False),
        sa.Column("skill_area", sa.String(length=80), nullable=False),
        sa.Column("lesson", sa.Text(), nullable=False),
        sa.Column("practical_task", sa.Text(), nullable=False),
        sa.Column("reflection_question", sa.Text(), nullable=False),
        sa.Column("mentor_prompt", sa.Text(), nullable=False),
        sa.Column("xp_reward", sa.Integer(), nullable=False, server_default="80"),
    )
    op.create_index("ix_day_content_day_number", "day_content", ["day_number"], unique=True)
    op.create_index("ix_day_content_id", "day_content", ["id"], unique=False)
    op.create_index("ix_day_content_phase_key", "day_content", ["phase_key"], unique=False)
    op.create_index("ix_day_content_skill_area", "day_content", ["skill_area"], unique=False)

    op.create_table(
        "daily_progress",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("day_id", sa.Integer(), sa.ForeignKey("day_content.id"), nullable=False),
        sa.Column("reflection_response", sa.Text(), nullable=True),
        sa.Column("challenge_answer", sa.Text(), nullable=True),
        sa.Column("mentor_summary", sa.Text(), nullable=True),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("completed_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("user_id", "day_id", name="uq_user_day_progress"),
    )
    op.create_index("ix_daily_progress_day_id", "daily_progress", ["day_id"], unique=False)
    op.create_index("ix_daily_progress_id", "daily_progress", ["id"], unique=False)
    op.create_index("ix_daily_progress_user_id", "daily_progress", ["user_id"], unique=False)

    op.create_table(
        "user_badges",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("badge_code", sa.String(length=120), nullable=False),
        sa.Column("badge_name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("unlocked_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("user_id", "badge_code", name="uq_user_badge"),
    )
    op.create_index("ix_user_badges_badge_code", "user_badges", ["badge_code"], unique=False)
    op.create_index("ix_user_badges_id", "user_badges", ["id"], unique=False)
    op.create_index("ix_user_badges_user_id", "user_badges", ["user_id"], unique=False)

    op.create_table(
        "artifacts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("kind", sa.String(length=80), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_artifacts_id", "artifacts", ["id"], unique=False)
    op.create_index("ix_artifacts_kind", "artifacts", ["kind"], unique=False)
    op.create_index("ix_artifacts_user_id", "artifacts", ["user_id"], unique=False)

    op.create_table(
        "discussion_posts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("topic", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("likes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_discussion_posts_id", "discussion_posts", ["id"], unique=False)
    op.create_index("ix_discussion_posts_user_id", "discussion_posts", ["user_id"], unique=False)

    op.create_table(
        "simulation_attempts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("scenario_key", sa.String(length=120), nullable=False),
        sa.Column("selected_option", sa.String(length=120), nullable=False),
        sa.Column("rationale", sa.Text(), nullable=True),
        sa.Column("score", sa.Float(), nullable=True),
        sa.Column("feedback", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_simulation_attempts_id", "simulation_attempts", ["id"], unique=False)
    op.create_index("ix_simulation_attempts_scenario_key", "simulation_attempts", ["scenario_key"], unique=False)
    op.create_index("ix_simulation_attempts_user_id", "simulation_attempts", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_simulation_attempts_user_id", table_name="simulation_attempts")
    op.drop_index("ix_simulation_attempts_scenario_key", table_name="simulation_attempts")
    op.drop_index("ix_simulation_attempts_id", table_name="simulation_attempts")
    op.drop_table("simulation_attempts")

    op.drop_index("ix_discussion_posts_user_id", table_name="discussion_posts")
    op.drop_index("ix_discussion_posts_id", table_name="discussion_posts")
    op.drop_table("discussion_posts")

    op.drop_index("ix_artifacts_user_id", table_name="artifacts")
    op.drop_index("ix_artifacts_kind", table_name="artifacts")
    op.drop_index("ix_artifacts_id", table_name="artifacts")
    op.drop_table("artifacts")

    op.drop_index("ix_user_badges_user_id", table_name="user_badges")
    op.drop_index("ix_user_badges_id", table_name="user_badges")
    op.drop_index("ix_user_badges_badge_code", table_name="user_badges")
    op.drop_table("user_badges")

    op.drop_index("ix_daily_progress_user_id", table_name="daily_progress")
    op.drop_index("ix_daily_progress_id", table_name="daily_progress")
    op.drop_index("ix_daily_progress_day_id", table_name="daily_progress")
    op.drop_table("daily_progress")

    op.drop_index("ix_day_content_skill_area", table_name="day_content")
    op.drop_index("ix_day_content_phase_key", table_name="day_content")
    op.drop_index("ix_day_content_id", table_name="day_content")
    op.drop_index("ix_day_content_day_number", table_name="day_content")
    op.drop_table("day_content")

    op.drop_index("ix_users_id", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
