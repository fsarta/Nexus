"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Tab = "docs" | "playground" | "keys" | "pricing";

const endpoints = [
    { method: "GET", path: "/api/v1/users/{id}", desc: "Get user profile by ID", category: "Users" },
    { method: "POST", path: "/api/v1/users/search", desc: "Search users by criteria", category: "Users" },
    { method: "GET", path: "/api/v1/feed", desc: "Get personalized feed", category: "Feed" },
    { method: "POST", path: "/api/v1/posts", desc: "Create a new post", category: "Feed" },
    { method: "GET", path: "/api/v1/jobs", desc: "List job postings", category: "Jobs" },
    { method: "POST", path: "/api/v1/jobs", desc: "Create a job posting", category: "Jobs" },
    { method: "GET", path: "/api/v1/connections/{id}", desc: "Get user connections", category: "Social Graph" },
    { method: "POST", path: "/api/v1/messages", desc: "Send a direct message", category: "Messaging" },
    { method: "GET", path: "/api/v1/skills/verify/{id}", desc: "Get skill verification status", category: "Skills" },
    { method: "POST", path: "/api/v1/aria/chat", desc: "Send message to ARIA AI", category: "ARIA" },
];

const apiKeys = [
    { name: "Production", key: "nxs_prod_sk_1a2b3c...d4e5f6", created: "Feb 15, 2026", lastUsed: "2m ago", calls: "1.2M", status: "active" as const },
    { name: "Staging", key: "nxs_stg_sk_7g8h9i...j0k1l2", created: "Jan 3, 2026", lastUsed: "1h ago", calls: "45K", status: "active" as const },
    { name: "Development", key: "nxs_dev_sk_m3n4o5...p6q7r8", created: "Dec 10, 2025", lastUsed: "3d ago", calls: "8.2K", status: "active" as const },
];

const plans = [
    { name: "Free", price: "$0", calls: "1,000/mo", features: ["Basic endpoints", "Community support", "1 API key"] },
    { name: "Pro", price: "$99", calls: "100K/mo", features: ["All endpoints", "Priority support", "10 API keys", "Webhooks", "Rate limit: 100/s"], popular: true },
    { name: "Enterprise", price: "Custom", calls: "Unlimited", features: ["All Pro features", "Dedicated support", "Unlimited keys", "Custom SLA", "SSO/SAML", "Bulk operations"] },
];

export default function ApiPlatformPage() {
    const [tab, setTab] = useState<Tab>("docs");
    const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
    const [playgroundResponse, setPlaygroundResponse] = useState("");
    const methodColor = (m: string) => m === "GET" ? "text-green-400 bg-green-500/10" : m === "POST" ? "text-blue-400 bg-blue-500/10" : m === "PUT" ? "text-yellow-400 bg-yellow-500/10" : "text-red-400 bg-red-500/10";

    const runRequest = () => {
        setPlaygroundResponse(JSON.stringify({
            status: 200,
            data: {
                id: "usr_1a2b3c4d",
                name: "Francesco Sartori",
                headline: "Co-Founder & CTO @ Nexus",
                verified: true,
                connections: 2847,
                skills: ["Go", "TypeScript", "Distributed Systems"],
                created_at: "2024-01-15T10:30:00Z"
            }
        }, null, 2));
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/feed" className="flex items-center gap-2 shrink-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center"><span className="text-white font-bold text-sm">N</span></div></Link>
                <span className="text-sm font-semibold">{`</>`} API Platform</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">v1.0</span>
            </header>
            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16">
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]">
                    {(["docs", "playground", "keys", "pricing"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)]"}`}>{t === "docs" ? "Documentation" : t === "keys" ? "API Keys" : t}</button>
                    ))}
                </div>

                {tab === "docs" && (
                    <div className="flex gap-6">
                        <div className="w-64 shrink-0 space-y-1">
                            <p className="text-[10px] font-semibold uppercase text-[var(--color-text-tertiary)] mb-2">Endpoints</p>
                            {endpoints.map((ep, i) => (
                                <button key={i} onClick={() => setSelectedEndpoint(ep)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${selectedEndpoint === ep ? "bg-[oklch(0.58_0.18_260/0.1)] text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"}`}>
                                    <span className={`text-[9px] px-1 py-0.5 rounded font-mono font-bold ${methodColor(ep.method)}`}>{ep.method}</span>
                                    <span className="truncate font-mono text-[10px]">{ep.path}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${methodColor(selectedEndpoint.method)}`}>{selectedEndpoint.method}</span>
                                <code className="text-sm font-mono">{selectedEndpoint.path}</code>
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">{selectedEndpoint.desc}</p>
                            <div className="mb-4">
                                <h4 className="text-xs font-semibold mb-2">Request Headers</h4>
                                <div className="rounded-lg bg-[oklch(0.12_0.02_260)] p-3 font-mono text-[11px]">
                                    <p><span className="text-blue-400">Authorization</span>: <span className="text-green-400">Bearer nxs_prod_sk_...</span></p>
                                    <p><span className="text-blue-400">Content-Type</span>: <span className="text-green-400">application/json</span></p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h4 className="text-xs font-semibold mb-2">Response Example</h4>
                                <div className="rounded-lg bg-[oklch(0.12_0.02_260)] p-3 font-mono text-[11px] max-h-48 overflow-y-auto">
                                    <pre className="text-green-400">{`{
  "status": 200,
  "data": {
    "id": "usr_1a2b3c4d",
    "name": "Francesco Sartori",
    "headline": "Co-Founder & CTO @ Nexus",
    "verified": true
  }
}`}</pre>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold mb-2">Rate Limits</h4>
                                <p className="text-xs text-[var(--color-text-tertiary)]">Free: 10 req/s · Pro: 100 req/s · Enterprise: Custom</p>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "playground" && (
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
                        <h3 className="text-sm font-semibold mb-4">API Playground</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] text-[var(--color-text-tertiary)]">Method & Endpoint</label>
                                <div className="flex gap-2 mt-1">
                                    <select className="px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm font-mono"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>
                                    <input defaultValue="/api/v1/users/usr_1a2b3c4d" className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm font-mono outline-none" />
                                </div>
                                <label className="text-[10px] text-[var(--color-text-tertiary)] mt-3 block">Headers</label>
                                <textarea rows={3} defaultValue={`Authorization: Bearer nxs_prod_sk_...\nContent-Type: application/json`} className="w-full mt-1 px-3 py-2 rounded-lg bg-[oklch(0.12_0.02_260)] border border-[var(--color-border-default)] text-[11px] font-mono outline-none resize-none" />
                                <label className="text-[10px] text-[var(--color-text-tertiary)] mt-3 block">Body (JSON)</label>
                                <textarea rows={4} placeholder="{}" className="w-full mt-1 px-3 py-2 rounded-lg bg-[oklch(0.12_0.02_260)] border border-[var(--color-border-default)] text-[11px] font-mono outline-none resize-none" />
                                <button onClick={runRequest} className="mt-4 w-full py-2.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">▶ Send Request</button>
                            </div>
                            <div>
                                <label className="text-[10px] text-[var(--color-text-tertiary)]">Response</label>
                                <div className="mt-1 rounded-lg bg-[oklch(0.12_0.02_260)] border border-[var(--color-border-default)] p-3 min-h-[300px] font-mono text-[11px]">
                                    {playgroundResponse ? <pre className="text-green-400 whitespace-pre-wrap">{playgroundResponse}</pre> : <p className="text-[var(--color-text-tertiary)]">Send a request to see the response...</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "keys" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><h3 className="text-sm font-semibold">API Keys</h3><button className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">+ Generate Key</button></div>
                        {apiKeys.map((k, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2"><span className="text-sm font-semibold">{k.name}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-success)]/15 text-[var(--color-success)]">{k.status}</span></div>
                                    <code className="text-[11px] font-mono text-[var(--color-text-tertiary)]">{k.key}</code>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Created {k.created} · Last used {k.lastUsed} · {k.calls} calls</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 text-[10px] font-medium rounded-lg border border-[var(--color-border-default)]">Copy</button>
                                    <button className="px-3 py-1.5 text-[10px] font-medium rounded-lg border border-red-500/30 text-red-400">Revoke</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {tab === "pricing" && (
                    <div className="grid grid-cols-3 gap-6">
                        {plans.map((p, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                className={`rounded-2xl border p-6 relative ${p.popular ? "bg-[oklch(0.58_0.18_260/0.08)] border-[oklch(0.58_0.18_260/0.3)]" : "bg-[var(--color-bg-secondary)] border-[var(--color-border-default)]"}`}>
                                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-semibold rounded-full text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]">Most Popular</span>}
                                <h3 className="text-lg font-bold">{p.name}</h3>
                                <p className="text-3xl font-bold mt-2">{p.price}<span className="text-sm font-normal text-[var(--color-text-tertiary)]">/mo</span></p>
                                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{p.calls} API calls</p>
                                <ul className="mt-4 space-y-2">{p.features.map((f, fi) => <li key={fi} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2"><span className="text-[var(--color-success)]">✓</span>{f}</li>)}</ul>
                                <button className={`w-full mt-6 py-2.5 text-sm font-semibold rounded-xl ${p.popular ? "text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" : "border border-[var(--color-border-default)]"}`}>{p.name === "Enterprise" ? "Contact Sales" : "Get Started"}</button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
