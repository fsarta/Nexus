"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const salaryData = [
    { role: "Software Engineer", level: "Junior (0-2yr)", p25: "€35K", p50: "€45K", p75: "€58K", p90: "€70K", reports: 1247 },
    { role: "Software Engineer", level: "Mid (3-5yr)", p25: "€50K", p50: "€65K", p75: "€82K", p90: "€100K", reports: 2341 },
    { role: "Senior Software Engineer", level: "Senior (5-8yr)", p25: "€70K", p50: "€90K", p75: "€115K", p90: "€140K", reports: 1892 },
    { role: "Staff Engineer", level: "Staff (8-12yr)", p25: "€95K", p50: "€125K", p75: "€155K", p90: "€190K", reports: 876 },
    { role: "Principal Engineer", level: "Principal (12+yr)", p25: "€120K", p50: "€155K", p75: "€200K", p90: "€280K", reports: 342 },
    { role: "Engineering Manager", level: "Manager", p25: "€80K", p50: "€105K", p75: "€135K", p90: "€170K", reports: 1123 },
    { role: "CTO", level: "Executive", p25: "€110K", p50: "€150K", p75: "€220K", p90: "€350K+", reports: 287 },
];

const topCompanies = [
    { name: "Google", avg: "€135K", compared: "+42%" },
    { name: "Stripe", avg: "€128K", compared: "+35%" },
    { name: "Meta", avg: "€125K", compared: "+32%" },
    { name: "Nexus", avg: "€115K", compared: "+21%" },
    { name: "Spotify", avg: "€105K", compared: "+11%" },
];

export default function SalaryPage() {
    const [role, setRole] = useState("Software Engineer");
    const [location, setLocation] = useState("Milan, Italy");
    const [showSubmit, setShowSubmit] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">💰 Salary Transparency</span>
                <div className="ml-auto"><button onClick={() => setShowSubmit(!showSubmit)} className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">+ Submit Salary</button></div>
            </header>
            <main className="max-w-5xl mx-auto pt-20 px-4 pb-16">
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1"><label className="text-[10px] text-[var(--color-text-tertiary)]">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-sm">
                            <option>Software Engineer</option><option>Data Scientist</option><option>Product Manager</option><option>Designer</option>
                        </select>
                    </div>
                    <div className="flex-1"><label className="text-[10px] text-[var(--color-text-tertiary)]">Location</label>
                        <select value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-sm">
                            <option>Milan, Italy</option><option>London, UK</option><option>Berlin, Germany</option><option>San Francisco, US</option><option>Remote (Global)</option>
                        </select>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold gradient-text">€65K</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Median Salary</p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-success)]">+12%</p><p className="text-[10px] text-[var(--color-text-tertiary)]">YoY Growth</p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold">8.1K</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Reports</p>
                    </div>
                    <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 text-center">
                        <p className="text-2xl font-bold">€35K-€280K</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Full Range</p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="flex-1">
                        {/* Salary Table */}
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden mb-6">
                            <div className="grid grid-cols-6 gap-0 px-4 py-2.5 border-b border-[var(--color-border-default)] text-[10px] font-semibold text-[var(--color-text-tertiary)]">
                                <span className="col-span-2">Level</span><span>25th</span><span>Median</span><span>75th</span><span>90th</span>
                            </div>
                            {salaryData.map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                                    className="grid grid-cols-6 gap-0 px-4 py-3 border-b border-[var(--color-border-default)] last:border-0 hover:bg-[var(--color-bg-tertiary)] transition-all">
                                    <div className="col-span-2"><p className="text-xs font-medium">{s.level}</p><p className="text-[9px] text-[var(--color-text-tertiary)]">{s.reports} reports</p></div>
                                    <span className="text-xs text-[var(--color-text-tertiary)]">{s.p25}</span>
                                    <span className="text-xs font-semibold gradient-text">{s.p50}</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">{s.p75}</span>
                                    <span className="text-xs text-[var(--color-success)]">{s.p90}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Visual bar chart */}
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5">
                            <h3 className="text-sm font-semibold mb-4">Salary Distribution — {role} in {location}</h3>
                            <div className="space-y-3">
                                {salaryData.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-[10px] text-[var(--color-text-tertiary)] w-24 shrink-0">{s.level.split("(")[0]}</span>
                                        <div className="flex-1 h-6 rounded bg-[var(--color-bg-tertiary)] relative overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, parseInt(s.p50.replace(/[^0-9]/g, "")) / 3)}%` }} transition={{ delay: i * 0.1, duration: 0.6 }}
                                                className="h-full rounded bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold">{s.p50}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="w-72 shrink-0 space-y-4">
                        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                            <h3 className="text-sm font-semibold mb-3">Top Paying Companies</h3>
                            {topCompanies.map((c, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)] last:border-0">
                                    <div className="flex items-center gap-2"><span className="text-xs font-medium">{i + 1}.</span><span className="text-xs font-medium">{c.name}</span></div>
                                    <div className="text-right"><p className="text-xs font-semibold">{c.avg}</p><p className="text-[9px] text-[var(--color-success)]">{c.compared} vs avg</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)] p-4">
                            <h3 className="text-sm font-semibold mb-2">🤖 ARIA Says</h3>
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Based on your profile (CTO, 8yr exp, Milan), your estimated market value is <strong>€155K-€195K</strong>. You're in the <strong>85th percentile</strong> for your role and location.</p>
                        </div>
                    </aside>
                </div>

                {/* Submit Modal */}
                {showSubmit && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSubmit(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                            <h2 className="text-lg font-bold mb-4">Submit Your Salary (Anonymous)</h2>
                            <div className="space-y-3">
                                {["Role", "Company", "Location", "Base Salary (€)", "Bonus (€)", "Equity Value (€)", "Years of Experience"].map(f => (
                                    <div key={f}><label className="text-[10px] text-[var(--color-text-tertiary)]">{f}</label>
                                        <input className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm outline-none" /></div>
                                ))}
                            </div>
                            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-3">🔒 Your submission is 100% anonymous. No personally identifiable information is stored.</p>
                            <button className="w-full mt-4 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Submit Anonymously</button>
                        </motion.div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
