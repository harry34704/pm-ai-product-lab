import { ipcMain, systemPreferences } from "electron";

export function registerPermissionHandlers() {
  ipcMain.handle("permissions:requestMicrophoneAccess", async () => {
    if (process.platform !== "darwin") {
      return "prompt";
    }

    const granted = await systemPreferences.askForMediaAccess("microphone");
    return granted ? "granted" : "denied";
  });
}
