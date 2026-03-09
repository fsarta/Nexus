"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const leads = [
    { id: "l1", name: "TechCorp GmbH", contact: "Hans Mueller", role: "VP Engineering", industry: "Automotive", size: "1000+", location: "Munich, Germany", score: 92, status: "hot" as const, lastActivity: "Viewed your profile 2h ago", budget: "€500K+" },
    { id: "l2", name: "FinanceFlow Ltd", contact: "Sophie Adams", role: "CTO", industry: "FinTech", size: "200-500", location: "London, UK", score: 87, status: "warm" as const, lastActivity: "Connected with you 3d ago", budget: "€200K-€500K" },
    { id: "l3", name: "HealthBridge", contact: "Dr. Maria Lopez", role: "Head of Digital", industry: "Healthcare", size: "500-1000", location: "Madrid, Spain", score: 78, status: "warm" as const, lastActivity: "Liked your post 1w ago", budget: "€100K-€200K" },
    { id: "l4", name: "EduNext", contact: "James Park", role: "Director of Engineering", industry: "EdTech", size: "50-200", location: "Seoul, Korea", score: 65, status: "new" as const, lastActivity: "New lead from search", budget: "€50K-€100K" },
    { id: "l5", name: "RetailAI", contact: "Anna Ivanova", role: "CPO", industry: "Retail", size: "200-500", location: "Stockholm, Sweden", score: 71, status: "new" as const, lastActivity: "Matched via skill overlap", budget: "€100K-€200K" },
];

export default function ClientDiscoveryPage() {
    const [selected, setSelected] = useState(leads[0]);
    const [filter, setFilter] = useState("all");
    const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);
    const statusColor = (s: string) => s === "hot" ? "bg-red-500/15 text-red-400" : s === "warm" ? "bg-orange-500/15 text-orange-400" : "bg-blue-500/15 text-blue-400";
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">🎯 Client Discovery</span>
                <div className="ml-auto flex items-center gap-3">
                    <span className="text-xs text-[var(--color-text-tertiary)]">{leads.length} leads found</span>
                    <button className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Export List</button>
                </div>
            </header>
            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16 flex gap-6">
                <div className="w-[400px] shrink-0 space-y-3">
                    <div className="flex gap-2 mb-4">
                        {["all", "hot", "warm", "new"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-medium rounded-lg capitalize transition-all ${filter === f ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)] border border-[oklch(0.58_0.18_260/0.3)]" : "bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]"}`}>{f === "all" ? "All Leads" : f}</button>
                        ))}
                    </div>
                    {filtered.map((l, i) => (
                        <motion.button key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} onClick={() => setSelected(l)}
                            className={`w-full text-left rounded-2xl border p-4 transition-all ${selected.id === l.id ? "bg-[oklch(0.58_0.18_260/0.08)] border-[oklch(0.58_0.18_260/0.3)]" : "bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]"}`}>
                            <div className="flex items-start justify-between mb-1">
                                <div><h3 className="text-sm font-semibold">{l.name}</h3><p className="text-[10px] text-[var(--color-text-secondary)]">{l.contact} · {l.role}</p></div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded capitalize ${statusColor(l.status)}`}>{l.status}</span>
                                    <span className="text-xs font-bold text-[oklch(0.72_0.18_190)]">{l.score}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-[var(--color-text-tertiary)]">{l.industry} · {l.size} · {l.location}</p>
                            <p className="text-[9px] text-[var(--color-text-tertiary)] mt-1">{l.lastActivity}</p>
                        </motion.button>
                    ))}
                </div>
                <div className="flex-1 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 sticky top-20 self-start">
                    <div className="flex items-center justify-between mb-4">
                        <div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm text-[var(--color-text-secondary)]">{selected.contact} · {selected.role}</p></div>
                        <div className="text-center"><p className="text-2xl font-bold gradient-text">{selected.score}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">Lead Score</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3"><p className="text-[10px] text-[var(--color-text-tertiary)]">Industry</p><p className="text-xs font-semibold">{selected.industry}</p></div>
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3"><p className="text-[10px] text-[var(--color-text-tertiary)]">Company Size</p><p className="text-xs font-semibold">{selected.size}</p></div>
                        <div className="rounded-xl bg-[var(--color-bg-tertiary)] p-3"><p className="text-[10px] text-[var(--color-text-tertiary)]">Est. Budget</p><p className="text-xs font-semibold">{selected.budget}</p></div>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold mb-2">AI Insights</h3>
                        <div className="p-3 rounded-xl bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)] text-xs text-[var(--color-text-secondary)] space-y-1.5">
                            <p>🎯 <strong>High intent</strong> — {selected.contact} visited your profile and company page 3 times this week</p>
                            <p>💡 <strong>Talking point</strong> — They recently posted about scaling challenges. Your distributed systems expertise is a great conversation starter.</p>
                            <p>📅 <strong>Best time to reach out</strong> — Tuesday/Wednesday 10-11 AM CET based on their activity patterns</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Send Message</button>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">Send InMail</button>
                        <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">Schedule Call</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
