from __future__ import annotations

import sqlite3
from pathlib import Path

import pandas as pd


DB_PATH = Path(__file__).resolve().parent.parent / "data" / "ab_testing.db"


def initialize_database() -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS experiments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                experiment_name TEXT NOT NULL,
                hypothesis TEXT NOT NULL,
                primary_metric TEXT NOT NULL,
                control_label TEXT NOT NULL DEFAULT 'Variant A',
                variant_label TEXT NOT NULL DEFAULT 'Variant B',
                audience TEXT NOT NULL DEFAULT 'All users',
                status TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        existing_columns = {
            row[1]
            for row in connection.execute("PRAGMA table_info(experiments)").fetchall()
        }
        if "control_label" not in existing_columns:
            connection.execute(
                "ALTER TABLE experiments ADD COLUMN control_label TEXT NOT NULL DEFAULT 'Variant A'"
            )
        if "variant_label" not in existing_columns:
            connection.execute(
                "ALTER TABLE experiments ADD COLUMN variant_label TEXT NOT NULL DEFAULT 'Variant B'"
            )
        if "audience" not in existing_columns:
            connection.execute(
                "ALTER TABLE experiments ADD COLUMN audience TEXT NOT NULL DEFAULT 'All users'"
            )


def save_experiment(
    experiment_name: str,
    hypothesis: str,
    primary_metric: str,
    control_label: str,
    variant_label: str,
    audience: str,
    status: str,
) -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            INSERT INTO experiments (
                experiment_name,
                hypothesis,
                primary_metric,
                control_label,
                variant_label,
                audience,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                experiment_name,
                hypothesis,
                primary_metric,
                control_label,
                variant_label,
                audience,
                status,
            ),
        )


def fetch_experiments() -> pd.DataFrame:
    with sqlite3.connect(DB_PATH) as connection:
        return pd.read_sql_query(
            """
            SELECT
                experiment_name,
                hypothesis,
                primary_metric,
                control_label,
                variant_label,
                audience,
                status,
                created_at
            FROM experiments
            ORDER BY id DESC
            """,
            connection,
        )
