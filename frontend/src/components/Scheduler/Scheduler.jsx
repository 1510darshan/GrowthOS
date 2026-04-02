import { useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .sch-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--off-white);
    min-height: 100vh;
    padding: 32px;
    color: var(--text-primary);
  }

  .sch-header {
    margin-bottom: 32px;
  }

  .sch-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .sch-title {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  .sch-subtitle {
    font-size: 13px;
    color: var(--text-hint);
    font-weight: 400;
  }

  .sch-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: var(--orange-light);
    border: 1px solid var(--orange-mid);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    color: var(--orange-dark);
  }

  .sch-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--orange);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .sch-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 20px;
    align-items: start;
  }

  @media (max-width: 900px) {
    .sch-layout { grid-template-columns: 1fr; }
    .sch-root { padding: 20px; }
  }

  .sch-left {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Cards */
  .sch-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 22px;
    transition: border-color 0.2s;
  }

  .sch-card:focus-within {
    border-color: var(--orange-mid);
  }

  .sch-card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-hint);
    margin-bottom: 14px;
  }

  /* Upload zone */
  .sch-upload {
    border: 1.5px dashed var(--border-strong);
    border-radius: var(--radius-md);
    min-height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--surface);
    position: relative;
    overflow: hidden;
  }

  .sch-upload:hover, .sch-upload.drag {
    border-color: var(--orange);
    background: var(--orange-light);
  }

  .sch-upload-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    background: var(--white);
    border: 1px solid var(--border-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--orange);
  }

  .sch-upload-text {
    font-size: 13px;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1.5;
  }

  .sch-upload-text span {
    color: var(--orange);
    font-weight: 500;
  }

  .sch-upload-hint {
    font-size: 11px;
    color: var(--text-hint);
  }

  .sch-preview-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: var(--radius-md);
    display: block;
  }

  .sch-img-replace {
    margin-top: 10px;
    font-size: 12px;
    color: var(--orange);
    cursor: pointer;
    text-align: center;
    font-weight: 500;
  }

  /* Fields */
  .sch-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .sch-field:last-child { margin-bottom: 0; }

  .sch-field label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .sch-input, .sch-textarea, .sch-select {
    width: 100%;
    padding: 10px 13px;
    border: 1px solid var(--border-md);
    border-radius: var(--radius-sm);
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    background: var(--surface);
    outline: none;
    transition: border-color 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .sch-input:focus, .sch-textarea:focus, .sch-select:focus {
    border-color: var(--orange);
    background: var(--white);
    box-shadow: 0 0 0 3px var(--orange-glow);
  }

  .sch-textarea {
    resize: vertical;
    min-height: 90px;
    line-height: 1.55;
  }

  .sch-char {
    font-size: 11px;
    color: var(--text-hint);
    text-align: right;
    margin-top: 3px;
  }

  .sch-char.warn { color: #BA7517; }
  .sch-char.over { color: #c0392b; }

  .sch-grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* Post type pills */
  .sch-type-wrap {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .sch-type-pill {
    padding: 7px 15px;
    border-radius: 999px;
    border: 1px solid var(--border-md);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    background: var(--surface);
    transition: all 0.15s;
    user-select: none;
  }

  .sch-type-pill:hover {
    border-color: var(--orange-mid);
    color: var(--orange-dark);
    background: var(--orange-light);
  }

  .sch-type-pill.active {
    background: var(--orange);
    border-color: var(--orange);
    color: var(--white);
  }

  /* Hashtag pills */
  .sch-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .sch-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: var(--orange-light);
    border: 1px solid var(--orange-mid);
    border-radius: 999px;
    font-size: 12px;
    color: var(--orange-dark);
    font-weight: 500;
  }

  .sch-tag-x {
    cursor: pointer;
    opacity: 0.6;
    font-size: 11px;
    line-height: 1;
  }
  .sch-tag-x:hover { opacity: 1; }

  .sch-tag-input {
    border: none;
    background: transparent;
    font-size: 12.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    outline: none;
    width: 120px;
  }

  /* Right panel */
  .sch-right {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 32px;
  }

  /* Phone mockup */
  .sch-phone-wrap {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sch-phone {
    width: 204px;
    background: var(--white);
    border: 1px solid var(--border-md);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  .sch-phone-bar {
    display: flex;
    align-items: center;
    padding: 10px 12px 8px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
  }

  .sch-phone-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), #C0461A);
    flex-shrink: 0;
  }

  .sch-phone-handle {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
  }

  .sch-phone-more {
    font-size: 14px;
    color: var(--text-hint);
    letter-spacing: 1px;
    line-height: 1;
  }

  .sch-phone-img {
    width: 100%;
    aspect-ratio: 1;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .sch-phone-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .sch-phone-img-empty {
    font-size: 11px;
    color: var(--text-hint);
  }

  .sch-phone-actions {
    display: flex;
    gap: 10px;
    padding: 9px 12px 5px;
  }

  .sch-phone-action svg {
    width: 17px;
    height: 17px;
    stroke: var(--text-secondary);
    fill: none;
  }

  .sch-phone-caption {
    padding: 0 12px 14px;
  }

  .sch-phone-cap-title {
    font-size: 10.5px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
  }

  .sch-phone-cap-text {
    font-size: 10px;
    color: var(--text-secondary);
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  /* Status card */
  .sch-status-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
  }

  .sch-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .sch-status-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-hint);
  }

  .sch-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
  }

  .sch-status-pill.empty {
    background: var(--surface2);
    color: var(--text-hint);
  }

  .sch-status-pill.ready {
    background: var(--orange-light);
    border: 1px solid var(--orange-mid);
    color: var(--orange-dark);
  }

  .sch-status-pill.queued {
    background: #EAF3DE;
    color: #3B6D11;
  }

  .sch-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .sch-sched-time {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    margin-top: 6px;
  }

  /* Submit button */
  .sch-submit {
    width: 100%;
    padding: 12px;
    background: var(--orange);
    color: var(--white);
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.01em;
  }

  .sch-submit:hover:not(:disabled) {
    background: var(--orange-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px var(--orange-glow);
  }

  .sch-submit:active:not(:disabled) {
    transform: translateY(0);
  }

  .sch-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Queue */
  .sch-queue {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
  }

  .sch-queue-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid var(--border);
  }

  .sch-queue-item:last-child { border-bottom: none; }

  .sch-queue-thumb {
    width: 38px;
    height: 38px;
    border-radius: var(--radius-xs);
    object-fit: cover;
    background: var(--surface2);
    flex-shrink: 0;
  }

  .sch-queue-info { flex: 1; min-width: 0; }

  .sch-queue-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sch-queue-time {
    font-size: 11px;
    color: var(--text-hint);
    margin-top: 1px;
  }

  .sch-queue-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--orange-mid);
    flex-shrink: 0;
  }

  /* Zapier info banner */
  .sch-zapier-banner {
    background: linear-gradient(135deg, var(--orange-light) 0%, #fff 100%);
    border: 1px solid var(--orange-mid);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-top: 4px;
  }

  .sch-zapier-banner strong {
    color: var(--orange-dark);
    font-weight: 600;
  }

  .sch-zapier-url {
    display: block;
    font-size: 11px;
    font-family: monospace;
    background: var(--white);
    border: 1px solid var(--orange-mid);
    border-radius: var(--radius-xs);
    padding: 5px 8px;
    color: var(--orange-dark);
    margin-top: 8px;
    word-break: break-all;
  }

  /* Toast */
  .sch-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--text-primary);
    color: var(--white);
    padding: 11px 22px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 9999;
    pointer-events: none;
    white-space: nowrap;
  }

  .sch-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .sch-divider {
    height: 1px;
    background: var(--border);
    margin: 14px 0;
  }
`;

const POST_TYPES = ["Feed post", "Story", "Reel", "Carousel"];

export default function Scheduler() {
    const [imgSrc, setImgSrc] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [handle, setHandle] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [postType, setPostType] = useState("Feed post");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [queue, setQueue] = useState([]);
    const [isDrag, setIsDrag] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const handleFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setImgFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImgSrc(e.target.result);
        reader.readAsDataURL(file);
    };

    const capLen = caption.length;
    const charClass = capLen > 2000 ? (capLen > 2200 ? "over" : "warn") : "";

    const isReady = title.trim() && handle.trim() && scheduleTime && imgSrc;

    const formatTime = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        return d.toLocaleString("en-IN", {
            weekday: "short", month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const addTag = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const t = tagInput.replace(/[^a-zA-Z0-9_]/g, "").trim();
            if (t && !tags.includes(t)) setTags([...tags, t]);
            setTagInput("");
        }
    };

    const removeTag = (t) => setTags(tags.filter((x) => x !== t));

    const handleSchedule = async () => {
        if (!isReady) return;
        setLoading(true);

        // Build FormData to send to Zapier webhook
        const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/";
        const formData = new FormData();
        formData.append("title", title);
        formData.append("caption", caption + (tags.length ? "\n" + tags.map(t => `#${t}`).join(" ") : ""));
        formData.append("handle", handle);
        formData.append("scheduleTime", scheduleTime);
        formData.append("postType", postType);
        if (imgFile) formData.append("image", imgFile);

        try {
            // Uncomment below when you have your Zapier webhook URL:
            // await fetch(ZAPIER_WEBHOOK_URL, { method: "POST", body: formData });

            // Simulate for now
            await new Promise((r) => setTimeout(r, 800));

            setQueue((q) => [
                { title, handle, scheduleTime, postType, imgSrc, id: Date.now() },
                ...q.slice(0, 3),
            ]);
            // Reset
            setTitle(""); setCaption(""); setHandle(""); setScheduleTime("");
            setImgSrc(null); setImgFile(null); setTags([]);
            setToast(true);
            setTimeout(() => setToast(false), 3000);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <>
            <style>{styles}</style>
            <div className="sch-root">
                {/* Header */}
                <div className="sch-header">
                    <div className="sch-header-top">
                        <h1 className="sch-title">Post Scheduler</h1>
                        <div className="sch-badge">
                            <div className="sch-badge-dot" />
                            Zapier connected
                        </div>
                    </div>
                    <p className="sch-subtitle">Schedule Instagram posts — powered by Zapier automation</p>
                </div>

                <div className="sch-layout">
                    {/* LEFT */}
                    <div className="sch-left">

                        {/* Image upload */}
                        <div className="sch-card">
                            <div className="sch-card-label">Image</div>
                            {imgSrc ? (
                                <>
                                    <img src={imgSrc} alt="preview" className="sch-preview-img" />
                                    <div className="sch-img-replace" onClick={() => fileRef.current.click()}>
                                        Replace image
                                    </div>
                                </>
                            ) : (
                                <div
                                    className={`sch-upload${isDrag ? " drag" : ""}`}
                                    onClick={() => fileRef.current.click()}
                                    onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
                                    onDragLeave={() => setIsDrag(false)}
                                    onDrop={(e) => { e.preventDefault(); setIsDrag(false); handleFile(e.dataTransfer.files[0]); }}
                                >
                                    <div className="sch-upload-icon">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </div>
                                    <p className="sch-upload-text">
                                        <span>Click to upload</span> or drag and drop
                                    </p>
                                    <p className="sch-upload-hint">JPG, PNG, WEBP · Square recommended (1:1)</p>
                                </div>
                            )}
                            <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }}
                                onChange={(e) => handleFile(e.target.files[0])} />
                        </div>

                        {/* Post details */}
                        <div className="sch-card">
                            <div className="sch-card-label">Post details</div>
                            <div className="sch-field">
                                <label>Post title (internal reference)</label>
                                <input className="sch-input" placeholder="e.g. Summer launch campaign"
                                    value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="sch-field">
                                <label>Caption</label>
                                <textarea className="sch-textarea" placeholder="Write your caption..."
                                    value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={2200} />
                                <div className={`sch-char ${charClass}`}>{capLen} / 2200</div>
                            </div>
                            <div className="sch-field">
                                <label>Hashtags (press Enter or Space to add)</label>
                                <div style={{ background: "var(--surface)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                                    <div className="sch-tags">
                                        {tags.map((t) => (
                                            <span key={t} className="sch-tag">
                                                #{t}
                                                <span className="sch-tag-x" onClick={() => removeTag(t)}>✕</span>
                                            </span>
                                        ))}
                                        <input className="sch-tag-input" placeholder="Add hashtag..."
                                            value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
                                    </div>
                                </div>
                            </div>
                            <div className="sch-field">
                                <label>Instagram handle</label>
                                <input className="sch-input" placeholder="@yourusername"
                                    value={handle} onChange={(e) => setHandle(e.target.value)} />
                            </div>
                        </div>

                        {/* Schedule settings */}
                        <div className="sch-card">
                            <div className="sch-card-label">Schedule</div>
                            <div className="sch-grid2">
                                <div className="sch-field">
                                    <label>Date &amp; time</label>
                                    <input type="datetime-local" className="sch-input"
                                        value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                                </div>
                                <div className="sch-field">
                                    <label>Post type</label>
                                    <select className="sch-select" value={postType} onChange={(e) => setPostType(e.target.value)}>
                                        {POST_TYPES.map((t) => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="sch-field">
                                <label>Post type quick pick</label>
                                <div className="sch-type-wrap">
                                    {POST_TYPES.map((t) => (
                                        <div key={t} className={`sch-type-pill${postType === t ? " active" : ""}`}
                                            onClick={() => setPostType(t)}>{t}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Zapier info */}
                        <div className="sch-zapier-banner">
                            <strong>How it works:</strong> When you click "Schedule post", this form sends your data to a Zapier webhook. Zapier then waits until the scheduled time and posts to Instagram automatically via Buffer.
                            <span className="sch-zapier-url">POST → https://hooks.zapier.com/hooks/catch/YOUR_ID/</span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="sch-right">
                        {/* Phone preview */}
                        <div className="sch-phone-wrap">
                            <div className="sch-card-label" style={{ alignSelf: "flex-start", marginBottom: 12 }}>Preview</div>
                            <div className="sch-phone">
                                <div className="sch-phone-bar">
                                    <div className="sch-phone-avatar" />
                                    <div className="sch-phone-handle">
                                        {handle ? (handle.startsWith("@") ? handle : "@" + handle) : "@yourusername"}
                                    </div>
                                    <div className="sch-phone-more">···</div>
                                </div>
                                <div className="sch-phone-img">
                                    {imgSrc
                                        ? <img src={imgSrc} alt="preview" />
                                        : <span className="sch-phone-img-empty">No image</span>}
                                </div>
                                <div className="sch-phone-actions">
                                    {/* Heart */}
                                    <span className="sch-phone-action">
                                        <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                    </span>
                                    {/* Comment */}
                                    <span className="sch-phone-action">
                                        <svg viewBox="0 0 24 24" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                    </span>
                                    {/* Share */}
                                    <span className="sch-phone-action">
                                        <svg viewBox="0 0 24 24" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </span>
                                </div>
                                <div className="sch-phone-caption">
                                    <div className="sch-phone-cap-title">{title || "Post title"}</div>
                                    <div className="sch-phone-cap-text">
                                        {caption || "Your caption will appear here..."}
                                        {tags.length > 0 && " " + tags.map(t => `#${t}`).join(" ")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="sch-status-card">
                            <div className="sch-status-row">
                                <span className="sch-status-label">Status</span>
                                <span className={`sch-status-pill ${isReady ? "ready" : "empty"}`}>
                                    <span className="sch-status-dot" />
                                    {isReady ? "Ready to schedule" : "Incomplete"}
                                </span>
                            </div>
                            {scheduleTime && (
                                <div className="sch-sched-time">
                                    {formatTime(scheduleTime)}
                                </div>
                            )}
                            <div className="sch-divider" />
                            <button className="sch-submit" disabled={!isReady || loading} onClick={handleSchedule}>
                                {loading ? "Sending to Zapier..." : "Schedule post →"}
                            </button>
                        </div>

                        {/* Queue */}
                        {queue.length > 0 && (
                            <div className="sch-queue">
                                <div className="sch-card-label" style={{ marginBottom: 10 }}>Scheduled queue</div>
                                {queue.map((item) => (
                                    <div key={item.id} className="sch-queue-item">
                                        {item.imgSrc
                                            ? <img src={item.imgSrc} className="sch-queue-thumb" alt="thumb" />
                                            : <div className="sch-queue-thumb" />}
                                        <div className="sch-queue-info">
                                            <div className="sch-queue-title">{item.title}</div>
                                            <div className="sch-queue-time">{formatTime(item.scheduleTime)} · {item.postType}</div>
                                        </div>
                                        <div className="sch-queue-dot" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast */}
            <div className={`sch-toast${toast ? " show" : ""}`}>
                Post scheduled via Zapier ✓
            </div>
        </>
    );
}