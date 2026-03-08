"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./sidebar";
import { TopNav } from "./top-nav";

const AUTH_ROUTES = ["/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return <main className="grid min-h-screen place-items-center p-6">{children}</main>;
  }

  return (
    <div className="grid-pattern min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <AppSidebar />
        <div className="flex min-h-screen flex-col">
          <TopNav />
          <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
