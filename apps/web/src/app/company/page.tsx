"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const companyData = {
    name: "Nexus", tagline: "The Career Operating System", industry: "Technology · HR Tech · AI", founded: "2024", size: "10-50", hq: "Milan, Italy", website: "nexus.pro",
    about: "Nexus is building the professional network of the future — AI-native, privacy-first, designed for 1B+ professionals. We believe career tools should empower individuals, not exploit them.",
    culture: ["🏠 Remote-first", "🌍 Async culture", "📚 €2K learning budget", "🏖️ Unlimited PTO", "💪 Health & wellness", "📈 Meaningful equity"],
    values: ["Radical Transparency", "User Privacy First", "Move Fast, Learn Faster", "Diverse by Default"],
    posts: [
        { author: "Francesco Sartori (CTO)", content: "Excited to announce — we just crossed 50K beta users! 🎉 The team has been incredible. Next milestone: 100K by Q3.", likes: 234, time: "3h", type: "milestone" },
        { author: "HR Team", content: "We're hiring! 5 new engineering positions open. If you want to build the future of work, check out our careers page.", likes: 89, time: "1d", type: "hiring" },
        { author: "Engineering", content: "Our Q1 engineering review is live. 99.97% uptime, 40% latency reduction, and 3 new microservices shipped.", likes: 156, time: "3d", type: "update" },
    ],
    jobs: [
        { title: "Senior Backend Engineer", type: "Full-time", location: "Remote" },
        { title: "ML Engineer — NLP", type: "Full-time", location: "Milan/Remote" },
        { title: "Product Designer", type: "Full-time", location: "Remote" },
        { title: "DevOps Engineer", type: "Contract", location: "Remote" },
    ],
    team: [
        { name: "Francesco Sartori", role: "Co-Founder & CTO" },
        { name: "Maria Bianchi", role: "Co-Founder & CEO" },
        { name: "Luca Romano", role: "VP Engineering" },
        { name: "Sofia Conti", role: "Head of Product" },
    ]
};

export default function CompanyPage() {
    const [tab, setTab] = useState<"feed" | "about" | "jobs" | "team">("feed");
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">🏢 Corporate Social</span>
            </header>
            <main className="max-w-4xl mx-auto pt-20 px-4 pb-16">
                {/* Company Header */}
                <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden mb-6">
                    <div className="h-36 bg-gradient-to-r from-[oklch(0.58_0.18_260)] via-[oklch(0.45_0.15_280)] to-[oklch(0.72_0.18_190)]" />
                    <div className="px-6 pb-6 -mt-10 flex items-end gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-elevated)] border-4 border-[var(--color-bg-secondary)] flex items-center justify-center text-2xl font-bold gradient-text">N</div>
                        <div className="flex-1 pt-10">
                            <div className="flex items-center gap-2"><h1 className="text-xl font-bold">{companyData.name}</h1><span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">✓ Verified</span></div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{companyData.tagline}</p>
                            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{companyData.industry} · {companyData.size} · {companyData.hq}</p>
                        </div>
                        <div className="flex gap-2 pt-10">
                            <button className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">+ Follow</button>
                            <button className="px-5 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-default)]">Visit Site</button>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {(["feed", "about", "jobs", "team"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>{t}</button>
                    ))}
                </div>
                {tab === "feed" && (
                    <div className="space-y-4">
                        {companyData.posts.map((p, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold">{p.author}</span>
                                    <span className={`px-1.5 py-0.5 text-[8px] rounded font-medium ${p.type === "milestone" ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : p.type === "hiring" ? "bg-blue-500/15 text-blue-400" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"}`}>{p.type}</span>
                                    <span className="text-[10px] text-[var(--color-text-tertiary)] ml-auto">{p.time} ago</span>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{p.content}</p>
                                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2">👍 {p.likes} reactions</p>
                            </motion.div>
                        ))}
                    </div>
                )}
                {tab === "about" && (
                    <div className="space-y-4">
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                            <h3 className="text-sm font-semibold mb-2">About</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{companyData.about}</p>
                        </div>
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                            <h3 className="text-sm font-semibold mb-3">Culture & Benefits</h3>
                            <div className="grid grid-cols-2 gap-2">{companyData.culture.map((c, i) => <div key={i} className="p-2.5 rounded-lg bg-[var(--color-bg-tertiary)] text-xs">{c}</div>)}</div>
                        </div>
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                            <h3 className="text-sm font-semibold mb-3">Values</h3>
                            <div className="flex flex-wrap gap-2">{companyData.values.map((v, i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-[oklch(0.58_0.18_260/0.1)] text-[oklch(0.72_0.18_190)] text-xs font-medium">{v}</span>)}</div>
                        </div>
                    </div>
                )}
                {tab === "jobs" && (
                    <div className="space-y-3">
                        {companyData.jobs.map((j, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center justify-between">
                                <div><h3 className="text-sm font-semibold">{j.title}</h3><p className="text-[11px] text-[var(--color-text-tertiary)]">{j.type} · {j.location}</p></div>
                                <Link href="/jobs" className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Apply</Link>
                            </motion.div>
                        ))}
                    </div>
                )}
                {tab === "team" && (
                    <div className="grid grid-cols-2 gap-4">
                        {companyData.team.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold">{t.name.charAt(0)}</div>
                                <div><p className="text-sm font-semibold">{t.name}</p><p className="text-[11px] text-[var(--color-text-tertiary)]">{t.role}</p></div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
