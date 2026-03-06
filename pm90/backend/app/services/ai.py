from typing import Dict, Optional

import httpx

from app.config import get_settings

settings = get_settings()


class MentorEngine:
    async def respond(self, system_prompt: str, user_prompt: str, context: Optional[str] = None) -> Dict[str, str]:
        if settings.ai_provider.lower() == "openai" and settings.openai_api_key:
            return {"provider": "openai", "response": await self._call_openai(system_prompt, user_prompt, context)}
        if settings.ai_provider.lower() == "ollama":
            return {"provider": "ollama", "response": await self._call_ollama(system_prompt, user_prompt, context)}
        return {"provider": "fallback", "response": self._fallback_response(system_prompt, user_prompt, context)}

    async def _call_openai(self, system_prompt: str, user_prompt: str, context: Optional[str]) -> str:
        payload = {
            "model": settings.openai_model,
            "input": [
                {"role": "system", "content": [{"type": "input_text", "text": system_prompt}]},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": self._compose_prompt(user_prompt, context),
                        }
                    ],
                },
            ],
        }
        headers = {"Authorization": f"Bearer {settings.openai_api_key}"}
        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post("https://api.openai.com/v1/responses", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()

        if data.get("output_text"):
            return data["output_text"]

        output_segments = []
        for item in data.get("output", []):
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    output_segments.append(content.get("text", ""))
        return "\n".join(segment for segment in output_segments if segment).strip() or self._fallback_response(system_prompt, user_prompt, context)

    async def _call_ollama(self, system_prompt: str, user_prompt: str, context: Optional[str]) -> str:
        payload = {
            "model": settings.ollama_model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": self._compose_prompt(user_prompt, context)},
            ],
        }
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(f"{settings.ollama_base_url.rstrip('/')}/api/chat", json=payload)
            response.raise_for_status()
            data = response.json()
        return data.get("message", {}).get("content", "").strip() or self._fallback_response(system_prompt, user_prompt, context)

    def _compose_prompt(self, user_prompt: str, context: Optional[str]) -> str:
        if not context:
            return user_prompt
        return f"{user_prompt}\n\nAdditional context:\n{context}"

    def _fallback_response(self, system_prompt: str, user_prompt: str, context: Optional[str]) -> str:
        lower_prompt = user_prompt.lower()
        context_text = f"\n\nContext used:\n{context}" if context else ""

        if "interview" in lower_prompt:
            return (
                "Evaluation\n"
                "- Signal: You addressed the problem with product structure and customer impact in mind.\n"
                "- Improve: Quantify success metrics earlier and state the trade-off you would reject.\n"
                "- Next answer upgrade: Lead with the user problem, define one north-star metric, then outline 2-3 focused bets."
                + context_text
            )

        if "prd" in lower_prompt or "requirement" in lower_prompt:
            return (
                "PRD Review\n"
                "- Strength: The problem statement is visible and business-oriented.\n"
                "- Gap: Clarify the target user, success metric, and rollout guardrails.\n"
                "- Recommendation: Add a decision log and non-goals section so scope stays disciplined."
                + context_text
            )

        if "challenge" in lower_prompt or "evaluate" in lower_prompt:
            return (
                "Challenge Feedback\n"
                "- What worked: You linked action to user value and business impact.\n"
                "- What to sharpen: Make your assumptions explicit and rank the next actions by confidence.\n"
                "- PM lens: Good answers state trade-offs, not just solutions."
                + context_text
            )

        if "simulation" in lower_prompt or "scenario" in lower_prompt:
            return (
                "Simulation Debrief\n"
                "- Your reasoning shows useful product judgment.\n"
                "- Push further on risk management, sequencing, and how you would validate the next step.\n"
                "- Senior-PM upgrade: Define the first metric you would check in the next 24 hours."
                + context_text
            )

        return (
            "PM90 Mentor\n"
            "- Start with the user problem and the business outcome.\n"
            "- Choose one measurable signal that proves you are moving in the right direction.\n"
            "- State the trade-off, the next best alternative, and why you are not choosing it.\n"
            "- Turn that reasoning into an artifact a team can act on."
            + context_text
        )


mentor_engine = MentorEngine()
