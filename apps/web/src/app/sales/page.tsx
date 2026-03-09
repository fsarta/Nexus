"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const pipeline = [
    { id: "d1", company: "TechCorp GmbH", contact: "Hans Mueller", value: "€480K", stage: "negotiation" as const, probability: 85, nextStep: "Contract review call", date: "Mar 12" },
    { id: "d2", company: "FinanceFlow Ltd", contact: "Sophie Adams", value: "€220K", stage: "proposal" as const, probability: 60, nextStep: "Send revised proposal", date: "Mar 14" },
    { id: "d3", company: "HealthBridge", contact: "Dr. Maria Lopez", value: "€150K", stage: "discovery" as const, probability: 35, nextStep: "Schedule demo", date: "Mar 18" },
    { id: "d4", company: "EduNext", contact: "James Park", value: "€90K", stage: "qualified" as const, probability: 45, nextStep: "Technical deep-dive", date: "Mar 15" },
    { id: "d5", company: "RetailAI", contact: "Anna Ivanova", value: "€340K", stage: "proposal" as const, probability: 55, nextStep: "Pricing discussion", date: "Mar 11" },
    { id: "d6", company: "LogiTrack", contact: "Peter Schmidt", value: "€180K", stage: "closed-won" as const, probability: 100, nextStep: "Onboarding kickoff", date: "Mar 8" },
];

const signals = [
    { company: "TechCorp GmbH", signal: "VP Engineering posted about scaling challenges", type: "buying-intent" as const, date: "2h ago" },
    { company: "FinanceFlow Ltd", signal: "Just raised Series B ($30M)", type: "funding" as const, date: "1d ago" },
    { company: "HealthBridge", signal: "Posted 3 new engineering jobs", type: "hiring" as const, date: "3d ago" },
    { company: "RetailAI", signal: "CTO mentioned evaluating new tools in a post", type: "buying-intent" as const, date: "5h ago" },
];

const stages = ["discovery", "qualified", "proposal", "negotiation", "closed-won"];
const stageLabel = (s: string) => s.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
const stageColor = (s: string) => { switch (s) { case "discovery": return "bg-blue-500"; case "qualified": return "bg-purple-500"; case "proposal": return "bg-yellow-500"; case "negotiation": return "bg-orange-500"; case "closed-won": return "bg-[var(--color-success)]"; default: return "bg-gray-500"; } };

export default function SalesIntelligencePage() {
    const [view, setView] = useState<"pipeline" | "signals" | "forecast">("pipeline");
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">📈 Sales Intelligence</span>
                <div className="ml-auto"><button className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">+ Add Deal</button></div>
            </header>
            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16">
                {/* Revenue Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[{ label: "Pipeline Value", value: "€1.46M", change: "+12%" }, { label: "Weighted", value: "€820K", change: "+8%" }, { label: "Won This Quarter", value: "€180K", change: "1 deal" }, { label: "Win Rate", value: "34%", change: "+5%" }].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                            <p className="text-2xl font-bold gradient-text">{s.value}</p>
                            <div className="flex items-center justify-between mt-1"><span className="text-[10px] text-[var(--color-text-tertiary)]">{s.label}</span><span className="text-[10px] text-[var(--color-success)]">{s.change}</span></div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {(["pipeline", "signals", "forecast"] as const).map(t => (
                        <button key={t} onClick={() => setView(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${view === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>{t}</button>
                    ))}
                </div>

                {view === "pipeline" && (
                    <div className="space-y-6">
                        {/* Kanban-style stages */}
                        <div className="flex gap-3 overflow-x-auto pb-4">
                            {stages.map(stage => (
                                <div key={stage} className="min-w-[240px] flex-1">
                                    <div className="flex items-center gap-2 mb-3"><div className={`w-2 h-2 rounded-full ${stageColor(stage)}`} /><span className="text-xs font-semibold">{stageLabel(stage)}</span><span className="text-[10px] text-[var(--color-text-tertiary)]">({pipeline.filter(d => d.stage === stage).length})</span></div>
                                    <div className="space-y-2">
                                        {pipeline.filter(d => d.stage === stage).map((deal, i) => (
                                            <motion.div key={deal.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3 hover:border-[var(--color-border-hover)] transition-all">
                                                <h4 className="text-xs font-semibold">{deal.company}</h4>
                                                <p className="text-[10px] text-[var(--color-text-tertiary)]">{deal.contact}</p>
                                                <p className="text-sm font-bold gradient-text mt-1">{deal.value}</p>
                                                <div className="flex items-center justify-between mt-2 text-[9px] text-[var(--color-text-tertiary)]"><span>{deal.probability}% prob</span><span>{deal.date}</span></div>
                                                <p className="text-[9px] text-[var(--color-text-secondary)] mt-1 p-1.5 rounded bg-[var(--color-bg-tertiary)]">→ {deal.nextStep}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === "signals" && (
                    <div className="space-y-3">
                        <div className="rounded-2xl bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)] p-4 mb-4">
                            <h3 className="text-sm font-semibold mb-1">🤖 ARIA Sales Intelligence</h3>
                            <p className="text-xs text-[var(--color-text-secondary)]">Monitoring <strong>5 accounts</strong> across LinkedIn, Nexus, news, and job boards. Found <strong>4 buying signals</strong> in the last 24 hours.</p>
                        </div>
                        {signals.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm ${s.type === "buying-intent" ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : s.type === "funding" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"}`}>
                                    {s.type === "buying-intent" ? "🎯" : s.type === "funding" ? "💰" : "👥"}
                                </div>
                                <div className="flex-1"><p className="text-xs font-semibold">{s.company}</p><p className="text-xs text-[var(--color-text-secondary)]">{s.signal}</p></div>
                                <div className="text-right"><span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${s.type === "buying-intent" ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : s.type === "funding" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"}`}>{stageLabel(s.type)}</span><p className="text-[9px] text-[var(--color-text-tertiary)] mt-1">{s.date}</p></div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {view === "forecast" && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-4">Quarterly Forecast</h3>
                            <div className="space-y-4">
                                {[{ q: "Q1 2026", target: "€500K", projected: "€420K", pct: 84 }, { q: "Q2 2026", target: "€750K", projected: "€680K", pct: 91 }, { q: "Q3 2026", target: "€1M", projected: "€950K", pct: 95 }, { q: "Q4 2026", target: "€1.5M", projected: "€1.2M", pct: 80 }].map((f, i) => (
                                    <div key={i}><div className="flex justify-between text-xs mb-1"><span className="font-medium">{f.q}</span><span className="text-[var(--color-text-tertiary)]">{f.projected} / {f.target}</span></div><div className="h-3 rounded-full bg-[var(--color-bg-tertiary)]"><motion.div initial={{ width: 0 }} animate={{ width: `${f.pct}%` }} transition={{ delay: i * 0.15, duration: 0.6 }} className={`h-3 rounded-full ${f.pct >= 90 ? "bg-[var(--color-success)]" : "bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]"}`} /></div></div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-4">Revenue by Industry</h3>
                            {[{ industry: "FinTech", value: "€340K", pct: 40 }, { industry: "Automotive", value: "€480K", pct: 56 }, { industry: "Healthcare", value: "€150K", pct: 18 }, { industry: "EdTech", value: "€90K", pct: 11 }, { industry: "Retail", value: "€340K", pct: 40 }].map((r, i) => (
                                <div key={i} className="flex items-center gap-2 py-2"><span className="text-xs w-20">{r.industry}</span><div className="flex-1 h-2.5 rounded-full bg-[var(--color-bg-tertiary)]"><motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ delay: i * 0.1 }} className="h-2.5 rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" /></div><span className="text-xs font-semibold w-16 text-right">{r.value}</span></div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
