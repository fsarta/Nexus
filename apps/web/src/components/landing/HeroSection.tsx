"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[oklch(0.58_0.18_260/0.08)] blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[oklch(0.72_0.18_190/0.06)] blur-[100px] animate-float" style={{ animationDelay: "3s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[oklch(0.50_0.15_280/0.04)] blur-[150px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Now in Early Access — Join 10,000+ professionals
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
                >
                    The Career Operating{" "}
                    <br className="hidden sm:block" />
                    System You{" "}
                    <span className="gradient-text">Deserve</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    AI-native professional network. Build your career, discover clients,
                    launch startups — without being anyone&apos;s product.{" "}
                    <span className="text-[var(--color-text-primary)] font-medium">No ads. Ever.</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/register"
                        id="hero-cta-primary"
                        className="relative px-8 py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all hover:shadow-[0_0_30px_oklch(0.58_0.18_260/0.3)] active:scale-[0.98]"
                    >
                        Start Free — No Credit Card
                    </Link>
                    <Link
                        href="#features"
                        id="hero-cta-secondary"
                        className="px-8 py-3.5 text-base font-medium text-[var(--color-text-secondary)] rounded-xl border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] transition-all"
                    >
                        See How It Works
                    </Link>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-16 flex items-center justify-center gap-8"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="w-10 h-10 rounded-full border-2 border-[var(--color-bg-primary)] bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]"
                                style={{ opacity: 1 - i * 0.1 }}
                            />
                        ))}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                            10,000+ professionals
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                            already building their careers on Nexus
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
