from __future__ import annotations

import sqlite3
from pathlib import Path

import pandas as pd


DB_PATH = Path(__file__).resolve().parent.parent / "data" / "validator_reports.db"


def initialize_database() -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS validator_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                product_idea TEXT NOT NULL,
                target_customer TEXT NOT NULL,
                business_model TEXT NOT NULL,
                viability_score INTEGER NOT NULL,
                market_opportunity_score INTEGER NOT NULL,
                report_markdown TEXT NOT NULL
            )
            """
        )


def build_markdown_report(analysis: dict) -> str:
    swot_lines = []
    for label, items in analysis["swot"].items():
        swot_lines.append(f"## {label}")
        swot_lines.extend([f"- {item}" for item in items])

    competitor_lines = "\n".join(
        [f"- {competitor}" for competitor in analysis["competitor_suggestions"]]
    )
    swot_text = "\n".join(swot_lines)

    return f"""# Product Validation Report

**Generated:** {analysis["created_at"]}

## Idea Summary

- Product idea: {analysis["product_idea"]}
- Target customer: {analysis["target_customer"]}
- Business model: {analysis["business_model"]}
- Product viability score: {analysis["viability_score"]}
- Market opportunity score: {analysis["market_opportunity_score"]}
- Risk score: {analysis["risk_score"]}

## Executive Summary

{analysis["summary"]}

{swot_text}

## Competitor Suggestions

{competitor_lines}
"""


def save_report(analysis: dict, report_markdown: str) -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            INSERT INTO validator_reports (
                created_at,
                product_idea,
                target_customer,
                business_model,
                viability_score,
                market_opportunity_score,
                report_markdown
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                analysis["created_at"],
                analysis["product_idea"],
                analysis["target_customer"],
                analysis["business_model"],
                analysis["viability_score"],
                analysis["market_opportunity_score"],
                report_markdown,
            ),
        )


def fetch_saved_reports() -> pd.DataFrame:
    with sqlite3.connect(DB_PATH) as connection:
        return pd.read_sql_query(
            """
            SELECT
                created_at,
                product_idea,
                target_customer,
                business_model,
                viability_score,
                market_opportunity_score
            FROM validator_reports
            ORDER BY id DESC
            """,
            connection,
        )
