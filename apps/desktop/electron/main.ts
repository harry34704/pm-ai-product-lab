import { app, session } from "electron";
import path from "node:path";
import { fork } from "node:child_process";
import { createMainWindow } from "./window";
import { registerSystemHandlers } from "./ipc/system";
import { registerFileHandlers } from "./ipc/files";
import { registerPermissionHandlers } from "./ipc/permissions";

let bundledServerProcess: ReturnType<typeof fork> | null = null;

function resolveBundledServerPath() {
  const candidates = [
    path.join(process.resourcesPath, "web", "apps", "web", "server.js"),
    path.join(process.resourcesPath, "web", "server.js")
  ];

  return candidates.find((candidate) => candidate);
}

async function waitForUrl(url: string, timeoutMs = 20000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // keep polling until timeout
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function getAppUrl() {
  if (process.env.ELECTRON_START_URL) {
    return process.env.ELECTRON_START_URL;
  }

  const serverPath = resolveBundledServerPath();
  if (!serverPath) {
    throw new Error("Could not locate bundled Next.js server.");
  }

  const port = process.env.PORT ?? "3111";
  bundledServerProcess = fork(serverPath, [], {
    cwd: path.dirname(serverPath),
    env: {
      ...process.env,
      PORT: port,
      HOSTNAME: "127.0.0.1"
    },
    silent: true
  });

  bundledServerProcess.on("error", (error) => {
    console.error("Bundled web server error", error);
  });

  const url = `http://127.0.0.1:${port}`;
  await waitForUrl(url);
  return url;
}

async function bootstrap() {
  await app.whenReady();

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === "media") {
      callback(true);
      return;
    }

    callback(false);
  });

  registerSystemHandlers();
  registerFileHandlers();
  registerPermissionHandlers();

  const window = createMainWindow();
  const appUrl = await getAppUrl();
  await window.loadURL(appUrl);

  app.on("activate", async () => {
    if (window.isDestroyed()) {
      const nextWindow = createMainWindow();
      await nextWindow.loadURL(appUrl);
    }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  bundledServerProcess?.kill();
  bundledServerProcess = null;
});

void bootstrap();
