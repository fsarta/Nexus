"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
interface Msg { id: string; role: "user" | "aria"; content: string; ts: string; }
const welcome: Msg = {
    id: "w", role: "aria", ts: "Now",
    content: "Hey Francesco! 👋 I'm ARIA, your AI career coach.\n\nI can help with:\n🎯 Career strategy\n📝 Profile review\n💼 Job search\n🤝 Networking tips\n📊 Salary insights\n✍️ Content strategy\n\nWhat would you like to explore?"
};
const responses: Record<string, string> = {
    career: "Based on your profile:\n\n📊 Career Score: 92/100 (Top 3%)\n\nStrengths:\n✅ Deep Go, distributed systems, AI/ML skills\n✅ Google → Stripe → Nexus leadership path\n✅ 2,847 connections, 12.3K followers\n\nGrowth:\n🔄 Publish more technical content (3.2x engagement)\n🎯 Add Product Management skills\n📈 Speak at 2-3 conferences in 2026\n\nWant a 90-day career growth plan?",
    profile: "Profile Strength: 92/100 🟢\n\n✅ Great: strong headline, verified badge, solid experiences\n❌ Improve: add profile photo (+14x views), 2 more verified skills, portfolio project\n\n📈 Expected: +35% views, +20% recruiter interest",
    salary: "💰 Salary Report (CTO, 8yr, Milan):\n\n25th: €95K-€120K\nMedian: €130K-€160K\n75th: €170K-€220K\n90th: €250K+\n\nYour estimated market value: €155K-€195K base\nGo + AI skills = 20% premium",
    jobs: "🎯 Top Matches:\n\n1. Staff Engineer @ Stripe — 92% match ($200K-$350K)\n2. ML Engineer @ DeepMind — 88% (£120K-£180K)\n3. CTO @ Stealth Startup — 85% (15-25% equity)\n\nWant me to help with hiring for YOUR company instead?"
};
export default function AriaPage() {
    const [msgs, setMsgs] = useState<Msg[]>([welcome]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
    const send = (text: string) => {
        if (!text.trim()) return;
        setMsgs(p => [...p, { id: `u${Date.now()}`, role: "user", content: text, ts: "Now" }]);
        setInput(""); setTyping(true);
        setTimeout(() => {
            const key = Object.keys(responses).find(k => text.toLowerCase().includes(k)) || "career";
            setMsgs(p => [...p, { id: `a${Date.now()}`, role: "aria", content: responses[key], ts: "Now" }]);
            setTyping(false);
        }, 1500);
    };
    const quickActions = [
        { label: "📊 Career Analysis", key: "career" }, { label: "📝 Profile Review", key: "profile" },
        { label: "💰 Salary Insights", key: "salary" }, { label: "💼 Job Matches", key: "jobs" }];
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
            <header className="h-14 glass-strong flex items-center px-6 shrink-0 z-50">
                <Link href="/feed" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span></div></Link>
                <div className="ml-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white text-sm">🤖</span></div>
                    <div><h1 className="text-sm font-semibold">ARIA</h1><p className="text-[10px] text-[oklch(0.72_0.18_190)]">AI Career Coach · Online</p></div>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden max-w-5xl mx-auto w-full">
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {msgs.map(m => (
                            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className="max-w-[80%]">
                                    {m.role === "aria" && <div className="flex items-center gap-2 mb-1"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white text-[10px]">🤖</span></div><span className="text-xs font-semibold text-[oklch(0.72_0.18_190)]">ARIA</span></div>}
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.52_0.17_270)] text-white rounded-br-md" : "bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-bl-md"}`}>
                                        {m.content.split(/(\*\*.*?\*\*)/).map((p, i) => p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {typing && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white text-[10px]">🤖</span></div><div className="px-4 py-3 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]"><div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)] animate-bounce" /><span className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)] animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)] animate-bounce" style={{ animationDelay: "300ms" }} /></div></div></motion.div>}
                        <div ref={endRef} />
                    </div>
                    {msgs.length <= 1 && <div className="px-6 mb-3 flex gap-2 flex-wrap">{quickActions.map(a => <button key={a.key} onClick={() => send(a.label)} className="px-4 py-2 text-xs font-medium rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] hover:border-[oklch(0.58_0.18_260/0.3)] transition-all">{a.label}</button>)}</div>}
                    <div className="px-6 py-4 border-t border-[var(--color-border-default)]">
                        <div className="flex items-end gap-3">
                            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder="Ask ARIA anything about your career..." rows={1} className="flex-1 resize-none px-4 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] outline-none text-sm" />
                            <button onClick={() => send(input)} disabled={!input.trim() || typing} className="p-2.5 rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] text-white disabled:opacity-30 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
                        </div>
                    </div>
                </div>
                <aside className="w-72 border-l border-[var(--color-border-default)] p-4 hidden lg:block overflow-y-auto">
                    <h3 className="text-xs font-semibold uppercase text-[var(--color-text-tertiary)] mb-3">Your Insights</h3>
                    <div className="space-y-3">
                        <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3">
                            <p className="text-xs font-semibold mb-1">Career Score</p>
                            <div className="flex items-center gap-3"><div className="text-2xl font-bold gradient-text">92</div><div className="flex-1"><div className="h-2 rounded-full bg-[var(--color-bg-tertiary)]"><div className="h-2 rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" style={{ width: "92%" }} /></div><p className="text-[9px] text-[var(--color-text-tertiary)] mt-0.5">Top 3% in Engineering</p></div></div>
                        </div>
                        <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3">
                            <p className="text-xs font-semibold mb-2">Profile Views</p><p className="text-lg font-bold">1,247</p><p className="text-[10px] text-[var(--color-success)]">↑ 23% this week</p>
                        </div>
                        <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3">
                            <p className="text-xs font-semibold mb-2">Post Performance</p><p className="text-lg font-bold">45.2K</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Impressions this month</p>
                        </div>
                        <div className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-3">
                            <p className="text-xs font-semibold mb-2">Search Appearances</p><p className="text-lg font-bold">342</p><p className="text-[10px] text-[var(--color-text-tertiary)]">Times in search results</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
