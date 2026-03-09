"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, FileText, Briefcase, SearchCheck, BookOpenText, Users, History, Settings, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customer-adoption", label: "Customer Adoption", icon: BarChart3 },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/story-bank", label: "Story Bank", icon: BookOpenText },
  { href: "/practice/new", label: "Practice Room", icon: Users },
  { href: "/sessions", label: "Sessions", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserCircle2 }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-border/70 bg-slate-950/35 px-5 py-6 lg:block">
      <div className="mb-8 rounded-2xl border border-border bg-slate-950/60 p-5">
        <p className="font-display text-xl font-semibold">MockRoom AI</p>
        <p className="mt-2 text-sm text-slate-400">Visible AI coaching for ethical interview rehearsal.</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-white",
                active && "bg-slate-900 text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <Link href="/analysis/new" className="mt-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          <SearchCheck className="h-4 w-4" />
          <span>Run Analysis</span>
        </Link>
      </nav>
    </aside>
  );
}
