import { dialog, ipcMain } from "electron";
import { promises as fs } from "node:fs";

export function registerFileHandlers() {
  ipcMain.handle("files:openFileDialog", async (_event, options?: { title?: string; filters?: { name: string; extensions: string[] }[] }) => {
    const result = await dialog.showOpenDialog({
      title: options?.title ?? "Choose a file",
      properties: ["openFile"],
      filters: options?.filters
    });

    if (result.canceled || !result.filePaths[0]) {
      return null;
    }

    const filePath = result.filePaths[0];
    const fileBuffer = await fs.readFile(filePath);
    const stats = await fs.stat(filePath);
    const name = filePath.split("/").pop() ?? "file";
    const extension = name.split(".").pop()?.toLowerCase();
    const mimeType =
      extension === "pdf"
        ? "application/pdf"
        : extension === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "text/plain";

    return {
      name,
      path: filePath,
      mimeType,
      size: stats.size,
      dataBase64: fileBuffer.toString("base64")
    };
  });
}
