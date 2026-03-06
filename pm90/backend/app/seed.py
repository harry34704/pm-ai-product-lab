from datetime import date, datetime, time, timedelta
from typing import Dict, List

from sqlalchemy.orm import Session

from app.auth import get_password_hash
from app.config import get_settings
from app.models import Artifact, DailyProgress, DayContent, DiscussionPost, SimulationAttempt, User

settings = get_settings()

PHASE_LIBRARY: List[Dict] = [
    {
        "key": "foundations",
        "name": "Phase 1 Foundations",
        "skill": "Product Foundations",
        "days": [
            ("What Product Managers Really Do", "Understand product management as a decision discipline rather than a feature factory."),
            ("Problem Framing", "Translate noisy stakeholder requests into sharp customer and business problems."),
            ("Customer-Centric Thinking", "Distinguish user pain from solution bias and anecdotal noise."),
            ("Product North Stars", "Use product vision and measurable outcomes to anchor execution."),
            ("Market and Competitor Mapping", "Assess alternatives and identify where a product can win."),
            ("Personas and JTBD", "Shift from demographics to motivations, jobs, and constraints."),
            ("Opportunity Sizing", "Estimate impact before writing delivery plans."),
            ("Product Metrics 101", "Separate health metrics, input metrics, and vanity metrics."),
            ("Stakeholder Management Basics", "Earn trust through clarity, trade-off framing, and decision hygiene."),
            ("Writing with Precision", "Communicate product thinking with concise business language."),
            ("Product Thinking in Fintech", "Balance compliance, trust, and growth in regulated markets."),
            ("Operational Excellence", "Use rituals and systems to keep cross-functional work aligned."),
            ("User Empathy Interviews", "Plan questions that surface motivations, blockers, and unmet needs."),
            ("Assumptions and Risks", "Make uncertainty visible before it becomes delivery churn."),
            ("Foundation Synthesis", "Connect the first fifteen days into a durable PM operating model."),
        ],
    },
    {
        "key": "discovery",
        "name": "Phase 2 Product Discovery",
        "skill": "Discovery",
        "days": [
            ("Interview Planning", "Create interview plans that test the most important assumptions first."),
            ("Survey Design", "Write unbiased prompts that reveal signal rather than confirm assumptions."),
            ("Customer Journey Mapping", "Find friction across end-to-end product experiences."),
            ("Opportunity Solution Trees", "Connect outcomes, opportunities, and experiments in one view."),
            ("Segmentation", "Find the user cohorts that matter most for learning and growth."),
            ("Feature Request Triage", "Translate requests into problem statements and evidence thresholds."),
            ("Discovery in B2B Products", "Balance buyer needs, user needs, and workflow realities."),
            ("Rapid Concept Testing", "Test lightweight concepts before spending engineering time."),
            ("Pricing Discovery", "Surface willingness to pay and perceived value anchors."),
            ("Prototype Feedback", "Use structured feedback loops to improve prototypes objectively."),
            ("Qualitative Synthesis", "Turn raw notes into insights, themes, and decision-ready outputs."),
            ("Quantitative Discovery", "Use events and funnels to sharpen discovery questions."),
            ("Opportunity Prioritization", "Score opportunities using impact, confidence, and strategic fit."),
            ("Discovery Readout", "Present what you learned, what changed, and what should happen next."),
            ("Discovery Sprint Capstone", "Package discovery outputs into a recommendation senior stakeholders can act on."),
        ],
    },
    {
        "key": "delivery",
        "name": "Phase 3 Product Delivery",
        "skill": "Delivery",
        "days": [
            ("Roadmap Fundamentals", "Use roadmaps as communication tools for outcomes and sequencing."),
            ("PRD Anatomy", "Write PRDs that clarify decisions, constraints, and success metrics."),
            ("User Stories and Acceptance Criteria", "Define scope precisely enough for engineering and QA."),
            ("Backlog Shaping", "Reduce ambiguity before sprint planning begins."),
            ("Prioritization Frameworks", "Choose the right scoring model for the decision at hand."),
            ("Managing Trade-offs", "Handle quality, speed, and scope tension without losing trust."),
            ("Cross-Functional Rituals", "Run standups, planning, demos, and retros with product intent."),
            ("Dependency Management", "Spot and mitigate delivery risk before timelines slip."),
            ("Launch Readiness", "Coordinate product, support, GTM, and analytics before release."),
            ("Feature Flags and Rollouts", "Reduce launch risk through staged exposure and observability."),
            ("QA Collaboration", "Partner on test coverage for the user journeys that matter."),
            ("Change Management", "Prepare internal teams for process and product shifts."),
            ("Post-Launch Reviews", "Measure outcomes against intent and document learnings."),
            ("Delivery Under Pressure", "Protect quality of decisions during urgent delivery cycles."),
            ("Delivery Capstone", "Ship a roadmap slice with clear metrics, roll-out plan, and stakeholders aligned."),
        ],
    },
    {
        "key": "analytics",
        "name": "Phase 4 Product Analytics",
        "skill": "Analytics",
        "days": [
            ("Event Taxonomy", "Design event schemas that answer product questions cleanly."),
            ("Funnel Analysis", "Interpret drop-off points and identify what to test next."),
            ("Retention Basics", "Separate acquisition wins from durable product value."),
            ("Cohort Analysis", "Compare behavior across signup periods and segments."),
            ("Activation Metrics", "Define the early behaviors that predict long-term value."),
            ("North Star Instrumentation", "Instrument key user actions without drowning in data."),
            ("A/B Testing Principles", "Set up experiments with real hypotheses and decision rules."),
            ("Experiment Guardrails", "Protect the business from local wins that hurt system health."),
            ("SQL for PMs", "Use practical query patterns to answer product questions quickly."),
            ("Dashboard Design", "Build dashboards that accelerate decision-making, not passive reporting."),
            ("Forecasting and Trend Reading", "Use leading indicators to spot product risk early."),
            ("Churn Analysis", "Diagnose why users leave and which levers are worth testing."),
            ("Monetization Metrics", "Measure ARPU, conversion, and pricing behavior in context."),
            ("Storytelling with Data", "Explain what happened, why it matters, and what to do next."),
            ("Analytics Capstone", "Turn a product dataset into an executive-ready recommendation."),
        ],
    },
    {
        "key": "strategy",
        "name": "Phase 5 Product Strategy",
        "skill": "Strategy",
        "days": [
            ("Strategic Context", "Connect product choices to market structure and company goals."),
            ("Vision to Roadmap", "Translate long-term intent into a believable path to value."),
            ("Portfolio Thinking", "Balance core, adjacent, and exploratory investments."),
            ("Platform Strategy", "Evaluate when to build leverage through shared capabilities."),
            ("Growth Loops", "Use compounding systems rather than one-off campaigns."),
            ("Product Positioning", "Clarify the value proposition for the right audience."),
            ("Business Models", "Understand how pricing, packaging, and cost structure shape product choices."),
            ("Go-to-Market Alignment", "Coordinate product and GTM motions around measurable outcomes."),
            ("Strategic Bets", "Assess risk, upside, and capability fit before major investments."),
            ("Executive Narratives", "Pitch product strategy with evidence, trade-offs, and conviction."),
            ("Fintech Strategy Deep Dive", "Balance trust, regulation, and differentiated customer value."),
            ("AI Product Strategy", "Frame where AI adds leverage and where it adds noise."),
            ("Strategic Prioritization", "Say no well and protect focus."),
            ("Scenario Planning", "Prepare decision paths for best-case, expected, and downside realities."),
            ("Strategy Capstone", "Author a strategy memo that links opportunity, plan, and business impact."),
        ],
    },
    {
        "key": "leadership",
        "name": "Phase 6 Leadership and Career",
        "skill": "Leadership",
        "days": [
            ("PM Leadership Styles", "Lead through influence, clarity, and decision quality."),
            ("Product Communication", "Match the message to executives, peers, and delivery teams."),
            ("Coaching and Feedback", "Help teams improve without creating noise or defensiveness."),
            ("Conflict Navigation", "Handle stakeholder disagreement with structure and calm."),
            ("Hiring Signals", "Recognize the traits of strong product talent and collaborators."),
            ("Career Narrative", "Position your PM story through evidence, growth, and outcomes."),
            ("Case Study Building", "Turn project work into high-signal portfolio stories."),
            ("Interview Preparation", "Practice product sense, execution, analytics, and leadership answers."),
            ("Managing Up", "Escalate with context, options, and recommended action."),
            ("Cross-Functional Credibility", "Become the person teams trust in ambiguity."),
            ("PM in Emerging Markets", "Adapt strategy and operations to local context and constraints."),
            ("Personal Operating System", "Build the routines that sustain long-term execution quality."),
            ("Mentoring Others", "Translate your learning into leverage for peers and teams."),
            ("Career Strategy", "Choose opportunities that compound your skills and optionality."),
            ("PM90 Graduation Day", "Synthesize your learning into a launch-ready PM portfolio and career plan."),
        ],
    },
]

RESOURCE_CATALOG: List[Dict] = [
    {"category": "SQL", "title": "Mode SQL Tutorial", "description": "Free SQL lessons with practical analytics queries.", "url": "https://mode.com/sql-tutorial", "format": "Guide"},
    {"category": "Strategy", "title": "Reforge Essays", "description": "Growth, retention, and product strategy fundamentals.", "url": "https://www.reforge.com/blog", "format": "Articles"},
    {"category": "Analytics", "title": "Google Analytics Academy", "description": "Measurement foundations and dashboard thinking.", "url": "https://analytics.google.com/analytics/academy", "format": "Course"},
    {"category": "APIs", "title": "Postman API Fundamentals", "description": "Practical API workflows, requests, and testing.", "url": "https://academy.postman.com", "format": "Course"},
    {"category": "Research", "title": "Nielsen Norman Group", "description": "High-signal UX research and discovery patterns.", "url": "https://www.nngroup.com/articles", "format": "Articles"},
    {"category": "Career", "title": "Lenny's Podcast", "description": "Career, product craft, and operator interviews.", "url": "https://www.lennysnewsletter.com/podcast", "format": "Podcast"},
]

WEEKLY_CHALLENGES: List[Dict] = [
    {"week": 1, "title": "Rewrite a vague feature request into a measurable product problem.", "xp_reward": 100},
    {"week": 4, "title": "Create a 3-step activation funnel and explain the biggest drop-off.", "xp_reward": 120},
    {"week": 7, "title": "Draft a one-page launch readiness brief for a risky rollout.", "xp_reward": 140},
    {"week": 10, "title": "Pitch a growth loop for a marketplace product in five bullets.", "xp_reward": 150},
    {"week": 13, "title": "Present an executive strategy memo for your strongest product idea.", "xp_reward": 180},
]

SIMULATION_SCENARIOS: List[Dict] = [
    {
        "key": "churn-crisis",
        "title": "User Churn Crisis",
        "summary": "Retention drops 11% after a pricing and onboarding change.",
        "challenge": "You have 48 hours to diagnose the cause, align stakeholders, and recommend a recovery path.",
        "business_context": "A B2B SaaS product serving growth-stage teams has seen activation fall, support tickets spike, and expansion forecasts soften.",
        "recommended_focus": "Root cause isolation, user segmentation, and confidence-weighted action sequencing.",
        "options": [
            {"key": "rollback", "label": "Rollback pricing immediately", "description": "Reduce immediate risk but learn less about the actual failure mode."},
            {"key": "segment", "label": "Segment churn by cohort and funnel stage", "description": "Build evidence before acting, but manage stakeholder pressure."},
            {"key": "survey", "label": "Launch a broad survey and wait for responses", "description": "Increases user feedback volume, but may delay action."},
        ],
    },
    {
        "key": "growth-bet",
        "title": "Growth Strategy Decision",
        "summary": "Leadership wants aggressive top-of-funnel growth while activation remains weak.",
        "challenge": "Choose between acquisition spend, onboarding redesign, or referral mechanics and justify the sequencing.",
        "business_context": "A consumer subscription app has strong press momentum but weak retained conversion after week one.",
        "recommended_focus": "Constraint-aware sequencing, activation leverage, and experimentation discipline.",
        "options": [
            {"key": "ads", "label": "Scale paid acquisition", "description": "Exploit current momentum but risk amplifying leaky activation."},
            {"key": "activation", "label": "Redesign onboarding", "description": "Fix the highest-leverage system before buying more traffic."},
            {"key": "referrals", "label": "Build a referral loop", "description": "Pursue lower-cost growth with uncertain short-term payoff."},
        ],
    },
    {
        "key": "prioritization-conflict",
        "title": "Feature Prioritization Conflict",
        "summary": "Sales wants enterprise requests while self-serve growth is plateauing.",
        "challenge": "Decide what gets on the roadmap next quarter and explain the opportunity cost.",
        "business_context": "A startup is balancing near-term revenue pressure with longer-term adoption and usability goals.",
        "recommended_focus": "Strategic fit, revenue quality, and portfolio balancing.",
        "options": [
            {"key": "sales", "label": "Prioritize enterprise asks", "description": "Supports high-value deals, but can create roadmap drag."},
            {"key": "growth", "label": "Prioritize self-serve growth", "description": "Improves funnel efficiency, but may upset sales stakeholders."},
            {"key": "split", "label": "Split the roadmap evenly", "description": "Looks fair, but risks focus dilution."},
        ],
    },
    {
        "key": "launch-failure",
        "title": "Product Launch Failure",
        "summary": "A major launch landed without traction and internal confidence is fading.",
        "challenge": "Run the recovery: decide whether to iterate, reposition, or sunset the feature.",
        "business_context": "Marketing has spent the budget, support is confused, and engineering is already committed to follow-up work.",
        "recommended_focus": "Signal reading, post-launch review quality, and decisive communication.",
        "options": [
            {"key": "iterate", "label": "Iterate based on usage patterns", "description": "Preserve investment while staying evidence-led."},
            {"key": "reposition", "label": "Reposition the feature for a narrower segment", "description": "Improves fit, but needs GTM alignment."},
            {"key": "sunset", "label": "Sunset quickly", "description": "Protects focus, but may waste learnings and stakeholder support."},
        ],
    },
    {
        "key": "stakeholder-disagreement",
        "title": "Stakeholder Disagreement",
        "summary": "Engineering, design, and commercial leads disagree on what success looks like.",
        "challenge": "Drive toward a decision without forcing false consensus.",
        "business_context": "A platform team is building a workflow change that touches core user habits and internal SLAs.",
        "recommended_focus": "Decision framing, trade-off transparency, and trust preservation.",
        "options": [
            {"key": "executive", "label": "Escalate immediately", "description": "Creates a fast answer, but can erode ownership."},
            {"key": "workshop", "label": "Run a trade-off workshop", "description": "Slower, but often improves decision quality."},
            {"key": "pilot", "label": "Run a pilot with guardrails", "description": "Lets evidence break the tie while limiting blast radius."},
        ],
    },
]


def level_for_xp(xp_balance: int) -> int:
    return max(1, 1 + xp_balance // 400)


def build_curriculum_rows() -> List[Dict]:
    rows: List[Dict] = []
    day_number = 1
    for phase in PHASE_LIBRARY:
        for topic, focus in phase["days"]:
            lesson = (
                f"{topic} is framed in PM90 as a practical operator skill. {focus} "
                f"Today you will connect this idea to product strategy, stakeholder communication, and measurable outcomes."
            )
            task = (
                f"Create a short working artifact for '{topic}': define the business goal, the customer signal to look for, "
                "and the decision you would make with that information."
            )
            reflection = (
                f"What changed in the way you think about {topic.lower()}, and what would you do differently in a real product team tomorrow?"
            )
            mentor_prompt = (
                f"Coach the learner through day {day_number} of PM90. Help them reason about {topic}, "
                "sharpen their practical task, and connect it to PM judgment."
            )
            rows.append(
                {
                    "day_number": day_number,
                    "phase_key": phase["key"],
                    "phase_name": phase["name"],
                    "topic": topic,
                    "skill_area": phase["skill"],
                    "lesson": lesson,
                    "practical_task": task,
                    "reflection_question": reflection,
                    "mentor_prompt": mentor_prompt,
                    "xp_reward": settings.default_daily_xp + ((day_number % 4) * 10),
                }
            )
            day_number += 1
    return rows


def ensure_seed_data(db: Session) -> None:
    if db.query(DayContent).count() == 0:
        for row in build_curriculum_rows():
            db.add(DayContent(**row))
        db.commit()

    if not settings.seed_demo_user:
        return

    demo_user = db.query(User).filter(User.email == settings.demo_user_email).first()
    if not demo_user:
        demo_user = User(
            email=settings.demo_user_email,
            full_name=settings.demo_user_name,
            headline="Product manager in training building a proof-of-work portfolio",
            password_hash=get_password_hash(settings.demo_user_password),
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    if settings.seed_community_users:
        community_members = [
            ("nandi@pm90.app", "Nandi Dlamini", "Growth-focused PM learner", 1480),
            ("samir@pm90.app", "Samir Patel", "Data-led associate PM", 1320),
            ("maya@pm90.app", "Maya Okafor", "Discovery and research enthusiast", 1240),
            ("alex@pm90.app", "Alex Chen", "Operator building strategic delivery skills", 1180),
        ]
        for email, name, headline, xp_balance in community_members:
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    email=email,
                    full_name=name,
                    headline=headline,
                    password_hash=get_password_hash(settings.demo_user_password),
                    xp_balance=xp_balance,
                    current_level=level_for_xp(xp_balance),
                    last_active_date=date.today() - timedelta(days=xp_balance % 5),
                )
                db.add(user)
        db.commit()

    if db.query(DailyProgress).filter(DailyProgress.user_id == demo_user.id).count() == 0:
        first_days = db.query(DayContent).order_by(DayContent.day_number.asc()).limit(12).all()
        total_xp = 0
        for index, day in enumerate(first_days):
            completed_at = datetime.combine(date.today() - timedelta(days=(len(first_days) - 1 - index)), time(hour=19, minute=30))
            total_xp += day.xp_reward
            db.add(
                DailyProgress(
                    user_id=demo_user.id,
                    day_id=day.id,
                    reflection_response=f"My key learning from {day.topic} is that product work improves when decisions are tied to a measurable business outcome.",
                    challenge_answer=f"For {day.topic}, I would use a structured artifact to align design, engineering, and stakeholders around one clear outcome.",
                    mentor_summary=f"Strong systems thinking on {day.topic}. Next step: tighten the link between evidence and prioritization.",
                    score=87 + (index % 4),
                    completed_at=completed_at,
                )
            )
        demo_user.xp_balance = total_xp
        demo_user.current_level = level_for_xp(total_xp)
        demo_user.last_active_date = date.today()
        db.commit()

    if db.query(Artifact).filter(Artifact.user_id == demo_user.id).count() == 0:
        db.add_all(
            [
                Artifact(
                    user_id=demo_user.id,
                    title="PRD: Guided onboarding for new fintech users",
                    kind="prd",
                    summary="A structured PRD focused on improving first-week activation.",
                    content="# Product Requirement Document\n\n## Problem\nNew users sign up but fail to connect their first financial account.\n\n## Goal\nImprove week-one activation from 34% to 48%.\n\n## Success Metrics\n- Account connection rate\n- Time to first key action\n- Support ticket volume\n",
                    metadata_json={"phase": "delivery", "format": "markdown"},
                ),
                Artifact(
                    user_id=demo_user.id,
                    title="Roadmap: Activation and retention bets",
                    kind="roadmap",
                    summary="A 3-quarter roadmap aligned to onboarding, activation, and retention.",
                    content="# Roadmap\n\n## Q1\n- Simplify onboarding\n- Instrument activation funnel\n\n## Q2\n- Launch guided setup\n- Add contextual nudges\n\n## Q3\n- Build retention experiments\n- Improve lifecycle messaging\n",
                    metadata_json={"phase": "strategy", "format": "markdown"},
                ),
            ]
        )
        db.commit()

    if db.query(DiscussionPost).count() == 0:
        users = db.query(User).order_by(User.created_at.asc()).limit(3).all()
        sample_posts = [
            ("Discovery insight", "The biggest shift for me this week was learning to separate user quotes from actual evidence-backed opportunities."),
            ("Analytics question", "How are you all deciding which guardrail metrics matter most in experiments with monetization risk?"),
            ("Career milestone", "I turned my PM90 PRD into a portfolio case study and used it in an interview simulation."),
        ]
        for user, (topic, body) in zip(users, sample_posts):
            db.add(DiscussionPost(user_id=user.id, topic=topic, body=body, likes=6 + len(topic)))
        db.commit()

    if db.query(SimulationAttempt).filter(SimulationAttempt.user_id == demo_user.id).count() == 0:
        db.add_all(
            [
                SimulationAttempt(
                    user_id=demo_user.id,
                    scenario_key="growth-bet",
                    selected_option="activation",
                    rationale="I would fix activation first because scaling acquisition into a leaky funnel is expensive and hides the real product issue.",
                    score=91.0,
                    feedback="Strong sequencing logic. You prioritized system leverage before spending on acquisition.",
                ),
                SimulationAttempt(
                    user_id=demo_user.id,
                    scenario_key="stakeholder-disagreement",
                    selected_option="pilot",
                    rationale="A pilot creates evidence and lowers the emotional temperature of the disagreement.",
                    score=88.0,
                    feedback="Pragmatic and low-risk. The next step would be defining success criteria before launch.",
                ),
            ]
        )
        db.commit()
