import mammoth from "mammoth";
import pdf from "pdf-parse";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export const ALLOWED_TYPES: Record<string, string[]> = {
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

export function validateUploadMetadata(input: { mimeType: string; size: number }, kind: keyof typeof ALLOWED_TYPES) {
  if (!ALLOWED_TYPES[kind].includes(input.mimeType)) {
    throw new Error(`Unsupported file type: ${input.mimeType || "unknown"}.`);
  }

  if (input.size > MAX_UPLOAD_SIZE) {
    throw new Error("File is too large. Keep uploads under 5MB.");
  }
}

export function validateUpload(file: File, kind: keyof typeof ALLOWED_TYPES) {
  validateUploadMetadata(
    {
      mimeType: file.type,
      size: file.size
    },
    kind
  );
}

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string) {
  if (mimeType === "application/pdf") {
    const parsed = await pdf(buffer);
    return parsed.text.trim();
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value.trim();
  }

  return buffer.toString("utf8").replace(/\u0000/g, "").trim();
}

export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return extractTextFromBuffer(buffer, file.type);
}

export function base64ToText(base64: string) {
  return Buffer.from(base64, "base64");
}
