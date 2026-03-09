export const runtime = "nodejs";

import { ok } from "@/lib/http";
import { getRuntimeFeatureStatus } from "@/lib/config";

export async function GET() {
  return ok({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: getRuntimeFeatureStatus()
  });
}
