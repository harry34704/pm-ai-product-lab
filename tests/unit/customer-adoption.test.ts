import { describe, expect, it } from "vitest";
import {
  DEMO_CUSTOMER_ADOPTION_ROWS,
  buildCustomerAdoptionAnalysis,
  normalizeGoogleSheetsUrl,
  parseCustomerAdoptionText
} from "../../apps/web/lib/customer-adoption";

describe("customer adoption parsing", () => {
  it("parses tab-separated data copied from a sheet", () => {
    const rows = parseCustomerAdoptionText(
      [
        "month\trequest_type\tapp_requests\tapp_unique_customers\tmoosedesk_tickets\tmoosedesk_unique_customers\tadoption_pct\ttotal_requests",
        "2026-03\tbuyout\t0\t0\t39\t34\t0\t39",
        "2026-03\tstatement_request\t80\t72\t18\t17\t81.63\t98"
      ].join("\n")
    );

    expect(rows).toHaveLength(2);
    expect(rows[1].request_type).toBe("statement_request");
    expect(rows[1].adoption_pct).toBe(81.63);
  });

  it("normalizes a standard Google Sheets URL into CSV export form", () => {
    const exportUrl = normalizeGoogleSheetsUrl(
      "https://docs.google.com/spreadsheets/d/abc123/edit?gid=456#gid=456"
    );

    expect(exportUrl).toBe("https://docs.google.com/spreadsheets/d/abc123/export?format=csv&gid=456");
  });
});

describe("customer adoption analysis", () => {
  it("builds summaries and overview metrics from imported rows", () => {
    const analysis = buildCustomerAdoptionAnalysis(DEMO_CUSTOMER_ADOPTION_ROWS);

    expect(analysis.overview.totalRequests).toBe(3722);
    expect(analysis.overview.overallAdoption).toBe(77.03);
    expect(analysis.summaries[0].feature).toBe("Payment Disputes");
    expect(analysis.summaries.at(-1)?.feature).toBe("Buyouts");
  });
});
