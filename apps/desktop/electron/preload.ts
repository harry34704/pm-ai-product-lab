import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("mockroom", {
  system: {
    getAppInfo: () => ipcRenderer.invoke("system:getAppInfo")
  },
  files: {
    openFileDialog: (options?: { title?: string; filters?: { name: string; extensions: string[] }[] }) =>
      ipcRenderer.invoke("files:openFileDialog", options)
  },
  permissions: {
    requestMicrophoneAccess: () => ipcRenderer.invoke("permissions:requestMicrophoneAccess")
  }
});
