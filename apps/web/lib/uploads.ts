import mammoth from "mammoth";
import pdf from "pdf-parse";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string[]> = {
  resume: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ],
  job: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ]
};

export function validateUpload(file: File, kind: keyof typeof ALLOWED_TYPES) {
  if (!ALLOWED_TYPES[kind].includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}.`);
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("File is too large. Keep uploads under 5MB.");
  }
}

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf") {
    const parsed = await pdf(buffer);
    return parsed.text.trim();
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value.trim();
  }

  return buffer.toString("utf8").replace(/\u0000/g, "").trim();
}

export function base64ToText(base64: string) {
  return Buffer.from(base64, "base64");
}
