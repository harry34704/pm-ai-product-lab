import { describe, expect, it } from "vitest";
import { validateUploadMetadata } from "../../apps/web/lib/uploads";

describe("upload validation", () => {
  it("accepts valid resume metadata", () => {
    expect(() =>
      validateUploadMetadata(
        {
          mimeType: "application/pdf",
          size: 1024
        },
        "resume"
      )
    ).not.toThrow();
  });

  it("rejects oversized uploads", () => {
    expect(() =>
      validateUploadMetadata(
        {
          mimeType: "text/plain",
          size: 6 * 1024 * 1024
        },
        "job"
      )
    ).toThrow(/under 5MB/i);
  });
});
