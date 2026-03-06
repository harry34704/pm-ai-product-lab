const portfolioData = window.PortfolioData || {};

const {
  siteConfig = {},
  homeCapabilities = [],
  aboutProfile = {},
  labApps = [],
  featuredLabApps = [],
} = portfolioData;

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function copyText(text, message) {
  if (!navigator.clipboard) {
    showToast("Clipboard is not available in this browser.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showToast(message))
    .catch(() => showToast("Unable to copy the requested value."));
}

function getLaunchStatusCopy(app) {
  return app.launch_url
    ? "Live deployment connected"
    : "Live deployment not connected yet. A local run guide is available from the portfolio.";
}

function getLaunchButtonLabel(app) {
  return app.launch_url ? "Launch App" : "Open Run Guide";
}

function openLaunch(app) {
  if (app.launch_url) {
    window.open(app.launch_url, "_blank", "noopener,noreferrer");
    return;
  }

  if (app.localRun?.length) {
    copyText(app.localRun.join("\n"), `${app.name} run instructions copied.`);
  }

  window.location.href = app.details_url;
}

function setExternalLinks() {
  const linkMap = {
    linkedin: siteConfig.linkedin,
    github: siteConfig.github,
    cv: siteConfig.cvPath,
    email: `mailto:${siteConfig.email}`,
  };

  document.querySelectorAll("[data-site-link]").forEach((link) => {
    const linkKey = link.dataset.siteLink;
    const href = linkMap[linkKey];
    if (href) {
      link.setAttribute("href", href);
    }
  });
}

function setYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = year;
  });
}

function initPageReady() {
  const revealReady = () => {
    document.body.classList.add("is-ready");
  };

  if (document.readyState === "complete") {
    window.setTimeout(revealReady, 120);
  } else {
    window.addEventListener(
      "load",
      () => {
        window.setTimeout(revealReady, 120);
      },
      { once: true },
    );
  }
}

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initRevealObserver() {
  const revealNodes = document.querySelectorAll("[data-reveal]");

  if (!revealNodes.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function createStatusBadge(app) {
  return `<span class="status-badge ${escapeHtml(app.statusTone)}">${escapeHtml(app.status)}</span>`;
}

function createActionButtons(app, context = "default") {
  const launchClass = context === "lab" ? "button primary" : "button secondary";
  return `
    <div class="card-actions">
      <button class="${launchClass}" type="button" data-launch-slug="${escapeHtml(app.slug)}">${escapeHtml(getLaunchButtonLabel(app))}</button>
      <a class="button tertiary" href="${escapeHtml(app.details_url)}">View Details</a>
      <a class="button tertiary" href="${escapeHtml(app.github_url)}" target="_blank" rel="noreferrer">View Code</a>
    </div>
  `;
}

function attachLaunchButtons(root = document) {
  root.querySelectorAll("[data-launch-slug]").forEach((button) => {
    button.addEventListener("click", () => {
      const app = labApps.find((entry) => entry.slug === button.dataset.launchSlug);
      if (app) {
        openLaunch(app);
      }
    });
  });
}

function renderCapabilityGrid() {
  const container = document.getElementById("capability-grid");
  if (!container) {
    return;
  }

  container.innerHTML = homeCapabilities
    .map(
      (capability) => `
        <article class="capability-card" data-reveal>
          <h3>${escapeHtml(capability.title)}</h3>
          <p>${escapeHtml(capability.description)}</p>
        </article>
      `,
    )
    .join("");
}

function renderHeroMiniCards() {
  const container = document.getElementById("hero-featured-mini");
  if (!container) {
    return;
  }

  container.innerHTML = featuredLabApps
    .slice(0, 3)
    .map(
      (app) => `
        <article class="mini-card" data-reveal>
          <div class="mini-card-top">
            <span>${escapeHtml(app.category)}</span>
            ${createStatusBadge(app)}
          </div>
          <h4>${escapeHtml(app.name)}</h4>
          <p>${escapeHtml(app.summary)}</p>
        </article>
      `,
    )
    .join("");
}

function renderFeaturedStrip() {
  const container = document.getElementById("featured-strip");
  if (!container) {
    return;
  }

  container.innerHTML = featuredLabApps
    .map(
      (app) => `
        <article class="feature-card" data-reveal>
          <div class="feature-card-media">
            <img src="${escapeHtml(app.screenshot)}" alt="${escapeHtml(app.name)} preview" />
          </div>
          <div class="feature-card-body">
            <div class="card-topline">
              <span>${escapeHtml(app.category)}</span>
              ${createStatusBadge(app)}
            </div>
            <h3>${escapeHtml(app.name)}</h3>
            <p>${escapeHtml(app.summary)}</p>
            ${createActionButtons(app)}
          </div>
        </article>
      `,
    )
    .join("");

  attachLaunchButtons(container);
}

function renderAboutPage() {
  const intro = document.getElementById("about-intro");
  const bio = document.getElementById("about-bio");
  const outcomes = document.getElementById("about-outcomes");
  const strengthGrid = document.getElementById("strength-grid");
  const industryTags = document.getElementById("industry-tags");
  const education = document.getElementById("education-copy");
  const timeline = document.getElementById("experience-timeline");
  const toolGroups = document.getElementById("tool-groups");
  const certificationList = document.getElementById("certification-list");
  const philosophyGrid = document.getElementById("philosophy-grid");

  if (intro) {
    intro.textContent = aboutProfile.intro || intro.textContent;
  }

  if (bio) {
    bio.textContent = aboutProfile.bio || bio.textContent;
  }

  if (education) {
    education.textContent = aboutProfile.education || education.textContent;
  }

  if (outcomes) {
    outcomes.innerHTML = (aboutProfile.outcomes || [])
      .map(
        (item) => `
          <article class="stat-card" data-reveal>
            <strong>${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
          </article>
        `,
      )
      .join("");
  }

  if (strengthGrid) {
    strengthGrid.innerHTML = (aboutProfile.strengths || [])
      .map(
        (item) => `
          <article class="story-card" data-reveal>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `,
      )
      .join("");
  }

  if (industryTags) {
    industryTags.innerHTML = (aboutProfile.industries || [])
      .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
      .join("");
  }

  if (timeline) {
    timeline.innerHTML = (aboutProfile.timeline || [])
      .map(
        (item) => `
          <article class="timeline-card" data-reveal>
            <div class="timeline-top">
              <div>
                <p class="timeline-role">${escapeHtml(item.role)}</p>
                <h3>${escapeHtml(item.company)}</h3>
              </div>
              <span class="timeline-period">${escapeHtml(item.period)}</span>
            </div>
            <p>${escapeHtml(item.summary)}</p>
            <ul class="plain-list">
              ${item.outcomes.map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join("")}
            </ul>
          </article>
        `,
      )
      .join("");
  }

  if (toolGroups) {
    toolGroups.innerHTML = (aboutProfile.toolGroups || [])
      .map(
        (group) => `
          <article class="tool-group" data-reveal>
            <h4>${escapeHtml(group.title)}</h4>
            <div class="tag-cloud">
              ${group.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
            </div>
          </article>
        `,
      )
      .join("");
  }

  if (certificationList) {
    certificationList.innerHTML = (aboutProfile.certifications || [])
      .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
      .join("");
  }

  if (philosophyGrid) {
    philosophyGrid.innerHTML = (aboutProfile.philosophy || [])
      .map(
        (item) => `
          <article class="story-card" data-reveal>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `,
      )
      .join("");
  }
}

function createLabCard(app, isActive) {
  const metricMarkup = app.metrics
    .map(
      (metric) => `
        <div class="inline-stat">
          <strong>${escapeHtml(metric.value)}</strong>
          <span>${escapeHtml(metric.label)}</span>
        </div>
      `,
    )
    .join("");

  return `
    <article class="lab-card ${isActive ? "is-active" : ""}" data-reveal>
      <button class="lab-card-hitbox" type="button" data-select-slug="${escapeHtml(app.slug)}" aria-label="Inspect ${escapeHtml(app.name)}"></button>
      <div class="lab-card-media">
        <img src="${escapeHtml(app.screenshot)}" alt="${escapeHtml(app.name)} preview" />
      </div>
      <div class="lab-card-body">
        <div class="card-topline">
          <span>${escapeHtml(app.category)}</span>
          ${createStatusBadge(app)}
        </div>
        <h3>${escapeHtml(app.name)}</h3>
        <p>${escapeHtml(app.summary)}</p>
        <div class="inline-stats">${metricMarkup}</div>
        ${createActionButtons(app, "lab")}
      </div>
    </article>
  `;
}

function createConsolePanel(app) {
  return `
    <article class="console-panel">
      <div class="console-media">
        <img src="${escapeHtml(app.screenshot)}" alt="${escapeHtml(app.name)} preview" />
      </div>

      <div class="console-content">
        <div class="card-topline">
          <span>${escapeHtml(app.category)}</span>
          ${createStatusBadge(app)}
        </div>
        <h2>${escapeHtml(app.name)}</h2>
        <p>${escapeHtml(app.overview)}</p>

        <div class="inline-stats">
          ${app.metrics
            .map(
              (metric) => `
                <div class="inline-stat">
                  <strong>${escapeHtml(metric.value)}</strong>
                  <span>${escapeHtml(metric.label)}</span>
                </div>
              `,
            )
            .join("")}
        </div>

        <div class="console-sections">
          <article class="detail-card">
            <h3>What this app solves</h3>
            <p>${escapeHtml(app.whatItSolves)}</p>
          </article>
          <article class="detail-card">
            <h3>PM thinking behind it</h3>
            <p>${escapeHtml(app.pmThinking)}</p>
          </article>
          <article class="detail-card">
            <h3>Datasets used</h3>
            <ul class="plain-list">
              ${app.datasetsUsed.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </article>
          <article class="detail-card">
            <h3>Business value</h3>
            <ul class="plain-list">
              ${app.businessValue.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
          <article class="detail-card">
            <h3>Integration fields</h3>
            <div class="integration-list">
              <code>launch_url: ${escapeHtml(app.launch_url || "pending deployment")}</code>
              <code>github_url: ${escapeHtml(app.github_url)}</code>
              <code>details_url: ${escapeHtml(app.details_url)}</code>
            </div>
            <p class="status-note">${escapeHtml(getLaunchStatusCopy(app))}</p>
          </article>
        </div>

        ${createActionButtons(app, "lab")}
      </div>
    </article>
  `;
}

function renderLabPage() {
  const cardGrid = document.getElementById("lab-card-grid");
  const consoleRoot = document.getElementById("lab-console");

  if (!cardGrid || !consoleRoot) {
    return;
  }

  const hashSlug = window.location.hash.replace("#", "");
  let activeSlug = labApps.some((app) => app.slug === hashSlug) ? hashSlug : labApps[0]?.slug;

  const syncView = () => {
    cardGrid.innerHTML = labApps.map((app) => createLabCard(app, app.slug === activeSlug)).join("");
    const activeApp = labApps.find((app) => app.slug === activeSlug) || labApps[0];
    consoleRoot.innerHTML = createConsolePanel(activeApp);

    cardGrid.querySelectorAll("[data-select-slug]").forEach((button) => {
      button.addEventListener("click", () => {
        activeSlug = button.dataset.selectSlug;
        window.history.replaceState(null, "", `#${activeSlug}`);
        syncView();
      });
    });

    attachLaunchButtons(cardGrid);
    attachLaunchButtons(consoleRoot);
  };

  syncView();
}

function createProjectSection(app) {
  return `
    <section class="project-section" id="${escapeHtml(app.slug)}" data-reveal>
      <div class="project-topbar">
        <div class="card-topline">
          <span>${escapeHtml(app.category)}</span>
          ${createStatusBadge(app)}
        </div>
        <div class="project-actions">
          <button class="button secondary" type="button" data-launch-slug="${escapeHtml(app.slug)}">Launch App</button>
          <a class="button tertiary" href="${escapeHtml(app.github_url)}" target="_blank" rel="noreferrer">View Code</a>
          <a class="button tertiary" href="ai-product-lab.html#${escapeHtml(app.slug)}">Open in Lab</a>
        </div>
      </div>

      <div class="project-section-grid">
        <article class="project-visual-card">
          <img src="${escapeHtml(app.screenshot)}" alt="${escapeHtml(app.name)} preview" />
        </article>

        <div class="project-content">
          <div class="project-heading-block">
            <h2>${escapeHtml(app.name)}</h2>
            <p>${escapeHtml(app.overview)}</p>
          </div>

          <div class="detail-card-grid">
            <article class="detail-card">
              <h3>Business problem</h3>
              <p>${escapeHtml(app.problem)}</p>
            </article>
            <article class="detail-card">
              <h3>Solution</h3>
              <p>${escapeHtml(app.solution)}</p>
            </article>
            <article class="detail-card">
              <h3>What it solves</h3>
              <p>${escapeHtml(app.whatItSolves)}</p>
            </article>
            <article class="detail-card">
              <h3>PM thinking</h3>
              <p>${escapeHtml(app.pmThinking)}</p>
            </article>
          </div>

          <div class="detail-card-grid">
            <article class="detail-card">
              <h3>Features</h3>
              <ul class="plain-list">
                ${app.features.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
            <article class="detail-card">
              <h3>Business value</h3>
              <ul class="plain-list">
                ${app.businessValue.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
            <article class="detail-card">
              <h3>Datasets used</h3>
              <ul class="plain-list">
                ${app.datasetsUsed.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </article>
            <article class="detail-card">
              <h3>Tech stack</h3>
              <div class="tag-cloud">
                ${app.stack.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
              </div>
            </article>
          </div>

          <div class="detail-card-grid">
            <article class="detail-card">
              <h3>Deployment link placeholder</h3>
              <p>${escapeHtml(getLaunchStatusCopy(app))}</p>
              <code>${escapeHtml(app.launch_url || "Add launch_url in site-data.js")}</code>
            </article>
            <article class="detail-card run-card">
              <div class="run-card-top">
                <h3>Local run instructions</h3>
                <button class="button tertiary" type="button" data-copy-run="${escapeHtml(app.slug)}">Copy Run</button>
              </div>
              <div class="code-block">
                ${app.localRun.map((step) => `<code>${escapeHtml(step)}</code>`).join("")}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderProjectsPage() {
  const jumpLinks = document.getElementById("project-jump-links");
  const showcase = document.getElementById("projects-showcase");

  if (!jumpLinks || !showcase) {
    return;
  }

  jumpLinks.innerHTML = labApps
    .map((app) => `<a class="jump-link" href="#${escapeHtml(app.slug)}">${escapeHtml(app.name)}</a>`)
    .join("");

  showcase.innerHTML = labApps.map((app) => createProjectSection(app)).join("");
  attachLaunchButtons(showcase);

  showcase.querySelectorAll("[data-copy-run]").forEach((button) => {
    button.addEventListener("click", () => {
      const app = labApps.find((entry) => entry.slug === button.dataset.copyRun);
      if (app) {
        copyText(app.localRun.join("\n"), `${app.name} run instructions copied.`);
      }
    });
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);
    }
  }
}

function initCopyEmail() {
  const button = document.getElementById("copy-email-button");
  if (!button || !siteConfig.email) {
    return;
  }

  button.addEventListener("click", () => {
    copyText(siteConfig.email, "Email address copied.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setExternalLinks();
  setYear();
  initPageReady();
  initNavToggle();
  renderCapabilityGrid();
  renderHeroMiniCards();
  renderFeaturedStrip();
  renderAboutPage();
  renderLabPage();
  renderProjectsPage();
  initCopyEmail();
  initRevealObserver();
});
