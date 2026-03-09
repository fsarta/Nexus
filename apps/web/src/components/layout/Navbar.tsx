"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-white font-bold text-sm">N</span>
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">
                            Nexus
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="#features">Features</NavLink>
                        <NavLink href="#pricing">Pricing</NavLink>
                        <NavLink href="#enterprise">Enterprise</NavLink>
                        <NavLink href="#startup-hub">Startup Hub</NavLink>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            id="cta-get-started"
                            className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all hover:shadow-[0_0_20px_oklch(0.58_0.18_260/0.3)]"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-[var(--color-text-secondary)]"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-strong border-t border-[var(--color-border-default)]"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <MobileNavLink href="#features" onClick={() => setMobileOpen(false)}>Features</MobileNavLink>
                            <MobileNavLink href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</MobileNavLink>
                            <MobileNavLink href="#enterprise" onClick={() => setMobileOpen(false)}>Enterprise</MobileNavLink>
                            <div className="pt-3 space-y-2">
                                <Link href="/login" className="block text-center py-2 text-sm text-[var(--color-text-secondary)]">
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="block text-center py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] group-hover:w-full transition-all duration-300" />
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
            {children}
        </Link>
    );
}
