"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Skill { name: string; category: string; level: "beginner" | "intermediate" | "advanced" | "expert"; verified: boolean; score?: number; badge?: string; endorsements: number; }
const skills: Skill[] = [
    { name: "Go", category: "Languages", level: "expert", verified: true, score: 96, badge: "🏆", endorsements: 47 },
    { name: "TypeScript", category: "Languages", level: "expert", verified: true, score: 93, badge: "🏆", endorsements: 38 },
    { name: "Distributed Systems", category: "Architecture", level: "expert", verified: false, score: undefined, badge: undefined, endorsements: 31 },
    { name: "Machine Learning", category: "AI/ML", level: "advanced", verified: true, score: 87, badge: "⭐", endorsements: 24 },
    { name: "React", category: "Frontend", level: "advanced", verified: false, endorsements: 19 },
    { name: "PostgreSQL", category: "Databases", level: "advanced", verified: false, endorsements: 15 },
    { name: "Kubernetes", category: "DevOps", level: "intermediate", verified: false, endorsements: 8 },
    { name: "Python", category: "Languages", level: "advanced", verified: false, endorsements: 12 },
];
const availableTests = [
    { id: "t1", skill: "Distributed Systems", duration: "45 min", questions: 30, difficulty: "Advanced", takers: "2.4K" },
    { id: "t2", skill: "System Design", duration: "60 min", questions: 25, difficulty: "Expert", takers: "5.1K" },
    { id: "t3", skill: "Kubernetes", duration: "30 min", questions: 20, difficulty: "Intermediate", takers: "8.7K" },
    { id: "t4", skill: "Python", duration: "40 min", questions: 35, difficulty: "Advanced", takers: "12.3K" },
    { id: "t5", skill: "React", duration: "35 min", questions: 25, difficulty: "Advanced", takers: "15.6K" },
];
export default function SkillsPage() {
    const [tab, setTab] = useState<"my" | "verify" | "leaderboard">("my");
    const levelColor = (l: string) => { switch (l) { case "expert": return "text-[oklch(0.72_0.18_190)]"; case "advanced": return "text-blue-400"; case "intermediate": return "text-yellow-400"; default: return "text-[var(--color-text-tertiary)]"; } };
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">Skills & Verification</span>
            </header>
            <main className="max-w-4xl mx-auto pt-20 px-4 pb-16">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold gradient-text">8</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Total Skills</p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold text-[oklch(0.72_0.18_190)]">3</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Verified</p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold">194</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Endorsements</p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold">Top 5%</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Ranking</p>
                    </div>
                </div>
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {(["my", "verify", "leaderboard"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>{t === "my" ? "My Skills" : t === "verify" ? "Take Assessment" : "Leaderboard"}</button>
                    ))}
                </div>
                {tab === "my" && (
                    <div className="space-y-3">
                        {skills.map((s, i) => (
                            <motion.div key={s.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-lg">{s.badge || "💻"}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">{s.name}</span>
                                        <span className={`text-[10px] font-medium capitalize ${levelColor(s.level)}`}>{s.level}</span>
                                        {s.verified && <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">✓ Verified</span>}
                                    </div>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{s.category} · {s.endorsements} endorsements</p>
                                    {s.score && <div className="mt-1.5 flex items-center gap-2"><div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-tertiary)]"><div className="h-1.5 rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" style={{ width: `${s.score}%` }} /></div><span className="text-[10px] font-semibold">{s.score}%</span></div>}
                                </div>
                                {!s.verified && <button className="px-3 py-1.5 text-[10px] font-medium rounded-lg border border-[oklch(0.58_0.18_260/0.3)] text-[oklch(0.72_0.18_190)] hover:bg-[oklch(0.58_0.18_260/0.1)]">Verify Now</button>}
                            </motion.div>
                        ))}
                    </div>
                )}
                {tab === "verify" && (
                    <div className="space-y-3">
                        {availableTests.map((t, i) => (
                            <motion.div key={t.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.58_0.18_260/0.2)] to-[oklch(0.72_0.18_190/0.2)] flex items-center justify-center text-lg">📝</div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold">{t.skill} Assessment</h3>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)]">⏱ {t.duration} · {t.questions} questions · {t.difficulty}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{t.takers} people have taken this test</p>
                                </div>
                                <button className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Start Test</button>
                            </motion.div>
                        ))}
                    </div>
                )}
                {tab === "leaderboard" && (
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden">
                        {[{ rank: 1, name: "You (Francesco Sartori)", score: 276, badge: "🥇" }, { rank: 2, name: "Sarah Chen", score: 264, badge: "🥈" }, { rank: 3, name: "Marco Rossi", score: 251, badge: "🥉" }, { rank: 4, name: "Alex Kim", score: 238, badge: "" }, { rank: 5, name: "Emma Schmidt", score: 224, badge: "" }, { rank: 6, name: "Raj Patel", score: 211, badge: "" }, { rank: 7, name: "Lisa Wang", score: 198, badge: "" }].map((p, i) => (
                            <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border-default)] last:border-0 ${p.rank === 1 ? "bg-[oklch(0.58_0.18_260/0.05)]" : ""}`}>
                                <span className="w-8 text-center text-sm font-bold">{p.badge || `#${p.rank}`}</span>
                                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-bold">{p.name.charAt(0)}</div>
                                <span className="flex-1 text-sm font-medium">{p.name}</span>
                                <span className="text-sm font-bold gradient-text">{p.score} pts</span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
