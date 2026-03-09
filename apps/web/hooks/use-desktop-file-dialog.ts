"use client";

export function useDesktopFileDialog() {
  const isDesktopBridgeAvailable = typeof window !== "undefined" && Boolean(window.mockroom?.files.openFileDialog);

  async function openFileDialog(extensions: string[]) {
    if (!isDesktopBridgeAvailable || !window.mockroom?.files.openFileDialog) {
      return null;
    }

    return window.mockroom.files.openFileDialog({
      title: "Choose a file",
      filters: [
        {
          name: "Supported files",
          extensions
        }
      ]
    });
  }

  return { openFileDialog, isDesktopBridgeAvailable };
}
