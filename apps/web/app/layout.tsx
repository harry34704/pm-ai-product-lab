import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans"
});

export const metadata: Metadata = {
  title: "MockRoom AI",
  description: "Ethical AI-powered interview rehearsal platform for visible practice sessions."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
