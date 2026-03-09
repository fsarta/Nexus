"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Tab = "overview" | "team" | "content" | "analytics";

const stats = [
    { label: "Total Employees", value: "47", change: "+3 this month", icon: "👥" },
    { label: "Active Users", value: "94%", change: "+2% vs last month", icon: "📊" },
    { label: "Posts Published", value: "234", change: "+18 this week", icon: "📝" },
    { label: "Avg. Engagement", value: "4.7%", change: "+0.3%", icon: "💬" },
];
const teamMembers = [
    { name: "Francesco Sartori", role: "CTO", dept: "Engineering", status: "active" as const, lastActive: "2m ago", posts: 34 },
    { name: "Maria Bianchi", role: "CEO", dept: "Executive", status: "active" as const, lastActive: "5m ago", posts: 28 },
    { name: "Luca Romano", role: "VP Engineering", dept: "Engineering", status: "active" as const, lastActive: "1h ago", posts: 19 },
    { name: "Sofia Conti", role: "Head of Product", dept: "Product", status: "away" as const, lastActive: "3h ago", posts: 22 },
    { name: "Marco Verde", role: "Senior SWE", dept: "Engineering", status: "active" as const, lastActive: "10m ago", posts: 15 },
    { name: "Anna Russo", role: "HR Manager", dept: "People", status: "active" as const, lastActive: "30m ago", posts: 41 },
    { name: "Paolo Neri", role: "Designer", dept: "Design", status: "offline" as const, lastActive: "1d ago", posts: 8 },
    { name: "Elena Ferri", role: "Marketing Lead", dept: "Marketing", status: "active" as const, lastActive: "15m ago", posts: 56 },
];
const modQueue = [
    { id: 1, type: "post", author: "Marco Verde", content: "Check out this amazing new tool...", reason: "Possible spam", time: "2h ago" },
    { id: 2, type: "comment", author: "External User", content: "DM me for great opportunities...", reason: "Spam detected (AI)", time: "4h ago" },
    { id: 3, type: "post", author: "Paolo Neri", content: "Controversial opinion about...", reason: "Flagged by 3 users", time: "1d ago" },
];

export default function EnterprisePage() {
    const [tab, setTab] = useState<Tab>("overview");
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">🏢 Enterprise Dashboard</span>
                <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">Admin</span>
            </header>
            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                            <div className="flex items-center justify-between mb-2"><span className="text-lg">{s.icon}</span><span className="text-[10px] text-[var(--color-success)]">{s.change}</span></div>
                            <p className="text-2xl font-bold">{s.value}</p><p className="text-[10px] text-[var(--color-text-tertiary)]">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {(["overview", "team", "content", "analytics"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>{t}</button>
                    ))}
                </div>

                {tab === "overview" && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-4">
                            {/* Activity Chart placeholder */}
                            <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                                <h3 className="text-sm font-semibold mb-4">Engagement Over Time</h3>
                                <div className="flex items-end gap-1 h-32">
                                    {[40, 55, 48, 62, 75, 68, 82, 90, 85, 95, 88, 92, 78, 85, 91, 96, 88, 94, 100, 92, 87, 95, 89, 93].map((v, i) => (
                                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.02, duration: 0.4 }}
                                            className="flex-1 rounded-t bg-gradient-to-t from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] opacity-80 hover:opacity-100 transition-opacity" />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-[9px] text-[var(--color-text-tertiary)]"><span>1 Mar</span><span>8 Mar</span><span>15 Mar</span><span>Today</span></div>
                            </div>
                            {/* Hiring Pipeline */}
                            <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                                <h3 className="text-sm font-semibold mb-3">Hiring Pipeline</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {[{ stage: "Applied", count: 124, color: "bg-blue-500" }, { stage: "Screening", count: 45, color: "bg-purple-500" }, { stage: "Interview", count: 18, color: "bg-yellow-500" }, { stage: "Offer", count: 6, color: "bg-orange-500" }, { stage: "Hired", count: 3, color: "bg-[var(--color-success)]" }].map((s, i) => (
                                        <div key={i} className="text-center"><div className={`h-2 rounded-full ${s.color} mb-2`} /><p className="text-lg font-bold">{s.count}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">{s.stage}</p></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Right column */}
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                                <h3 className="text-sm font-semibold mb-3">Department Breakdown</h3>
                                {[{ dept: "Engineering", count: 22, pct: 47 }, { dept: "Product", count: 8, pct: 17 }, { dept: "Marketing", count: 6, pct: 13 }, { dept: "People", count: 5, pct: 11 }, { dept: "Design", count: 4, pct: 8 }, { dept: "Executive", count: 2, pct: 4 }].map((d, i) => (
                                    <div key={i} className="flex items-center gap-2 py-1.5"><span className="text-[11px] w-20">{d.dept}</span><div className="flex-1 h-2 rounded-full bg-[var(--color-bg-tertiary)]"><motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ delay: i * 0.1 }} className="h-2 rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" /></div><span className="text-[10px] font-semibold w-6">{d.count}</span></div>
                                ))}
                            </div>
                            <div className="rounded-2xl bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)] p-4">
                                <h3 className="text-sm font-semibold mb-2">🤖 ARIA Enterprise</h3>
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Employee engagement is <strong>up 12%</strong> this quarter. Your team posts 3.2x more than industry average. Consider launching an internal hackathon to maintain momentum.</p>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "team" && (
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden">
                        <div className="grid grid-cols-6 px-4 py-2.5 border-b border-[var(--color-border-default)] text-[10px] font-semibold text-[var(--color-text-tertiary)]">
                            <span className="col-span-2">Member</span><span>Department</span><span>Status</span><span>Last Active</span><span>Posts</span>
                        </div>
                        {teamMembers.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                className="grid grid-cols-6 items-center px-4 py-3 border-b border-[var(--color-border-default)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-all">
                                <div className="col-span-2 flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-bold">{m.name.charAt(0)}</div><div><p className="text-xs font-medium">{m.name}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">{m.role}</p></div></div>
                                <span className="text-xs">{m.dept}</span>
                                <span className={`text-[10px] font-medium ${m.status === "active" ? "text-[var(--color-success)]" : m.status === "away" ? "text-yellow-400" : "text-[var(--color-text-tertiary)]"}`}>● {m.status}</span>
                                <span className="text-xs text-[var(--color-text-tertiary)]">{m.lastActive}</span>
                                <span className="text-xs font-semibold">{m.posts}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                {tab === "content" && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Moderation Queue ({modQueue.length})</h3>
                        {modQueue.map((item, i) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div><p className="text-xs font-semibold">{item.author} <span className="text-[var(--color-text-tertiary)] font-normal">({item.type})</span></p><p className="text-[10px] text-red-400">{item.reason}</p></div>
                                    <span className="text-[10px] text-[var(--color-text-tertiary)]">{item.time}</span>
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-3 p-2 rounded-lg bg-[var(--color-bg-tertiary)]">&ldquo;{item.content}&rdquo;</p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-[var(--color-success)]">Approve</button>
                                    <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-red-500">Remove</button>
                                    <button className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border-default)]">Flag User</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {tab === "analytics" && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-4">Company Page Views</h3>
                            <p className="text-3xl font-bold gradient-text">24,892</p><p className="text-xs text-[var(--color-success)]">↑ 34% vs last month</p>
                            <div className="flex items-end gap-0.5 h-20 mt-4">{[30, 45, 55, 40, 65, 78, 60, 72, 85, 90, 82, 95].map((v, i) => (<motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.04 }} className="flex-1 rounded-t bg-gradient-to-t from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" />))}</div>
                        </div>
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-4">Follower Growth</h3>
                            <p className="text-3xl font-bold">12,340</p><p className="text-xs text-[var(--color-success)]">↑ 18% vs last month</p>
                            <div className="flex items-end gap-0.5 h-20 mt-4">{[20, 28, 35, 42, 48, 52, 58, 64, 70, 78, 85, 92].map((v, i) => (<motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.04 }} className="flex-1 rounded-t bg-gradient-to-t from-[oklch(0.45_0.15_280)] to-[oklch(0.58_0.18_260)]" />))}</div>
                        </div>
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-3">Top Performing Content</h3>
                            {[{ title: "50K beta users announcement", views: "12.4K", eng: "8.2%" }, { title: "Q1 engineering review", views: "5.6K", eng: "6.1%" }, { title: "We're hiring! 5 positions", views: "3.2K", eng: "4.8%" }].map((c, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)] last:border-0"><span className="text-xs">{c.title}</span><div className="text-right"><p className="text-xs font-semibold">{c.views}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">{c.eng} eng</p></div></div>
                            ))}
                        </div>
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-3">Audience Demographics</h3>
                            {[{ region: "Europe", pct: 42 }, { region: "North America", pct: 31 }, { region: "Asia Pacific", pct: 18 }, { region: "Other", pct: 9 }].map((d, i) => (
                                <div key={i} className="flex items-center gap-2 py-1.5"><span className="text-xs w-28">{d.region}</span><div className="flex-1 h-2 rounded-full bg-[var(--color-bg-tertiary)]"><motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ delay: i * 0.1 }} className="h-2 rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" /></div><span className="text-[10px] font-semibold">{d.pct}%</span></div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
