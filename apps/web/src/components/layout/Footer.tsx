import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                                <span className="text-white font-bold text-sm">N</span>
                            </div>
                            <span className="text-lg font-bold">Nexus</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed">
                            The career operating system for modern professionals.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Product</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/features">Features</FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/enterprise">Enterprise</FooterLink>
                            <FooterLink href="/startup-hub">Startup Hub</FooterLink>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Resources</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/docs">Documentation</FooterLink>
                            <FooterLink href="/api">API</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/changelog">Changelog</FooterLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Company</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/about">About</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/press">Press</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Legal</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/privacy">Privacy</FooterLink>
                            <FooterLink href="/terms">Terms</FooterLink>
                            <FooterLink href="/gdpr">GDPR</FooterLink>
                            <FooterLink href="/security">Security</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                        © {new Date().getFullYear()} Nexus. All rights reserved. No ads. No data selling. Privacy-first.
                    </p>
                    <div className="flex items-center gap-4 text-[var(--color-text-tertiary)]">
                        <span className="text-xs">🌍 Global availability</span>
                        <span className="text-xs">🔒 SOC 2 compliant</span>
                        <span className="text-xs">🇪🇺 GDPR ready</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
                {children}
            </Link>
        </li>
    );
}
