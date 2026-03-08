import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const staticSource = join(root, ".next", "static");
const staticTarget = join(standaloneDir, ".next", "static");
const publicSource = join(root, "public");
const publicTarget = join(standaloneDir, "public");

if (!existsSync(standaloneDir)) {
  console.error("Missing .next/standalone. Run `npm run build` first.");
  process.exit(1);
}

mkdirSync(join(standaloneDir, ".next"), { recursive: true });

if (existsSync(staticTarget)) {
  rmSync(staticTarget, { recursive: true, force: true });
}
if (existsSync(staticSource)) {
  cpSync(staticSource, staticTarget, { recursive: true });
}

if (existsSync(publicTarget)) {
  rmSync(publicTarget, { recursive: true, force: true });
}
if (existsSync(publicSource)) {
  cpSync(publicSource, publicTarget, { recursive: true });
}

const server = spawn(process.execPath, [join(standaloneDir, "server.js")], {
  stdio: "inherit",
  env: process.env,
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
