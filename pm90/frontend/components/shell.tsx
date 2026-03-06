"use client";

import type { ReactNode } from "react";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import type { UserSummary } from "@/lib/types";

export function AppShell({
  title,
  eyebrow,
  user,
  onLogout,
  children,
}: {
  title: string;
  eyebrow?: string;
  user?: UserSummary | null;
  onLogout?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <main className="min-h-screen flex-1 px-4 py-4 md:px-8 md:py-8">
          <Topbar title={title} eyebrow={eyebrow} user={user} onLogout={onLogout} />
          {children}
        </main>
      </div>
    </div>
  );
}
