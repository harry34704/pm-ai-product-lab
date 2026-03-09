import { fail, ok } from "@/lib/http";
import { normalizeGoogleSheetsUrl, parseCustomerAdoptionText } from "@/lib/customer-adoption";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { url?: string };
    const sourceUrl = payload.url?.trim();

    if (!sourceUrl) {
      return fail("A Google Sheets URL is required.");
    }

    const exportUrl = normalizeGoogleSheetsUrl(sourceUrl);
    const response = await fetch(exportUrl, {
      cache: "no-store",
      headers: {
        Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8"
      }
    });

    if (!response.ok) {
      return fail(`Unable to fetch the Google Sheet (${response.status}). Make sure the sheet is shared or published as CSV.`, 400);
    }

    const text = await response.text();
    const rows = parseCustomerAdoptionText(text);

    return ok({
      rows,
      exportUrl
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not import Google Sheet.");
  }
}
