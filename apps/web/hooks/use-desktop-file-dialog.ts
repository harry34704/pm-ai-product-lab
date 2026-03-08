"use client";

export function useDesktopFileDialog() {
  async function openFileDialog(extensions: string[]) {
    if (!window.mockroom?.files.openFileDialog) {
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

  return { openFileDialog, isDesktopBridgeAvailable: Boolean(window.mockroom?.files.openFileDialog) };
}
