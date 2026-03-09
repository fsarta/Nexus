"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type JobType = "full-time" | "part-time" | "contract" | "freelance";
type WorkMode = "remote" | "hybrid" | "onsite";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: JobType;
    work_mode: WorkMode;
    salary_min: number;
    salary_max: number;
    currency: string;
    posted: string;
    applicants: number;
    skills: string[];
    match_score: number;
    description: string;
    is_saved: boolean;
}

const mockJobs: Job[] = [
    {
        id: "j1", title: "Senior Backend Engineer", company: "Nexus", location: "Milan, Italy", type: "full-time", work_mode: "hybrid",
        salary_min: 90000, salary_max: 130000, currency: "EUR", posted: "2h ago", applicants: 24, skills: ["Go", "PostgreSQL", "gRPC", "Kubernetes"],
        match_score: 96, description: "Join Nexus to build the professional network of the future. You'll work on high-throughput microservices...", is_saved: false,
    },
    {
        id: "j2", title: "ML Engineer — NLP", company: "DeepMind", location: "London, UK", type: "full-time", work_mode: "hybrid",
        salary_min: 120000, salary_max: 180000, currency: "GBP", posted: "1d ago", applicants: 89, skills: ["Python", "PyTorch", "Transformers", "NLP"],
        match_score: 88, description: "Work on cutting-edge NLP models. Deploy large language models at scale...", is_saved: true,
    },
    {
        id: "j3", title: "Staff Software Engineer", company: "Stripe", location: "San Francisco, US", type: "full-time", work_mode: "remote",
        salary_min: 200000, salary_max: 350000, currency: "USD", posted: "3d ago", applicants: 156, skills: ["Go", "Ruby", "Distributed Systems"],
        match_score: 92, description: "Build the financial infrastructure for the internet. Design systems handling millions of transactions...", is_saved: false,
    },
    {
        id: "j4", title: "CTO / Technical Cofounder", company: "Stealth Startup", location: "Remote", type: "full-time", work_mode: "remote",
        salary_min: 0, salary_max: 0, currency: "EUR", posted: "5d ago", applicants: 12, skills: ["Architecture", "Leadership", "AI", "Go"],
        match_score: 85, description: "Equity: 15-25%. Join as technical cofounder for an AI-native productivity platform...", is_saved: false,
    },
    {
        id: "j5", title: "Freelance Systems Architect", company: "Accenture", location: "Remote", type: "contract", work_mode: "remote",
        salary_min: 800, salary_max: 1200, currency: "EUR/day", posted: "1w ago", applicants: 7, skills: ["Cloud Architecture", "AWS", "Kubernetes"],
        match_score: 78, description: "6-month contract for enterprise cloud migration project...", is_saved: false,
    },
];

export default function JobsPage() {
    const [selectedJob, setSelectedJob] = useState<Job>(mockJobs[0]);
    const [workModeFilter, setWorkModeFilter] = useState<string>("all");

    const filteredJobs = workModeFilter === "all" ? mockJobs : mockJobs.filter((j) => j.work_mode === workModeFilter);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                </Link>
                <Link href="/search" className="flex-1 max-w-lg flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-tertiary)]">
                    🔍 Search jobs by title, skill, or company...
                </Link>
                <nav className="flex items-center gap-1">
                    {[
                        { href: "/feed", label: "Feed", icon: "🏠" },
                        { href: "/network", label: "Network", icon: "👥" },
                        { href: "/jobs", label: "Jobs", icon: "💼", active: true },
                        { href: "/messages", label: "Messages", icon: "💬" },
                        { href: "/aria", label: "ARIA", icon: "🤖" },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className={`flex flex-col items-center px-4 py-1.5 rounded-lg text-[10px] font-medium transition-all ${item.active ? "text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-tertiary)]"}`}>
                            <span className="text-base mb-0.5">{item.icon}</span>{item.label}
                        </Link>
                    ))}
                </nav>
                <Link href="/profile/me" className="ml-2 w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-semibold shrink-0">F</Link>
            </header>

            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16 flex gap-6">
                {/* Job List */}
                <div className="w-[400px] shrink-0 space-y-3">
                    {/* Filters */}
                    <div className="flex gap-2 mb-4">
                        {["all", "remote", "hybrid", "onsite"].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setWorkModeFilter(mode)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${workModeFilter === mode
                                        ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)] border border-[oklch(0.58_0.18_260/0.3)]"
                                        : "bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
                                    }`}
                            >
                                {mode === "all" ? "All" : mode}
                            </button>
                        ))}
                    </div>

                    {filteredJobs.map((job, i) => (
                        <motion.button
                            key={job.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => setSelectedJob(job)}
                            className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedJob.id === job.id
                                    ? "bg-[oklch(0.58_0.18_260/0.08)] border-[oklch(0.58_0.18_260/0.3)]"
                                    : "bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold">{job.title}</h3>
                                    <p className="text-[11px] text-[var(--color-text-secondary)]">{job.company}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">📍 {job.location} · {job.work_mode}</p>
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${job.match_score >= 90 ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : "bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)]"
                                    }`}>
                                    {job.match_score}% match
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {job.skills.slice(0, 3).map((s) => (
                                    <span key={s} className="px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] text-[9px] rounded">{s}</span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--color-text-tertiary)]">
                                <span>{job.salary_min > 0 ? `${(job.salary_min / 1000).toFixed(0)}K – ${(job.salary_max / 1000).toFixed(0)}K ${job.currency}` : "Equity-based"}</span>
                                <span>{job.posted} · {job.applicants} applicants</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Job Detail */}
                <div className="flex-1 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{selectedJob.company}</p>
                            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">📍 {selectedJob.location} · 🏢 {selectedJob.work_mode} · ⏰ {selectedJob.type}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${selectedJob.match_score >= 90 ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : "bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)]"
                            }`}>
                            {selectedJob.match_score}% match
                        </span>
                    </div>

                    {selectedJob.salary_min > 0 && (
                        <div className="mb-4 p-3 rounded-xl bg-[var(--color-bg-tertiary)] text-sm">
                            💰 <strong>{(selectedJob.salary_min / 1000).toFixed(0)}K – {(selectedJob.salary_max / 1000).toFixed(0)}K {selectedJob.currency}</strong>/year
                        </div>
                    )}

                    <div className="flex gap-3 mb-6">
                        <button id="apply-job-btn" className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all">
                            Apply Now
                        </button>
                        <button className="px-6 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all">
                            {selectedJob.is_saved ? "★ Saved" : "☆ Save"}
                        </button>
                        <button className="px-4 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all">
                            Share
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob.skills.map((s) => (
                                <span key={s} className="px-3 py-1 rounded-lg bg-[oklch(0.58_0.18_260/0.1)] text-[oklch(0.72_0.18_190)] text-xs font-medium">{s}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">About this role</h3>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{selectedJob.description}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">What you&apos;ll do</h3>
                        <ul className="text-sm text-[var(--color-text-secondary)] space-y-2 list-disc list-inside">
                            <li>Design and build scalable distributed systems</li>
                            <li>Collaborate with cross-functional teams to define technical strategy</li>
                            <li>Mentor junior engineers and contribute to engineering culture</li>
                            <li>Drive technical decisions and architecture reviews</li>
                            <li>Participate in on-call rotation and incident response</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2">Benefits</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)]">
                            {["🏥 Health insurance", "🏠 Remote flexibility", "📚 Learning budget €2K/yr", "🏖️ 30 days PTO", "💻 Equipment allowance", "📈 Stock options"].map((b) => (
                                <div key={b} className="p-2 rounded-lg bg-[var(--color-bg-tertiary)]">{b}</div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 text-[10px] text-[var(--color-text-tertiary)]">
                        Posted {selectedJob.posted} · {selectedJob.applicants} applicants · Job ID: {selectedJob.id}
                    </div>
                </div>
            </main>
        </div>
    );
}
