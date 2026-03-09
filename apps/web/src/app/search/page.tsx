"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type SearchTab = "all" | "people" | "jobs" | "posts" | "companies";

const results = {
    people: [
        { id: "1", name: "Marco Rossi", headline: "AI Researcher @ DeepMind", mutual: 24, verified: true },
        { id: "2", name: "Sarah Chen", headline: "CTO @ CloudScale", mutual: 18, verified: true },
        { id: "3", name: "Alex Kim", headline: "Founder @ DataPipeline.io", mutual: 12, verified: false },
        { id: "4", name: "Emma Schmidt", headline: "ML Lead @ Tesla", mutual: 8, verified: false },
    ],
    jobs: [
        { id: "j1", title: "Senior Backend Engineer", company: "Nexus", location: "Milan, Italy", salary: "€90K-€130K", match: 96 },
        { id: "j2", title: "ML Engineer", company: "DeepMind", location: "London, UK", salary: "£120K-£180K", match: 88 },
        { id: "j3", title: "Staff SWE", company: "Stripe", location: "San Francisco", salary: "$200K-$350K", match: 92 },
    ],
    posts: [
        { id: "p1", author: "Marco Rossi", snippet: "Just published our new paper on transformer architectures for code generation...", likes: 847, time: "2h" },
        { id: "p2", author: "Sarah Chen", snippet: "Hot take: The best engineering teams don't have the best engineers...", likes: 2341, time: "5h" },
    ],
    companies: [
        { id: "c1", name: "Nexus", tagline: "The Career Operating System", industry: "Technology", employees: "10-50", followers: "12.3K" },
        { id: "c2", name: "DeepMind", tagline: "Solving intelligence to advance science", industry: "AI Research", employees: "1000+", followers: "2.4M" },
        { id: "c3", name: "Stripe", tagline: "Financial infrastructure for the internet", industry: "Fintech", employees: "5000+", followers: "1.8M" },
    ],
};

export default function SearchPage() {
    const [query, setQuery] = useState("distributed systems");
    const [tab, setTab] = useState<SearchTab>("all");

    const tabs: { id: SearchTab; label: string; count: number }[] = [
        { id: "all", label: "All", count: 9 },
        { id: "people", label: "People", count: 4 },
        { id: "jobs", label: "Jobs", count: 3 },
        { id: "posts", label: "Posts", count: 2 },
        { id: "companies", label: "Companies", count: 3 },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span></div></Link>
                <div className="flex-1 max-w-xl">
                    <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, jobs, posts, companies..." autoFocus className="w-full px-4 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] outline-none text-sm" />
                </div>
                <nav className="flex items-center gap-1">
                    {[{ href: "/feed", label: "Feed", icon: "🏠" }, { href: "/network", label: "Network", icon: "👥" }, { href: "/jobs", label: "Jobs", icon: "💼" }, { href: "/messages", label: "Messages", icon: "💬" }, { href: "/aria", label: "ARIA", icon: "🤖" }].map(i => (
                        <Link key={i.href} href={i.href} className="flex flex-col items-center px-4 py-1.5 rounded-lg text-[10px] font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"><span className="text-base mb-0.5">{i.icon}</span>{i.label}</Link>
                    ))}
                </nav>
            </header>

            <main className="max-w-3xl mx-auto pt-20 px-4 pb-16">
                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${tab === t.id ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>
                            {t.label} <span className="ml-1 text-[10px] opacity-60">{t.count}</span>
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {(tab === "all" || tab === "people") && (
                        <section>
                            {tab === "all" && <h2 className="text-sm font-semibold mb-3">People</h2>}
                            <div className="space-y-2">
                                {results.people.map((p, i) => (
                                    <motion.div key={p.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold">{p.name.charAt(0)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5"><span className="text-sm font-semibold">{p.name}</span>{p.verified && <span className="text-[9px] px-1 py-0.5 rounded bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">✓</span>}</div>
                                            <p className="text-[11px] text-[var(--color-text-tertiary)]">{p.headline}</p>
                                            <p className="text-[10px] text-[var(--color-text-tertiary)]">{p.mutual} mutual connections</p>
                                        </div>
                                        <button className="px-4 py-1.5 text-[10px] font-semibold rounded-lg border border-[oklch(0.58_0.18_260/0.3)] text-[oklch(0.72_0.18_190)] hover:bg-[oklch(0.58_0.18_260/0.1)]">Connect</button>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(tab === "all" || tab === "jobs") && (
                        <section>
                            {tab === "all" && <h2 className="text-sm font-semibold mb-3 mt-6">Jobs</h2>}
                            <div className="space-y-2">
                                {results.jobs.map((j, i) => (
                                    <motion.div key={j.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold">{j.title}</h3>
                                            <p className="text-[11px] text-[var(--color-text-secondary)]">{j.company} · {j.location}</p>
                                            <p className="text-[10px] text-[var(--color-text-tertiary)]">{j.salary}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${j.match >= 90 ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : "bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)]"}`}>{j.match}%</span>
                                            <Link href="/jobs" className="px-4 py-1.5 text-[10px] font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">View</Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(tab === "all" || tab === "posts") && (
                        <section>
                            {tab === "all" && <h2 className="text-sm font-semibold mb-3 mt-6">Posts</h2>}
                            <div className="space-y-2">
                                {results.posts.map((p, i) => (
                                    <motion.div key={p.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                                        <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold">{p.author}</span><span className="text-[10px] text-[var(--color-text-tertiary)]">· {p.time} ago</span></div>
                                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{p.snippet}</p>
                                        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2">👍 {p.likes} reactions</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(tab === "all" || tab === "companies") && (
                        <section>
                            {tab === "all" && <h2 className="text-sm font-semibold mb-3 mt-6">Companies</h2>}
                            <div className="space-y-2">
                                {results.companies.map((c, i) => (
                                    <motion.div key={c.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold">{c.name.charAt(0)}</div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold">{c.name}</h3>
                                            <p className="text-[11px] text-[var(--color-text-tertiary)]">{c.tagline}</p>
                                            <p className="text-[10px] text-[var(--color-text-tertiary)]">{c.industry} · {c.employees} · {c.followers} followers</p>
                                        </div>
                                        <button className="px-4 py-1.5 text-[10px] font-medium rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]">Follow</button>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
