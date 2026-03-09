"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDesktopFileDialog } from "@/hooks/use-desktop-file-dialog";
import { uploadFileToObjectStorage } from "@/lib/client-upload";

export function ResumeUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { openFileDialog, isDesktopBridgeAvailable } = useDesktopFileDialog();
  const [pending, setPending] = useState(false);

  async function uploadFile(file: File) {
    setPending(true);
    try {
      const upload = await uploadFileToObjectStorage(file, "resume");
      let response: Response;

      if (upload) {
        response = await fetch("/api/resumes/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            storageKey: upload.key,
            originalFileName: file.name,
            mimeType: file.type || "application/octet-stream",
            fileSizeBytes: file.size,
            storageProvider: upload.storageProvider,
            storageBucket: upload.storageBucket,
            storageUrl: upload.storageUrl
          })
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("/api/resumes/upload", { method: "POST", body: formData });
      }
      const payload = await response.json();
      setPending(false);

      if (!response.ok) {
        toast.error(payload.error ?? "Resume upload failed.");
        return;
      }

      toast.success("Resume uploaded.");
      router.push(`/resumes/${payload.resume.id}`);
      router.refresh();
    } catch (error) {
      setPending(false);
      toast.error(error instanceof Error ? error.message : "Resume upload failed.");
    }
  }

  async function onDesktopDialog() {
    const selected = await openFileDialog(["pdf", "docx", "txt"]);
    if (!selected) {
      return;
    }

    const bytes = Uint8Array.from(atob(selected.dataBase64), (char) => char.charCodeAt(0));
    const file = new File([bytes], selected.name, { type: selected.mimeType || "text/plain" });
    await uploadFile(file);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload resume</CardTitle>
        <CardDescription>Supports PDF, DOCX, and TXT files. Parsed sections stay editable after upload.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input ref={inputRef} type="file" accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => event.target.files?.[0] && uploadFile(event.target.files[0])} />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => inputRef.current?.click()} disabled={pending}>
            <Upload className="mr-2 h-4 w-4" />
            {pending ? "Uploading..." : "Choose file"}
          </Button>
          {isDesktopBridgeAvailable ? (
            <Button variant="secondary" onClick={onDesktopDialog} disabled={pending}>
              <Monitor className="mr-2 h-4 w-4" />
              Use desktop dialog
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
