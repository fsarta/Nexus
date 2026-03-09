"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Types & Mock Data ───────────────────────────

interface PostData {
    id: string;
    author: { name: string; headline: string; avatar?: string; verified: boolean };
    content: string;
    media_url?: string;
    post_type: "text" | "image" | "article";
    like_count: number;
    comment_count: number;
    repost_count: number;
    view_count: number;
    has_liked: boolean;
    time: string;
    reactions: string[];
}

const mockPosts: PostData[] = [
    {
        id: "p1",
        author: { name: "Marco Rossi", headline: "AI Researcher @ DeepMind", verified: true },
        content: "Just published our new paper on transformer architectures for code generation. The results are incredible — 40% improvement in code completion accuracy compared to GPT-4.\n\nKey takeaways:\n🔬 Novel attention mechanism for long-range dependencies\n📊 Benchmarked on 12 programming languages\n🚀 Open-source model available on HuggingFace\n\n#AI #MachineLearning #Research",
        post_type: "text",
        like_count: 847,
        comment_count: 92,
        repost_count: 234,
        view_count: 45200,
        has_liked: false,
        time: "2h",
        reactions: ["👍", "🎉", "💡"],
    },
    {
        id: "p2",
        author: { name: "Sarah Chen", headline: "CTO @ CloudScale · Ex-AWS", verified: true },
        content: "Hot take: The best engineering teams I've seen don't have the best engineers. They have the best communicators.\n\nTechnical skill is table stakes. What separates great teams:\n\n1. Clear written communication\n2. Psychological safety\n3. Shared context on WHY, not just WHAT\n4. Blameless postmortems\n5. Celebrating learning from failure\n\nAgree? 🤔",
        post_type: "text",
        like_count: 2341,
        comment_count: 187,
        repost_count: 456,
        view_count: 128400,
        has_liked: true,
        time: "5h",
        reactions: ["👍", "💡", "❤️"],
    },
    {
        id: "p3",
        author: { name: "TechStart Inc.", headline: "Building the future of work", verified: false },
        content: "🎉 We're thrilled to announce our $25M Series A!\n\nThis funding will help us expand our AI-powered hiring platform to 10 new markets and hire 50 engineers.\n\nIf you're passionate about revolutionizing recruitment, check out our open positions:\n→ Senior Backend Engineer (Go)\n→ ML Engineer (PyTorch)\n→ Product Designer\n\n#Hiring #Startup #FundingNews",
        post_type: "text",
        like_count: 423,
        comment_count: 34,
        repost_count: 89,
        view_count: 23100,
        has_liked: false,
        time: "8h",
        reactions: ["👍", "🎉"],
    },
    {
        id: "p4",
        author: { name: "Alex Kim", headline: "Founder @ DataPipeline.io", verified: false },
        content: "I left a $400k job at FAANG to build my startup. 18 months in, here's what I've learned:\n\n• Revenue doesn't equal product-market fit\n• Your first 10 customers teach you more than 10,000 surveys\n• Hiring slowly is the hardest but most important discipline\n• Mental health is your most valuable asset\n• The loneliest moments produce the biggest breakthroughs\n\nTo everyone on the founder journey — keep going. 💪",
        post_type: "text",
        like_count: 5621,
        comment_count: 342,
        repost_count: 1203,
        view_count: 312000,
        has_liked: false,
        time: "12h",
        reactions: ["👍", "❤️", "🎉", "💡"],
    },
];

// ── Main Feed Component ─────────────────────────

export default function FeedPage() {
    const [showComposer, setShowComposer] = useState(false);
    const [posts] = useState(mockPosts);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-14 glass-strong z-50 flex items-center px-6 gap-4">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-lg">
                    <Link href="/search" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-tertiary)] hover:border-[var(--color-border-hover)] transition-all">
                        🔍 Search people, jobs, posts...
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex items-center gap-1">
                    {[
                        { href: "/feed", label: "Feed", icon: "🏠", active: true },
                        { href: "/network", label: "Network", icon: "👥", active: false },
                        { href: "/jobs", label: "Jobs", icon: "💼", active: false },
                        { href: "/messages", label: "Messages", icon: "💬", active: false },
                        { href: "/aria", label: "ARIA", icon: "🤖", active: false },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center px-4 py-1.5 rounded-lg text-[10px] font-medium transition-all ${item.active
                                    ? "text-[oklch(0.72_0.18_190)]"
                                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                                }`}
                        >
                            <span className="text-base mb-0.5">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Profile */}
                <Link href="/profile/me" className="ml-2 w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-semibold shrink-0">
                    F
                </Link>
            </header>

            <main className="max-w-6xl mx-auto pt-20 px-4 pb-16 flex gap-6">
                {/* Left Sidebar */}
                <aside className="w-56 shrink-0 hidden lg:block space-y-4">
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden">
                        <div className="h-16 bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" />
                        <div className="px-4 pb-4 -mt-6 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-bg-elevated)] border-2 border-[var(--color-bg-secondary)] flex items-center justify-center text-sm font-bold">F</div>
                            <p className="text-sm font-semibold mt-2">Francesco Sartori</p>
                            <p className="text-[10px] text-[var(--color-text-tertiary)]">Senior Software Engineer</p>
                            <div className="flex justify-center gap-4 mt-3 text-center">
                                <div>
                                    <p className="text-xs font-bold">2,847</p>
                                    <p className="text-[9px] text-[var(--color-text-tertiary)]">Connections</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">12.3K</p>
                                    <p className="text-[9px] text-[var(--color-text-tertiary)]">Followers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-2 space-y-0.5">
                        {[
                            { href: "/profile/edit", label: "Edit Profile", icon: "✏️" },
                            { href: "/settings", label: "Settings", icon: "⚙️" },
                            { href: "/analytics", label: "Analytics", icon: "📊" },
                        ].map((item) => (
                            <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all">
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Feed */}
                <div className="flex-1 max-w-xl space-y-4">
                    {/* Composer Trigger */}
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold shrink-0">F</div>
                            <button
                                onClick={() => setShowComposer(true)}
                                className="flex-1 text-left px-4 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-tertiary)] hover:border-[var(--color-border-hover)] transition-all"
                            >
                                Share your thoughts, insights, or news...
                            </button>
                        </div>
                        <div className="flex gap-2 mt-3 pl-[52px]">
                            {[
                                { icon: "🖼️", label: "Photo" },
                                { icon: "🎥", label: "Video" },
                                { icon: "📄", label: "Article" },
                                { icon: "📊", label: "Poll" },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => setShowComposer(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Posts */}
                    {posts.map((post, i) => (
                        <PostCard key={post.id} post={post} index={i} />
                    ))}
                </div>

                {/* Right Sidebar */}
                <aside className="w-72 shrink-0 hidden xl:block space-y-4">
                    {/* ARIA Widget */}
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-base">🤖</span>
                            <h3 className="text-sm font-semibold">ARIA Insights</h3>
                            <span className="ml-auto px-1.5 py-0.5 text-[9px] font-medium rounded bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]">AI</span>
                        </div>
                        <div className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
                            <div className="p-2.5 rounded-lg bg-[var(--color-bg-tertiary)]">
                                💡 <strong>3 connections</strong> changed roles this week. Consider reaching out!
                            </div>
                            <div className="p-2.5 rounded-lg bg-[var(--color-bg-tertiary)]">
                                📈 Posts with code snippets get <strong>3.2x more engagement</strong> in your field.
                            </div>
                        </div>
                        <Link href="/aria" className="mt-3 block text-center text-[10px] text-[oklch(0.72_0.18_190)] font-medium hover:underline">
                            Talk to ARIA →
                        </Link>
                    </div>

                    {/* Trending */}
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                        <h3 className="text-sm font-semibold mb-3">Trending on Nexus</h3>
                        {[
                            { topic: "#AIStartups", posts: "12.4K posts" },
                            { topic: "#RemoteWork2026", posts: "8.7K posts" },
                            { topic: "#GoLang", posts: "5.2K posts" },
                            { topic: "#FounderLife", posts: "4.1K posts" },
                        ].map((t) => (
                            <div key={t.topic} className="py-2 border-b border-[var(--color-border-default)] last:border-0">
                                <p className="text-sm font-medium text-[oklch(0.72_0.18_190)]">{t.topic}</p>
                                <p className="text-[10px] text-[var(--color-text-tertiary)]">{t.posts}</p>
                            </div>
                        ))}
                    </div>

                    {/* People to follow */}
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                        <h3 className="text-sm font-semibold mb-3">People to Follow</h3>
                        {[
                            { name: "Lisa Wang", headline: "VP Engineering @ Meta" },
                            { name: "Raj Patel", headline: "Founder @ CleanEnergy.ai" },
                            { name: "Emma Schmidt", headline: "ML Lead @ Tesla" },
                        ].map((p) => (
                            <div key={p.name} className="flex items-center gap-2.5 py-2">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-semibold shrink-0">{p.name.charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{p.name}</p>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">{p.headline}</p>
                                </div>
                                <button className="px-2.5 py-1 text-[10px] font-medium rounded-lg border border-[oklch(0.58_0.18_260/0.3)] text-[oklch(0.72_0.18_190)] hover:bg-[oklch(0.58_0.18_260/0.1)] transition-all shrink-0">
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>

            {/* Post Composer Modal */}
            <AnimatePresence>
                {showComposer && <PostComposer onClose={() => setShowComposer(false)} />}
            </AnimatePresence>
        </div>
    );
}

// ── Post Card Component ─────────────────────────

function PostCard({ post, index }: { post: PostData; index: number }) {
    const [liked, setLiked] = useState(post.has_liked);
    const [likeCount, setLikeCount] = useState(post.like_count);
    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    const formatCount = (n: number) => {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return n.toString();
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden"
        >
            {/* Author Header */}
            <div className="flex items-start gap-3 p-4 pb-0">
                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold shrink-0">
                    {post.author.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold">{post.author.name}</span>
                        {post.author.verified && <span className="text-[9px] px-1 py-0.5 rounded bg-[oklch(0.72_0.18_190/0.15)] text-[oklch(0.72_0.18_190)]">✓</span>}
                    </div>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">{post.author.headline}</p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">{post.time} ago · 🌐</p>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] text-xs">•••</button>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
                <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center justify-between px-4 py-2 text-[11px] text-[var(--color-text-tertiary)]">
                <div className="flex items-center gap-1">
                    <span className="flex -space-x-0.5">
                        {post.reactions.map((r, i) => <span key={i} className="text-xs">{r}</span>)}
                    </span>
                    <span>{formatCount(likeCount)}</span>
                </div>
                <div className="flex gap-3">
                    <span>{formatCount(post.comment_count)} comments</span>
                    <span>{formatCount(post.repost_count)} reposts</span>
                    <span>{formatCount(post.view_count)} views</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex border-t border-[var(--color-border-default)]">
                <ActionButton
                    icon={liked ? "👍" : "👍"}
                    label="Like"
                    active={liked}
                    onClick={handleLike}
                />
                <ActionButton icon="💬" label="Comment" onClick={() => setShowComments(!showComments)} />
                <ActionButton icon="🔄" label="Repost" />
                <ActionButton icon="📤" label="Share" />
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[var(--color-border-default)] overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            <div className="flex gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-bold shrink-0">F</div>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm outline-none focus:border-[oklch(0.58_0.18_260)]"
                                />
                            </div>
                            {/* Mock comments */}
                            <div className="flex gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-[10px] font-bold shrink-0">M</div>
                                <div className="flex-1">
                                    <div className="px-3 py-2 rounded-xl bg-[var(--color-bg-tertiary)]">
                                        <p className="text-xs font-semibold">Marco Rossi</p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Great insights! Totally agree about communication being key.</p>
                                    </div>
                                    <div className="flex gap-3 mt-1 px-3 text-[10px] text-[var(--color-text-tertiary)]">
                                        <button className="hover:text-[var(--color-text-secondary)]">Like</button>
                                        <button className="hover:text-[var(--color-text-secondary)]">Reply</button>
                                        <span>2h</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

function ActionButton({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all hover:bg-[var(--color-bg-tertiary)] ${active ? "text-[oklch(0.72_0.18_190)]" : "text-[var(--color-text-tertiary)]"
                }`}
        >
            <span>{icon}</span>
            {label}
        </button>
    );
}

// ── Post Composer Modal ─────────────────────────

function PostComposer({ onClose }: { onClose: () => void }) {
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState("text");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-default)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-bold">F</div>
                        <div>
                            <p className="text-sm font-semibold">Francesco Sartori</p>
                            <select className="text-[10px] text-[var(--color-text-tertiary)] bg-transparent outline-none">
                                <option>🌐 Public</option>
                                <option>👥 Connections only</option>
                                <option>🔒 Private</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">✕</button>
                </div>

                <div className="p-5">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What do you want to talk about?"
                        rows={6}
                        autoFocus
                        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-[var(--color-text-tertiary)] leading-relaxed"
                    />
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border-default)]">
                    <div className="flex gap-1">
                        {[
                            { icon: "🖼️", type: "image" },
                            { icon: "🎥", type: "video" },
                            { icon: "📄", type: "document" },
                            { icon: "📊", type: "poll" },
                            { icon: "🔗", type: "link" },
                            { icon: "#️⃣", type: "hashtag" },
                        ].map((item) => (
                            <button
                                key={item.type}
                                onClick={() => setPostType(item.type)}
                                className={`p-2 rounded-lg text-sm transition-all ${postType === item.type ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)]" : "hover:bg-[var(--color-bg-tertiary)]"}`}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={!content.trim()}
                        id="publish-post-btn"
                        className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all disabled:opacity-30"
                    >
                        Publish
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
