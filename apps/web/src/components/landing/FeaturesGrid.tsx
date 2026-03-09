"use client";

import { motion } from "framer-motion";

const features = [
    {
        icon: "🤖",
        title: "ARIA AI Career Coach",
        description: "Your personal AI career strategist — skill gap analysis, interview prep, salary negotiation, and proactive career insights.",
        tag: "AI-Native",
        gradient: "from-[oklch(0.58_0.18_260)] to-[oklch(0.50_0.20_280)]",
    },
    {
        icon: "🎯",
        title: "Client Discovery",
        description: "B2B lead intelligence with intent signals, ICP matching, and AI-powered outreach. Find your next client before they find you.",
        tag: "B2B Sales",
        gradient: "from-[oklch(0.72_0.18_190)] to-[oklch(0.62_0.16_200)]",
    },
    {
        icon: "🚀",
        title: "Startup Hub",
        description: "Co-founder matching, investor connect, pitch arena, and AI-powered due diligence tools — all in one platform.",
        tag: "Founders",
        gradient: "from-[oklch(0.80_0.16_75)] to-[oklch(0.70_0.16_50)]",
    },
    {
        icon: "🏢",
        title: "Corporate Social",
        description: "Enterprise-grade internal network with departments, channels, HRIS sync, and compliance — the Yammer killer.",
        tag: "Enterprise",
        gradient: "from-[oklch(0.72_0.17_150)] to-[oklch(0.62_0.15_160)]",
    },
    {
        icon: "✅",
        title: "Verified Skills",
        description: "On-chain skill attestation, multi-level testing, and peer endorsements. Prove what you know, not just claim it.",
        tag: "Trust",
        gradient: "from-[oklch(0.65_0.20_25)] to-[oklch(0.55_0.18_15)]",
    },
    {
        icon: "💰",
        title: "Salary Transparency",
        description: "Real-time salary benchmarks across roles, locations, and seniority levels. Know your worth with 50M+ data points.",
        tag: "Intelligence",
        gradient: "from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]",
    },
];

export function FeaturesGrid() {
    return (
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-bold mb-4"
                    >
                        Everything LinkedIn{" "}
                        <span className="gradient-text">should have been</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto"
                    >
                        Six pillars of a truly useful professional platform — built with AI at the core.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                            <div className="relative z-10">
                                {/* Icon & Tag */}
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{feature.icon}</span>
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r ${feature.gradient} text-white`}>
                                        {feature.tag}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
