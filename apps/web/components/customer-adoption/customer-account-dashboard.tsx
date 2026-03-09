"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Database,
  FileSpreadsheet,
  LineChart,
  Loader2,
  RefreshCcw,
  Table2,
  Upload
} from "lucide-react";
import { toast } from "sonner";
import { useDesktopFileDialog } from "@/hooks/use-desktop-file-dialog";
import {
  DEMO_CUSTOMER_ADOPTION_ROWS,
  buildCustomerAdoptionAnalysis,
  parseCustomerAdoptionText,
  type CustomerAdoptionInsight,
  type CustomerAdoptionRow,
  type CustomerAdoptionSummary
} from "@/lib/customer-adoption";

type DashboardTab = "overview" | "trends" | "volume" | "breakdown";

const FEATURE_PALETTE = ["#4f46e5", "#0f766e", "#f59e0b", "#f97316", "#dc2626", "#0891b2", "#7c3aed", "#65a30d"];
const STATUS_COLORS = {
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444"
} as const;

const REQUIRED_COLUMNS_TEXT =
  "month, request_type, app_requests, app_unique_customers, moosedesk_tickets, moosedesk_unique_customers, adoption_pct, total_requests";

function formatPercent(value: number) {
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function roundUp(value: number, step: number) {
  if (value <= 0) {
    return step;
  }

  return Math.ceil(value / step) * step;
}

function decodeBase64Text(dataBase64: string) {
  const binary = atob(dataBase64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function StatusBadge({ status }: { status: CustomerAdoptionSummary["status"] }) {
  const Icon = status === "success" ? CheckCircle2 : status === "warning" ? AlertTriangle : CircleAlert;
  const label = status === "success" ? "Healthy" : status === "warning" ? "Monitor" : "Action Required";

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        status === "success" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
        status === "warning" && "bg-amber-50 text-amber-700 ring-amber-200",
        status === "danger" && "bg-red-50 text-red-700 ring-red-200"
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function TonePanel({ insight }: { insight: CustomerAdoptionInsight }) {
  const Icon = insight.tone === "success" ? CheckCircle2 : insight.tone === "warning" ? AlertTriangle : CircleAlert;

  return (
    <div
      className={[
        "rounded-2xl border p-4",
        insight.tone === "success" && "border-emerald-200 bg-emerald-50",
        insight.tone === "warning" && "border-amber-200 bg-amber-50",
        insight.tone === "danger" && "border-red-200 bg-red-50"
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex items-center gap-2 text-sm font-semibold",
          insight.tone === "success" && "text-emerald-700",
          insight.tone === "warning" && "text-amber-700",
          insight.tone === "danger" && "text-red-700"
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Icon className="h-4 w-4" />
        {insight.title}
      </div>
      <p
        className={[
          "mt-2 text-sm",
          insight.tone === "success" && "text-emerald-600",
          insight.tone === "warning" && "text-amber-600",
          insight.tone === "danger" && "text-red-600"
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {insight.body}
      </p>
    </div>
  );
}

function AdoptionBar({ pct, status }: { pct: number; status: CustomerAdoptionSummary["status"] }) {
  return (
    <div className="mt-2 h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[status] }} />
    </div>
  );
}

function KpiCard({ summary, color }: { summary: CustomerAdoptionSummary; color: string }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Request Type</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{summary.feature}</p>
        </div>
        <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-white" style={{ backgroundColor: color }}>
          {summary.monthlyRows} mo
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold tracking-tight" style={{ color: STATUS_COLORS[summary.status] }}>
            {formatPercent(summary.avgAdoption)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Average monthly adoption</p>
        </div>
        <StatusBadge status={summary.status} />
      </div>
      <AdoptionBar pct={summary.avgAdoption} status={summary.status} />
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-slate-600">
          <span className="block text-slate-400">App requests</span>
          <span className="mt-1 block font-semibold text-slate-900">{formatNumber(summary.appRequests)}</span>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-slate-600">
          <span className="block text-slate-400">Tickets</span>
          <span className="mt-1 block font-semibold text-slate-900">{formatNumber(summary.moosedeskTickets)}</span>
        </div>
      </div>
    </article>
  );
}

function OverviewBars({ summaries }: { summaries: CustomerAdoptionSummary[] }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-4 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span>Feature</span>
        <span className="text-right">Adoption</span>
      </div>
      {summaries.map((summary) => (
        <div key={summary.requestType} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{summary.feature}</p>
                <StatusBadge status={summary.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {formatNumber(summary.appRequests)} app requests against {formatNumber(summary.moosedeskTickets)} MooseDesk tickets
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold tracking-tight" style={{ color: STATUS_COLORS[summary.status] }}>
                {formatPercent(summary.avgAdoption)}
              </p>
              <p className="text-xs text-slate-500">{formatPercent(summary.weightedAdoption)} weighted adoption</p>
            </div>
          </div>
          <AdoptionBar pct={summary.avgAdoption} status={summary.status} />
        </div>
      ))}
    </div>
  );
}

function TrendChart({
  series,
  requestTypes,
  featureLabels,
  featureColors
}: {
  series: Array<Record<string, string | number>>;
  requestTypes: string[];
  featureLabels: Record<string, string>;
  featureColors: Record<string, string>;
}) {
  const width = 760;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 44, left: 48 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const yTicks = [0, 25, 50, 75, 100];
  const xForIndex = (index: number) => padding.left + (plotWidth * index) / Math.max(series.length - 1, 1);
  const yForValue = (value: number) => padding.top + plotHeight - (value / 100) * plotHeight;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {requestTypes.map((requestType) => (
          <span key={requestType} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: featureColors[requestType] }} />
            {featureLabels[requestType]}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[680px] w-full">
          {yTicks.map((tick) => {
            const y = yForValue(tick);
            return (
              <g key={tick}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
                <text x={padding.left - 12} y={y + 4} fill="#94a3b8" fontSize="11" textAnchor="end">
                  {tick}%
                </text>
              </g>
            );
          })}

          {series.map((point, index) => {
            const x = xForIndex(index);
            return (
              <text key={`${point.label}`} x={x} y={height - 12} fill="#64748b" fontSize="11" textAnchor="middle">
                {String(point.label)}
              </text>
            );
          })}

          {requestTypes.map((requestType) => {
            const polyline = series
              .map((point, index) => `${xForIndex(index)},${yForValue(Number(point[requestType] ?? 0))}`)
              .join(" ");

            return (
              <g key={requestType}>
                <polyline
                  fill="none"
                  stroke={featureColors[requestType]}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  points={polyline}
                />
                {series.map((point, index) => {
                  const x = xForIndex(index);
                  const y = yForValue(Number(point[requestType] ?? 0));

                  return (
                    <circle key={`${requestType}-${point.month}`} cx={x} cy={y} r="5" fill={featureColors[requestType]} stroke="#fff" strokeWidth="3">
                      <title>{`${featureLabels[requestType]} · ${String(point.label)}: ${formatPercent(Number(point[requestType] ?? 0))}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function VolumeChart({
  rows,
  feature,
  featureLabel
}: {
  rows: CustomerAdoptionRow[];
  feature: string;
  featureLabel: string;
}) {
  const featureRows = rows.filter((row) => row.request_type === feature);
  const width = 760;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 44, left: 52 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const groupWidth = plotWidth / Math.max(featureRows.length, 1);
  const barWidth = Math.min(42, groupWidth * 0.24);
  const maxValue = roundUp(
    Math.max(...featureRows.flatMap((row) => [row.app_requests, row.moosedesk_tickets]), 0),
    10
  );
  const yTicks = Array.from({ length: 5 }, (_, index) => (maxValue / 4) * index);
  const yForValue = (value: number) => padding.top + plotHeight - (value / maxValue) * plotHeight;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-indigo-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">App Requests</p>
          <p className="mt-2 text-2xl font-bold text-indigo-950">{formatNumber(featureRows.reduce((sum, row) => sum + row.app_requests, 0))}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-rose-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">MooseDesk Tickets</p>
          <p className="mt-2 text-2xl font-bold text-rose-950">{formatNumber(featureRows.reduce((sum, row) => sum + row.moosedesk_tickets, 0))}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">Average Adoption</p>
          <p className="mt-2 text-2xl font-bold text-emerald-950">
            {formatPercent(featureRows.reduce((sum, row) => sum + row.adoption_pct, 0) / Math.max(featureRows.length, 1))}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          Customer Account App
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          MooseDesk Tickets
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
          {featureLabel}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[680px] w-full">
          {yTicks.map((tick) => {
            const y = yForValue(tick);
            return (
              <g key={tick}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
                <text x={padding.left - 12} y={y + 4} fill="#94a3b8" fontSize="11" textAnchor="end">
                  {formatNumber(tick)}
                </text>
              </g>
            );
          })}

          {featureRows.map((row, index) => {
            const baseX = padding.left + groupWidth * index + (groupWidth - barWidth * 2 - 10) / 2;
            const appHeight = plotHeight - (yForValue(row.app_requests) - padding.top);
            const mdHeight = plotHeight - (yForValue(row.moosedesk_tickets) - padding.top);

            return (
              <g key={`${row.month}-${row.request_type}`}>
                <rect x={baseX} y={yForValue(row.app_requests)} width={barWidth} height={appHeight} rx="8" fill="#4f46e5">
                  <title>{`${row.month} app volume: ${formatNumber(row.app_requests)}`}</title>
                </rect>
                <rect x={baseX + barWidth + 10} y={yForValue(row.moosedesk_tickets)} width={barWidth} height={mdHeight} rx="8" fill="#ef4444">
                  <title>{`${row.month} MooseDesk volume: ${formatNumber(row.moosedesk_tickets)}`}</title>
                </rect>
                <text x={padding.left + groupWidth * index + groupWidth / 2} y={height - 12} fill="#64748b" fontSize="11" textAnchor="middle">
                  {row.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function CustomerAccountDashboard() {
  const [rows, setRows] = useState<CustomerAdoptionRow[]>(DEMO_CUSTOMER_ADOPTION_ROWS);
  const [sourceLabel, setSourceLabel] = useState("Demo dataset");
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [selectedFeature, setSelectedFeature] = useState("payment_dispute");
  const [sheetUrl, setSheetUrl] = useState("");
  const [pasteData, setPasteData] = useState("");
  const [sheetPending, setSheetPending] = useState(false);
  const [textPending, setTextPending] = useState(false);
  const [filePending, setFilePending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openFileDialog, isDesktopBridgeAvailable } = useDesktopFileDialog();

  const analysis = buildCustomerAdoptionAnalysis(rows);
  const orderedRequestTypes = analysis.summaries.map((summary) => summary.requestType);
  const activeFeature = orderedRequestTypes.includes(selectedFeature) ? selectedFeature : orderedRequestTypes[0];
  const featureColors = Object.fromEntries(orderedRequestTypes.map((requestType, index) => [requestType, FEATURE_PALETTE[index % FEATURE_PALETTE.length]]));

  function applyRows(nextRows: CustomerAdoptionRow[], nextSource: string) {
    const nextAnalysis = buildCustomerAdoptionAnalysis(nextRows);
    setRows(nextRows);
    setSourceLabel(nextSource);
    setSelectedFeature(nextAnalysis.summaries[0]?.requestType ?? "");
  }

  function importText(text: string, nextSource: string) {
    const nextRows = parseCustomerAdoptionText(text);
    applyRows(nextRows, nextSource);
    toast.success(`Imported ${nextRows.length} rows from ${nextSource}.`);
  }

  async function handleSheetImport() {
    try {
      setSheetPending(true);
      const response = await fetch("/api/customer-adoption/import-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: sheetUrl })
      });
      const payload = (await response.json()) as { error?: string; rows?: CustomerAdoptionRow[] };

      if (!response.ok || !payload.rows) {
        throw new Error(payload.error ?? "Could not import Google Sheet.");
      }

      applyRows(payload.rows, "Google Sheets import");
      toast.success("Google Sheet imported.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not import Google Sheet.");
    } finally {
      setSheetPending(false);
    }
  }

  async function handlePasteImport() {
    try {
      setTextPending(true);
      importText(pasteData, "pasted data");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not parse pasted data.");
    } finally {
      setTextPending(false);
    }
  }

  async function handleDesktopFileImport() {
    try {
      setFilePending(true);
      const file = await openFileDialog(["csv", "tsv", "txt"]);
      if (!file) {
        return;
      }

      const text = decodeBase64Text(file.dataBase64);
      importText(text, file.name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not import file.");
    } finally {
      setFilePending(false);
    }
  }

  async function handleBrowserFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setFilePending(true);
      const text = await file.text();
      importText(text, file.name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not import file.");
    } finally {
      event.target.value = "";
      setFilePending(false);
    }
  }

  function handleUploadTrigger() {
    if (isDesktopBridgeAvailable) {
      void handleDesktopFileImport();
      return;
    }

    fileInputRef.current?.click();
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_28%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_48%,_#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_32px_90px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Standalone Local Tool</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Customer Account Adoption Analyzer</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Import a Google Sheet, paste TSV rows from Sheets, or load a local CSV file to analyze app adoption versus MooseDesk support demand.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-700">{analysis.overview.monthCount} months loaded</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">{analysis.overview.featureCount} request types</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{formatPercent(analysis.overview.overallAdoption)} overall adoption</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">App Requests</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(analysis.overview.totalAppRequests)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">App Unique Customers</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(analysis.overview.totalAppUniqueCustomers)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">MooseDesk Tickets</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(analysis.overview.totalMooseDeskTickets)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ticket Unique Customers</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(analysis.overview.totalMooseDeskUniqueCustomers)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Import Google Sheets</h2>
                  <p className="text-xs text-slate-500">Use a standard share link or direct CSV export URL.</p>
                </div>
              </div>
              <input
                value={sheetUrl}
                onChange={(event) => setSheetUrl(event.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="mt-4 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={() => void handleSheetImport()}
                disabled={sheetPending}
                className="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sheetPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                Import Sheet
              </button>
              <p className="mt-3 text-xs text-slate-500">The sheet must be accessible without login to the local app process.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-emerald-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Import CSV or TSV</h2>
                  <p className="text-xs text-slate-500">{isDesktopBridgeAvailable ? "Native desktop file picker is available." : "Browser file upload is available."}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUploadTrigger}
                disabled={filePending}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {filePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Choose File
              </button>
              <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,text/csv,text/plain" className="hidden" onChange={handleBrowserFileChange} />
              <p className="mt-3 text-xs text-slate-500">Paste-friendly TSV exports from Google Sheets and normal CSVs are both supported.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <Table2 className="h-5 w-5 text-amber-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Paste Data Directly</h2>
                  <p className="text-xs text-slate-500">Useful when you copy rows straight out of Google Sheets.</p>
                </div>
              </div>
              <textarea
                value={pasteData}
                onChange={(event) => setPasteData(event.target.value)}
                placeholder={"month\trequest_type\tapp_requests\t..."}
                className="mt-4 min-h-[136px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-400"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handlePasteImport()}
                  disabled={textPending}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {textPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Table2 className="h-4 w-4" />}
                  Analyze Pasted Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyRows(DEMO_CUSTOMER_ADOPTION_ROWS, "Demo dataset");
                    toast.success("Loaded demo dataset.");
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Load Demo Data
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current Dataset</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{sourceLabel}</p>
              <p className="mt-1 text-sm text-slate-500">
                {formatNumber(rows.length)} rows loaded across {analysis.overview.monthCount} months. Expected columns: {REQUIRED_COLUMNS_TEXT}.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {analysis.monthlyTotals.map((month) => (
                <span key={month.month} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600">
                  {month.label}: {formatPercent(month.adoptionPct)}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {analysis.summaries.map((summary, index) => (
            <KpiCard key={summary.requestType} summary={summary} color={featureColors[summary.requestType] ?? FEATURE_PALETTE[index % FEATURE_PALETTE.length]} />
          ))}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1">
            {[
              { key: "overview", label: "Overview" },
              { key: "trends", label: "Trends" },
              { key: "volume", label: "Volume" },
              { key: "breakdown", label: "Data Breakdown" }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as DashboardTab)}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-medium transition",
                  activeTab === tab.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <div className="mb-5 flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-slate-500" />
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Average Adoption by Request Type</h2>
                    <p className="text-xs text-slate-500">Average monthly adoption is used for the status signal.</p>
                  </div>
                </div>
                <OverviewBars summaries={analysis.summaries} />
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                  <h2 className="text-sm font-semibold text-slate-900">Key Findings</h2>
                  <div className="mt-4 space-y-3">
                    {analysis.insights.map((insight) => (
                      <TonePanel key={insight.title} insight={insight} />
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                  <h2 className="text-sm font-semibold text-slate-900">Monthly Rollup</h2>
                  <div className="mt-4 space-y-3">
                    {analysis.monthlyTotals.map((month) => (
                      <div key={month.month} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{month.label}</p>
                            <p className="text-xs text-slate-500">{formatNumber(month.totalRequests)} total requests</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-950">{formatPercent(month.adoptionPct)}</p>
                            <p className="text-xs text-slate-500">{formatNumber(month.moosedeskTickets)} tickets</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "trends" ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
              <div className="mb-5 flex items-center gap-3">
                <LineChart className="h-5 w-5 text-slate-500" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Monthly Adoption Trends</h2>
                  <p className="text-xs text-slate-500">Every request type found in the imported dataset is plotted automatically.</p>
                </div>
              </div>
              <TrendChart
                series={analysis.trendSeries}
                requestTypes={orderedRequestTypes}
                featureLabels={analysis.featureLabels}
                featureColors={featureColors}
              />
            </div>
          ) : null}

          {activeTab === "volume" && activeFeature ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">App vs MooseDesk Volume</h2>
                  <p className="text-xs text-slate-500">Switch request type to inspect monthly volume and support load.</p>
                </div>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  Request type
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                    value={activeFeature}
                    onChange={(event) => setSelectedFeature(event.target.value)}
                  >
                    {analysis.summaries.map((summary) => (
                      <option key={summary.requestType} value={summary.requestType}>
                        {summary.feature}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <VolumeChart rows={rows} feature={activeFeature} featureLabel={analysis.featureLabels[activeFeature]} />
            </div>
          ) : null}

          {activeTab === "breakdown" ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <h2 className="text-sm font-semibold text-slate-900">Monthly Totals</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Month</th>
                        <th className="px-4 py-3">App</th>
                        <th className="px-4 py-3">Tickets</th>
                        <th className="px-4 py-3">Adoption</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {analysis.monthlyTotals.map((month) => (
                        <tr key={month.month}>
                          <td className="px-4 py-3 font-medium text-slate-900">{month.label}</td>
                          <td className="px-4 py-3 text-slate-600">{formatNumber(month.appRequests)}</td>
                          <td className="px-4 py-3 text-slate-600">{formatNumber(month.moosedeskTickets)}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{formatPercent(month.adoptionPct)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <h2 className="text-sm font-semibold text-slate-900">Imported Rows</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="max-h-[520px] overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Month</th>
                          <th className="px-4 py-3">Request Type</th>
                          <th className="px-4 py-3">App</th>
                          <th className="px-4 py-3">App Unique</th>
                          <th className="px-4 py-3">Tickets</th>
                          <th className="px-4 py-3">Ticket Unique</th>
                          <th className="px-4 py-3">Adoption</th>
                          <th className="px-4 py-3">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {[...analysis.breakdownRows].reverse().map((row) => (
                          <tr key={`${row.month}-${row.request_type}`}>
                            <td className="px-4 py-3 font-medium text-slate-900">{row.monthLabel}</td>
                            <td className="px-4 py-3 text-slate-600">{row.feature}</td>
                            <td className="px-4 py-3 text-slate-600">{formatNumber(row.app_requests)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatNumber(row.app_unique_customers)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatNumber(row.moosedesk_tickets)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatNumber(row.moosedesk_unique_customers)}</td>
                            <td className="px-4 py-3 font-semibold text-slate-900">{formatPercent(row.adoption_pct)}</td>
                            <td className="px-4 py-3 text-slate-600">{formatNumber(row.total_requests)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </section>
  );
}
