import { useState, useRef } from "react";
import "./BusinessBrain.css";
import axios from "axios";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const INDUSTRY_CATEGORIES = [
  "E-commerce / Retail",
  "Food & Beverage / Restaurant",
  "Fashion & Apparel",
  "Health & Wellness / Fitness",
  "Beauty & Personal Care",
  "Education & EdTech",
  "Real Estate",
  "Travel & Hospitality",
  "Technology / SaaS",
  "Finance & FinTech",
  "Healthcare / Medical",
  "Agriculture / AgroTech",
  "Manufacturing / B2B",
  "Media & Entertainment",
  "NGO / Non-Profit",
  "Professional Services",
  "Automotive",
  "Home & Interior Design",
  "Events & Wedding",
  "Other",
];

const BUSINESS_MODELS = [
  "D2C (Direct to Consumer)",
  "B2B (Business to Business)",
  "B2C (Business to Consumer)",
  "Marketplace / Platform",
  "Subscription",
  "Franchise",
  "Service-based",
  "SaaS / Digital Product",
];

const ANALYSIS_STEPS = [
  { id: 1, label: "Scanning website & landing pages" },
  { id: 2, label: "Analyzing industry & competitors" },
  { id: 3, label: "Building audience personas" },
  { id: 4, label: "Detecting market trends & festivals" },
  { id: 5, label: "Generating business intelligence report" },
];

/* ─────────────────────────────────────────────
   SERPER SEARCH HELPER
   Backend route: POST /api/serper-search
   (see backend guide below)
───────────────────────────────────────────── */


async function serperSearch(query) {
  try {
    const res = await axios.post(
      "http://localhost:5000/api//serper-search",
      { query }
    );

    const data = res.data;

    return (
      data.organic
        ?.map((r) => `${r.title}: ${r.snippet}`)
        .join("\n") || ""
    );
  } catch (err) {
    console.error("Serper Error:", err.message);
    return "";
  }
}

/* ─────────────────────────────────────────────
   GEMINI / CLAUDE API HELPER
   Backend route: POST /api/generate
───────────────────────────────────────────── */
async function generateAI(prompt) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("AI generation failed");
  const data = await res.json();
  return data.text || data.content || "";
}

/* ─────────────────────────────────────────────
   PARSE AI JSON RESPONSE SAFELY
───────────────────────────────────────────── */
function parseJSON(raw) {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
   RESULT DISPLAY COMPONENTS
───────────────────────────────────────────── */
function SectionCard({ icon, label, badge, children }) {
  return (
    <div className="bb-section">
      <div className="bb-section-head">
        <div className="bb-section-icon">{icon}</div>
        <span className="bb-section-label">{label}</span>
        {badge && <span className="bb-section-badge">{badge}</span>}
      </div>
      <div className="bb-section-body">{children}</div>
    </div>
  );
}

function ResultDisplay({ data, onReset }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="bb-result">
      {/* Top bar */}
      <div className="bb-result-topbar">
        <div className="bb-result-title">
          📊 Business Intelligence Report — <span style={{ color: "var(--orange)" }}>{data.businessName}</span>
        </div>
        <div className="bb-result-actions">
          <button className="bb-action-btn" onClick={handleCopy}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy JSON
          </button>
          <button className="bb-action-btn" onClick={onReset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.86" />
            </svg>
            New Analysis
          </button>
        </div>
      </div>

      {/* 1. Business Overview */}
      <SectionCard icon="🏢" label="Business Overview" badge="AI Generated">
        <div className="bb-metrics">
          {[
            { label: "Business Name", value: data.businessName },
            { label: "Industry", value: data.industry },
            { label: "Business Model", value: data.businessModel },
            { label: "Market Size", value: data.marketSize, orange: true },
            { label: "Growth Rate", value: data.growthRate, orange: true },
            { label: "Location Focus", value: data.locationFocus },
          ].map((m, i) => (
            <div className="bb-metric" key={i}>
              <div className="bb-metric-label">{m.label}</div>
              <div className={`bb-metric-value${m.orange ? " orange" : ""}`}>{m.value || "—"}</div>
            </div>
          ))}
        </div>
        <p className="bb-prose">{data.businessSummary}</p>
        {data.uniqueValueProps?.length > 0 && (
          <div className="bb-tags">
            {data.uniqueValueProps.map((t, i) => (
              <span className="bb-tag-pill orange" key={i}>{t}</span>
            ))}
          </div>
        )}
      </SectionCard>

      {/* 2. Target Audience Personas */}
      <SectionCard icon="👥" label="Target Audience Personas" badge={`${data.personas?.length || 0} Personas`}>
        <div className="bb-personas">
          {data.personas?.map((p, i) => (
            <div className="bb-persona-card" key={i}>
              <div className="bb-persona-avatar">{p.emoji || "👤"}</div>
              <div className="bb-persona-name">{p.name}</div>
              <div className="bb-persona-role">{p.role}</div>
              <div className="bb-persona-desc">{p.description}</div>
              <div className="bb-persona-tags">
                {p.traits?.map((t, j) => (
                  <span className="bb-persona-tag" key={j}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3. Competitor Analysis */}
      <SectionCard icon="🔍" label="Competitor Positioning">
        <table className="bb-competitor-table">
          <thead>
            <tr>
              <th>Competitor</th>
              <th>Strengths</th>
              <th>Weakness / Gap</th>
              <th>Your Edge</th>
            </tr>
          </thead>
          <tbody>
            {data.competitors?.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.strengths}</td>
                <td><span className="bb-gap-badge warn">{c.weakness}</span></td>
                <td><span className="bb-gap-badge">{c.yourEdge}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* 4. Market Trends */}
      <SectionCard icon="📈" label="Current Market Trends & Dynamics" badge="Live Intel">
        <div className="bb-trends">
          {data.trends?.map((t, i) => (
            <div className="bb-trend-card" key={i}>
              <div className="bb-trend-head">
                <span className="bb-trend-icon">{t.emoji || "📊"}</span>
                <span className="bb-trend-name">{t.name}</span>
                <span className="bb-trend-arrow">↑</span>
              </div>
              <div className="bb-trend-desc">{t.description}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 5. Festival & Seasonal Calendar */}
      <SectionCard icon="🎯" label="Festival & Seasonal Opportunities" badge="30-Day Outlook">
        <div className="bb-festival-list">
          {data.festivals?.map((f, i) => (
            <div className="bb-festival-item" key={i}>
              <span className="bb-festival-emoji">{f.emoji || "🎉"}</span>
              <div className="bb-festival-info">
                <div className="bb-festival-name">{f.name}</div>
                <div className="bb-festival-date">{f.date}</div>
                <div className="bb-festival-opp">{f.opportunity}</div>
              </div>
              <div className="bb-festival-score">
                <div className="score-num">{f.relevanceScore}/10</div>
                <div className="score-lbl">relevance</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 6. Buying Intent Keywords */}
      <SectionCard icon="🔑" label="High-Intent Keywords & Topics">
        <div className="bb-tags">
          {data.highIntentKeywords?.map((k, i) => (
            <span className={`bb-tag-pill ${i % 3 === 0 ? "orange" : i % 3 === 1 ? "green" : "blue"}`} key={i}>{k}</span>
          ))}
        </div>
      </SectionCard>

      {/* 7. Strategic Recommendations */}
      <SectionCard icon="🚀" label="Strategic Growth Recommendations" badge="AI Insights">
        <div className="bb-recs">
          {data.recommendations?.map((r, i) => (
            <div className="bb-rec-item" key={i}>
              <div className="bb-rec-num">{i + 1}</div>
              <div className="bb-rec-text" dangerouslySetInnerHTML={{ __html: r.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS INDICATOR
───────────────────────────────────────────── */
function ProgressView({ currentStep, progress }) {
  return (
    <div className="bb-progress-card">
      <div className="bb-progress-header">
        <div className="bb-progress-icon">🧠</div>
        <div>
          <div className="bb-progress-title">Analyzing your business…</div>
          <div className="bb-progress-sub">AI is building your intelligence report. This takes ~60–90 seconds.</div>
        </div>
      </div>
      <div className="bb-progress-bar-wrap">
        <div className="bb-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="bb-progress-steps">
        {ANALYSIS_STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;
          return (
            <div
              key={step.id}
              className={`bb-progress-step${isDone ? " done" : isActive ? " active" : ""}`}
            >
              <div className="bb-step-dot">
                {isDone ? "✓" : isActive ? "…" : ""}
              </div>
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function BusinessBrain() {
  const [form, setForm] = useState({
    websiteUrl: "",
    businessName: "",
    category: "",
    businessModel: "",
    targetLocation: "",
    productsServices: "",
    additionalContext: "",
  });
  const [selectedModels, setSelectedModels] = useState([]);
  const [phase, setPhase] = useState("form"); // form | loading | result | error
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const topRef = useRef(null);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const toggleModel = (model) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const isFormValid =
    form.websiteUrl.trim() !== "" &&
    form.category !== "" &&
    form.additionalContext.trim().length >= 10;

  /* ── MAIN ANALYSIS FLOW ── */
  const handleAnalyze = async () => {
    if (!isFormValid) return;
    setPhase("loading");
    setCurrentStep(1);
    setProgress(5);
    topRef.current?.scrollIntoView({ behavior: "smooth" });

    try {
      // Step 1 — scrape context via Serper
      setCurrentStep(1); setProgress(10);
      const webContext = await serperSearch(
        `${form.businessName || form.websiteUrl} ${form.category} business India market overview site:${form.websiteUrl}`
      );

      // Step 2 — competitor research
      setCurrentStep(2); setProgress(28);
      const competitorContext = await serperSearch(
        `top competitors ${form.category} India 2025 ${form.targetLocation || ""} market`
      );

      // Step 3 — audience + trends
      setCurrentStep(3); setProgress(46);
      const trendContext = await serperSearch(
        `${form.category} India consumer trends 2025 buying behavior digital marketing`
      );

      // Step 4 — festivals
      setCurrentStep(4); setProgress(64);
      const festivalContext = await serperSearch(
        `India upcoming festivals 2025 marketing opportunities ${form.category}`
      );

      // Step 5 — generate full report
      setCurrentStep(5); setProgress(78);

      const prompt = `
You are an expert business intelligence analyst specializing in Indian markets and digital growth strategy.

Analyze the following business and generate a comprehensive, structured business intelligence report.

BUSINESS DETAILS:
- Website/URL: ${form.websiteUrl}
- Business Name: ${form.businessName || "Not provided (infer from URL/context)"}
- Industry Category: ${form.category}
- Business Model: ${form.businessModel || "Not specified"}
- Target Location: ${form.targetLocation || "India (general)"}
- Products/Services: ${form.productsServices || "Not specified"}
- Additional Context: ${form.additionalContext}

RESEARCH DATA FROM WEB:
Web Context: ${webContext}
Competitor Intelligence: ${competitorContext}
Market Trends: ${trendContext}
Festival Calendar: ${festivalContext}

Generate a detailed JSON business intelligence profile with this EXACT structure. Be specific, India-relevant, and actionable. No placeholders:

{
  "businessName": "string",
  "industry": "string",
  "businessModel": "string",
  "marketSize": "e.g. ₹2,500 crore",
  "growthRate": "e.g. 28% YoY",
  "locationFocus": "string",
  "businessSummary": "2-3 sentence precise business overview",
  "uniqueValueProps": ["string", "string", "string"],
  "personas": [
    {
      "emoji": "single emoji",
      "name": "Persona Name",
      "role": "Job/Role title",
      "description": "2-sentence description of this buyer",
      "traits": ["trait1", "trait2", "trait3", "trait4"]
    }
  ],
  "competitors": [
    {
      "name": "Competitor name",
      "strengths": "Key strength in 1 sentence",
      "weakness": "Gap or weakness",
      "yourEdge": "How this business can win"
    }
  ],
  "trends": [
    {
      "emoji": "single emoji",
      "name": "Trend name",
      "description": "Why this trend matters for this business in India"
    }
  ],
  "festivals": [
    {
      "emoji": "single emoji",
      "name": "Festival or occasion name",
      "date": "Month/Date 2025",
      "opportunity": "Specific campaign or offer idea for this business",
      "relevanceScore": number between 1-10
    }
  ],
  "highIntentKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"],
  "recommendations": [
    "**Action**: specific recommendation with reasoning",
    "**Action**: specific recommendation with reasoning",
    "**Action**: specific recommendation with reasoning",
    "**Action**: specific recommendation with reasoning",
    "**Action**: specific recommendation with reasoning"
  ]
}

Rules:
- Return ONLY valid JSON. No markdown, no explanation outside JSON.
- Make ALL data India-specific and relevant to the ${form.category} industry.
- personas: minimum 3, maximum 4
- competitors: minimum 3, maximum 5
- trends: minimum 4, maximum 6
- festivals: minimum 5, maximum 8 upcoming ones
- highIntentKeywords: exactly 10
- recommendations: exactly 5
`;

      const raw = await generateAI(prompt);
      setProgress(92);

      const parsed = parseJSON(raw);
      if (!parsed) throw new Error("Could not parse AI response. Please try again.");

      setProgress(100);
      await new Promise((r) => setTimeout(r, 400));
      setResult(parsed);
      setPhase("result");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setPhase("error");
    }
  };

  const handleReset = () => {
    setPhase("form");
    setResult(null);
    setErrorMsg("");
    setCurrentStep(1);
    setProgress(0);
  };

  /* ── URL VALIDATION ── */
  const urlValid =
    form.websiteUrl.length > 4 &&
    (form.websiteUrl.startsWith("http") || form.websiteUrl.includes("."));

  return (
    <div className="bb-page" ref={topRef}>
      {/* Header */}
      <div className="bb-header">
        <div className="bb-tag">
          <span className="bb-tag-dot" />
          Module 01
        </div>
        <h1 className="bb-title">
          Business <span>Brain</span>
        </h1>
        <p className="bb-subtitle">
          Provide your business details below. The AI will scan your website, analyze your market, map competitors, and generate a full India-specific intelligence report in under 2 minutes.
        </p>
      </div>

      {/* ── FORM ── */}
      {phase === "form" && (
        <div className="bb-form-card">
          <div className="bb-form-grid">
            {/* Website URL — required */}
            <div className="bb-field bb-form-full">
              <label>
                <span className="lbl-icon">🌐</span>
                Website URL or Landing Page
                <span className="lbl-required">* required</span>
              </label>
              <div className="bb-input-wrap">
                <span className="bb-input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                <input
                  className={`bb-input${form.websiteUrl ? " has-value" : ""}`}
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourbusiness.com"
                  type="url"
                />
                {urlValid && <span className="bb-input-status valid">✓ valid</span>}
              </div>
            </div>

            {/* Business Name */}
            <div className="bb-field">
              <label>
                <span className="lbl-icon">🏷️</span>
                Business Name
                <span className="lbl-optional">optional</span>
              </label>
              <input
                className={`bb-input${form.businessName ? " has-value" : ""}`}
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="e.g. Nykaa, Zepto, MyBrand"
              />
            </div>

            {/* Target Location */}
            <div className="bb-field">
              <label>
                <span className="lbl-icon">📍</span>
                Target Location
                <span className="lbl-optional">optional</span>
              </label>
              <input
                className={`bb-input${form.targetLocation ? " has-value" : ""}`}
                name="targetLocation"
                value={form.targetLocation}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Pan-India, Tier-2 cities"
              />
            </div>

            {/* Industry Category — required */}
            <div className="bb-field">
              <label>
                <span className="lbl-icon">🏭</span>
                Industry Category
                <span className="lbl-required">* required</span>
              </label>
              <select
                className={`bb-select${form.category ? " has-value" : ""}`}
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select industry…</option>
                {INDUSTRY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Business Model */}
            <div className="bb-field">
              <label>
                <span className="lbl-icon">⚙️</span>
                Business Model
                <span className="lbl-optional">optional</span>
              </label>
              <select
                className={`bb-select${form.businessModel ? " has-value" : ""}`}
                name="businessModel"
                value={form.businessModel}
                onChange={handleChange}
              >
                <option value="">Select model…</option>
                {BUSINESS_MODELS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Products / Services */}
            <div className="bb-field bb-form-full">
              <label>
                <span className="lbl-icon">📦</span>
                Key Products / Services
                <span className="lbl-optional">optional — helps sharpen the analysis</span>
              </label>
              <input
                className={`bb-input${form.productsServices ? " has-value" : ""}`}
                name="productsServices"
                value={form.productsServices}
                onChange={handleChange}
                placeholder="e.g. Organic skincare, Women's kurtas, SaaS HR tool"
              />
            </div>

            {/* Additional context / prompt — required */}
            <div className="bb-field bb-form-full">
              <label>
                <span className="lbl-icon">✍️</span>
                Tell AI about your business
                <span className="lbl-required">* required (min 10 chars)</span>
              </label>
              <textarea
                className="bb-textarea"
                name="additionalContext"
                value={form.additionalContext}
                onChange={handleChange}
                placeholder="Describe what you sell, who your customers are, what makes you different, your current marketing challenges, or any specific area you want analyzed…"
              />
              <div style={{ fontSize: 11, color: form.additionalContext.length >= 10 ? "var(--orange)" : "var(--text-hint)", marginTop: 4 }}>
                {form.additionalContext.length} characters{form.additionalContext.length < 10 ? ` (${10 - form.additionalContext.length} more needed)` : " ✓"}
              </div>
            </div>

            {/* Business Model chips (visual shortcuts) */}
            <div className="bb-field bb-form-full">
              <label>
                <span className="lbl-icon">🎯</span>
                Quick Focus Areas
                <span className="lbl-optional">optional — select what to prioritize</span>
              </label>
              <div className="bb-field-chips">
                {["Competitor gaps", "Audience personas", "Festival campaigns", "Trending topics", "Buying intent keywords", "Seasonal demand", "Content strategy", "Pricing positioning"].map((chip) => (
                  <span
                    key={chip}
                    className={`bb-chip${selectedModels.includes(chip) ? " selected" : ""}`}
                    onClick={() => toggleModel(chip)}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bb-form-footer">
            <div className="bb-form-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Analysis takes ~60–90 seconds · Uses web search + AI
            </div>
            <button
              className="bb-submit-btn"
              onClick={handleAnalyze}
              disabled={!isFormValid}
            >
              <span className="btn-icon">🧠</span>
              Generate Intelligence Report
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {phase === "loading" && (
        <ProgressView currentStep={currentStep} progress={progress} />
      )}

      {/* ── ERROR ── */}
      {phase === "error" && (
        <>
          <div className="bb-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <strong>Analysis failed</strong><br />
              {errorMsg}
            </div>
          </div>
          <button className="bb-submit-btn" onClick={handleReset} style={{ marginTop: 12, alignSelf: "flex-start" }}>
            ← Try Again
          </button>
        </>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && result && (
        <ResultDisplay data={result} onReset={handleReset} />
      )}
    </div>
  );
}