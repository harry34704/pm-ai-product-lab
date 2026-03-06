(() => {
const siteConfig = {
  projectName: "pm-ai-product-lab",
  siteName: "Harry Munyai AI Product Lab",
  personName: "Harry Munyai",
  role: "Product Manager | Business Analyst | AI Product Builder",
  location: "Johannesburg, South Africa",
  email: "harry34704@outlook.com",
  linkedin: "https://www.linkedin.com/in/harrymunyai/",
  github: "https://github.com/harry34704",
  cvPath: "assets/Harry_Munyai_PM.pdf",
  siteUrl: "https://harry34704.github.io/pm-ai-product-lab",
  repoBaseUrl: "https://github.com/harry34704/pm-ai-product-lab/tree/main",
};

const homeCapabilities = [
  {
    title: "Product Strategy",
    description:
      "Roadmap ownership, prioritisation, and outcome framing grounded in commercial reality.",
  },
  {
    title: "Business Analysis",
    description:
      "Requirements, process mapping, stakeholder alignment, and structured problem definition.",
  },
  {
    title: "AI Prototyping",
    description:
      "Rapid prototypes that turn product questions into deployable decision-support tools.",
  },
  {
    title: "Automation Systems",
    description:
      "Workflow optimisation across payments, approvals, self-service, and operational handoffs.",
  },
  {
    title: "Analytics",
    description:
      "SQL-first product analytics, KPI monitoring, funnel analysis, and insight communication.",
  },
];

const aboutProfile = {
  intro:
    "I work where product management, business analysis, and technical execution overlap. My background spans fintech, SaaS, verification operations, and workflow-heavy environments where product decisions need both systems depth and measurable commercial outcomes.",
  bio:
    "Harry Munyai is a Product Manager and Business Analyst with 6+ years of cross-functional experience across digital payments, workflow optimisation, data analytics, and platform delivery. He has led roadmap execution from discovery through release, translated complex system behaviour into clear requirements, and partnered closely with engineering, operations, and finance teams to ship product improvements that increase conversion, reduce manual effort, and improve operational reliability.",
  strengths: [
    {
      title: "Roadmap and Prioritisation",
      description:
        "Owns product direction through clear prioritisation logic, stakeholder alignment, and execution discipline.",
    },
    {
      title: "Requirements and Process Design",
      description:
        "Turns ambiguous workflow problems into PRDs, user stories, edge cases, acceptance criteria, and release-ready plans.",
    },
    {
      title: "Product Analytics and SQL",
      description:
        "Uses SQL, dashboards, and KPI instrumentation to uncover friction, validate hypotheses, and improve product decisions.",
    },
    {
      title: "Payments and Platform Operations",
      description:
        "Experienced across checkout flows, authorisation logic, virtual cards, approvals, and self-service journeys.",
    },
    {
      title: "AI Product Prototyping",
      description:
        "Builds small AI products that make validation, analytics, experimentation, and planning faster and more legible.",
    },
  ],
  industries: [
    "Fintech",
    "SaaS",
    "E-commerce",
    "Payments",
    "Verification operations",
    "Analytics tooling",
    "AI-enabled internal products",
  ],
  toolGroups: [
    {
      title: "Product and Delivery",
      items: ["Jira", "Confluence", "Notion", "Miro", "Trello", "Agile", "Scrum", "Kanban"],
    },
    {
      title: "Data and Analytics",
      items: ["SQL", "Power BI", "Excel", "Google Sheets", "Looker", "Amplitude"],
    },
    {
      title: "Design and Systems",
      items: ["Figma", "Lucidchart", "Journey mapping", "BPMN", "SDLC", "API workflows"],
    },
    {
      title: "Builder Stack",
      items: ["Python", "Streamlit", "Plotly", "SQLite", "scikit-learn", "OpenAI API"],
    },
  ],
  certifications: [
    "Product Discovery Micro-Certification",
    "Product Analytics Micro-Certification",
    "IIBA ECBA",
    "Payment Master Class",
    "Meta Database Engineer",
    "CS50P Introduction to Python",
    "Agile with Atlassian Jira",
    "Scrum Foundation Professional Certificate",
    "LLM Foundations for Product Managers",
    "AI Agents",
  ],
  philosophy: [
    {
      title: "Start with the decision",
      description:
        "The right product artefact is the one that helps a team make a clearer decision, not the one that looks the most sophisticated.",
    },
    {
      title: "Prefer transparent logic",
      description:
        "Dashboards, scoring models, and prioritisation systems should be explainable enough for stakeholders to challenge and trust.",
    },
    {
      title: "Ship production-shaped prototypes",
      description:
        "Even small portfolio tools should feel structured, usable, and ready for extension into real operating products.",
    },
    {
      title: "Use AI to accelerate work",
      description:
        "AI should reduce analysis time and sharpen thinking without turning product decisions into a black box.",
    },
  ],
  timeline: [
    {
      role: "Senior Product Manager - Payments and Digital Products",
      company: "Rentoza",
      period: "March 2023 - Present",
      summary:
        "Leading product delivery across customer-facing and internal platforms in a high-growth fintech and SaaS environment, with ownership across payments, virtual cards, self-service, and workflow automation.",
      outcomes: [
        "Increased payment authorisation rate by 18 percent and recovered R1.2M+ in quarterly revenue through checkout and retry-flow optimisation.",
        "Delivered a virtual card product enabling 5,000+ cards issued per month and contributing R800K+ in monthly revenue.",
        "Launched a self-service portal MVP in three sprints with projected reductions in support load and stronger task completion.",
        "Designed straight-through processing workflows that reduced manual effort by 60 percent and saved roughly 120 hours per month.",
      ],
    },
    {
      role: "Business Analyst and Data Analyst",
      company: "Managed Integrity Evaluation",
      period: "February 2022 - February 2023",
      summary:
        "Delivered process analysis, SQL reporting, and structured requirements across verification workflows and operational systems.",
      outcomes: [
        "Optimised four key workflows through As-Is and To-Be analysis, cutting turnaround time by 30 percent.",
        "Built SQL-powered Power BI dashboards tracking SLA compliance, throughput, and operational performance.",
        "Produced functional specs, UAT documentation, and reusable analysis templates adopted by the wider team.",
      ],
    },
    {
      role: "Software Engineer",
      company: "ULTECH Solutions",
      period: "November 2019 - December 2021",
      summary:
        "Built full-stack applications across the SDLC, developing the engineering literacy that now strengthens product and business analysis work.",
      outcomes: [
        "Translated business requirements into technical specifications and backend-oriented delivery plans.",
        "Reduced production defects through stronger validation logic and documentation discipline.",
        "Supported automation and quality workflows that improved regression coverage and release confidence.",
      ],
    },
  ],
  outcomes: [
    { value: "6+ years", label: "Cross-functional PM, BA, and delivery experience" },
    { value: "R1.2M+", label: "Quarterly revenue recovered through payment optimisation" },
    { value: "5,000+", label: "Virtual cards issued monthly after product launch" },
    { value: "60%", label: "Reduction in manual processing via workflow automation" },
  ],
  education: "BSc Computer Science, University of the People (Expected December 2026)",
};

const repoBaseUrl = siteConfig.repoBaseUrl;

const labApps = [
  {
    slug: "ai-product-validator",
    name: "AI Product Validator",
    category: "Discovery Intelligence",
    status: "Deployment-ready",
    statusTone: "ready",
    featured: true,
    launch_url: "",
    github_url: `${repoBaseUrl}/projects/ai-product-validator`,
    details_url: "projects.html#ai-product-validator",
    screenshot: "assets/project_images/ai-product-validator.svg",
    summary:
      "Stress-test product concepts with structured scoring, SWOT analysis, competitor framing, and report-ready output.",
    overview:
      "A product discovery workspace designed to make early-stage idea evaluation more rigorous, repeatable, and easier to communicate.",
    problem:
      "New ideas are often prioritised with inconsistent logic, which slows alignment and increases the risk of investing in low-signal concepts.",
    solution:
      "The app captures the idea, target customer, and business model, then combines deterministic scoring with optional AI synthesis to produce a clean validation report.",
    whatItSolves:
      "It helps teams compare ideas with a shared evaluation lens before engineering time or go-to-market spend is committed.",
    pmThinking:
      "The goal is not to predict winners perfectly. It is to make assumptions, trade-offs, and risks visible enough for better product conversations.",
    datasetsUsed: ["`sample_ideas.csv` with five product concepts, target users, and business models."],
    businessValue: [
      "Creates reusable idea review artefacts for product, commercial, and founder discussions.",
      "Reduces low-quality discovery debates by turning assumptions into visible scoring criteria.",
      "Speeds up triage of MVP candidates and opportunity framing.",
    ],
    features: [
      "Idea intake form with sample concepts",
      "Viability, opportunity, and risk scoring",
      "SWOT analysis and competitor suggestions",
      "Markdown report generation with SQLite-backed history",
    ],
    stack: ["Python", "Streamlit", "SQLite", "OpenAI API"],
    localRun: [
      "cd projects/ai-product-validator",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "5", label: "Sample concepts" },
      { value: "4", label: "Decision lenses" },
    ],
  },
  {
    slug: "product-analytics-dashboard",
    name: "Product Analytics Dashboard",
    category: "Product Analytics",
    status: "Deployment-ready",
    statusTone: "ready",
    featured: true,
    launch_url: "",
    github_url: `${repoBaseUrl}/projects/product-analytics-dashboard`,
    details_url: "projects.html#product-analytics-dashboard",
    screenshot: "assets/project_images/product-analytics-dashboard.svg",
    summary:
      "A PM-facing analytics workspace for DAU, funnels, retention cohorts, and feature adoption.",
    overview:
      "A lightweight analytics layer that simulates the kind of dashboard a product manager uses for weekly operating reviews.",
    problem:
      "Product teams often wait on fragmented reporting before they can assess activation, retention, or feature traction.",
    solution:
      "This app turns a simple event stream into actionable PM views, including sequential funnels, cohort retention, active users, and adoption breakdowns.",
    whatItSolves:
      "It shortens the distance between raw event data and the product decisions that follow from it.",
    pmThinking:
      "The most useful product analytics surfaces are the ones that connect usage patterns to product levers like onboarding, activation, and engagement.",
    datasetsUsed: [
      "`sample_events.csv` with 47 product events across plans, platforms, features, and event timestamps.",
    ],
    businessValue: [
      "Makes activation and retention conversations faster and more evidence-based.",
      "Gives product leads a compact view of usage without depending on a full analytics stack.",
      "Highlights which features deserve investment, iteration, or removal.",
    ],
    features: [
      "Date, plan, platform, and funnel-step filters",
      "Daily active user trendlines",
      "Sequential funnel conversion analysis",
      "Retention heatmap and feature adoption views",
    ],
    stack: ["Python", "Streamlit", "Pandas", "Plotly"],
    localRun: [
      "cd projects/product-analytics-dashboard",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "47", label: "Sample events" },
      { value: "4", label: "Core PM views" },
    ],
  },
  {
    slug: "ai-customer-insights",
    name: "AI Customer Insights",
    category: "Voice of Customer",
    status: "Deployment-ready",
    statusTone: "ready",
    featured: true,
    launch_url: "",
    github_url: `${repoBaseUrl}/projects/ai-customer-insights`,
    details_url: "projects.html#ai-customer-insights",
    screenshot: "assets/project_images/ai-customer-insights.svg",
    summary:
      "Turn support tickets into structured product insight with categorisation, sentiment, bug detection, and trend analysis.",
    overview:
      "A customer-feedback intelligence tool built for PMs who need signal, not noise, from support and service channels.",
    problem:
      "Ticket queues contain product insight, but manual review is slow and recurring issues are easy to miss.",
    solution:
      "The app enriches tickets with categories, sentiment, bug flags, and feature-request flags, then summarises the output with charts and a concise PM-facing narrative.",
    whatItSolves:
      "It converts unstructured support volume into a prioritised backlog signal for product and operations teams.",
    pmThinking:
      "Voice-of-customer systems are valuable when they compress repetitive feedback into trends, severity cues, and recommendation-ready themes.",
    datasetsUsed: [
      "`sample_tickets.csv` with 16 support tickets across channels, customer tiers, subjects, and descriptions.",
    ],
    businessValue: [
      "Surfaces friction themes before they escalate into churn or support cost.",
      "Gives product teams structured evidence for bug fixes and roadmap requests.",
      "Helps align support, product, and engineering around repeat customer pain.",
    ],
    features: [
      "Ticket upload with sample support queue",
      "Sentiment scoring and issue categorisation",
      "Bug and feature-request detection",
      "Trend dashboards and summary generation",
    ],
    stack: ["Python", "Streamlit", "Pandas", "Plotly", "OpenAI API"],
    localRun: [
      "cd projects/ai-customer-insights",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "16", label: "Sample tickets" },
      { value: "4", label: "Insight views" },
    ],
  },
  {
    slug: "product-ab-testing-engine",
    name: "Product A/B Testing Engine",
    category: "Experimentation",
    status: "Deployment-ready",
    statusTone: "ready",
    featured: false,
    launch_url: "",
    github_url: `${repoBaseUrl}/projects/product-ab-testing-engine`,
    details_url: "projects.html#product-ab-testing-engine",
    screenshot: "assets/project_images/product-ab-testing-engine.svg",
    summary:
      "Manage experiment definitions, compare variants, and interpret uplift with significance testing.",
    overview:
      "A lightweight experimentation workbench that blends experiment setup, persisted metadata, and statistics-backed result interpretation.",
    problem:
      "Experiments are often scattered across docs and spreadsheets, making readouts inconsistent and confidence difficult to assess.",
    solution:
      "This app stores experiment definitions, loads result files, and calculates conversion, uplift, p-values, confidence intervals, and segment-level performance.",
    whatItSolves:
      "It helps teams move from intuition-led testing to a more disciplined experimentation operating model.",
    pmThinking:
      "A/B testing only becomes useful when the setup, metric, audience, and interpretation are all explicit enough to support a decision.",
    datasetsUsed: [
      "`sample_experiment_results.csv` with 10 rows covering experiment name, visitors, conversions, date, and segment.",
    ],
    businessValue: [
      "Improves the quality of shipping decisions after an experiment concludes.",
      "Introduces statistical discipline into PM and growth workflows.",
      "Creates reusable experiment history instead of ad hoc result reviews.",
    ],
    features: [
      "Experiment definition form with SQLite persistence",
      "Variant performance summary and significance messaging",
      "Confidence interval and uplift analysis",
      "Segment comparison visualisations",
    ],
    stack: ["Python", "Streamlit", "SQLite", "SciPy", "Plotly"],
    localRun: [
      "cd projects/product-ab-testing-engine",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "10", label: "Sample result rows" },
      { value: "95%", label: "Decision confidence lens" },
    ],
  },
  {
    slug: "sports-ai-predictor",
    name: "AI Sports Predictor",
    category: "Predictive Modeling",
    status: "Prototype-ready",
    statusTone: "prototype",
    featured: false,
    launch_url: "",
    github_url: `${repoBaseUrl}/projects/sports-ai-predictor`,
    details_url: "projects.html#sports-ai-predictor",
    screenshot: "assets/project_images/sports-ai-predictor.svg",
    summary:
      "Train a lightweight model, generate probability-based forecasts, and expose the logic behind the prediction.",
    overview:
      "A simple machine-learning prototype that demonstrates how predictive outputs can be translated into an interpretable product interface.",
    problem:
      "Forecasting tools are often treated like black boxes, which makes business users reluctant to trust or act on them.",
    solution:
      "The app trains a logistic regression model on match data, then exposes feature importance, confusion matrix, trend charts, and a prediction form.",
    whatItSolves:
      "It demonstrates how to package model outputs into a product surface that explains confidence and contributing factors.",
    pmThinking:
      "Predictive products need more than a probability score. They need context, visibility into inputs, and enough transparency to support action.",
    datasetsUsed: [
      "`sample_matches.csv` with 28 rows covering ratings, recent form, rest days, home advantage, and outcomes.",
    ],
    businessValue: [
      "Shows the ability to move from structured data to a usable predictive product flow.",
      "Demonstrates interpretable model communication for non-technical users.",
      "Acts as a portable ML case study inside the wider product lab.",
    ],
    features: [
      "One-click model training",
      "Accuracy and ROC-AUC reporting",
      "Feature importance and confusion matrix views",
      "Prediction form with probability output",
    ],
    stack: ["Python", "Streamlit", "scikit-learn", "Plotly"],
    localRun: [
      "cd projects/sports-ai-predictor",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "28", label: "Training rows" },
      { value: "1", label: "Predictive workflow" },
    ],
  },
  {
    slug: "ai-product-roadmap-generator",
    name: "AI Product Roadmap Generator",
    category: "Roadmapping",
    status: "Deployment-ready",
    statusTone: "ready",
    featured: true,
    launch_url: "",
    github_url: `${repoBaseUrl}/projects/ai-product-roadmap-generator`,
    details_url: "projects.html#ai-product-roadmap-generator",
    screenshot: "assets/project_images/ai-product-roadmap-generator.svg",
    summary:
      "Convert product goals, customer feedback, and feature ideas into a transparent roadmap proposal.",
    overview:
      "A prioritisation and planning assistant for product teams that need a faster path from input chaos to roadmap structure.",
    problem:
      "Roadmap conversations are often slowed by fragmented inputs and opaque prioritisation criteria.",
    solution:
      "The app combines business goals, feedback, product metrics, and feature ideas into a score-driven prioritisation model with impact-effort and quarterly roadmap outputs.",
    whatItSolves:
      "It turns competing inputs into a roadmap artefact that is easier to defend with both stakeholders and delivery teams.",
    pmThinking:
      "A roadmap is strongest when the scoring model is visible, the trade-offs are explicit, and narrative summary supports the chart output.",
    datasetsUsed: [
      "`sample_feature_ideas.csv` with nine roadmap candidates scored across reach, impact, confidence, effort, strategic fit, and feedback volume.",
    ],
    businessValue: [
      "Brings consistency to roadmap conversations and quarterly planning cycles.",
      "Helps explain why a feature made the roadmap and what was deprioritised.",
      "Reduces planning overhead while keeping judgement transparent.",
    ],
    features: [
      "Inputs for goals, feedback, and product metrics",
      "RICE-style prioritisation logic",
      "Impact-versus-effort and quarterly roadmap visualisations",
      "Optional AI-generated planning summary",
    ],
    stack: ["Python", "Streamlit", "Pandas", "Plotly", "OpenAI API"],
    localRun: [
      "cd projects/ai-product-roadmap-generator",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "9", label: "Feature candidates" },
      { value: "3", label: "Planning inputs" },
    ],
  },
  {
    slug: "product-teardowns-studio",
    name: "Product Teardowns Studio",
    category: "Strategy Research",
    status: "Showcase-ready",
    statusTone: "showcase",
    featured: false,
    launch_url: "",
    github_url: `${repoBaseUrl}/product-teardowns`,
    details_url: "projects.html#product-teardowns-studio",
    screenshot: "assets/project_images/product-teardowns.svg",
    overview:
      "A strategy library that turns product teardown writing into a browsable research surface.",
    summary:
      "Browse structured teardowns across category, user model, business model, and strategic moat.",
    problem:
      "Strategic product learning often sits in scattered notes instead of a reusable format teams can revisit or present.",
    solution:
      "The app pairs markdown teardown documents with structured metadata, turning strategic analysis into a searchable interview and portfolio asset.",
    whatItSolves:
      "It packages product strategy thinking into a repeatable format that is easier to browse, compare, and extend.",
    pmThinking:
      "Teardowns are most useful when they connect user behaviour, business model, and defensibility instead of stopping at feature lists.",
    datasetsUsed: [
      "`teardown_catalog.csv` with five products and metadata covering category, user, business model, strengths, and risks.",
      "Markdown teardown documents for Netflix, Uber, Airbnb, Stripe, and OpenAI.",
    ],
    businessValue: [
      "Shows strategic writing and market analysis in a portfolio-friendly surface.",
      "Creates a reusable template for future teardown research.",
      "Demonstrates product thinking beyond delivery into positioning and moat analysis.",
    ],
    features: [
      "Sidebar-driven teardown browser",
      "Structured metadata and portfolio index",
      "Five full teardown documents",
      "Expandable format for future research additions",
    ],
    stack: ["Markdown", "Streamlit", "Pandas", "Product strategy"],
    localRun: [
      "cd product-teardowns",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
    metrics: [
      { value: "5", label: "Teardowns" },
      { value: "4", label: "Strategy lenses" },
    ],
  },
];

const featuredLabApps = labApps.filter((app) => app.featured);

window.PortfolioData = {
  siteConfig,
  homeCapabilities,
  aboutProfile,
  labApps,
  featuredLabApps,
};
})();
