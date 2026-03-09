"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Mock profile data — replaced by API call in production
const profile = {
    id: "user-1",
    full_name: "Francesco Sartori",
    username: "fsartori",
    headline: "Senior Software Engineer · AI & Distributed Systems",
    location: "Milan, Italy 🇮🇹",
    bio: "Building next-generation professional tools. Passionate about distributed systems, AI/ML, and open source. Previously at Google, now building Nexus.",
    verification: "verified",
    account_tier: "pro",
    connections: 2847,
    followers: 12340,
    following: 856,
    career_score: 92,
    open_to_work: false,
    skills: [
        { name: "Go", level: "expert", endorsements: 47, verified: true },
        { name: "TypeScript", level: "expert", endorsements: 38, verified: true },
        { name: "Distributed Systems", level: "expert", endorsements: 31, verified: false },
        { name: "Machine Learning", level: "advanced", endorsements: 24, verified: true },
        { name: "React", level: "advanced", endorsements: 19, verified: false },
        { name: "PostgreSQL", level: "advanced", endorsements: 15, verified: false },
    ],
    experiences: [
        {
            company: "Nexus",
            title: "Co-Founder & CTO",
            period: "2024 – Present",
            description: "Building the professional network of the future. AI-native, privacy-first, no ads.",
            current: true,
        },
        {
            company: "Google",
            title: "Senior Software Engineer",
            period: "2020 – 2024",
            description: "Led the backend team for Google Workspace APIs. Designed and built high-throughput microservices serving 2B+ requests/day.",
            current: false,
        },
        {
            company: "Stripe",
            title: "Software Engineer",
            period: "2017 – 2020",
            description: "Built payment processing infrastructure. Reduced latency by 40% through distributed caching.",
            current: false,
        },
    ],
};

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 glass-strong z-50 flex items-center px-6">
                <Link href="/feed" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <span className="text-lg font-bold">Nexus</span>
                </Link>
            </header>

            <main className="max-w-4xl mx-auto pt-20 px-4 pb-16">
                {/* Cover + Avatar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]"
                >
                    <div className="h-48 bg-gradient-to-r from-[oklch(0.58_0.18_260)] via-[oklch(0.50_0.16_280)] to-[oklch(0.72_0.18_190)]" />
                    <div className="px-6 pb-6 -mt-16">
                        <div className="flex items-end gap-4">
                            <div className="w-32 h-32 rounded-2xl border-4 border-[var(--color-bg-secondary)] bg-[var(--color-bg-elevated)] flex items-center justify-center text-4xl font-bold gradient-text shrink-0">
                                {profile.full_name.charAt(0)}
                            </div>
                            <div className="flex-1 pt-16">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                                    {profile.verification === "verified" && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">
                                            ✓ Verified
                                        </span>
                                    )}
                                    {profile.account_tier === "pro" && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260/0.2)] to-[oklch(0.72_0.18_190/0.2)] text-[oklch(0.72_0.18_190)]">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--color-text-secondary)]">{profile.headline}</p>
                                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{profile.location}</p>
                            </div>
                            <div className="flex gap-2 pt-16">
                                <Link
                                    href={`/messages?to=${profile.id}`}
                                    className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all"
                                >
                                    Message
                                </Link>
                                <button className="px-5 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all">
                                    Connect
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-4 mt-6"
                >
                    <StatCard label="Connections" value={profile.connections.toLocaleString()} />
                    <StatCard label="Followers" value={profile.followers.toLocaleString()} />
                    <StatCard label="Following" value={profile.following.toLocaleString()} />
                    <StatCard label="Career Score" value={`${profile.career_score}/100`} gradient />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Bio */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6"
                        >
                            <h2 className="text-sm font-semibold mb-3">About</h2>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{profile.bio}</p>
                        </motion.section>

                        {/* Experience */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6"
                        >
                            <h2 className="text-sm font-semibold mb-4">Experience</h2>
                            <div className="space-y-5">
                                {profile.experiences.map((exp, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-bold shrink-0">
                                            {exp.company.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold">{exp.title}</h3>
                                                {exp.current && (
                                                    <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-[var(--color-success)]/15 text-[var(--color-success)]">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--color-text-secondary)]">
                                                {exp.company} · {exp.period}
                                            </p>
                                            <p className="text-xs text-[var(--color-text-tertiary)] mt-1 leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Skills */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6"
                        >
                            <h2 className="text-sm font-semibold mb-4">Skills</h2>
                            <div className="space-y-3">
                                {profile.skills.map((skill) => (
                                    <div
                                        key={skill.name}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{skill.name}</span>
                                            {skill.verified && (
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)] font-medium">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-[var(--color-text-tertiary)]">
                                            {skill.endorsements} endorsements
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* ARIA Insights */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6"
                        >
                            <h2 className="text-sm font-semibold mb-3">ARIA Insights</h2>
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.58_0.18_260/0.1)] to-[oklch(0.72_0.18_190/0.1)] border border-[oklch(0.58_0.18_260/0.2)]">
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                    🎯 Your profile strength is <strong>92/100</strong>. Consider adding 2 more verified skills and a recent portfolio project to reach the top tier.
                                </p>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, gradient }: { label: string; value: string; gradient?: boolean }) {
    return (
        <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
            <p className={`text-xl font-bold mb-0.5 ${gradient ? "gradient-text" : ""}`}>{value}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{label}</p>
        </div>
    );
}
