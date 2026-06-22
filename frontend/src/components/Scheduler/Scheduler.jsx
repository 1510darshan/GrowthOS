import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000";

const PLATFORMS = [
    {
        id: "youtube", name: "YouTube", color: "#FF0000", supported: true,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>,
    },
    {
        id: "instagram", name: "Instagram", color: "#E1306C", supported: false,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>,
    },
    {
        id: "twitter", name: "X (Twitter)", color: "#000", supported: false,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    },
    {
        id: "facebook", name: "Facebook", color: "#1877F2", supported: false,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
    },
    {
        id: "tiktok", name: "TikTok", color: "#010101", supported: false,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" /></svg>,
    },
    {
        id: "linkedin", name: "LinkedIn", color: "#0A66C2", supported: false,
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    },
];

const s = {
    page: { minHeight: "100vh", background: "#F7F6F3", padding: "32px 16px", fontFamily: "'DM Sans','Inter',sans-serif" },
    wrap: { maxWidth: 920, margin: "0 auto" },
    badge: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F4622A", marginBottom: 4 },
    pageTitle: { fontSize: 28, fontWeight: 800, letterSpacing: -0.8, color: "#0F0E0C", margin: 0, fontFamily: "'Syne','DM Sans',sans-serif" },
    pageSub: { fontSize: 13, color: "#7A7874", marginTop: 4 },
    headerRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 },
    dateBadge: { fontSize: 12, fontWeight: 600, color: "#7A7874", background: "#EDECE9", borderRadius: 8, padding: "6px 12px" },
    platformGrid: { display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 28 },
    layout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" },
    card: { background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 18, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 14 },
    cardTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9B9895", marginBottom: 16 },
    authRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F5F4F1", borderRadius: 10, padding: "10px 14px", marginBottom: 12 },
    label: { fontSize: 12, fontWeight: 600, color: "#5A5956", letterSpacing: "0.02em", display: "block", marginBottom: 5 },
    input: { width: "100%", padding: "10px 13px", border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: 9, fontSize: 14, color: "#0F0E0C", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" },
    textarea: { width: "100%", padding: "10px 13px", border: "1.5px solid rgba(0,0,0,0.1)", borderRadius: 9, fontSize: 14, color: "#0F0E0C", background: "#fff", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 88, fontFamily: "'DM Sans',sans-serif" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    fieldWrap: { marginBottom: 14 },
    summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 12 },
};

export default function Scheduler() {
    const [activePlatform, setActivePlatform] = useState("youtube");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishAt, setPublishAt] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [isAuthed, setIsAuthed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const fileInputRef = useRef(null);
    const popupRef = useRef(null);

    useEffect(() => {
        axios.get(`${API}/auth/status`)
            .then((r) => setIsAuthed(r.data.authenticated))
            .catch(() => setIsAuthed(false));
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.origin !== API) return;
            if (e.data?.type === "YOUTUBE_AUTH_SUCCESS") {
                axios.get(`${API}/auth/status`).then((r) => {
                    setIsAuthed(r.data.authenticated);
                    if (r.data.authenticated) setStatus({ t: "ok", m: "YouTube connected successfully!" });
                });
                popupRef.current?.close();
            }
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    const handleConnect = () => {
        const w = 500, h = 650;
        const popup = window.open(`${API}/auth/google`, "yt-auth",
            `width=${w},height=${h},left=${(window.screenX + (window.outerWidth - w) / 2)},top=${(window.screenY + (window.outerHeight - h) / 2)},toolbar=no,menubar=no`);
        popupRef.current = popup;
        const t = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(t);
                axios.get(`${API}/auth/status`).then((r) => {
                    setIsAuthed(r.data.authenticated);
                    if (r.data.authenticated) setStatus({ t: "ok", m: "YouTube connected successfully!" });
                });
            }
        }, 700);
    };

    const handleSchedule = async () => {
        if (!title) return setStatus({ t: "err", m: "Please enter a video title." });
        if (!publishAt) return setStatus({ t: "err", m: "Please pick a publish date & time." });
        if (!videoFile) return setStatus({ t: "err", m: "Please select a video file." });
        const fd = new FormData();
        fd.append("video", videoFile); fd.append("title", title);
        fd.append("description", description); fd.append("publishAt", new Date(publishAt).toISOString());
        setLoading(true); setStatus({ t: "load", m: "Uploading to YouTube, please wait…" });
        try {
            const r = await axios.post(`${API}/schedule`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            setStatus({ t: "ok", m: `Scheduled! Video ID: ${r.data.videoId}` });
            setTitle(""); setDescription(""); setPublishAt(""); setVideoFile(null);
        } catch (e) {
            setStatus({ t: "err", m: e.response?.data?.error || e.message });
        } finally { setLoading(false); }
    };



    const getDateWarning = () => {
        if (!publishAt) return null;
        const picked = new Date(publishAt);
        const now = new Date();
        if (isNaN(picked.getTime())) return { type: "error", msg: "Invalid date — please enter a valid date and time." };
        if (picked < now) return { type: "error", msg: "This date & time is in the past. Please choose a future date." };
        if (picked.getFullYear() < now.getFullYear()) return { type: "error", msg: `Year ${picked.getFullYear()} is outdated. Did you mean ${now.getFullYear()} or later?` };
        if (picked.getFullYear() === now.getFullYear() && picked.getMonth() < now.getMonth()) return { type: "error", msg: `${picked.toLocaleString("default", { month: "long" })} ${picked.getFullYear()} has already passed. Please pick a future month.` };
        const diffMins = (picked - now) / 60000;
        if (diffMins < 15) return { type: "warn", msg: "Schedule at least 15 minutes ahead so YouTube has time to process." };
        return { type: "ok", msg: `Valid — publishes in ${diffMins < 60 ? Math.round(diffMins) + " minutes" : diffMins < 1440 ? Math.round(diffMins / 60) + " hours" : Math.round(diffMins / 1440) + " days"}.` };
    };

    const dateWarning = getDateWarning();
    const disabled = loading || !isAuthed || dateWarning?.type === "error";

    const statusStyle = (t) => ({
        padding: "10px 14px", borderRadius: 9, border: "1px solid", fontSize: 13, fontWeight: 500, marginTop: 12,
        background: t === "ok" ? "#f0fdf4" : t === "load" ? "#fffbeb" : "#fef2f2",
        borderColor: t === "ok" ? "#86efac" : t === "load" ? "#fcd34d" : "#fca5a5",
        color: t === "ok" ? "#15803d" : t === "load" ? "#92400e" : "#b91c1c",
    });

    return (
        <div style={s.page}>
            <div style={s.wrap}>

                {/* Header */}
                <div style={s.headerRow}>
                    <div>
                        <div style={s.badge}>Content Hub</div>
                        <h1 style={s.pageTitle}>Social Autopilot</h1>
                        <p style={s.pageSub}>Schedule and publish content across all your platforms.</p>
                    </div>
                    <div style={s.dateBadge}>
                        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </div>
                </div>

                {/* Platform Selector */}
                <div style={s.platformGrid}>
                    {PLATFORMS.map((p) => {
                        const active = activePlatform === p.id;
                        return (
                            <div key={p.id} onClick={() => p.supported && setActivePlatform(p.id)} style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                                padding: "14px 6px", borderRadius: 14, textAlign: "center",
                                border: active ? `2px solid ${p.color}` : "1.5px solid rgba(0,0,0,0.09)",
                                background: active ? "#fff" : "#fff",
                                cursor: p.supported ? "pointer" : "default",
                                opacity: p.supported ? 1 : 0.42,
                                transition: "all 0.15s", position: "relative",
                                boxShadow: active ? `0 0 0 3px ${p.color}22` : "none",
                            }}>
                                {!p.supported && (
                                    <span style={{ position: "absolute", top: 5, right: 5, fontSize: 8, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#9B9895", background: "#EDECE9", borderRadius: 4, padding: "2px 4px" }}>
                                        Soon
                                    </span>
                                )}
                                <div style={{ color: active ? p.color : "#AAAAA5" }}>{p.icon}</div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: active ? p.color : "#5A5956", letterSpacing: "0.01em" }}>{p.name}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Two-col layout */}
                <div style={s.layout}>

                    {/* Left */}
                    <div>
                        {/* Auth */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>YouTube Account</div>
                            <div style={s.authRow}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: isAuthed ? "#16a34a" : "#d97706", flexShrink: 0 }} />
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "#0F0E0C" }}>
                                        {isAuthed ? "Connected — ready to publish" : "Not connected"}
                                    </span>
                                </div>
                                {!isAuthed
                                    ? <button onClick={handleConnect} style={{ padding: "7px 14px", background: "#F4622A", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Connect YouTube</button>
                                    : <button onClick={() => { setIsAuthed(false); setStatus(null); }} style={{ padding: "7px 14px", background: "transparent", color: "#dc2626", border: "1.5px solid #fca5a5", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Disconnect</button>
                                }
                            </div>
                            {!isAuthed && <p style={{ fontSize: 12, color: "#9B9895", margin: 0 }}>Authorize once — credentials saved securely on your local server.</p>}
                        </div>

                        {/* Video Details */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Video Details</div>
                            <div style={s.fieldWrap}>
                                <label style={s.label}>Video Title *</label>
                                <input style={s.input} placeholder="Give your video a compelling title…" value={title} onChange={(e) => setTitle(e.target.value)} />
                                <div style={{ fontSize: 11, color: title.length > 90 ? "#dc2626" : "#9B9895", textAlign: "right", marginTop: 3 }}>{title.length}/100</div>
                            </div>
                            <div style={s.fieldWrap}>
                                <label style={s.label}>Description</label>
                                <textarea style={s.textarea} placeholder="Describe your video… use keywords and #hashtags for discoverability." value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div style={{ ...s.grid2, ...s.fieldWrap }}>
                                <div>
                                    <label style={s.label}>Publish Date & Time *</label>
                                    <input
                                        style={{ ...s.input, borderColor: dateWarning?.type === "error" ? "#fca5a5" : dateWarning?.type === "warn" ? "#fcd34d" : dateWarning?.type === "ok" ? "#86efac" : "rgba(0,0,0,0.1)" }}
                                        type="datetime-local"
                                        value={publishAt}
                                        onChange={(e) => setPublishAt(e.target.value)}
                                    />
                                    {dateWarning && (
                                        <div style={{
                                            marginTop: 6, padding: "7px 11px", borderRadius: 7, fontSize: 12, fontWeight: 500,
                                            background: dateWarning.type === "error" ? "#fef2f2" : dateWarning.type === "warn" ? "#fffbeb" : "#f0fdf4",
                                            color: dateWarning.type === "error" ? "#b91c1c" : dateWarning.type === "warn" ? "#92400e" : "#15803d",
                                            border: `1px solid ${dateWarning.type === "error" ? "#fca5a5" : dateWarning.type === "warn" ? "#fcd34d" : "#86efac"}`,
                                        }}>
                                            {dateWarning.type === "error" ? "⚠️" : dateWarning.type === "warn" ? "⏰" : "✅"} {dateWarning.msg}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={s.label}>Visibility</label>
                                    <select style={s.input}>
                                        <option>Private (auto-publish)</option>
                                        <option>Public</option>
                                        <option>Unlisted</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Upload */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Video File</div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("video/")) setVideoFile(f); }}
                                style={{
                                    border: `1.5px dashed ${videoFile ? "#F4622A" : "rgba(0,0,0,0.14)"}`,
                                    borderRadius: 12, padding: "24px 20px",
                                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                                    cursor: "pointer", background: videoFile ? "#fff5f1" : "#FAFAF8",
                                    transition: "all 0.15s", textAlign: "center",
                                }}
                            >
                                <input ref={fileInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setVideoFile(e.target.files[0])} />
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                                    {videoFile ? "🎬" : "📁"}
                                </div>
                                {videoFile ? (
                                    <>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#F4622A" }}>{videoFile.name}</span>
                                        <span style={{ fontSize: 11, color: "#9B9895" }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB · Click to replace</span>
                                    </>
                                ) : (
                                    <>
                                        <span style={{ fontSize: 13, color: "#5A5956" }}><span style={{ color: "#F4622A", fontWeight: 600 }}>Click to upload</span> or drag & drop</span>
                                        <span style={{ fontSize: 11, color: "#9B9895" }}>MP4, MOV, AVI — up to 128 GB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div>
                        {/* Summary */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Post Summary</div>
                            {[
                                ["Platform", "YouTube"],
                                ["Title", title || "—"],
                                ["Scheduled", publishAt ? new Date(publishAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"],
                                ["File", videoFile ? videoFile.name : "—"],
                                ["Auth", isAuthed ? "✅ Ready" : "⚠️ Connect first"],
                            ].map(([k, v]) => (
                                <div key={k} style={s.summaryRow}>
                                    <span style={{ color: "#7A7874" }}>{k}</span>
                                    <span style={{ fontWeight: 600, color: v.startsWith("✅") ? "#16a34a" : v.startsWith("⚠️") ? "#d97706" : "#0F0E0C", maxWidth: 160, textAlign: "right", wordBreak: "break-word", fontSize: 12 }}>{v}</span>
                                </div>
                            ))}

                            {status && <div style={statusStyle(status.t)}>{status.t === "ok" ? "✅" : status.t === "load" ? "⏳" : "❌"} {status.m}</div>}

                            <button
                                onClick={handleSchedule}
                                disabled={disabled}
                                style={{
                                    width: "100%", padding: "13px", marginTop: 16,
                                    background: disabled ? "#D0CECC" : "#F4622A",
                                    color: "#fff", border: "none", borderRadius: 10,
                                    fontSize: 15, fontWeight: 700,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    fontFamily: "'DM Sans',sans-serif", transition: "background 0.15s",
                                }}
                            >
                                {loading ? "⏳ Uploading…" : "🚀 Schedule Post"}
                            </button>
                            {!isAuthed && <p style={{ textAlign: "center", fontSize: 12, color: "#9B9895", marginTop: 8, marginBottom: 0 }}>Connect YouTube above first</p>}
                        </div>

                        {/* Tips */}
                        <div style={{ background: "#FFF8F5", border: "1px solid #fde8de", borderRadius: 14, padding: "16px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#F4622A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Pro Tips</div>
                            {[
                                "Schedule at least 15 mins ahead for YouTube to process your video.",
                                "Best time to post: Tue–Thu, 2–4 PM your audience's timezone.",
                                "Add #hashtags in description for better discoverability.",
                                "Ideal thumbnail: 1280×720px JPG or PNG under 2 MB.",
                            ].map((tip, i) => (
                                <div key={i} style={{ fontSize: 12, color: "#7A7874", lineHeight: 1.7, display: "flex", gap: 6, marginBottom: 4 }}>
                                    <span style={{ color: "#F4622A", flexShrink: 0 }}>›</span> {tip}
                                </div>
                            ))}
                        </div>

                        {/* Back */}
                        <button onClick={() => window.history.back()} style={{ marginTop: 14, background: "none", border: "none", color: "#9B9895", fontSize: 13, cursor: "pointer", padding: 0, display: "block" }}>
                            ← Back to Home
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}