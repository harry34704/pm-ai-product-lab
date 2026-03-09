export type CustomerAdoptionRow = {
  month: string;
  request_type: string;
  app_requests: number;
  app_unique_customers: number;
  moosedesk_tickets: number;
  moosedesk_unique_customers: number;
  adoption_pct: number;
  total_requests: number;
};

export type CustomerAdoptionSummary = {
  requestType: string;
  feature: string;
  avgAdoption: number;
  weightedAdoption: number;
  status: "success" | "warning" | "danger";
  appRequests: number;
  appUniqueCustomers: number;
  moosedeskTickets: number;
  moosedeskUniqueCustomers: number;
  totalRequests: number;
  monthlyRows: number;
};

export type CustomerAdoptionInsight = {
  tone: "success" | "warning" | "danger";
  title: string;
  body: string;
};

export type CustomerAdoptionAnalysis = {
  overview: {
    totalAppRequests: number;
    totalAppUniqueCustomers: number;
    totalMooseDeskTickets: number;
    totalMooseDeskUniqueCustomers: number;
    totalRequests: number;
    overallAdoption: number;
    monthCount: number;
    featureCount: number;
  };
  summaries: CustomerAdoptionSummary[];
  monthlyTotals: Array<{
    month: string;
    label: string;
    appRequests: number;
    appUniqueCustomers: number;
    moosedeskTickets: number;
    moosedeskUniqueCustomers: number;
    totalRequests: number;
    adoptionPct: number;
  }>;
  trendSeries: Array<Record<string, string | number>>;
  breakdownRows: Array<CustomerAdoptionRow & { monthLabel: string; feature: string }>;
  requestTypes: string[];
  featureLabels: Record<string, string>;
  insights: CustomerAdoptionInsight[];
};

const REQUIRED_COLUMNS = [
  "month",
  "request_type",
  "app_requests",
  "app_unique_customers",
  "moosedesk_tickets",
  "moosedesk_unique_customers",
  "adoption_pct",
  "total_requests"
] as const;

const REQUEST_TYPE_LABELS: Record<string, string> = {
  buyout: "Buyouts",
  cancellation: "Cancellations",
  payment_dispute: "Payment Disputes",
  return: "Returns",
  statement_request: "Statement Requests",
  upgrade_downgrade: "Upgrades & Downgrades"
};

export const DEMO_CUSTOMER_ADOPTION_ROWS: CustomerAdoptionRow[] = [
  { month: "2026-03", request_type: "buyout", app_requests: 0, app_unique_customers: 0, moosedesk_tickets: 39, moosedesk_unique_customers: 34, adoption_pct: 0, total_requests: 39 },
  { month: "2026-03", request_type: "cancellation", app_requests: 87, app_unique_customers: 74, moosedesk_tickets: 44, moosedesk_unique_customers: 25, adoption_pct: 66.41, total_requests: 131 },
  { month: "2026-03", request_type: "payment_dispute", app_requests: 60, app_unique_customers: 35, moosedesk_tickets: 19, moosedesk_unique_customers: 6, adoption_pct: 75.95, total_requests: 79 },
  { month: "2026-03", request_type: "return", app_requests: 0, app_unique_customers: 0, moosedesk_tickets: 6, moosedesk_unique_customers: 4, adoption_pct: 0, total_requests: 6 },
  { month: "2026-03", request_type: "statement_request", app_requests: 80, app_unique_customers: 72, moosedesk_tickets: 18, moosedesk_unique_customers: 17, adoption_pct: 81.63, total_requests: 98 },
  { month: "2026-03", request_type: "upgrade_downgrade", app_requests: 9, app_unique_customers: 7, moosedesk_tickets: 1, moosedesk_unique_customers: 1, adoption_pct: 90, total_requests: 10 },
  { month: "2026-02", request_type: "buyout", app_requests: 0, app_unique_customers: 0, moosedesk_tickets: 71, moosedesk_unique_customers: 58, adoption_pct: 0, total_requests: 71 },
  { month: "2026-02", request_type: "cancellation", app_requests: 583, app_unique_customers: 313, moosedesk_tickets: 156, moosedesk_unique_customers: 124, adoption_pct: 78.89, total_requests: 739 },
  { month: "2026-02", request_type: "payment_dispute", app_requests: 207, app_unique_customers: 70, moosedesk_tickets: 10, moosedesk_unique_customers: 7, adoption_pct: 95.39, total_requests: 217 },
  { month: "2026-02", request_type: "return", app_requests: 3, app_unique_customers: 1, moosedesk_tickets: 10, moosedesk_unique_customers: 8, adoption_pct: 23.08, total_requests: 13 },
  { month: "2026-02", request_type: "statement_request", app_requests: 295, app_unique_customers: 241, moosedesk_tickets: 70, moosedesk_unique_customers: 60, adoption_pct: 80.82, total_requests: 365 },
  { month: "2026-02", request_type: "upgrade_downgrade", app_requests: 59, app_unique_customers: 20, moosedesk_tickets: 17, moosedesk_unique_customers: 15, adoption_pct: 77.63, total_requests: 76 },
  { month: "2026-01", request_type: "buyout", app_requests: 0, app_unique_customers: 0, moosedesk_tickets: 91, moosedesk_unique_customers: 79, adoption_pct: 0, total_requests: 91 },
  { month: "2026-01", request_type: "cancellation", app_requests: 481, app_unique_customers: 278, moosedesk_tickets: 167, moosedesk_unique_customers: 116, adoption_pct: 74.23, total_requests: 648 },
  { month: "2026-01", request_type: "payment_dispute", app_requests: 625, app_unique_customers: 45, moosedesk_tickets: 37, moosedesk_unique_customers: 16, adoption_pct: 94.41, total_requests: 662 },
  { month: "2026-01", request_type: "return", app_requests: 0, app_unique_customers: 0, moosedesk_tickets: 12, moosedesk_unique_customers: 9, adoption_pct: 0, total_requests: 12 },
  { month: "2026-01", request_type: "statement_request", app_requests: 340, app_unique_customers: 284, moosedesk_tickets: 67, moosedesk_unique_customers: 56, adoption_pct: 83.54, total_requests: 407 },
  { month: "2026-01", request_type: "upgrade_downgrade", app_requests: 38, app_unique_customers: 22, moosedesk_tickets: 20, moosedesk_unique_customers: 13, adoption_pct: 65.52, total_requests: 58 }
];

function normalizeHeader(header: string) {
  return header
    .trim()
    .toLowerCase()
    .replace(/[%]/g, "pct")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitDelimitedLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === "\"") {
      const next = line[index + 1];
      if (insideQuotes && next === "\"") {
        current += "\"";
        index += 1;
        continue;
      }

      insideQuotes = !insideQuotes;
      continue;
    }

    if (!insideQuotes && char === delimiter) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function parseDelimitedText(text: string) {
  const normalizedText = text.replace(/\r\n/g, "\n").trim();

  if (!normalizedText) {
    throw new Error("No data found. Paste rows or import a sheet first.");
  }

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("The dataset needs a header row and at least one data row.");
  }

  const headerLine = lines[0];
  const candidates = ["\t", ",", ";"];
  const delimiter = candidates
    .map((candidate) => ({
      candidate,
      count: (headerLine.match(new RegExp(escapeRegex(candidate), "g")) ?? []).length
    }))
    .sort((left, right) => right.count - left.count)[0]?.candidate;

  const headers = splitDelimitedLine(headerLine, delimiter ?? ",").map(normalizeHeader);

  const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missingColumns.length) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  return lines.slice(1).map((line, rowIndex) => {
    const cells = splitDelimitedLine(line, delimiter ?? ",");
    const record = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));

    return coerceRow(record, rowIndex + 2);
  });
}

function coerceNumber(raw: string, field: string, rowNumber: number) {
  const normalized = raw.replace(/,/g, "").trim();
  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number for "${field}" on row ${rowNumber}.`);
  }

  return value;
}

function coerceMonth(value: string, rowNumber: number) {
  const month = value.trim();
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`Invalid month "${value}" on row ${rowNumber}. Use YYYY-MM format.`);
  }

  return month;
}

function coerceRequestType(value: string, rowNumber: number) {
  const requestType = value.trim().toLowerCase().replace(/[\s/]+/g, "_");
  if (!requestType) {
    throw new Error(`Missing request_type on row ${rowNumber}.`);
  }

  return requestType;
}

function coerceRow(record: Record<string, string>, rowNumber: number): CustomerAdoptionRow {
  const month = coerceMonth(record.month ?? "", rowNumber);
  const request_type = coerceRequestType(record.request_type ?? "", rowNumber);
  const app_requests = coerceNumber(record.app_requests ?? "", "app_requests", rowNumber);
  const app_unique_customers = coerceNumber(record.app_unique_customers ?? "", "app_unique_customers", rowNumber);
  const moosedesk_tickets = coerceNumber(record.moosedesk_tickets ?? "", "moosedesk_tickets", rowNumber);
  const moosedesk_unique_customers = coerceNumber(record.moosedesk_unique_customers ?? "", "moosedesk_unique_customers", rowNumber);
  const total_requests = coerceNumber(record.total_requests ?? "", "total_requests", rowNumber);
  const calculatedAdoption = total_requests === 0 ? 0 : Number(((app_requests / total_requests) * 100).toFixed(2));
  const rawAdoption = record.adoption_pct?.trim();
  const adoption_pct = rawAdoption ? coerceNumber(rawAdoption, "adoption_pct", rowNumber) : calculatedAdoption;

  return {
    month,
    request_type,
    app_requests,
    app_unique_customers,
    moosedesk_tickets,
    moosedesk_unique_customers,
    adoption_pct,
    total_requests
  };
}

function formatMonthLabel(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, 1));

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

function humanizeRequestType(requestType: string) {
  if (REQUEST_TYPE_LABELS[requestType]) {
    return REQUEST_TYPE_LABELS[requestType];
  }

  return requestType
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getStatus(adoption: number): "success" | "warning" | "danger" {
  if (adoption >= 80) {
    return "success";
  }

  if (adoption >= 50) {
    return "warning";
  }

  return "danger";
}

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

export function normalizeGoogleSheetsUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Paste a Google Sheets URL first.");
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("The sheet URL is not valid.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("The sheet URL must start with http:// or https://.");
  }

  const directCsv = url.pathname.endsWith(".csv") || url.searchParams.get("output") === "csv" || url.searchParams.get("format") === "csv";
  if (directCsv) {
    return url.toString();
  }

  if (url.hostname !== "docs.google.com") {
    throw new Error("Use a Google Sheets link or a direct CSV export link.");
  }

  const match = url.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error("Could not find a spreadsheet id in the provided URL.");
  }

  const spreadsheetId = match[1];
  const hashMatch = url.hash.match(/gid=(\d+)/);
  const gid = url.searchParams.get("gid") ?? hashMatch?.[1] ?? "0";

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

export function parseCustomerAdoptionText(text: string) {
  const rows = parseDelimitedText(text);
  return sortRows(rows);
}

function sortRows(rows: CustomerAdoptionRow[]) {
  return [...rows].sort((left, right) => {
    if (left.month === right.month) {
      return left.request_type.localeCompare(right.request_type);
    }

    return left.month.localeCompare(right.month);
  });
}

export function buildCustomerAdoptionAnalysis(inputRows: CustomerAdoptionRow[]): CustomerAdoptionAnalysis {
  const rows = sortRows(inputRows);

  if (!rows.length) {
    throw new Error("No rows were supplied for analysis.");
  }

  const requestTypes = Array.from(new Set(rows.map((row) => row.request_type)));
  const months = Array.from(new Set(rows.map((row) => row.month)));
  const featureLabels = Object.fromEntries(requestTypes.map((requestType) => [requestType, humanizeRequestType(requestType)]));

  const overview = rows.reduce(
    (accumulator, row) => {
      accumulator.totalAppRequests += row.app_requests;
      accumulator.totalAppUniqueCustomers += row.app_unique_customers;
      accumulator.totalMooseDeskTickets += row.moosedesk_tickets;
      accumulator.totalMooseDeskUniqueCustomers += row.moosedesk_unique_customers;
      accumulator.totalRequests += row.total_requests;
      return accumulator;
    },
    {
      totalAppRequests: 0,
      totalAppUniqueCustomers: 0,
      totalMooseDeskTickets: 0,
      totalMooseDeskUniqueCustomers: 0,
      totalRequests: 0,
      overallAdoption: 0,
      monthCount: months.length,
      featureCount: requestTypes.length
    }
  );

  overview.overallAdoption = overview.totalRequests === 0 ? 0 : round((overview.totalAppRequests / overview.totalRequests) * 100);

  const summaries = requestTypes
    .map((requestType) => {
      const featureRows = rows.filter((row) => row.request_type === requestType);
      const appRequests = featureRows.reduce((sum, row) => sum + row.app_requests, 0);
      const appUniqueCustomers = featureRows.reduce((sum, row) => sum + row.app_unique_customers, 0);
      const moosedeskTickets = featureRows.reduce((sum, row) => sum + row.moosedesk_tickets, 0);
      const moosedeskUniqueCustomers = featureRows.reduce((sum, row) => sum + row.moosedesk_unique_customers, 0);
      const totalRequests = featureRows.reduce((sum, row) => sum + row.total_requests, 0);
      const avgAdoption = round(featureRows.reduce((sum, row) => sum + row.adoption_pct, 0) / featureRows.length, 1);
      const weightedAdoption = totalRequests === 0 ? 0 : round((appRequests / totalRequests) * 100, 1);

      return {
        requestType,
        feature: featureLabels[requestType],
        avgAdoption,
        weightedAdoption,
        status: getStatus(avgAdoption),
        appRequests,
        appUniqueCustomers,
        moosedeskTickets,
        moosedeskUniqueCustomers,
        totalRequests,
        monthlyRows: featureRows.length
      } satisfies CustomerAdoptionSummary;
    })
    .sort((left, right) => right.avgAdoption - left.avgAdoption);

  const monthlyTotals = months.map((month) => {
    const monthRows = rows.filter((row) => row.month === month);
    const appRequests = monthRows.reduce((sum, row) => sum + row.app_requests, 0);
    const appUniqueCustomers = monthRows.reduce((sum, row) => sum + row.app_unique_customers, 0);
    const moosedeskTickets = monthRows.reduce((sum, row) => sum + row.moosedesk_tickets, 0);
    const moosedeskUniqueCustomers = monthRows.reduce((sum, row) => sum + row.moosedesk_unique_customers, 0);
    const totalRequests = monthRows.reduce((sum, row) => sum + row.total_requests, 0);

    return {
      month,
      label: formatMonthLabel(month),
      appRequests,
      appUniqueCustomers,
      moosedeskTickets,
      moosedeskUniqueCustomers,
      totalRequests,
      adoptionPct: totalRequests === 0 ? 0 : round((appRequests / totalRequests) * 100, 2)
    };
  });

  const trendSeries = months.map((month) => {
    const monthRows = rows.filter((row) => row.month === month);
    return monthRows.reduce<Record<string, string | number>>(
      (accumulator, row) => {
        accumulator[row.request_type] = row.adoption_pct;
        return accumulator;
      },
      { month, label: formatMonthLabel(month) }
    );
  });

  const breakdownRows = rows.map((row) => ({
    ...row,
    monthLabel: formatMonthLabel(row.month),
    feature: featureLabels[row.request_type]
  }));

  const bestFeature = summaries[0];
  const worstFeature = summaries[summaries.length - 1];
  const heaviestTicketMonth = [...monthlyTotals].sort((left, right) => right.moosedeskTickets - left.moosedeskTickets)[0];

  const insights: CustomerAdoptionInsight[] = [];

  if (worstFeature) {
    insights.push({
      tone: worstFeature.avgAdoption < 25 ? "danger" : "warning",
      title: `${worstFeature.feature} needs attention`,
      body: `${worstFeature.feature} averaged ${worstFeature.avgAdoption}% adoption with ${worstFeature.moosedeskTickets} manual tickets across the imported period.`
    });
  }

  if (bestFeature) {
    insights.push({
      tone: bestFeature.avgAdoption >= 85 ? "success" : "warning",
      title: `${bestFeature.feature} is the strongest journey`,
      body: `${bestFeature.feature} is leading at ${bestFeature.avgAdoption}% average adoption and can be used as the benchmark pattern for weaker flows.`
    });
  }

  if (heaviestTicketMonth) {
    insights.push({
      tone: heaviestTicketMonth.moosedeskTickets > heaviestTicketMonth.appRequests ? "warning" : "success",
      title: `${heaviestTicketMonth.label} carried the heaviest support load`,
      body: `${heaviestTicketMonth.label} generated ${heaviestTicketMonth.moosedeskTickets} MooseDesk tickets against ${heaviestTicketMonth.appRequests} app requests.`
    });
  }

  return {
    overview,
    summaries,
    monthlyTotals,
    trendSeries,
    breakdownRows,
    requestTypes,
    featureLabels,
    insights
  };
}
