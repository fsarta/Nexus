"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Tab = "account" | "privacy" | "notifications";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("account");

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "account", label: "Account", icon: "👤" },
        { id: "privacy", label: "Privacy", icon: "🔒" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <header className="fixed top-0 left-0 right-0 h-16 glass-strong z-50 flex items-center px-6">
                <Link href="/feed" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <span className="text-lg font-bold">Nexus</span>
                </Link>
                <span className="ml-4 text-sm text-[var(--color-text-tertiary)]">/ Settings</span>
            </header>

            <main className="max-w-4xl mx-auto pt-24 px-4 pb-16">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <nav className="w-56 shrink-0 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? "bg-[oklch(0.58_0.18_260/0.1)] text-[oklch(0.72_0.18_190)]"
                                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                        <hr className="border-[var(--color-border-default)] my-3" />
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                            <span>⚠️</span>
                            Delete Account
                        </button>
                    </nav>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        {activeTab === "account" && <AccountTab />}
                        {activeTab === "privacy" && <PrivacyTab />}
                        {activeTab === "notifications" && <NotificationsTab />}
                    </div>
                </div>
            </main>
        </div>
    );
}

function AccountTab() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Section title="Email & Password">
                <SettingRow label="Email" value="francesco@nexus.pro" action="Change" />
                <SettingRow label="Password" value="••••••••••" action="Update" />
                <SettingRow label="Two-Factor Auth" value="Enabled (Authenticator App)" action="Manage" badge="Active" badgeColor="success" />
            </Section>

            <Section title="Connected Accounts">
                <SettingRow label="Google" value="fsartori@gmail.com" action="Disconnect" badge="Connected" badgeColor="success" />
                <SettingRow label="GitHub" value="Not connected" action="Connect" />
                <SettingRow label="Apple" value="Not connected" action="Connect" />
            </Section>

            <Section title="Subscription">
                <div className="p-4 rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_260/0.1)] to-[oklch(0.72_0.18_190/0.1)] border border-[oklch(0.58_0.18_260/0.2)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">Nexus Pro</p>
                            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">€29.99/month · Renews May 15, 2026</p>
                        </div>
                        <button className="px-4 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all">
                            Manage
                        </button>
                    </div>
                </div>
            </Section>

            <Section title="Data & Privacy">
                <SettingRow label="Download your data" value="Get a copy of everything you've shared" action="Request" />
                <SettingRow label="Account language" value="English" action="Change" />
            </Section>
        </motion.div>
    );
}

function PrivacyTab() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Section title="Profile Visibility">
                <ToggleSetting label="Public profile" description="Allow anyone to see your profile" defaultChecked={true} />
                <ToggleSetting label="Show in search engines" description="Let Google and others index your profile" defaultChecked={true} />
                <ToggleSetting label="Show career score" description="Display your career score on your profile" defaultChecked={false} />
            </Section>

            <Section title="Messaging">
                <ToggleSetting label="Allow messages from anyone" description="People outside your network can message you" defaultChecked={false} />
                <ToggleSetting label="Read receipts" description="Let others know when you've read their messages" defaultChecked={true} />
                <ToggleSetting label="Typing indicators" description="Show when you're typing a message" defaultChecked={true} />
            </Section>

            <Section title="Activity">
                <ToggleSetting label="Show online status" description="Let others see when you're online" defaultChecked={true} />
                <ToggleSetting label="Profile views" description="See who viewed your profile (others can see you too)" defaultChecked={true} />
                <ToggleSetting label="Activity broadcasts" description="Notify network about profile updates and posts" defaultChecked={true} />
            </Section>
        </motion.div>
    );
}

function NotificationsTab() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Section title="Push Notifications">
                <ToggleSetting label="Direct messages" description="When someone sends you a message" defaultChecked={true} />
                <ToggleSetting label="Connection requests" description="When someone wants to connect" defaultChecked={true} />
                <ToggleSetting label="Post reactions" description="When someone reacts to your post" defaultChecked={true} />
                <ToggleSetting label="Comments" description="When someone comments on your post" defaultChecked={true} />
                <ToggleSetting label="Job recommendations" description="New jobs matching your profile" defaultChecked={false} />
            </Section>

            <Section title="Email Notifications">
                <ToggleSetting label="Weekly digest" description="Summary of your network activity" defaultChecked={true} />
                <ToggleSetting label="Job alerts" description="New jobs matching your skills" defaultChecked={false} />
                <ToggleSetting label="ARIA insights" description="AI-powered career recommendations" defaultChecked={true} />
                <ToggleSetting label="Marketing" description="Product updates and promotions" defaultChecked={false} />
            </Section>
        </motion.div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-6">
            <h3 className="text-sm font-semibold mb-4">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function SettingRow({ label, value, action, badge, badgeColor }: { label: string; value: string; action: string; badge?: string; badgeColor?: string }) {
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{label}</p>
                    {badge && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${badgeColor === "success" ? "bg-[var(--color-success)]/15 text-[var(--color-success)]" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"}`}>
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)]">{value}</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all">
                {action}
            </button>
        </div>
    );
}

function ToggleSetting({ label, description, defaultChecked }: { label: string; description: string; defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">{description}</p>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${checked ? "bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" : "bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)]"}`}
            >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
            </button>
        </div>
    );
}
