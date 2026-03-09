"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface FormData {
    fullName: string;
    email: string;
    username: string;
    password: string;
    headline: string;
}

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        email: "",
        username: "",
        password: "",
        headline: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateField = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) {
            setStep(step + 1);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }

            window.location.href = "/feed";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel — Decorative */}
            <div className="hidden lg:block flex-1 relative bg-[var(--color-bg-secondary)] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[oklch(0.58_0.18_260/0.08)] blur-[120px] animate-float" />
                    <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-[oklch(0.72_0.18_190/0.06)] blur-[90px] animate-float" style={{ animationDelay: "3s" }} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="max-w-md">
                        <p className="text-5xl mb-6">⬡</p>
                        <h2 className="text-2xl font-bold mb-4">Join the future of professional networking</h2>
                        <div className="space-y-4 text-[var(--color-text-secondary)]">
                            <FeatureItem emoji="🤖" text="AI career coach that knows your entire professional history" />
                            <FeatureItem emoji="🎯" text="Smart job matching with 98-dimensional compatibility scoring" />
                            <FeatureItem emoji="💰" text="Real-time salary benchmarks across 50M+ data points" />
                            <FeatureItem emoji="🔒" text="No ads ever. Your data stays yours." />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <span className="text-2xl font-bold">Nexus</span>
                    </Link>

                    <h1 className="text-3xl font-bold mb-2">Create your account</h1>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        Step {step} of 2 — {step === 1 ? "Your credentials" : "Your professional identity"}
                    </p>

                    {/* Progress bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step
                                        ? "bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]"
                                        : "bg-[var(--color-border-default)]"
                                    }`}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-[oklch(0.65_0.20_25/0.1)] border border-[oklch(0.65_0.20_25/0.3)] text-sm text-[var(--color-error)]"
                            >
                                {error}
                            </motion.div>
                        )}

                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <InputField
                                    id="register-fullname"
                                    label="Full Name"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(v) => updateField("fullName", v)}
                                    placeholder="Jane Smith"
                                />
                                <InputField
                                    id="register-email"
                                    label="Email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(v) => updateField("email", v)}
                                    placeholder="jane@company.com"
                                />
                                <InputField
                                    id="register-password"
                                    label="Password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(v) => updateField("password", v)}
                                    placeholder="Min. 8 characters"
                                    minLength={8}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <InputField
                                    id="register-username"
                                    label="Username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(v) => updateField("username", v)}
                                    placeholder="janesmith"
                                    prefix="nexus.com/"
                                />
                                <InputField
                                    id="register-headline"
                                    label="Professional Headline"
                                    type="text"
                                    value={formData.headline}
                                    onChange={(v) => updateField("headline", v)}
                                    placeholder="Senior Engineer at Google"
                                />
                            </motion.div>
                        )}

                        <div className="flex gap-3 pt-2">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 py-3 rounded-lg border border-[var(--color-border-default)] text-sm font-medium hover:bg-[var(--color-bg-tertiary)] transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                id="register-submit"
                                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] text-white font-semibold text-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? "Creating..." : step < 2 ? "Continue" : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[oklch(0.72_0.18_190)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-4 text-center text-xs text-[var(--color-text-tertiary)]">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="underline hover:text-[var(--color-text-secondary)]">Terms</Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-[var(--color-text-secondary)]">Privacy Policy</Link>.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function InputField({
    id,
    label,
    type,
    required,
    value,
    onChange,
    placeholder,
    prefix,
    minLength,
}: {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    prefix?: string;
    minLength?: number;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {label}
            </label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-tertiary)]">
                        {prefix}
                    </span>
                )}
                <input
                    id={id}
                    type={type}
                    required={required}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    minLength={minLength}
                    className={`w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] focus:ring-1 focus:ring-[oklch(0.58_0.18_260/0.3)] outline-none transition-all text-sm placeholder:text-[var(--color-text-tertiary)] ${prefix ? "pl-[5.5rem]" : ""
                        }`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="text-lg shrink-0">{emoji}</span>
            <p className="text-sm">{text}</p>
        </div>
    );
}
