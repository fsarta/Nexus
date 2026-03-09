export default function FeedPage() {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Top bar placeholder */}
            <header className="fixed top-0 left-0 right-0 h-16 glass-strong z-50 flex items-center px-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <span className="text-lg font-bold">Nexus</span>
                </div>
                <div className="flex-1 max-w-lg mx-8">
                    <input
                        type="search"
                        placeholder="Search people, companies, jobs, skills..."
                        className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[oklch(0.58_0.18_260)]"
                    />
                </div>
            </header>

            {/* Layout */}
            <div className="max-w-6xl mx-auto pt-24 px-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6">
                {/* Left sidebar — Profile card */}
                <aside className="hidden lg:block">
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] overflow-hidden">
                        {/* Cover */}
                        <div className="h-20 bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)]" />
                        <div className="px-4 pb-4 -mt-8">
                            <div className="w-16 h-16 rounded-full border-4 border-[var(--color-bg-secondary)] bg-[var(--color-bg-tertiary)] mb-3" />
                            <h2 className="font-semibold text-sm">Your Name</h2>
                            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Your Headline</p>
                            <div className="mt-4 pt-4 border-t border-[var(--color-border-default)] space-y-2">
                                <ProfileStat label="Connections" value="0" />
                                <ProfileStat label="Profile views" value="0" />
                                <ProfileStat label="Career Score" value="—" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Feed */}
                <main>
                    {/* Post composer */}
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-tertiary)] shrink-0" />
                            <button className="flex-1 px-4 py-2.5 rounded-full bg-[var(--color-bg-tertiary)] text-left text-sm text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-elevated)] transition-colors">
                                What&apos;s on your mind?
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-border-default)]">
                            <button className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                                📷 Photo
                            </button>
                            <button className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                                🎥 Video
                            </button>
                            <button className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                                📄 Document
                            </button>
                            <button className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors">
                                🎤 Event
                            </button>
                        </div>
                    </div>

                    {/* Empty state */}
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-12 text-center">
                        <p className="text-4xl mb-4">📭</p>
                        <h3 className="text-lg font-semibold mb-2">Your feed is empty</h3>
                        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto">
                            Start connecting with professionals, follow companies, and join conversations to populate your feed.
                        </p>
                    </div>
                </main>

                {/* Right sidebar */}
                <aside className="hidden lg:block">
                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4">
                        <h3 className="font-semibold text-sm mb-3">ARIA AI Coach</h3>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[oklch(0.58_0.18_260/0.1)] to-[oklch(0.72_0.18_190/0.1)] border border-[oklch(0.58_0.18_260/0.2)]">
                            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                👋 Welcome to Nexus! I&apos;m ARIA, your AI career coach. Complete your profile to get personalized career insights and recommendations.
                            </p>
                        </div>
                        <button className="w-full mt-3 py-2 rounded-lg text-xs font-medium text-[oklch(0.72_0.18_190)] border border-[oklch(0.72_0.18_190/0.3)] hover:bg-[oklch(0.72_0.18_190/0.05)] transition-colors">
                            Chat with ARIA
                        </button>
                    </div>

                    <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] p-4 mt-4">
                        <h3 className="font-semibold text-sm mb-3">Trending on Nexus</h3>
                        <div className="space-y-3">
                            <TrendingItem topic="#AIinBusiness" posts="1.2K posts" />
                            <TrendingItem topic="#RemoteWork" posts="890 posts" />
                            <TrendingItem topic="#StartupFunding" posts="650 posts" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-tertiary)]">{label}</span>
            <span className="text-xs font-semibold text-[oklch(0.72_0.18_190)]">{value}</span>
        </div>
    );
}

function TrendingItem({ topic, posts }: { topic: string; posts: string }) {
    return (
        <div className="cursor-pointer hover:bg-[var(--color-bg-tertiary)] -mx-2 px-2 py-1.5 rounded-lg transition-colors">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{topic}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{posts}</p>
        </div>
    );
}
