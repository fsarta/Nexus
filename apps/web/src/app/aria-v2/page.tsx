"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Mode = "chat" | "career-path" | "interview" | "resume";
const careerPath = [
    { year: "2017", role: "Software Engineer", company: "Stripe", level: 1, salary: "€55K" },
    { year: "2020", role: "Senior Software Engineer", company: "Google", level: 2, salary: "€105K" },
    { year: "2024", role: "Co-Founder & CTO", company: "Nexus", level: 3, salary: "€150K + equity" },
    { year: "2027", role: "CEO or Venture Partner", company: "Future", level: 4, salary: "€300K+", predicted: true },
    { year: "2030", role: "Board Member / Angel Investor", company: "Future", level: 5, salary: "Portfolio returns", predicted: true },
];
const interviewQuestions = [
    { id: 1, category: "System Design", question: "Design a URL shortener that handles 1B redirects/day", difficulty: "Hard", timeMin: 45 },
    { id: 2, category: "Behavioral", question: "Tell me about a time you had to make a difficult technical decision with incomplete information", difficulty: "Medium", timeMin: 10 },
    { id: 3, category: "Technical", question: "Explain the difference between eventual consistency and strong consistency. When would you use each?", difficulty: "Medium", timeMin: 15 },
    { id: 4, category: "Leadership", question: "How do you handle disagreements between senior engineers on your team about architectural decisions?", difficulty: "Medium", timeMin: 10 },
    { id: 5, category: "System Design", question: "Design a real-time messaging system like Nexus Messages that supports 100M concurrent users", difficulty: "Hard", timeMin: 45 },
];
export default function AriaV2Page() {
    const [mode, setMode] = useState<Mode>("chat");
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const modes: { id: Mode; label: string; icon: string }[] = [
        { id: "chat", label: "Chat", icon: "💬" }, { id: "career-path", label: "Career Path", icon: "🗺️" },
        { id: "interview", label: "Interview Prep", icon: "🎤" }, { id: "resume", label: "Resume Review", icon: "📄" }];
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="h-14 glass-strong flex items-center px-6 shrink-0 z-50">
                <Link href="/feed" className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <div className="ml-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white text-sm">🤖</span></div>
                    <div><h1 className="text-sm font-semibold">ARIA v2</h1><p className="text-[10px] text-[oklch(0.72_0.18_190)]">Enhanced AI · Multi-Modal</p></div>
                </div>
                <div className="ml-auto flex gap-1">{modes.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === m.id ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"}`}>{m.icon} {m.label}</button>
                ))}</div>
            </header>
            <main className="max-w-5xl mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    {mode === "chat" && (
                        <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-6">
                            <div className="flex-1 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                                <div className="text-center py-12"><span className="text-5xl">🤖</span><h2 className="text-lg font-bold mt-4">ARIA v2 — Enhanced Mode</h2><p className="text-sm text-[var(--color-text-tertiary)] mt-1">Now with multi-modal analysis, career path prediction, and interview prep</p>
                                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                                        {["Analyze my GitHub profile", "Review my resume PDF", "Compare two job offers", "Prep for Google interview", "Negotiate my salary"].map(s => (
                                            <button key={s} className="px-4 py-2 text-xs rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] hover:border-[oklch(0.58_0.18_260/0.3)] transition-all">{s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <aside className="w-72 space-y-4">
                                <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                                    <h3 className="text-xs font-semibold uppercase text-[var(--color-text-tertiary)] mb-3">v2 Capabilities</h3>
                                    <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                                        {["📄 PDF resume analysis", "💻 GitHub profile review", "📊 Multi-offer comparison", "🎤 Mock interviews", "🗺️ Career path prediction", "💰 Salary negotiation coach"].map((c, i) => (
                                            <div key={i} className="p-2 rounded-lg bg-[var(--color-bg-tertiary)]">{c}</div>))}
                                    </div>
                                </div>
                            </aside>
                        </motion.div>
                    )}
                    {mode === "career-path" && (
                        <motion.div key="path" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                                <h2 className="text-lg font-bold mb-1">Your Career Path</h2>
                                <p className="text-xs text-[var(--color-text-tertiary)] mb-6">AI-predicted trajectory based on your skills, experience, and market trends</p>
                                <div className="relative">
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" />
                                    {careerPath.map((step, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                                            className={`relative flex items-start gap-6 mb-8 last:mb-0 ${step.predicted ? "opacity-70" : ""}`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 ${step.predicted ? "bg-[var(--color-bg-tertiary)] border-2 border-dashed border-[oklch(0.58_0.18_260/0.3)]" : "bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]"}`}>
                                                <span className="text-white text-sm font-bold">{step.level}</span>
                                            </div>
                                            <div className={`flex-1 p-4 rounded-xl ${step.predicted ? "border-2 border-dashed border-[var(--color-border-default)] bg-[var(--color-bg-tertiary)]/50" : "bg-[var(--color-bg-tertiary)]"}`}>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold">{step.role}</p>
                                                    {step.predicted && <span className="px-1.5 py-0.5 text-[8px] font-medium rounded bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">AI Predicted</span>}
                                                </div>
                                                <p className="text-xs text-[var(--color-text-secondary)]">{step.company} · {step.year}</p>
                                                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">💰 {step.salary}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 rounded-xl bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)]">
                                    <p className="text-xs text-[var(--color-text-secondary)]">🤖 <strong>ARIA&apos;s prediction confidence:</strong> 78% — Based on your current trajectory, skill growth rate, and market trends. The CEO path assumes continued leadership experience and successful Nexus growth. Alternative paths include VP Engineering at a larger company (82% confidence) or independent consulting (75%).</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {mode === "interview" && (
                        <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {!interviewStarted ? (
                                <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                                    <h2 className="text-lg font-bold mb-1">Interview Prep</h2>
                                    <p className="text-xs text-[var(--color-text-tertiary)] mb-6">Practice with AI-generated questions tailored to your target role</p>
                                    <div className="space-y-3">
                                        {interviewQuestions.map((q, i) => (
                                            <div key={q.id} className="rounded-xl bg-[var(--color-bg-tertiary)] p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold">{i + 1}</div>
                                                <div className="flex-1"><p className="text-sm font-medium">{q.question}</p><p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{q.category} · {q.difficulty} · {q.timeMin} min</p></div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setInterviewStarted(true)} className="mt-6 w-full py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Start Mock Interview</button>
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div><p className="text-[10px] text-[var(--color-text-tertiary)]">Question {currentQ + 1} of {interviewQuestions.length}</p><h2 className="text-lg font-bold mt-1">{interviewQuestions[currentQ].question}</h2><p className="text-xs text-[var(--color-text-tertiary)] mt-1">{interviewQuestions[currentQ].category} · {interviewQuestions[currentQ].difficulty}</p></div>
                                        <div className="text-center"><p className="text-2xl font-bold gradient-text">{interviewQuestions[currentQ].timeMin}:00</p><p className="text-[9px] text-[var(--color-text-tertiary)]">Time left</p></div>
                                    </div>
                                    <textarea rows={8} placeholder="Type your answer here... ARIA will evaluate your response." className="w-full resize-none px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm outline-none focus:border-[oklch(0.58_0.18_260)]" />
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)] disabled:opacity-30">← Previous</button>
                                        <button className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Submit Answer</button>
                                        <button onClick={() => setCurrentQ(Math.min(interviewQuestions.length - 1, currentQ + 1))} className="px-5 py-2.5 text-sm font-medium rounded-xl border border-[var(--color-border-default)]">Skip →</button>
                                        <button onClick={() => { setInterviewStarted(false); setCurrentQ(0); }} className="ml-auto px-5 py-2.5 text-sm font-medium rounded-xl border border-red-500/30 text-red-400">End Interview</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {mode === "resume" && (
                        <motion.div key="resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                                <h2 className="text-lg font-bold mb-1">Resume Review</h2>
                                <p className="text-xs text-[var(--color-text-tertiary)] mb-6">Upload your resume and get AI-powered feedback</p>
                                <div className="border-2 border-dashed border-[var(--color-border-default)] rounded-2xl p-12 text-center hover:border-[oklch(0.58_0.18_260/0.3)] transition-all cursor-pointer">
                                    <span className="text-4xl">📄</span>
                                    <p className="text-sm font-medium mt-3">Drop your resume here or click to upload</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">PDF, DOCX · Max 10MB</p>
                                </div>
                                <div className="mt-6 p-4 rounded-xl bg-[oklch(0.58_0.18_260/0.08)] border border-[oklch(0.58_0.18_260/0.15)]">
                                    <h3 className="text-sm font-semibold mb-2">What ARIA will analyze:</h3>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)]">
                                        {["📝 Content & clarity", "🎯 ATS compatibility", "📊 Quantified impact", "🔤 Grammar & tone", "🎨 Formatting & layout", "💡 Missing keywords"].map((i, idx) => (
                                            <div key={idx} className="p-2 rounded-lg bg-[var(--color-bg-tertiary)]">{i}</div>))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
