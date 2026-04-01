import { useState, useRef, useEffect, useCallback } from "react";
import "./Home.css";
import LoginSignup from "../LoginSignup/LoginSignup";


/* ══════════════════════════════════════════
   NAV MODULES — all 7 features from problem 1
══════════════════════════════════════════ */
const NAV_MODULES = [
    {
        id: "home",
        icon: "🏠",
        name: "Home",
        desc: "Dashboard overview",
        section: "workspace",
    },
    {
        id: "business-brain",
        icon: "🧠",
        name: "Business Brain",
        desc: "Intelligence layer",
        badge: "AI",
        section: "modules",
    },
    {
        id: "growth-planner",
        icon: "📅",
        name: "Growth Planner",
        desc: "Weekly AI calendar",
        badge: "New",
        section: "modules",
    },
    {
        id: "caption-studio",
        icon: "✍️",
        name: "Caption Studio",
        desc: "AI content generator",
        section: "modules",
    },
    {
        id: "social-autopilot",
        icon: "📡",
        name: "Social Autopilot",
        desc: "Schedule & automate",
        section: "modules",
    },
    {
        id: "festival-radar",
        icon: "🎯",
        name: "Festival Radar",
        desc: "Trend & occasion intel",
        badge: "Live",
        section: "modules",
    },
    {
        id: "ad-engine",
        icon: "⚡",
        name: "Ad Engine",
        desc: "Mock ad recommendations",
        section: "modules",
    },
    {
        id: "performance",
        icon: "📊",
        name: "Performance",
        desc: "Analytics dashboard",
        section: "modules",
    },
    {
        id: "chat",
        icon: "💬",
        name: "AI Assistant",
        desc: "Ask anything",
        section: "workspace",
    },
];

/* ══════════════════════════════════════════
   MODULE CONTENT DEFINITIONS
══════════════════════════════════════════ */
const MODULE_CONTENT = {
    "business-brain": {
        tag: "Module 01",
        title: "Business Brain",
        desc: "Feed your business details once. AI builds a complete intelligence profile — audience personas, competitor gaps, seasonal demand patterns, and market positioning.",
        cards: [
            { icon: "🌐", title: "Website Analyzer", desc: "Paste your URL — AI extracts brand voice, products, and audience signals in 90 seconds.", badge: "AI" },
            { icon: "👥", title: "Audience Personas", desc: "Generates 3–5 detailed buyer personas with buying intent and pain points.", badge: "AI" },
            { icon: "🔍", title: "Competitor Map", desc: "Identifies 5 top competitors and surfaces content gaps you can own.", badge: "AI" },
            { icon: "📈", title: "Market Signals", desc: "Tracks seasonal demand, trending topics, and emerging opportunities in your sector.", badge: "Live" },
        ],
    },
    "growth-planner": {
        tag: "Module 02",
        title: "Weekly Growth Planner",
        desc: "Input your goals for the week. AI cross-references festivals, industry trends, and past performance to build a 7-day execution calendar with themes, timings, and post types.",
        cards: [
            { icon: "🗓️", title: "7-Day Calendar", desc: "Auto-generates full week plan with content pillars, platform, and optimal timing.", badge: "AI" },
            { icon: "🎪", title: "Festival Awareness", desc: "Integrates Diwali, Holi, Independence Day, and 200+ occasions into your strategy.", badge: "" },
            { icon: "📌", title: "Goal Alignment", desc: "Maps each post to a weekly business objective — leads, awareness, or conversions.", badge: "" },
            { icon: "🔁", title: "Evergreen Recycler", desc: "Re-queues high-performing past content at optimal intervals.", badge: "New" },
        ],
    },
    "caption-studio": {
        tag: "Module 03",
        title: "Caption Studio",
        desc: "Paste a product description. Get 3–5 caption variations per platform, each with hashtags, CTAs, and brand-tone consistency. Run A/B tests directly from here.",
        cards: [
            { icon: "✨", title: "3-Variant Generator", desc: "Produces casual, professional, and emotional caption variants simultaneously.", badge: "AI" },
            { icon: "#️⃣", title: "Smart Hashtags", desc: "Generates platform-specific hashtag sets ranked by reach and relevance.", badge: "AI" },
            { icon: "🎨", title: "Tone Matching", desc: "Learns your brand voice from past captions and stays consistent across posts.", badge: "" },
            { icon: "🧪", title: "A/B Testing", desc: "Schedule two variants — system picks the winner by engagement after 24h.", badge: "New" },
        ],
    },
    "social-autopilot": {
        tag: "Module 04",
        title: "Social Autopilot",
        desc: "Connect Instagram, LinkedIn, Facebook, and X. The system schedules, publishes, monitors, and sends you a daily digest — all without manual work.",
        cards: [
            { icon: "🤖", title: "Auto-Scheduler", desc: "Posts at peak audience activity windows — different per platform, per audience.", badge: "" },
            { icon: "💬", title: "Smart Replies", desc: "Auto-responds to common comments with branded templates you approve once.", badge: "AI" },
            { icon: "📬", title: "Daily Digest", desc: "WhatsApp / email summary: what posted, what performed, what to do next.", badge: "" },
            { icon: "🔗", title: "Platform Connect", desc: "Instagram · LinkedIn · Facebook · X/Twitter — one-click OAuth connection.", badge: "" },
        ],
    },
    "festival-radar": {
        tag: "Module 05",
        title: "Festival Radar",
        desc: "Never miss a revenue opportunity. The system scans 30 days ahead, identifies relevant festivals and occasions, and pre-generates campaign ideas tied to your business.",
        cards: [
            { icon: "📡", title: "30-Day Outlook", desc: "Live calendar of upcoming occasions with relevance score for your business category.", badge: "Live" },
            { icon: "🇮🇳", title: "India-First", desc: "Covers 200+ Indian festivals, regional holidays, and awareness days.", badge: "" },
            { icon: "💡", title: "Campaign Ideas", desc: "Auto-generates 3 campaign concepts per upcoming occasion with ad copy.", badge: "AI" },
            { icon: "🎨", title: "Creative Templates", desc: "Pre-built festival poster templates with dynamic text overlay slots.", badge: "" },
        ],
    },
    "ad-engine": {
        tag: "Module 06",
        title: "Ad Engine",
        desc: "Simulated ad intelligence dashboard. Input your goal and budget — AI generates targeting recommendations, ad copy variants, and projected performance outcomes.",
        cards: [
            { icon: "🎯", title: "Audience Builder", desc: "Constructs interest + demographic targeting sets based on your business profile.", badge: "AI" },
            { icon: "📝", title: "Copy Variants", desc: "Generates 3–5 ad headlines and descriptions for each campaign objective.", badge: "AI" },
            { icon: "💰", title: "Budget Optimizer", desc: "Recommends how to split budget across platforms for best projected ROAS.", badge: "" },
            { icon: "⚙️", title: "Mock Dashboard", desc: "Simulated CTR, CPC, CPL, and ROAS data with AI-generated optimization insights.", badge: "" },
        ],
    },
    performance: {
        tag: "Module 07",
        title: "Performance Dashboard",
        desc: "A unified analytics view across all your content and campaigns. See what's working, what's not, and get AI-generated recommendations for what to do next.",
        cards: [
            { icon: "📊", title: "Engagement Metrics", desc: "Likes, comments, shares, reach, and save rates across all platforms.", badge: "" },
            { icon: "🏆", title: "Top Performers", desc: "Automatically surfaces your best-performing posts and campaign elements.", badge: "" },
            { icon: "🔔", title: "Smart Alerts", desc: "Notifies you when a post outperforms average by 2× — or underperforms.", badge: "Live" },
            { icon: "📋", title: "AI Insights", desc: "Weekly AI summary: what drove growth, what to double down on, what to drop.", badge: "AI" },
        ],
    },
};

/* ══════════════════════════════════════════
   HERO QUICK-START CARDS
══════════════════════════════════════════ */
const HERO_CARDS = [
    { icon: "🧠", title: "Business Brain", desc: "Analyze your business in 2 min", id: "business-brain" },
    { icon: "📅", title: "Plan This Week", desc: "AI-generated 7-day calendar", id: "growth-planner" },
    { icon: "✍️", title: "Write Captions", desc: "3 variants + hashtags instantly", id: "caption-studio" },
    { icon: "📊", title: "View Analytics", desc: "Performance at a glance", id: "performance" },
    { icon: "🎯", title: "Festival Radar", desc: "Upcoming campaign opportunities", id: "festival-radar" },
    { icon: "⚡", title: "Ad Engine", desc: "Mock ad recommendations", id: "ad-engine" },
];

/* ══════════════════════════════════════════
   ANIMATED GROWTH ILLUSTRATION
══════════════════════════════════════════ */
function GrowthIllustration() {
    return (
        <div className="growth-canvas" aria-hidden>
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rising bars */}
                <rect x="30" y="280" width="40" height="80" rx="6" fill="#F4622A" opacity="0.6">
                    <animate attributeName="height" values="0;80" dur="1.2s" fill="freeze" />
                    <animate attributeName="y" values="360;280" dur="1.2s" fill="freeze" />
                </rect>
                <rect x="90" y="220" width="40" height="140" rx="6" fill="#F4622A" opacity="0.7">
                    <animate attributeName="height" values="0;140" dur="1.2s" begin="0.15s" fill="freeze" />
                    <animate attributeName="y" values="360;220" dur="1.2s" begin="0.15s" fill="freeze" />
                </rect>
                <rect x="150" y="170" width="40" height="190" rx="6" fill="#F4622A" opacity="0.8">
                    <animate attributeName="height" values="0;190" dur="1.2s" begin="0.3s" fill="freeze" />
                    <animate attributeName="y" values="360;170" dur="1.2s" begin="0.3s" fill="freeze" />
                </rect>
                <rect x="210" y="110" width="40" height="250" rx="6" fill="#F4622A" opacity="0.9">
                    <animate attributeName="height" values="0;250" dur="1.2s" begin="0.45s" fill="freeze" />
                    <animate attributeName="y" values="360;110" dur="1.2s" begin="0.45s" fill="freeze" />
                </rect>
                <rect x="270" y="60" width="40" height="300" rx="6" fill="#F4622A">
                    <animate attributeName="height" values="0;300" dur="1.2s" begin="0.6s" fill="freeze" />
                    <animate attributeName="y" values="360;60" dur="1.2s" begin="0.6s" fill="freeze" />
                </rect>
                {/* Trend line */}
                <polyline points="50,280 110,220 170,170 230,110 290,60"
                    stroke="#F4622A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4">
                    <animate attributeName="stroke-dasharray" from="0 500" to="500 0" dur="1.8s" begin="0.3s" fill="freeze" />
                </polyline>
                {/* Dots */}
                {[[50, 280], [110, 220], [170, 170], [230, 110], [290, 60]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="6" fill="#F4622A" opacity="0.9">
                        <animate attributeName="r" values="0;6" dur="0.3s" begin={`${0.9 + i * 0.1}s`} fill="freeze" />
                    </circle>
                ))}
                {/* Grid lines */}
                {[100, 200, 300].map(y => (
                    <line key={y} x1="20" y1={y} x2="340" y2={y} stroke="#F4622A" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
                ))}
            </svg>
        </div>
    );
}

/* ══════════════════════════════════════════
   MODULE PANEL
══════════════════════════════════════════ */
function ModulePanel({ moduleId, onNavigate }) {
    const data = MODULE_CONTENT[moduleId];
    if (!data) return null;
    return (
        <div className="module-panel">
            <div className="module-header">
                <div className="module-tag">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5" /></svg>
                    {data.tag}
                </div>
                <h2 className="module-title">{data.title}</h2>
                <p className="module-desc">{data.desc}</p>
            </div>
            <div className="module-grid">
                {data.cards.map((c, i) => (
                    <div className="module-card" key={i}>
                        <div className="mc-icon" style={{ fontSize: 20 }}>{c.icon}</div>
                        <div className="mc-title">{c.title}</div>
                        <div className="mc-desc">{c.desc}</div>
                        {c.badge && <span className={`mc-badge${c.badge === "AI" || c.badge === "New" ? " new" : ""}`}>{c.badge}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════ */
function ChatPanel({ messages, loading, bottomRef }) {
    return (
        <div className="chat-area">
            {messages.map((m, i) => (
                <div className={`msg ${m.role}`} key={i}>
                    <div className="msg-av">
                        {m.role === "user" ? "U" : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                            </svg>
                        )}
                    </div>
                    <div className="msg-bubble">{m.content}</div>
                </div>
            ))}
            {loading && (
                <div className="msg assistant">
                    <div className="msg-av">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
                        </svg>
                    </div>
                    <div className="msg-bubble"><div className="typing-dots"><span /><span /><span /></div></div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN HOME COMPONENT
══════════════════════════════════════════ */
export default function Home() {
    const [activeModule, setActiveModule] = useState("home");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAuth, setShowAuth] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputVal, setInputVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + "px";
        }
    }, [inputVal]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = useCallback(async (text) => {
        const msg = text || inputVal;
        if (!msg.trim()) return;
        setMessages((prev) => [...prev, { role: "user", content: msg }]);
        setInputVal("");
        setLoading(true);
        if (activeModule !== "chat") setActiveModule("chat");
        await new Promise((r) => setTimeout(r, 1200));
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "This is a placeholder response from Growth OS. Connect your AI backend (Gemini/Claude API) to get real intelligent responses tailored to your business." },
        ]);
        setLoading(false);
    }, [inputVal, activeModule]);

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const toggleRecording = () => setIsRecording((p) => !p);

    // Filter nav items by search
    const filteredNav = searchQuery.trim()
        ? NAV_MODULES.filter(
            (m) =>
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : NAV_MODULES;

    const sections = ["workspace", "modules"];
    const sectionLabels = { workspace: "Workspace", modules: "AI Modules" };

    // Active module label for breadcrumb
    const activeItem = NAV_MODULES.find((m) => m.id === activeModule);

    // Placeholder for which panel to show
    const showChat = activeModule === "chat" || messages.length > 0;
    const showHero = activeModule === "home";
    const showModule = MODULE_CONTENT[activeModule] !== undefined;

    // Context tag text for input
    const contextLabel = activeItem ? activeItem.name : "Growth OS";
    const contextIcon = activeItem ? activeItem.icon : "🚀";

    return (
        <>
            {/* Background particles */}
            <div className="bg-particles" aria-hidden>
                <div className="bg-particle" /><div className="bg-particle" />
                <div className="bg-particle" /><div className="bg-particle" />
            </div>

            <div className="gos-shell">
                {/* ── SIDEBAR ── */}
                <aside className={`gos-sidebar${sidebarOpen ? "" : " collapsed"}`}>
                    {/* Logo */}
                    <div className="sidebar-logo">
                        <div className="logo-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                <polyline points="16 7 22 7 22 13" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            Growth<span className="accent">OS</span>
                            <span className="sub">Autonomous Growth Platform</span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="sidebar-search">
                        <div className="sidebar-search-inner">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search modules…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="sidebar-nav">
                        {sections.map((section) => {
                            const items = filteredNav.filter((m) => m.section === section);
                            if (items.length === 0) return null;
                            return (
                                <div key={section}>
                                    <div className="nav-section-label">{sectionLabels[section]}</div>
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`nav-item${activeModule === item.id ? " active" : ""}`}
                                            onClick={() => {
                                                setActiveModule(item.id);
                                                // If switching away from chat, preserve messages but show module
                                            }}
                                        >
                                            <div className="nav-item-icon">{item.icon}</div>
                                            <div className="nav-item-text">
                                                <div className="name">{item.name}</div>
                                                <div className="desc">{item.desc}</div>
                                            </div>
                                            {item.badge && (
                                                <span className={`nav-badge${item.badge === "New" || item.badge === "Live" ? "" : ""}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="sidebar-footer">
                        <div className="user-row">
                            <div className="user-avatar">G</div>
                            <div className="user-info">
                                <div className="uname">Guest</div>
                                <div className="urole">Free plan</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── MAIN AREA ── */}
                <main className="gos-main">
                    {/* Topbar */}
                    <header className="gos-topbar">
                        <button className="topbar-toggle" onClick={() => setSidebarOpen((p) => !p)} title="Toggle sidebar">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <div className="topbar-breadcrumb">
                            <span>Growth OS</span>
                            <span className="sep">/</span>
                            <span className="current">{activeItem?.name || "Home"}</span>
                        </div>

                        <div className="topbar-actions">
                            {/* Theme / share */}
                            <button className="topbar-icon-btn" title="Share">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </button>
                            <button className="topbar-btn" onClick={() => setShowAuth(true)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                                Log in
                            </button>
                            <button className="topbar-btn primary" onClick={() => setShowAuth(true)}>
                                Sign up free
                            </button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="gos-content">
                        {/* Home / Hero */}
                        {showHero && !showChat && (
                            <div className="hero-wrap">
                                <GrowthIllustration />

                                <div className="hero-top">
                                    {/* <div className="hero-eyebrow">
                                        <span className="pulse-dot" />
                                        Autonomous Growth Operating System
                                    </div> */}

                                    <h1 className="hero-title">
                                        Your business,<br />
                                        <em>always growing.</em>
                                        {/* <span className="line2">Zero social media manager needed.</span> */}
                                    </h1>

                                    <p className="hero-desc">
                                        AI that understands your business, plans your week, writes your captions, schedules your posts, and optimises your ads — all while you focus on what matters.
                                    </p>

                                    <div className="hero-stats">
                                        <div className="hero-stat"><span className="num">7×</span><span className="lbl">faster content</span></div>
                                        <div className="hero-stat-div" />
                                        <div className="hero-stat"><span className="num">₹0</span><span className="lbl">infra cost</span></div>
                                        <div className="hero-stat-div" />
                                        <div className="hero-stat"><span className="num">50M+</span><span className="lbl">SMEs in India</span></div>
                                    </div>

                                    <div className="hero-cards">
                                        {HERO_CARDS.map((c) => (
                                            <div
                                                className="hero-card"
                                                key={c.id}
                                                onClick={() => setActiveModule(c.id)}
                                            >
                                                <div className="hc-icon">{c.icon}</div>
                                                <div className="hc-title">{c.title}</div>
                                                <div className="hc-desc">{c.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Module Panel */}
                        {showModule && !showChat && (
                            <ModulePanel moduleId={activeModule} onNavigate={setActiveModule} />
                        )}

                        {/* Chat view */}
                        {showChat && (
                            <ChatPanel messages={messages} loading={loading} bottomRef={bottomRef} />
                        )}
                    </div>

                    {/* ── INPUT BAR ── */}
                    <div className="gos-input-bar">
                        <div className="input-container">
                            <div className="input-top-row">
                                {/* Context tag */}
                                <div className="input-context-tag">
                                    <span style={{ fontSize: 12 }}>{contextIcon}</span>
                                    {contextLabel}
                                </div>

                                <textarea
                                    ref={textareaRef}
                                    className="gos-textarea"
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder={`Ask ${contextLabel} anything…`}
                                    rows={1}
                                />

                                <button
                                    className="input-send-btn"
                                    onClick={() => sendMessage()}
                                    disabled={!inputVal.trim() || loading}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="input-bottom-row">
                                {/* Audio */}
                                {isRecording ? (
                                    <button className="input-pill-btn" onClick={toggleRecording}>
                                        <div className="audio-dot" />
                                        <span style={{ color: "var(--orange-dark)" }}>Recording… tap to stop</span>
                                    </button>
                                ) : (
                                    <button className="input-pill-btn" onClick={toggleRecording} title="Voice input">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                        Voice
                                    </button>
                                )}

                                <button className="input-pill-btn" title="New conversation" onClick={() => { setMessages([]); setActiveModule("home"); }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    New chat
                                </button>

                                <span className="input-hint-txt">↵ Send · Shift+↵ Newline</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── AUTH MODAL ── */}
            {showAuth && <LoginSignup onClose={() => setShowAuth(false)} />}
        </>
    );
}
