"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Mock Data ───────────────────────────────────

interface Participant {
    type: "user" | "company";
    id: string;
    display_name: string;
    avatar_url?: string;
    is_online?: boolean;
}

interface Conversation {
    id: string;
    type: "direct" | "group";
    title?: string;
    participants: Participant[];
    last_message?: {
        content: string;
        sender_name: string;
        timestamp: string;
    };
    unread_count: number;
    is_pinned?: boolean;
}

interface Message {
    id: string;
    sender_type: "user" | "company";
    sender_id: string;
    sender_name: string;
    sender_avatar?: string;
    message_type: "text" | "image" | "file" | "system";
    content?: string;
    media_url?: string;
    media_filename?: string;
    reply_to_text?: string;
    reply_to_sender?: string;
    is_edited?: boolean;
    created_at: string;
}

const CURRENT_USER_ID = "user-1";

const mockConversations: Conversation[] = [
    {
        id: "conv-1",
        type: "direct",
        participants: [
            { type: "user", id: "user-1", display_name: "You", is_online: true },
            { type: "user", id: "user-2", display_name: "Marco Rossi", is_online: true },
        ],
        last_message: { content: "Sure! Let's schedule a call for tomorrow.", sender_name: "Marco Rossi", timestamp: "2 min ago" },
        unread_count: 2,
        is_pinned: true,
    },
    {
        id: "conv-2",
        type: "direct",
        participants: [
            { type: "user", id: "user-1", display_name: "You" },
            { type: "company", id: "comp-1", display_name: "TechStart Inc.", is_online: true },
        ],
        last_message: { content: "We'd love to discuss the Senior Engineer position with you.", sender_name: "TechStart Inc.", timestamp: "1h ago" },
        unread_count: 1,
    },
    {
        id: "conv-3",
        type: "direct",
        participants: [
            { type: "user", id: "user-1", display_name: "You" },
            { type: "user", id: "user-3", display_name: "Sarah Chen", is_online: false },
        ],
        last_message: { content: "Thanks for the introduction!", sender_name: "You", timestamp: "Yesterday" },
        unread_count: 0,
    },
    {
        id: "conv-4",
        type: "direct",
        participants: [
            { type: "user", id: "user-1", display_name: "You" },
            { type: "company", id: "comp-2", display_name: "Nexus Ventures" },
        ],
        last_message: { content: "Your pitch deck looks great. When can we meet?", sender_name: "Nexus Ventures", timestamp: "2 days ago" },
        unread_count: 0,
    },
    {
        id: "conv-5",
        type: "group",
        title: "AI Startup Founders",
        participants: [
            { type: "user", id: "user-1", display_name: "You" },
            { type: "user", id: "user-4", display_name: "Alex Kim" },
            { type: "user", id: "user-5", display_name: "Lisa Wang" },
        ],
        last_message: { content: "Great insights on the funding round!", sender_name: "Alex Kim", timestamp: "3 days ago" },
        unread_count: 0,
    },
];

const mockMessages: Record<string, Message[]> = {
    "conv-1": [
        { id: "m1", sender_type: "user", sender_id: "user-2", sender_name: "Marco Rossi", message_type: "text", content: "Hi! I saw your profile on Nexus and noticed we have similar interests in AI/ML.", created_at: "10:30 AM" },
        { id: "m2", sender_type: "user", sender_id: "user-1", sender_name: "You", message_type: "text", content: "Hey Marco! Yes, I've been working on transformer models for NLP tasks. What about you?", created_at: "10:32 AM" },
        { id: "m3", sender_type: "user", sender_id: "user-2", sender_name: "Marco Rossi", message_type: "text", content: "I'm building a startup around AI-powered document analysis. Would love to pick your brain about fine-tuning strategies.", created_at: "10:35 AM" },
        { id: "m4", sender_type: "user", sender_id: "user-1", sender_name: "You", message_type: "text", content: "That sounds fascinating! I'd be happy to help.", created_at: "10:36 AM" },
        { id: "m5", sender_type: "user", sender_id: "user-2", sender_name: "Marco Rossi", message_type: "text", content: "Sure! Let's schedule a call for tomorrow.", created_at: "10:38 AM" },
    ],
    "conv-2": [
        { id: "m6", sender_type: "company", sender_id: "comp-1", sender_name: "TechStart Inc.", message_type: "text", content: "Hello! We came across your profile and were really impressed by your experience.", created_at: "Yesterday" },
        { id: "m7", sender_type: "company", sender_id: "comp-1", sender_name: "TechStart Inc.", message_type: "text", content: "We'd love to discuss the Senior Engineer position with you.", created_at: "1h ago" },
    ],
};

// ── Main Page Component ─────────────────────────

export default function MessagesPage() {
    const [selectedConvId, setSelectedConvId] = useState<string | null>("conv-1");
    const [messageInput, setMessageInput] = useState("");
    const [showNewDM, setShowNewDM] = useState(false);

    const selectedConv = mockConversations.find((c) => c.id === selectedConvId);
    const messages = selectedConvId ? mockMessages[selectedConvId] || [] : [];

    const getConversationName = (conv: Conversation) => {
        if (conv.title) return conv.title;
        const other = conv.participants.find((p) => p.id !== CURRENT_USER_ID);
        return other?.display_name || "Unknown";
    };

    const getOtherParticipant = (conv: Conversation) =>
        conv.participants.find((p) => p.id !== CURRENT_USER_ID);

    const handleSend = () => {
        if (!messageInput.trim() || !selectedConvId) return;
        // TODO: POST /api/v1/messages/conversations/:id/messages
        setMessageInput("");
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
            {/* Header */}
            <header className="h-16 glass-strong flex items-center px-6 shrink-0 z-50">
                <Link href="/feed" className="flex items-center gap-2 mr-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <span className="text-lg font-bold">Nexus</span>
                </Link>
                <h1 className="text-sm font-semibold text-[var(--color-text-secondary)]">Messages</h1>
                <div className="ml-auto">
                    <button
                        onClick={() => setShowNewDM(true)}
                        id="new-message-btn"
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] text-white hover:opacity-90 transition-all"
                    >
                        + New Message
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* ── Sidebar: Conversation List ──── */}
                <aside className="w-80 border-r border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] flex flex-col">
                    {/* Search */}
                    <div className="p-3 border-b border-[var(--color-border-default)]">
                        <input
                            type="search"
                            placeholder="Search messages..."
                            className="w-full px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] text-sm placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[oklch(0.58_0.18_260)]"
                        />
                    </div>

                    {/* Conversation list */}
                    <div className="flex-1 overflow-y-auto">
                        {mockConversations.map((conv) => {
                            const other = getOtherParticipant(conv);
                            const isSelected = conv.id === selectedConvId;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConvId(conv.id)}
                                    className={`w-full flex items-start gap-3 p-3 text-left transition-colors border-b border-[var(--color-border-default)] ${isSelected
                                            ? "bg-[oklch(0.58_0.18_260/0.08)] border-l-2 border-l-[oklch(0.58_0.18_260)]"
                                            : "hover:bg-[var(--color-bg-tertiary)]"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${other?.type === "company"
                                                    ? "bg-gradient-to-br from-[oklch(0.72_0.18_190/0.3)] to-[oklch(0.58_0.18_260/0.3)] text-[oklch(0.72_0.18_190)]"
                                                    : "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
                                                }`}
                                        >
                                            {conv.title
                                                ? "👥"
                                                : (other?.display_name || "?").charAt(0).toUpperCase()}
                                        </div>
                                        {other?.is_online && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-bg-secondary)]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold truncate">
                                                {getConversationName(conv)}
                                            </span>
                                            <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0 ml-1">
                                                {conv.last_message?.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                                                {conv.last_message?.content}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className="ml-2 shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] text-white text-[10px] font-bold flex items-center justify-center">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        {other?.type === "company" && (
                                            <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-medium rounded bg-[oklch(0.72_0.18_190/0.1)] text-[oklch(0.72_0.18_190)]">
                                                Company
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* ── Main: Conversation View ────── */}
                {selectedConv ? (
                    <div className="flex-1 flex flex-col">
                        {/* Conversation Header */}
                        <div className="h-16 px-6 flex items-center border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-sm font-semibold">
                                    {selectedConv.title ? "👥" : getConversationName(selectedConv).charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold">{getConversationName(selectedConv)}</h2>
                                    <p className="text-xs text-[var(--color-text-tertiary)]">
                                        {getOtherParticipant(selectedConv)?.is_online
                                            ? "🟢 Online"
                                            : "Last seen recently"}
                                    </p>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors" title="Search in conversation">
                                    🔍
                                </button>
                                <button className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors" title="More options">
                                    ⚙️
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {messages.map((msg) => {
                                const isOwn = msg.sender_id === CURRENT_USER_ID;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                                            {!isOwn && (
                                                <span className="text-xs text-[var(--color-text-tertiary)] mb-1 block">
                                                    {msg.sender_name}
                                                </span>
                                            )}
                                            <div
                                                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn
                                                        ? "bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.52_0.17_270)] text-white rounded-br-md"
                                                        : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-bl-md"
                                                    }`}
                                            >
                                                {msg.reply_to_text && (
                                                    <div className={`text-xs mb-1.5 pb-1.5 border-b ${isOwn ? "border-white/20 text-white/70" : "border-[var(--color-border-default)] text-[var(--color-text-tertiary)]"}`}>
                                                        ↩ {msg.reply_to_sender}: {msg.reply_to_text}
                                                    </div>
                                                )}
                                                {msg.content}
                                                {msg.is_edited && (
                                                    <span className="text-[10px] opacity-60 ml-1">(edited)</span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] text-[var(--color-text-tertiary)] mt-1 block ${isOwn ? "text-right" : ""}`}>
                                                {msg.created_at}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Message Input */}
                        <div className="px-6 py-4 border-t border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
                            <div className="flex items-end gap-3">
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors" title="Attach file">
                                        📎
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors" title="Send image">
                                        🖼️
                                    </button>
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        rows={1}
                                        className="w-full resize-none px-4 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] focus:ring-1 focus:ring-[oklch(0.58_0.18_260/0.3)] outline-none text-sm placeholder:text-[var(--color-text-tertiary)]"
                                    />
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!messageInput.trim()}
                                    id="send-message-btn"
                                    className="p-2.5 rounded-xl bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] text-white hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty state */
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-5xl mb-4">💬</p>
                            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Choose from your existing conversations or start a new one.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── New DM Modal ───────────────── */}
            <AnimatePresence>
                {showNewDM && (
                    <NewDMModal onClose={() => setShowNewDM(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ── New DM Modal Component ──────────────────────

function NewDMModal({ onClose }: { onClose: () => void }) {
    const [recipientType, setRecipientType] = useState<"user" | "company">("user");
    const [searchQuery, setSearchQuery] = useState("");
    const [message, setMessage] = useState("");

    const handleSend = () => {
        // TODO: POST /api/v1/messages/conversations
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] shadow-lg overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-default)]">
                    <h2 className="text-lg font-semibold">New Message</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Recipient Type Toggle */}
                    <div className="flex gap-2">
                        <TypeToggle
                            active={recipientType === "user"}
                            onClick={() => setRecipientType("user")}
                            label="👤 Person"
                        />
                        <TypeToggle
                            active={recipientType === "company"}
                            onClick={() => setRecipientType("company")}
                            label="🏢 Company"
                        />
                    </div>

                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                            To:
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={
                                recipientType === "user"
                                    ? "Search people by name or username..."
                                    : "Search companies..."
                            }
                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] focus:ring-1 focus:ring-[oklch(0.58_0.18_260/0.3)] outline-none text-sm placeholder:text-[var(--color-text-tertiary)]"
                        />
                    </div>

                    {/* Mock search results */}
                    {searchQuery.length > 0 && (
                        <div className="rounded-lg border border-[var(--color-border-default)] max-h-40 overflow-y-auto">
                            {["Marco Rossi", "Sarah Chen", "Alex Kim"].filter(n =>
                                n.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map((name) => (
                                <button
                                    key={name}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-tertiary)] transition-colors text-sm"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xs font-semibold">
                                        {name.charAt(0)}
                                    </div>
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                            Message:
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Write your message..."
                            className="w-full resize-none px-4 py-2.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-default)] focus:border-[oklch(0.58_0.18_260)] outline-none text-sm placeholder:text-[var(--color-text-tertiary)]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--color-border-default)] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        id="send-new-dm-btn"
                        className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[oklch(0.58_0.18_260)] to-[oklch(0.72_0.18_190)] hover:opacity-90 transition-all"
                    >
                        Send Message
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function TypeToggle({
    active,
    onClick,
    label,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${active
                    ? "bg-[oklch(0.58_0.18_260/0.15)] text-[oklch(0.72_0.18_190)] border border-[oklch(0.58_0.18_260/0.3)]"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)]"
                }`}
        >
            {label}
        </button>
    );
}
