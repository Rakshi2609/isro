import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { CopilotProvider } from "../context/CopilotContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ISRO MPLS Copilot",
  description: "Air-Gapped Predictive Network Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#090b14] text-slate-200">
        <CopilotProvider>
          {/* TOP NAVBAR */}
          <nav className="bg-[#0d111c] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 mr-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  IS
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                  NOC Copilot
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800/80">
                <Link href="/" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition-colors">
                  Overview
                </Link>
                <Link href="/diagnostics" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition-colors">
                  Diagnostics
                </Link>
                <Link href="/whatif" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition-colors">
                  Simulation
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-bold bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full text-slate-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                AIR-GAPPED
              </span>
            </div>
          </nav>

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col">{children}</main>
        </CopilotProvider>
      </body>
    </html>
  );
}
