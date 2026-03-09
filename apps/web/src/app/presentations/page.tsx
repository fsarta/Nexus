"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const templates = [
    { id: "t1", name: "Pitch Deck", slides: 12, style: "gradient", preview: "🚀", desc: "Perfect for startup fundraising" },
    { id: "t2", name: "Portfolio", slides: 8, style: "minimal", preview: "🎨", desc: "Showcase your best work" },
    { id: "t3", name: "Case Study", slides: 10, style: "data", preview: "📊", desc: "Data-driven project stories" },
    { id: "t4", name: "Team Intro", slides: 6, style: "photo", preview: "👥", desc: "Introduce your team culture" },
    { id: "t5", name: "Product Launch", slides: 15, style: "bold", preview: "⚡", desc: "Make a splash with new products" },
    { id: "t6", name: "Quarterly Review", slides: 9, style: "corporate", preview: "📈", desc: "Business results and KPIs" },
];

const myPresentations = [
    { id: "p1", title: "Nexus Series A Pitch", slides: 14, views: 342, shared: 28, lastEdited: "2 days ago", status: "published" as const },
    { id: "p2", title: "Q1 2026 Engineering Review", slides: 11, views: 89, shared: 12, lastEdited: "1 week ago", status: "draft" as const },
    { id: "p3", title: "AI Architecture Deep Dive", slides: 22, views: 1247, shared: 156, lastEdited: "3 weeks ago", status: "published" as const },
];

export default function PresentationsPage() {
    const [tab, setTab] = useState<"my" | "templates" | "shared">("my");
    const [showEditor, setShowEditor] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    const editorSlides = [
        { id: 0, title: "Cover", content: "Nexus — The Career Operating System", bg: "from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" },
        { id: 1, title: "Problem", content: "Professional networking is broken.\n94% of professionals feel LinkedIn doesn't represent their real skills.", bg: "from-[oklch(0.25_0.05_260)] to-[oklch(0.20_0.04_280)]" },
        { id: 2, title: "Solution", content: "AI-native career platform\n• Skill verification with blockchain\n• 3D presentations (like this one!)\n• ARIA AI career coach", bg: "from-[oklch(0.30_0.08_260)] to-[oklch(0.25_0.06_190)]" },
        { id: 3, title: "Market", content: "$500B professional services market\nTAM: 3.5B professionals globally\nSAM: 500M knowledge workers", bg: "from-[oklch(0.22_0.06_280)] to-[oklch(0.28_0.08_260)]" },
        { id: 4, title: "Traction", content: "• 50K beta users (30% MoM growth)\n• 92% retention rate\n• NPS: 78", bg: "from-[oklch(0.20_0.04_260)] to-[oklch(0.30_0.10_190)]" },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div>
                </Link>
                <span className="text-sm font-semibold">Presentations</span>
                <div className="ml-auto">
                    <button onClick={() => setShowEditor(true)} className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90">+ New Presentation</button>
                </div>
            </header>

            <AnimatePresence>
                {showEditor ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[var(--color-bg-primary)]">
                        {/* Editor */}
                        <div className="h-12 flex items-center px-4 border-b border-[var(--color-border-default)] gap-3">
                            <button onClick={() => setShowEditor(false)} className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">← Back</button>
                            <span className="text-sm font-semibold">Nexus Series A Pitch</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-success)]/15 text-[var(--color-success)]">Auto-saved</span>
                            <div className="ml-auto flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border-default)]">Preview 3D</button>
                                <button className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Publish</button>
                            </div>
                        </div>
                        <div className="flex h-[calc(100vh-3rem)]">
                            {/* Slide thumbnails */}
                            <div className="w-48 border-r border-[var(--color-border-default)] overflow-y-auto p-3 space-y-2">
                                {editorSlides.map((s, i) => (
                                    <button key={s.id} onClick={() => setActiveSlide(i)} className={`w-full aspect-[16/9] rounded-lg bg-gradient-to-br ${s.bg} p-2 text-left transition-all ${activeSlide === i ? "ring-2 ring-[oklch(0.72_0.18_190)]" : "opacity-60 hover:opacity-80"}`}>
                                        <p className="text-[7px] font-semibold text-white">{s.title}</p>
                                    </button>
                                ))}
                                <button className="w-full aspect-[16/9] rounded-lg border-2 border-dashed border-[var(--color-border-default)] flex items-center justify-center text-xs text-[var(--color-text-tertiary)] hover:border-[oklch(0.58_0.18_260/0.3)]">+ Add Slide</button>
                            </div>
                            {/* Main canvas */}
                            <div className="flex-1 flex items-center justify-center p-8 bg-[oklch(0.12_0.02_260)]">
                                <motion.div key={activeSlide} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-3xl aspect-[16/9] rounded-2xl bg-gradient-to-br ${editorSlides[activeSlide].bg} p-12 flex flex-col justify-center shadow-2xl`}>
                                    <p className="text-xs uppercase tracking-wider text-white/50 mb-2">{editorSlides[activeSlide].title}</p>
                                    <p className="text-2xl font-bold text-white whitespace-pre-line leading-relaxed">{editorSlides[activeSlide].content}</p>
                                </motion.div>
                            </div>
                            {/* Properties */}
                            <div className="w-64 border-l border-[var(--color-border-default)] p-4 space-y-4">
                                <h3 className="text-xs font-semibold uppercase text-[var(--color-text-tertiary)]">Slide Properties</h3>
                                <div>
                                    <label className="text-[10px] text-[var(--color-text-tertiary)]">Animation</label>
                                    <select className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm">
                                        <option>Fade In</option><option>Slide Left</option><option>Zoom</option><option>3D Rotate</option><option>Parallax</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-[var(--color-text-tertiary)]">3D Effect</label>
                                    <select className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm">
                                        <option>Perspective Tilt</option><option>Cube Rotate</option><option>Flip</option><option>Sphere</option><option>None</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-[var(--color-text-tertiary)]">Background Style</label>
                                    <div className="grid grid-cols-4 gap-2 mt-1">
                                        {["from-[oklch(0.58_0.18_260)]", "from-[oklch(0.20_0.04_280)]", "from-[oklch(0.30_0.10_190)]", "from-[oklch(0.40_0.12_30)]"].map((c, i) => (
                                            <button key={i} className={`aspect-square rounded-lg bg-gradient-to-br ${c} to-transparent border-2 ${i === 0 ? "border-white/50" : "border-transparent"}`} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-[var(--color-text-tertiary)]">AI Suggestions</label>
                                    <div className="mt-1 p-2.5 rounded-lg bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)] text-[10px] text-[var(--color-text-secondary)]">
                                        💡 Add a competitor comparison slide after "Market" to strengthen your pitch.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <main className="max-w-5xl mx-auto pt-20 px-4 pb-16">
                        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                            {(["my", "templates", "shared"] as const).map(t => (
                                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>{t === "my" ? "My Presentations" : t}</button>
                            ))}
                        </div>

                        {tab === "my" && (
                            <div className="space-y-3">
                                {myPresentations.map((p, i) => (
                                    <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setShowEditor(true)}
                                        className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-5 flex items-center gap-4 cursor-pointer hover:border-[var(--color-border-hover)] transition-all">
                                        <div className="w-24 h-14 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center text-white text-xs font-bold">3D</div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold">{p.title}</h3>
                                            <p className="text-[11px] text-[var(--color-text-tertiary)]">{p.slides} slides · Edited {p.lastEdited}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-[11px] text-[var(--color-text-tertiary)]">
                                            <span>👁 {p.views}</span><span>🔗 {p.shared}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${p.status === "published" ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"}`}>{p.status}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {tab === "templates" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map((t, i) => (
                                    <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden hover:border-[var(--color-border-hover)] transition-all cursor-pointer">
                                        <div className="h-32 bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center text-4xl">{t.preview}</div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold">{t.name}</h3>
                                            <p className="text-[11px] text-[var(--color-text-tertiary)]">{t.desc}</p>
                                            <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">{t.slides} slides · {t.style}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {tab === "shared" && (
                            <div className="text-center py-16 text-[var(--color-text-tertiary)]">
                                <span className="text-4xl">📤</span>
                                <p className="text-sm mt-3">No shared presentations yet</p>
                                <p className="text-xs mt-1">Presentations shared with you will appear here</p>
                            </div>
                        )}
                    </main>
                )}
            </AnimatePresence>
        </div>
    );
}
