import { BrowserWindow, shell } from "electron";
import path from "node:path";

export function createMainWindow() {
  const preloadPath = path.join(__dirname, "preload.js");

  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1200,
    minHeight: 760,
    show: false,
    title: "MockRoom AI",
    backgroundColor: "#0b1020",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  return window;
}
