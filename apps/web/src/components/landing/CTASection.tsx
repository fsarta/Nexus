"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[oklch(0.58_0.18_260/0.06)] blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10 max-w-3xl mx-auto text-center"
            >
                <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                    Your career deserves{" "}
                    <span className="gradient-text">better tools</span>
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
                    Join the professional network built for you, not for advertisers.
                    Free forever for core features. No credit card required.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register"
                        id="cta-bottom-primary"
                        className="px-10 py-4 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all hover:shadow-[0_0_30px_oklch(0.58_0.18_260/0.3)] active:scale-[0.98]"
                    >
                        Create Your Nexus Profile
                    </Link>
                    <Link
                        href="#pricing"
                        className="px-10 py-4 text-base font-medium text-[var(--color-text-secondary)] rounded-xl border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all"
                    >
                        View Pricing Plans
                    </Link>
                </div>

                <p className="mt-6 text-xs text-[var(--color-text-tertiary)]">
                    🔒 Privacy-first · GDPR compliant · SOC 2 Type II · No ads, no data selling
                </p>
            </motion.div>
        </section>
    );
}
