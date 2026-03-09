"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EditProfilePage() {
    const [form, setForm] = useState({
        full_name: "Francesco Sartori",
        username: "fsartori",
        headline: "Senior Software Engineer · AI & Distributed Systems",
        location: "Milan, Italy",
        bio: "Building next-generation professional tools. Passionate about distributed systems, AI/ML, and open source. Previously at Google, now building Nexus.",
        website: "https://nexus.pro",
        open_to_work: false,
        open_to_hire: true,
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // TODO: PUT /api/v1/users/:id
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const update = (key: string, value: string | boolean) =>
        setForm((p) => ({ ...p, [key]: value }));

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-16 glass-strong z-50 flex items-center px-6">
                <Link href="/profile/me" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <span className="text-lg font-bold">Nexus</span>
                </Link>
                <span className="ml-4 text-sm text-[var(--color-text-tertiary)]">/ Edit Profile</span>
                <div className="ml-auto flex items-center gap-3">
                    {saved && (
                        <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs text-[var(--color-success)]"
                        >
                            ✓ Saved
                        </motion.span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        id="save-profile-btn"
                        className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto pt-24 px-4 pb-16">
                {/* Avatar Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 mb-6"
                >
                    <h2 className="text-sm font-semibold mb-4">Profile Photo</h2>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-[var(--color-bg-elevated)] flex items-center justify-center text-3xl font-bold gradient-text">
                            {form.full_name.charAt(0)}
                        </div>
                        <div>
                            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all">
                                Upload New Photo
                            </button>
                            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                                JPG, PNG or WebP. Max 5MB. Recommended 400×400px.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Cover Photo */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 mb-6"
                >
                    <h2 className="text-sm font-semibold mb-4">Cover Photo</h2>
                    <div className="h-32 rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_260)] via-[oklch(0.50_0.16_280)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-black/30 text-white backdrop-blur-sm hover:bg-black/40 transition-all">
                            Change Cover
                        </button>
                    </div>
                </motion.section>

                {/* Basic Info */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 mb-6"
                >
                    <h2 className="text-sm font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Full Name" value={form.full_name} onChange={(v) => update("full_name", v)} />
                        <InputField label="Username" value={form.username} onChange={(v) => update("username", v)} prefix="@" />
                        <div className="col-span-2">
                            <InputField label="Professional Headline" value={form.headline} onChange={(v) => update("headline", v)} />
                        </div>
                        <InputField label="Location" value={form.location} onChange={(v) => update("location", v)} />
                        <InputField label="Website" value={form.website} onChange={(v) => update("website", v)} />
                    </div>
                </motion.section>

                {/* About */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 mb-6"
                >
                    <h2 className="text-sm font-semibold mb-4">About</h2>
                    <textarea
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        rows={4}
                        className="w-full resize-none px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] focus:ring-1 focus:ring-[oklch(0.58_0.18_260/0.3)] outline-none text-sm leading-relaxed placeholder:text-[var(--color-text-tertiary)]"
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1 text-right">{form.bio.length}/2000</p>
                </motion.section>

                {/* Work Preferences */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 mb-6"
                >
                    <h2 className="text-sm font-semibold mb-4">Work Preferences</h2>
                    <div className="space-y-4">
                        <ToggleRow
                            label="Open to Work"
                            description="Let recruiters know you're open to new opportunities"
                            checked={form.open_to_work}
                            onChange={(v) => update("open_to_work", v)}
                        />
                        <ToggleRow
                            label="Open to Hire"
                            description="Show that your company is hiring"
                            checked={form.open_to_hire}
                            onChange={(v) => update("open_to_hire", v)}
                        />
                    </div>
                </motion.section>

                {/* Experience Management */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold">Experience</h2>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[oklch(0.58_0.18_260/0.1)] text-[oklch(0.72_0.18_190)] hover:bg-[oklch(0.58_0.18_260/0.15)] transition-all">
                            + Add Experience
                        </button>
                    </div>
                    {[
                        { title: "Co-Founder & CTO", company: "Nexus", period: "2024 – Present" },
                        { title: "Senior Software Engineer", company: "Google", period: "2020 – 2024" },
                        { title: "Software Engineer", company: "Stripe", period: "2017 – 2020" },
                    ].map((exp, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--color-border-default)] last:border-0">
                            <div>
                                <p className="text-sm font-medium">{exp.title}</p>
                                <p className="text-xs text-[var(--color-text-tertiary)]">{exp.company} · {exp.period}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-1.5 rounded text-xs text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-tertiary)]">✏️</button>
                                <button className="p-1.5 rounded text-xs text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-tertiary)]">🗑️</button>
                            </div>
                        </div>
                    ))}
                </motion.section>

                {/* Skills Management */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold">Skills</h2>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[oklch(0.58_0.18_260/0.1)] text-[oklch(0.72_0.18_190)] hover:bg-[oklch(0.58_0.18_260/0.15)] transition-all">
                            + Add Skill
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Go", "TypeScript", "Distributed Systems", "Machine Learning", "React", "PostgreSQL", "Docker", "Kubernetes"].map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm"
                            >
                                {skill}
                                <button className="text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] text-xs">×</button>
                            </span>
                        ))}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}

function InputField({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
    return (
        <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-tertiary)]">{prefix}</span>
                )}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full ${prefix ? 'pl-8' : 'pl-4'} pr-4 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] focus:ring-1 focus:ring-[oklch(0.58_0.18_260/0.3)] outline-none text-sm`}
                />
            </div>
        </div>
    );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 rounded-full transition-all relative ${checked ? "bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" : "bg-[var(--color-bg-tertiary)]"}`}
            >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-[26px]" : "left-0.5"}`} />
            </button>
        </div>
    );
}
