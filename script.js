const githubUserFromHost = window.location.hostname.endsWith(".github.io")
  ? window.location.hostname.split(".")[0]
  : "USERNAME";

const repoBaseUrl = `https://github.com/${githubUserFromHost}/pm-ai-product-lab/tree/main`;

const projects = [
  {
    slug: "ai-product-validator",
    title: "AI Product Validator",
    category: "AI Strategy",
    repoPath: "projects/ai-product-validator",
    runPath: "projects/ai-product-validator",
    dataset: "data/sample_ideas.csv",
    stack: ["Python", "Streamlit", "SQLite", "OpenAI API"],
    screenshot: "assets/project_images/ai-product-validator.svg",
    shortDescription:
      "Evaluates startup ideas with SWOT output, viability scoring, market opportunity analysis, and report generation.",
    longDescription:
      "A PM-facing validation workflow for early-stage product concepts. The app combines structured heuristics with optional OpenAI summaries to assess demand, monetization, competitive risk, and MVP potential.",
    highlights: [
      "Idea input form with sample concepts",
      "SWOT analysis and competitor suggestions",
      "Viability, demand, defensibility, and risk scoring",
      "SQLite-backed report history with markdown export",
    ],
    runInstructions: [
      "cd projects/ai-product-validator",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
  {
    slug: "product-analytics-dashboard",
    title: "Product Analytics Dashboard",
    category: "Analytics",
    repoPath: "projects/product-analytics-dashboard",
    runPath: "projects/product-analytics-dashboard",
    dataset: "data/sample_events.csv",
    stack: ["Python", "Streamlit", "Pandas", "Plotly"],
    screenshot: "assets/project_images/product-analytics-dashboard.svg",
    shortDescription:
      "A lightweight Mixpanel-style dashboard for DAU, funnels, retention cohorts, and feature adoption analysis.",
    longDescription:
      "This app simulates a compact analytics stack for a product manager. Event uploads are filtered by plan, platform, and date range, then translated into sequential funnel conversion, active-user trendlines, retention heatmaps, and adoption patterns.",
    highlights: [
      "Automatic sample dataset loading",
      "Daily active user trend and product usage overview",
      "Sequential funnel analysis across selected steps",
      "Retention cohort heatmap and feature adoption breakdown",
    ],
    runInstructions: [
      "cd projects/product-analytics-dashboard",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
  {
    slug: "ai-customer-insights",
    title: "AI Customer Insights",
    category: "Voice of Customer",
    repoPath: "projects/ai-customer-insights",
    runPath: "projects/ai-customer-insights",
    dataset: "data/sample_tickets.csv",
    stack: ["Python", "Streamlit", "Pandas", "OpenAI API"],
    screenshot: "assets/project_images/ai-customer-insights.svg",
    shortDescription:
      "Transforms support tickets into structured product insight with sentiment scoring, issue categorization, and trend analysis.",
    longDescription:
      "Designed for PMs and support-led product discovery, the app ingests support tickets, tags common issue categories, flags feature requests and bug reports, and surfaces repeat friction themes with charts and a concise summary.",
    highlights: [
      "Ticket upload with sample support queue",
      "Sentiment scoring with deterministic fallback",
      "Issue classification, bug detection, and feature-request detection",
      "Issue frequency, bug trend, and feature-request trend views",
    ],
    runInstructions: [
      "cd projects/ai-customer-insights",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
  {
    slug: "product-ab-testing-engine",
    title: "Product A/B Testing Engine",
    category: "Experimentation",
    repoPath: "projects/product-ab-testing-engine",
    runPath: "projects/product-ab-testing-engine",
    dataset: "data/sample_experiment_results.csv",
    stack: ["Python", "Streamlit", "SQLite", "SciPy"],
    screenshot: "assets/project_images/product-ab-testing-engine.svg",
    shortDescription:
      "Creates product experiments, compares A/B variants, and measures uplift with statistical significance testing.",
    longDescription:
      "A lightweight experimentation workbench that stores experiment definitions, evaluates control and treatment performance, and helps product teams reason about lift with p-values, confidence intervals, and segment-level comparison.",
    highlights: [
      "SQLite-backed experiment setup and history",
      "Control and variant definition fields",
      "Conversion rate, lift, z-score, and p-value analysis",
      "Segment comparison chart for deeper readouts",
    ],
    runInstructions: [
      "cd projects/product-ab-testing-engine",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
  {
    slug: "sports-ai-predictor",
    title: "AI Sports Predictor",
    category: "Machine Learning",
    repoPath: "projects/sports-ai-predictor",
    runPath: "projects/sports-ai-predictor",
    dataset: "data/sample_matches.csv",
    stack: ["Python", "Streamlit", "scikit-learn", "Plotly"],
    screenshot: "assets/project_images/sports-ai-predictor.svg",
    shortDescription:
      "Trains a lightweight match prediction model and produces win probability estimates with trend analysis.",
    longDescription:
      "Built as a simple ML prototype for business storytelling, this project trains a logistic regression classifier on structured match data and exposes model quality, feature importance, confusion matrix, and rolling team performance trends.",
    highlights: [
      "Sample match dataset with team and opponent features",
      "Train-on-click logistic regression model",
      "Win probability prediction form",
      "Feature importance, confusion matrix, and performance trend visualizations",
    ],
    runInstructions: [
      "cd projects/sports-ai-predictor",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
  {
    slug: "ai-product-roadmap-generator",
    title: "AI Product Roadmap Generator",
    category: "Planning",
    repoPath: "projects/ai-product-roadmap-generator",
    runPath: "projects/ai-product-roadmap-generator",
    dataset: "data/sample_feature_ideas.csv",
    stack: ["Python", "Streamlit", "Pandas", "OpenAI API"],
    screenshot: "assets/project_images/ai-product-roadmap-generator.svg",
    shortDescription:
      "Converts goals, metrics, feedback, and feature ideas into a prioritized roadmap with quarter-level planning.",
    longDescription:
      "A planning assistant for product teams that scores feature ideas using transparent prioritization logic, visualizes impact versus effort, and generates a quarter-mapped roadmap with optional AI-generated narrative.",
    highlights: [
      "Inputs for goals, feedback, metrics, and features",
      "RICE-style prioritization logic",
      "Impact vs effort matrix and quarterly roadmap view",
      "Optional AI summary with deterministic fallback",
    ],
    runInstructions: [
      "cd projects/ai-product-roadmap-generator",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
  {
    slug: "product-teardowns",
    title: "Product Teardowns",
    category: "Product Strategy",
    repoPath: "product-teardowns",
    runPath: "product-teardowns",
    dataset: "data/teardown_catalog.csv",
    stack: ["Markdown", "Streamlit", "Product Strategy"],
    screenshot: "assets/project_images/product-teardowns.svg",
    shortDescription:
      "A portfolio collection of product teardowns covering Netflix, Uber, Airbnb, Stripe, and OpenAI.",
    longDescription:
      "This project turns product teardown writing into a browsable showcase. It pairs markdown teardown documents with a Streamlit browser that highlights each product's category, user model, business model, and strategic moat.",
    highlights: [
      "Teardowns for five well-known technology companies",
      "Portfolio-friendly Streamlit browser",
      "Catalog dataset for quick comparison",
      "Reusable structure for future teardown additions",
    ],
    runInstructions: [
      "cd product-teardowns",
      "pip install -r requirements.txt",
      "streamlit run app.py",
    ],
  },
];

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    return;
  }
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2400);
}

function copyRunCommand(project) {
  const command = project.runInstructions.join("\n");
  navigator.clipboard
    .writeText(command)
    .then(() => showToast(`${project.title} run command copied`))
    .catch(() => showToast("Unable to copy command"));
}

function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";
  article.innerHTML = `
    <div class="project-preview">
      <img src="${project.screenshot}" alt="${project.title} preview" />
    </div>
    <div class="card-meta">${project.category}</div>
    <h3>${project.title}</h3>
    <p>${project.shortDescription}</p>
    <div class="chip-row">
      ${project.stack.map((item) => `<span>${item}</span>`).join("")}
    </div>
    <footer>
      <a class="button small primary" href="project.html?slug=${project.slug}">Project Details</a>
      <a class="button small secondary" href="${repoBaseUrl}/${project.repoPath}" target="_blank" rel="noreferrer">View GitHub Folder</a>
      <button class="button small ghost" type="button">Run Demo Locally</button>
    </footer>
  `;
  article.querySelector("button").addEventListener("click", () => copyRunCommand(project));
  return article;
}

function renderHomePage() {
  const grid = document.getElementById("projects-grid");
  const spotlight = document.getElementById("featured-project-card");
  if (!grid || !spotlight) {
    return;
  }

  projects.forEach((project) => {
    grid.appendChild(createProjectCard(project));
  });

  const featured = projects[0];
  spotlight.innerHTML = `
    <div class="card-meta">Featured Project</div>
    <h3>${featured.title}</h3>
    <p>${featured.shortDescription}</p>
    <div class="chip-row">
      ${featured.stack.slice(0, 3).map((item) => `<span>${item}</span>`).join("")}
    </div>
    <img src="${featured.screenshot}" alt="${featured.title} interface preview" />
  `;
}

function renderDetailPage() {
  const root = document.getElementById("project-detail-root");
  if (!root) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const project = projects.find((entry) => entry.slug === slug) || projects[0];
  const relatedProjects = projects
    .filter((entry) => entry.slug !== project.slug)
    .slice(0, 3);

  document.title = `${project.title} | PM AI Product Lab`;

  root.innerHTML = `
    <div class="detail-shell">
      <section class="detail-headline">
        <div class="detail-copy">
          <div class="detail-kicker">${project.category}</div>
          <h1>${project.title}</h1>
          <p>${project.longDescription}</p>
          <div class="detail-actions">
            <a class="button primary" href="${repoBaseUrl}/${project.repoPath}" target="_blank" rel="noreferrer">View GitHub Folder</a>
            <button class="button secondary" type="button" id="copy-run-command">Run Demo Locally</button>
          </div>
          <div class="detail-stat-grid">
            <div class="detail-stat">
              <strong>${project.dataset}</strong>
              <span>Bundled sample dataset</span>
            </div>
            <div class="detail-stat">
              <strong>${project.stack.length}</strong>
              <span>Core technologies highlighted</span>
            </div>
            <div class="detail-stat">
              <strong>Streamlit</strong>
              <span>Consistent local run surface</span>
            </div>
          </div>
        </div>
        <div class="detail-card">
          <img src="${project.screenshot}" alt="${project.title} screenshot" />
        </div>
      </section>

      <section class="detail-content">
        <div class="detail-content-grid">
          <div>
            <div class="detail-overview">
              <p class="eyebrow">Description</p>
              <h2>What this project does</h2>
              <p>${project.longDescription}</p>
            </div>

            <div class="detail-gallery">
              <p class="eyebrow">Screenshots</p>
              <h2>Visual walkthrough</h2>
              <div class="detail-feature-grid">
                <article class="detail-feature-card">
                  <h3>Interface preview</h3>
                  <p>
                    The repository includes a ready-to-present visual preview for this
                    project inside the portfolio website.
                  </p>
                  <img src="${project.screenshot}" alt="${project.title} dashboard preview" />
                </article>
                <article class="detail-feature-card">
                  <h3>Feature snapshot</h3>
                  <p>${project.highlights[0]}</p>
                  <p>${project.highlights[1]}</p>
                  <p>${project.highlights[2]}</p>
                  <p>${project.highlights[3]}</p>
                </article>
              </div>
            </div>
          </div>

          <div>
            <div class="detail-stack">
              <p class="eyebrow">Tech Stack</p>
              <h2>Built with</h2>
              <div class="stack-row">
                ${project.stack.map((item) => `<span>${item}</span>`).join("")}
              </div>
            </div>

            <div class="detail-run">
              <p class="eyebrow">Run Locally</p>
              <h2>Local instructions</h2>
              <div class="detail-instructions">
                <ol>
                  <li>Open the repository in a terminal.</li>
                  <li>Install dependencies for the selected project.</li>
                  <li>Launch the Streamlit app.</li>
                </ol>
                <div class="command-block">${project.runInstructions.join("\n")}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="related-projects">
          <p class="eyebrow">More Work</p>
          <h2>Related projects in the lab</h2>
          <div class="related-grid" id="related-grid"></div>
        </div>
      </section>
    </div>
  `;

  root.querySelector("#copy-run-command").addEventListener("click", () => copyRunCommand(project));
  const relatedGrid = document.getElementById("related-grid");
  relatedProjects.forEach((entry) => relatedGrid.appendChild(createProjectCard(entry)));
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open");
  });
}

function setFooterYear() {
  const footer = document.getElementById("footer-year");
  if (footer) {
    footer.textContent = `Updated ${new Date().getFullYear()}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.dataset.page;
  setupNavigation();
  setFooterYear();

  if (pageType === "home") {
    renderHomePage();
  }

  if (pageType === "detail") {
    renderDetailPage();
  }
});

