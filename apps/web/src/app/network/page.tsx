"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Tab = "connections" | "pending" | "suggestions";

const connections = [
    { id: "1", name: "Marco Rossi", headline: "AI Researcher @ DeepMind", mutual: 24, connected: "2 months ago" },
    { id: "2", name: "Sarah Chen", headline: "CTO @ CloudScale", mutual: 18, connected: "3 months ago" },
    { id: "3", name: "Alex Kim", headline: "Founder @ DataPipeline.io", mutual: 12, connected: "1 month ago" },
    { id: "4", name: "Emma Schmidt", headline: "ML Lead @ Tesla", mutual: 8, connected: "5 months ago" },
    { id: "5", name: "Raj Patel", headline: "Founder @ CleanEnergy.ai", mutual: 15, connected: "2 weeks ago" },
    { id: "6", name: "Lisa Wang", headline: "VP Engineering @ Meta", mutual: 31, connected: "4 months ago" },
];

const pending = [
    { id: "7", name: "James Wilson", headline: "Staff Engineer @ Netflix", mutual: 6, direction: "incoming" as const },
    { id: "8", name: "Ana García", headline: "Data Scientist @ Spotify", mutual: 3, direction: "incoming" as const },
    { id: "9", name: "Tom Baker", headline: "DevRel @ Vercel", mutual: 9, direction: "outgoing" as const },
];

const suggestions = [
    { id: "10", name: "David Park", headline: "CTO @ AI Ventures", mutual: 14, reason: "Based on your skills in Go and AI" },
    { id: "11", name: "Nina Petrov", headline: "Engineering Manager @ Stripe", mutual: 22, reason: "Worked at Stripe when you were there" },
    { id: "12", name: "Carlos Mendez", headline: "Founder @ LatAm Tech", mutual: 7, reason: "Active in Startup Founders community" },
    { id: "13", name: "Yuki Tanaka", headline: "Senior SRE @ Google Cloud", mutual: 19, reason: "You have 19 mutual connections" },
    { id: "14", name: "Sophie Laurent", headline: "VP Product @ Figma", mutual: 5, reason: "People in your network follow her" },
    { id: "15", name: "Amit Sharma", headline: "Principal Architect @ AWS", mutual: 11, reason: "Based on your interest in Distributed Systems" },
];

export default function NetworkPage() {
    const [activeTab, setActiveTab] = useState<Tab>("connections");

    const tabs: { id: Tab; label: string; count: number }[] = [
        { id: "connections", label: "Connections", count: 2847 },
        { id: "pending", label: "Pending", count: 3 },
        { id: "suggestions", label: "Discover", count: 50 },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                </Link>
                <Link href="/search" className="flex-1 max-w-lg flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-tertiary)]">
                    🔍 Search people, jobs, posts...
                </Link>
                <nav className="flex items-center gap-1">
                    {[
                        { href: "/feed", label: "Feed", icon: "🏠" },
                        { href: "/network", label: "Network", icon: "👥", active: true },
                        { href: "/jobs", label: "Jobs", icon: "💼" },
                        { href: "/messages", label: "Messages", icon: "💬" },
                        { href: "/aria", label: "ARIA", icon: "🤖" },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center px-4 py-1.5 rounded-lg text-[10px] font-medium transition-all ${item.active ? "text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"}`}>
                            <span className="text-base mb-0.5">{item.icon}</span>{item.label}
                        </Link>
                    ))}
                </nav>
                <Link href="/profile/me" className="ml-2 w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-semibold shrink-0">F</Link>
            </header>

            <main className="max-w-4xl mx-auto pt-20 px-4 pb-16">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold gradient-text">2,847</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">Connections</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold">12.3K</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">Followers</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold">856</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">Following</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                                }`}
                        >
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${activeTab === tab.id ? "bg-[oklch(0.58_0.18_260/0.2)]" : "bg-[var(--color-bg-tertiary)]"}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === "connections" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {connections.map((c, i) => (
                            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-base font-bold">{c.name.charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{c.name}</p>
                                    <p className="text-[11px] text-[var(--color-text-tertiary)] truncate">{c.headline}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{c.mutual} mutual · Connected {c.connected}</p>
                                </div>
                                <Link href={`/messages?to=${c.id}`} className="px-3 py-1.5 text-[10px] font-medium rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all shrink-0">
                                    Message
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === "pending" && (
                    <div className="space-y-3">
                        {pending.map((p, i) => (
                            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-base font-bold">{p.name.charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold">{p.name}</p>
                                    <p className="text-[11px] text-[var(--color-text-tertiary)]">{p.headline}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{p.mutual} mutual connections</p>
                                </div>
                                {p.direction === "incoming" ? (
                                    <div className="flex gap-2 shrink-0">
                                        <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Accept</button>
                                        <button className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border-default)]">Decline</button>
                                    </div>
                                ) : (
                                    <span className="px-3 py-1.5 text-[10px] text-[var(--color-text-tertiary)] border border-[var(--color-border-default)] rounded-lg">Pending</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === "suggestions" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.map((s, i) => (
                            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden">
                                <div className="h-16 bg-gradient-to-r from-[oklch(0.58_0.18_260/0.3)] to-[oklch(0.72_0.18_190/0.3)]" />
                                <div className="px-4 pb-4 -mt-6 text-center">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-bg-elevated)] border-2 border-[var(--color-bg-secondary)] flex items-center justify-center text-sm font-bold">{s.name.charAt(0)}</div>
                                    <p className="text-sm font-semibold mt-2">{s.name}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{s.headline}</p>
                                    <p className="text-[9px] text-[oklch(0.72_0.18_190)] mt-1">{s.reason}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{s.mutual} mutual connections</p>
                                    <button className="mt-3 w-full px-4 py-1.5 text-xs font-semibold rounded-lg border border-[oklch(0.58_0.18_260/0.3)] text-[oklch(0.72_0.18_190)] hover:bg-[oklch(0.58_0.18_260/0.1)] transition-all">
                                        Connect
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
