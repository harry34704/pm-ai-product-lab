import path from "node:path";
import { test, expect } from "@playwright/test";

const fixtures = path.join(process.cwd(), "tests", "e2e", "fixtures");

test("resume upload to review smoke flow", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("pm@example.com");
  await page.getByPlaceholder("Password").fill("Password123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/);

  await page.goto("/resumes");
  await page.locator('input[type="file"]').setInputFiles(path.join(fixtures, "resume.txt"));
  await expect(page).toHaveURL(/\/resumes\//);

  await page.goto("/jobs");
  await page.getByPlaceholder("Role title").fill("Product Manager");
  await page.getByPlaceholder("Company").fill("Acme Cloud");
  await page.getByPlaceholder("Paste the job description here...").fill(`Product Manager
Acme Cloud
Responsibilities
- Lead roadmap planning
Required skills
- SQL
- Stakeholder management
- Experimentation`);
  await page.getByRole("button", { name: "Save job description" }).click();
  await expect(page).toHaveURL(/\/jobs\//);

  await page.goto("/analysis/new");
  await page.getByRole("button", { name: "Run analysis" }).click();
  await expect(page).toHaveURL(/\/analysis\//);

  await page.goto("/practice/new");
  await page.getByPlaceholder("Room title").fill("Playwright Mock Room");
  await page.getByPlaceholder("Your display name").fill("Candidate Owner");
  await page.getByRole("button", { name: "Create room" }).click();
  await expect(page).toHaveURL(/\/practice\//);

  await page.getByPlaceholder("Display name").fill("Guest Interviewer");
  await page.locator("select").nth(1).selectOption("INTERVIEWER");
  await page.getByRole("button", { name: "Join room" }).click();
  await page.getByRole("button", { name: "Start practice session" }).click();

  await page.getByRole("button", { name: "I consent to transcript use" }).click();
  await page.getByPlaceholder("Add manual notes when speech recognition is unavailable...").fill("Interviewer: Tell me about a roadmap decision you made.");
  await page.getByRole("button", { name: "Save note" }).click();
  await page.getByRole("button", { name: "End session" }).click();

  await page.goto("/sessions");
  await page.getByText("Playwright Mock Room").first().click();
  await expect(page).toHaveURL(/\/sessions\//);
  await expect(page.getByText("Transcript")).toBeVisible();
});
