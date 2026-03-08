import { app, ipcMain } from "electron";

export function registerSystemHandlers() {
  ipcMain.handle("system:getAppInfo", async () => ({
    name: app.getName(),
    version: app.getVersion(),
    userDataPath: app.getPath("userData")
  }));
}
