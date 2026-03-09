type PresignedUpload = {
  key: string;
  url: string;
  method: "PUT";
  headers: Record<string, string>;
  storageProvider: string;
  storageBucket: string;
  storageUrl: string | null;
} | null;

export async function uploadFileToObjectStorage(file: File, kind: "resume" | "job"): Promise<PresignedUpload> {
  const response = await fetch("/api/storage/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      kind,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Could not create an object storage upload URL.");
  }

  if (!payload.upload) {
    return null;
  }

  const uploadResponse = await fetch(payload.upload.url, {
    method: payload.upload.method,
    headers: payload.upload.headers,
    body: file
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload to object storage failed.");
  }

  return payload.upload satisfies PresignedUpload;
}
