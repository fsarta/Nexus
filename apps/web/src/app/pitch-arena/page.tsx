"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Tab = "upcoming" | "live" | "past";
interface Pitch { id: string; startup: string; founder: string; tagline: string; stage: string; askAmount: string; time: string; votes: number; viewers: number; status: "upcoming" | "live" | "completed"; logo: string; }

const pitches: Pitch[] = [
    { id: "pa1", startup: "MedAssist", founder: "Dr. Maria Lopez", tagline: "AI diagnostic assistant for clinicians", stage: "Pre-Seed", askAmount: "€1.5M", time: "Today, 3:00 PM CET", votes: 0, viewers: 0, status: "upcoming", logo: "🏥" },
    { id: "pa2", startup: "FinScope", founder: "Tom Baker", tagline: "Embedded finance for SaaS platforms", stage: "Series A", askAmount: "€15M", time: "Today, 4:30 PM CET", votes: 0, viewers: 0, status: "upcoming", logo: "💳" },
    { id: "pa3", startup: "CleanEnergy.ai", founder: "Raj Patel", tagline: "AI-powered renewable energy optimization", stage: "Seed", askAmount: "€4M", time: "LIVE NOW", votes: 342, viewers: 1247, status: "live", logo: "⚡" },
    { id: "pa4", startup: "DataPipeline.io", founder: "Alex Kim", tagline: "Real-time data processing made simple", stage: "Series B", askAmount: "€42M", time: "March 2, 2026", votes: 567, viewers: 3420, status: "completed", logo: "📊" },
    { id: "pa5", startup: "EduNext", founder: "James Park", tagline: "Personalized learning at global scale", stage: "Seed", askAmount: "€3M", time: "Feb 28, 2026", votes: 289, viewers: 2180, status: "completed", logo: "📚" },
];

export default function PitchArenaPage() {
    const [tab, setTab] = useState<Tab>("live");
    const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(pitches.find(p => p.status === "live") || null);
    const filtered = tab === "live" ? pitches.filter(p => p.status === "live") : tab === "upcoming" ? pitches.filter(p => p.status === "upcoming") : pitches.filter(p => p.status === "completed");

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">🏟️ Pitch Arena</span>
                <div className="ml-auto flex gap-3">
                    <button className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Apply to Pitch</button>
                </div>
            </header>
            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16">
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {(["live", "upcoming", "past"] as const).map(t => (
                        <button key={t} onClick={() => { setTab(t); setSelectedPitch(null); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>
                            {t === "live" ? <span>🔴 Live Now</span> : t}{t === "live" && ` (${pitches.filter(p => p.status === "live").length})`}
                        </button>
                    ))}
                </div>

                {selectedPitch ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <button onClick={() => setSelectedPitch(null)} className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">← Back to all pitches</button>
                        {/* Stage View */}
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-[oklch(0.15_0.05_260)] to-[oklch(0.10_0.03_280)] flex items-center justify-center relative">
                                <div className="text-center">
                                    <span className="text-6xl">{selectedPitch.logo}</span>
                                    <h2 className="text-2xl font-bold mt-4">{selectedPitch.startup}</h2>
                                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{selectedPitch.tagline}</p>
                                    {selectedPitch.status === "live" && <div className="mt-4"><span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold animate-pulse">🔴 LIVE</span></div>}
                                </div>
                                {selectedPitch.status === "live" && <div className="absolute top-4 right-4 flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]"><span>👁 {selectedPitch.viewers.toLocaleString()} watching</span><span>🗳️ {selectedPitch.votes} votes</span></div>}
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-xs text-[var(--color-text-tertiary)]">Asking</p><p className="text-sm font-bold gradient-text">{selectedPitch.askAmount}</p></div>
                                    <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-xs text-[var(--color-text-tertiary)]">Stage</p><p className="text-sm font-bold">{selectedPitch.stage}</p></div>
                                    <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-xs text-[var(--color-text-tertiary)]">Founder</p><p className="text-sm font-bold">{selectedPitch.founder}</p></div>
                                    <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-xs text-[var(--color-text-tertiary)]">Votes</p><p className="text-sm font-bold text-[var(--color-success)]">{selectedPitch.votes}</p></div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">🗳️ Vote for this Startup</button>
                                    <button className="px-6 py-3 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">💬 Ask a Question</button>
                                    <button className="px-6 py-3 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">📤 Share</button>
                                </div>
                            </div>
                        </div>
                        {/* Q&A */}
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-3">Live Q&A</h3>
                            {[{ q: "What's your current burn rate?", by: "Investor A", time: "2m ago", upvotes: 24 }, { q: "How do you differentiate from existing solutions?", by: "Investor B", time: "5m ago", upvotes: 18 }, { q: "What's your go-to-market strategy?", by: "Community", time: "8m ago", upvotes: 31 }].map((qa, i) => (
                                <div key={i} className="flex gap-3 py-3 border-b border-[var(--color-border-default)] last:border-0">
                                    <button className="flex flex-col items-center text-[10px] text-[var(--color-text-tertiary)] hover:text-[oklch(0.72_0.18_190)]"><span>▲</span><span className="font-bold">{qa.upvotes}</span></button>
                                    <div><p className="text-sm">{qa.q}</p><p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">by {qa.by} · {qa.time}</p></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((p, i) => (
                            <motion.button key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedPitch(p)}
                                className="w-full text-left rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5 flex items-center gap-4 hover:border-[var(--color-border-hover)] transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-2xl">{p.logo}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2"><h3 className="text-sm font-semibold">{p.startup}</h3>{p.status === "live" && <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-red-500/20 text-red-400 animate-pulse">LIVE</span>}<span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)]">{p.stage}</span></div>
                                    <p className="text-[11px] text-[var(--color-text-tertiary)]">{p.tagline}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">👤 {p.founder} · 🕐 {p.time}</p>
                                </div>
                                <div className="text-right"><p className="text-sm font-bold gradient-text">{p.askAmount}</p>{p.votes > 0 && <p className="text-[10px] text-[var(--color-text-tertiary)]">🗳️ {p.votes} · 👁 {p.viewers.toLocaleString()}</p>}</div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
