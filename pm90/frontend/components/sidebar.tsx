"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/mentor", label: "AI Mentor" },
  { href: "/simulations", label: "Simulations" },
  { href: "/analytics", label: "Analytics" },
  { href: "/artifacts", label: "Portfolio" },
  { href: "/community", label: "Community" },
  { href: "/resources", label: "Resources" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="grid-dots sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/60 px-6 py-8 backdrop-blur xl:block">
      <Link href="/" className="mb-10 block">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/70">PM90</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Product mastery in 90 days.</h1>
      </Link>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl border px-4 py-3 text-sm transition ${
                active
                  ? "border-cyan-300/40 bg-cyan-400/10 text-white shadow-[0_0_0_1px_rgba(76,226,198,0.12)]"
                  : "border-white/5 bg-white/5 text-slate-300 hover:border-white/10 hover:bg-white/8 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">System</p>
        <p className="mt-3">Daily lessons, AI feedback loops, portfolio artifacts, and PM simulations in one workspace.</p>
      </div>
    </aside>
  );
}
