"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "10K+", label: "Professionals", suffix: "in early access" },
    { value: "500+", label: "Companies", suffix: "onboarded" },
    { value: "98%", label: "Match Accuracy", suffix: "AI job matching" },
    { value: "0", label: "Ads", suffix: "ever" },
];

export function StatsBar() {
    return (
        <section className="py-16 border-y border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <p className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                                {stat.value}
                            </p>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                {stat.label}
                            </p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">
                                {stat.suffix}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
