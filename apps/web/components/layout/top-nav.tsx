"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { MonitorSmartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pageLabel = pathname.replace(/[-/]/g, " ").trim() || "dashboard";

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-border/70 bg-slate-950/45 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Practice Mode</p>
        <p className="mt-1 font-display text-xl font-semibold capitalize">{pageLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-slate-900/80 px-3 py-2 text-xs text-slate-400 md:flex">
          <MonitorSmartphone className="h-4 w-4 text-accent" />
          Desktop-first shell active
        </div>
        <Button variant="ghost" size="sm" onClick={logout} disabled={pending}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
