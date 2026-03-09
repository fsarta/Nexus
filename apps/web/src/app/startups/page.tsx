"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const startups = [
    {
        id: "s1", name: "Nexus", tagline: "The Career Operating System", stage: "Series A", funding: "$25M", industry: "HR Tech", team: 12, founded: "2024", logo: "N",
        metrics: { mrr: "$180K", growth: "30% MoM", users: "50K", nps: 78 }, tags: ["AI", "B2B", "SaaS"]
    },
    {
        id: "s2", name: "CleanEnergy.ai", tagline: "AI-powered renewable energy optimization", stage: "Seed", funding: "$4M", industry: "CleanTech", team: 8, founded: "2025", logo: "⚡",
        metrics: { mrr: "$45K", growth: "22% MoM", users: "120", nps: 85 }, tags: ["AI", "CleanTech", "B2B"]
    },
    {
        id: "s3", name: "DataPipeline.io", tagline: "Real-time data processing made simple", stage: "Series B", funding: "$42M", industry: "Data Infra", team: 65, founded: "2022", logo: "📊",
        metrics: { mrr: "$520K", growth: "18% MoM", users: "2.4K", nps: 72 }, tags: ["Data", "DevTools", "B2B"]
    },
    {
        id: "s4", name: "MedAssist", tagline: "AI diagnostic assistant for clinicians", stage: "Pre-Seed", funding: "$800K", industry: "HealthTech", team: 4, founded: "2025", logo: "🏥",
        metrics: { mrr: "$8K", growth: "45% MoM", users: "35", nps: 91 }, tags: ["AI", "Healthcare", "B2B"]
    },
    {
        id: "s5", name: "FinScope", tagline: "Embedded finance for SaaS platforms", stage: "Series A", funding: "$15M", industry: "FinTech", team: 28, founded: "2023", logo: "💳",
        metrics: { mrr: "$290K", growth: "25% MoM", users: "890", nps: 68 }, tags: ["Fintech", "API", "B2B"]
    },
];

export default function StartupHubPage() {
    const [selected, setSelected] = useState(startups[0]);
    const [stageFilter, setStageFilter] = useState("all");
    const filtered = stageFilter === "all" ? startups : startups.filter(s => s.stage.toLowerCase().includes(stageFilter));
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">🚀 Startup Hub</span>
                <div className="ml-auto"><button className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">+ List Your Startup</button></div>
            </header>
            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16 flex gap-6">
                <div className="w-[380px] shrink-0 space-y-3">
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {["all", "pre-seed", "seed", "series a", "series b"].map(s => (
                            <button key={s} onClick={() => setStageFilter(s)} className={`px-3 py-1.5 text-[10px] font-medium rounded-lg capitalize transition-all ${stageFilter === s ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)] border border-[oklch(0.58_0.18_260/0.3)]" : "bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]"}`}>{s === "all" ? "All Stages" : s}</button>
                        ))}
                    </div>
                    {filtered.map((s, i) => (
                        <motion.button key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setSelected(s)}
                            className={`w-full text-left rounded-2xl border p-4 transition-all ${selected.id === s.id ? "bg-[oklch(0.58_0.18_260/0.08)] border-[oklch(0.58_0.18_260/0.3)]" : "bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]"}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-lg">{s.logo}</div>
                                <div className="flex-1"><h3 className="text-sm font-semibold">{s.name}</h3><p className="text-[10px] text-[var(--color-text-tertiary)]">{s.tagline}</p></div>
                                <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)]">{s.stage}</span>
                            </div>
                            <div className="flex gap-1 mt-2">{s.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] text-[8px] rounded">{t}</span>)}</div>
                        </motion.button>
                    ))}
                </div>
                <div className="flex-1 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 sticky top-20 self-start">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-3xl">{selected.logo}</div>
                        <div>
                            <h2 className="text-xl font-bold">{selected.name}</h2>
                            <p className="text-sm text-[var(--color-text-secondary)]">{selected.tagline}</p>
                            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{selected.industry} · Founded {selected.founded} · {selected.team} team members</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-sm font-bold gradient-text">{selected.metrics.mrr}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">MRR</p></div>
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-sm font-bold text-[var(--color-success)]">{selected.metrics.growth}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">Growth</p></div>
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-sm font-bold">{selected.metrics.users}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">Users</p></div>
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3 text-center"><p className="text-sm font-bold">{selected.metrics.nps}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">NPS</p></div>
                    </div>
                    <div className="mb-4"><p className="text-xs text-[var(--color-text-tertiary)]">Funding</p><p className="text-lg font-bold">{selected.funding} <span className="text-xs font-normal text-[var(--color-text-tertiary)]">({selected.stage})</span></p></div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Connect with Founders</button>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">View Pitch Deck</button>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">Open Positions</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
