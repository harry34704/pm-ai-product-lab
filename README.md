# pm-ai-product-lab-v2

Premium multi-page portfolio platform for **Harry Munyai**:

- Product Manager
- Business Analyst
- AI Product Builder

The site is designed to feel like a real product platform rather than a static portfolio. It presents Harry's work through a premium dark-theme interface and a unified **AI Product Lab** dashboard that brings seven deployable apps into one operating surface.

## What Is Included

### Public website

- `index.html` - premium home page
- `about.html` - professional profile, strengths, sectors, tools, certifications, and product philosophy
- `ai-product-lab.html` - dashboard-style control center for all seven apps
- `projects.html` - detailed showcase with business problem, solution, stack, datasets, screenshots, and local run instructions
- `contact.html` - direct contact surface with LinkedIn, GitHub, email, and CV download
- `404.html` - premium fallback page
- `project.html` - legacy redirect to `projects.html`
- `style.css` - shared visual system
- `script.js` - shared interaction and rendering logic
- `site-data.js` - central content/config layer for profile data and app metadata

### Product apps

- `projects/ai-product-validator`
- `projects/product-analytics-dashboard`
- `projects/ai-customer-insights`
- `projects/product-ab-testing-engine`
- `projects/sports-ai-predictor`
- `projects/ai-product-roadmap-generator`
- `product-teardowns`

### Assets

- `assets/profile.jpg`
- `assets/profile.png`
- `assets/Harry_Munyai_PM.pdf`
- `assets/favicon.svg`
- `assets/social-preview.svg`
- `assets/project_images/*`

## Folder Structure

```text
pm-ai-product-lab-v2/
|-- 404.html
|-- about.html
|-- ai-product-lab.html
|-- contact.html
|-- index.html
|-- project.html
|-- projects.html
|-- README.md
|-- robots.txt
|-- script.js
|-- sitemap.xml
|-- site-data.js
|-- style.css
|-- assets/
|   |-- Harry_Munyai_PM.pdf
|   |-- favicon.svg
|   |-- profile.jpg
|   |-- profile.png
|   |-- social-preview.svg
|   `-- project_images/
|-- docs/
|-- product-teardowns/
`-- projects/
```

## Local Preview

Because the site is fully static, there is no build step.

### Quick preview

Open `index.html` directly in a browser.

### Better local preview

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Central Update File

The main maintenance file is:

- `site-data.js`

That file controls:

- profile identity and external links
- GitHub repo base URL
- app names and categories
- app status badges
- `launch_url`
- `github_url`
- `details_url`
- business problem and solution copy
- datasets used
- business value
- local run instructions

If you want to change portfolio wording or activate live app links later, start there.

## How To Update Profile Details

### Update the profile image

Replace:

- `assets/profile.jpg`

Optional:

- `assets/profile.png`

The website currently uses `assets/profile.jpg`.

### Update the CV

Replace:

- `assets/Harry_Munyai_PM.pdf`

The download buttons already point to that file.

### Update LinkedIn, GitHub, email, repo URL, or site URL

Edit:

- `site-data.js`

Update these keys:

```js
linkedin
github
email
siteUrl
repoBaseUrl
```

## How To Activate Live App Links

Each app in `site-data.js` includes:

```js
launch_url
github_url
details_url
```

To make an app launch live:

1. Deploy the Streamlit app.
2. Copy the deployed URL.
3. Paste it into that app's `launch_url`.

Example:

```js
launch_url: "https://your-app-name.streamlit.app"
```

If `launch_url` is empty, the site keeps the premium launch button but shows a placeholder toast instead of opening a broken link.

## GitHub Pages Deployment

This site is static, so deployment is simple.

### Option 1: GitHub Pages

1. Push the repo to GitHub.
2. Rename the repository to `pm-ai-product-lab-v2` if you want the default URL to match the site config.
3. In GitHub, open `Settings` -> `Pages`.
4. Set the source to deploy from the repository root on your main branch.
5. Save and wait for GitHub Pages to publish the site.

Expected URL:

```text
https://harry34704.github.io/pm-ai-product-lab-v2/
```

If you deploy under a different repo name or custom domain, update `siteUrl` in `site-data.js` and the canonical/social URLs in the HTML pages.

## Netlify Deployment

1. Connect the repository in Netlify.
2. Set the publish directory to the repository root.
3. Leave the build command empty.
4. Deploy.

No framework adapter or bundler is required.

## Notes On Copy And Positioning

The site copy is intentionally positioned around:

- product strategy
- business analysis
- payments and platform operations
- analytics and SQL-led decision making
- AI prototyping

The goal is to make the portfolio feel credible to senior stakeholders, hiring managers, and LinkedIn audiences without sounding inflated or generic.

## Verification

Recommended checks after updates:

1. Open all top-level pages and confirm navigation, footer links, and download buttons work.
2. Confirm `launch_url` buttons behave correctly for both empty and live links.
3. Check screenshots, profile image, and social assets render correctly.
4. Review mobile layout for the header, dashboard cards, and project sections.
