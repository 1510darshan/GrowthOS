<div align="center">

<br/>

# 🚀 GrowthOS

### Autonomous Growth Platform for Indian SMEs

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Admin-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Firebase-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io)
[![Zapier](https://img.shields.io/badge/Automation-Zapier-FF4A00?style=flat-square&logo=zapier&logoColor=white)](https://zapier.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)

**GrowthOS** is an all-in-one AI-powered growth platform built for India's 50M+ small and medium businesses. It combines business intelligence, content generation, social media scheduling, and performance analytics into a single workspace — designed to help SME owners grow 7× faster without any marketing expertise.

[Overview](#-overview) · [Modules](#-ai-modules) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 📖 Overview

Marketing and growth for small businesses in India is fragmented — owners juggle Instagram manually, miss festival campaign windows, have no competitor intelligence, and struggle to write consistent content. **GrowthOS solves this** by wrapping AI into a single, chat-first workspace.

```
"AI that understands your business, plans your week, writes your captions,
 schedules your posts, and optimises your ads — while you focus on what matters."
```

### Key Highlights

| Stat | Value |
|------|-------|
| Target Market | 50M+ SMEs in India |
| Content Speed | 7× faster than manual creation |
| Infrastructure Cost | ₹0 (serverless-friendly design) |
| Auth Strategy | Firebase Auth + JWT dual-token |
| Automation | Zapier webhook for social scheduling |
| AI Backend | Gemini / Claude API (pluggable) |

---

## 🧩 AI Modules

GrowthOS is built around **8 specialised AI modules**, each accessible from the persistent sidebar:

### 🧠 Business Brain *(Module 01 — Built)*

The intelligence layer of GrowthOS. Input your website URL and business details, and the AI runs a multi-step analysis pipeline:

1. **Web scraping** via Serper API — scans your site, landing pages, and indexed content
2. **Competitor research** — maps the top 3–5 competitors in your industry, their strengths, weaknesses, and your edge
3. **Audience personas** — generates 3–4 detailed buyer personas with traits, roles, and motivations
4. **Market trends** — identifies 4–6 current India-specific trends relevant to your category
5. **Festival & seasonal calendar** — surfaces the next 5–8 upcoming festivals/occasions with campaign ideas and a relevance score (1–10)
6. **High-intent keywords** — 10 buying-intent search terms for your business
7. **Strategic recommendations** — 5 actionable growth plays with reasoning

Supports 20 industry categories (E-commerce, Food & Beverage, Health & Wellness, FinTech, and more) and 8 business models (D2C, B2B, SaaS, Subscription, etc.).

---

### 📅 Growth Planner *(Module 02 — Built)*

AI-generated weekly content calendar and Instagram post scheduler. Includes:

- **Drag-and-drop image upload** with live phone preview
- **Caption editor** with 2,200-char limit counter and warning states
- **Hashtag pill builder** — press Enter/Space to add, click to remove
- **Instagram post preview** — real-time phone mockup showing exactly how the post will look
- **Zapier integration** — on submit, form data (image + metadata) is sent to a Zapier webhook which queues the post for automated publishing via Buffer
- **Scheduled queue panel** — shows the last 4 upcoming posts with thumbnails and times
- Post type quick-pick: **Feed Post, Story, Reel, Carousel**

---

### ✍️ Caption Studio *(Module 03 — Planned)*

AI content generator. Will produce 3 caption variants per post with matching hashtag sets, tone selection (formal/casual/witty), and platform-specific length optimisation.

---

### 📡 Social Autopilot *(Module 04 — Planned)*

Full scheduling and automation layer. Set a posting schedule, upload a content batch, and let GrowthOS handle publishing across platforms automatically.

---

### 🎯 Festival Radar *(Module 05 — Planned)*

Live trend and occasion intelligence. Surfaces upcoming Indian festivals, national holidays, and viral moments with pre-built campaign templates specific to your industry.

---

### ⚡ Ad Engine *(Module 06 — Planned)*

Mock ad recommendation engine. Generates ad copy variants, audience targeting suggestions, and budget allocation guidance based on your Business Brain profile.

---

### 📊 Performance *(Module 07 — Planned)*

Analytics dashboard. Aggregates post performance data, tracks reach/engagement trends, and surfaces the top-performing content formats for your account.

---

### 💬 AI Assistant *(Module 08 — Built)*

A persistent chat interface embedded in the home screen. Ask anything about your business strategy, content, or growth. Currently uses a placeholder response; connects to your AI API at `/api/generate`.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           GROWTHOS                                  │
│                                                                     │
│  ┌───────────────────────────┐   ┌─────────────────────────────┐   │
│  │     Frontend (React 19)   │   │    Backend (Node.js)        │   │
│  │                           │   │                             │   │
│  │  Home / Dashboard         │   │  Express App (port 3000)    │   │
│  │  Business Brain      ─────┼───┼▶ Helmet · CORS · Morgan    │   │
│  │  Growth Planner           │   │  Rate Limiter (100/15min)   │   │
│  │  Caption Studio           │   │                             │   │
│  │  Social Autopilot         │   │  /api/health                │   │
│  │  Festival Radar           │   │  /api/auth/register         │   │
│  │  Ad Engine                │   │  /api/auth/login            │   │
│  │  Performance              │   │  /api/auth/logout           │   │
│  │  AI Chat                  │   │  /api/auth/refresh          │   │
│  │                           │   │  /api/auth/me               │   │
│  │  Auth Service (axios)     │   │                             │   │
│  └───────────────────────────┘   │  Firebase Admin SDK         │   │
│                                   │  createUser / getUser       │   │
│  ┌───────────────────────────┐   │  verifyFirebaseToken        │   │
│  │  External Services        │   └─────────────────────────────┘   │
│  │                           │                                     │
│  │  Firebase Auth (client)   │   Auth Middleware:                  │
│  │  Serper API (web search)  │   Bearer token → try Firebase first │
│  │  Gemini / Claude API      │                → fallback to JWT    │
│  │  Zapier Webhooks          │                                     │
│  └───────────────────────────┘                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Auth Flow

GrowthOS uses a **dual-token authentication strategy**:

```
POST /api/auth/login
  │
  ├─ Firebase Identity REST API verifies email + password
  │
  ├─ On success → sign JWT { uid, email } with JWT_SECRET, expires 7d
  │
  └─ Return { user: { uid, email }, token }
            │
            ▼
      Client stores in localStorage (gos_token, gos_user)
            │
            ▼
  Subsequent requests → Authorization: Bearer <token>
            │
            ▼
  authMiddleware: tries Firebase token first → falls back to JWT
```

This means the same middleware accepts both Firebase ID tokens (for future Google Sign-In) and custom JWTs (for email/password users).

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Usage |
|------------|---------|-------|
| React | 19.x | UI framework |
| React Router DOM | 7.x | Client-side routing (9 routes) |
| Vite | 8.x | Build tool + dev server |
| Axios | 1.14 | HTTP client for API calls |
| DM Sans / DM Serif Display | Google Fonts | Typography (Scheduler module) |

### Backend

| Technology | Version | Usage |
|------------|---------|-------|
| Node.js | ≥ 18 | Runtime |
| Express | 4.21 | HTTP framework |
| Firebase Admin SDK | 13.x | Server-side user management |
| Firebase (client) | 12.x | Identity REST API calls |
| jsonwebtoken | 9.x | JWT signing & verification |
| bcryptjs | 2.4 | Password hashing utility |
| express-validator | 7.2 | Request body validation |
| express-rate-limit | 7.4 | API rate limiting |
| helmet | 8.x | HTTP security headers |
| morgan | 1.10 | HTTP request logging |
| winston | 3.14 | Structured application logging |

### External Integrations

| Service | Purpose |
|---------|---------|
| Firebase Auth | User registration, authentication, token verification |
| Serper API | Google search results for Business Brain market research |
| Gemini / Claude API | AI text generation for intelligence reports and captions |
| Zapier Webhooks | Automated Instagram post scheduling via Buffer |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- A Firebase project (for Auth)
- A Serper API key (for Business Brain)
- A Gemini or Claude API key (for AI generation)

### 1. Clone the Repository

```bash
git clone https://github.com/1510darshan/GrowthOS.git
cd GrowthOS
```

### 2. Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS — must match your frontend origin
CORS_ORIGIN=http://localhost:5173

# Firebase Admin SDK (server-side only — never expose to client)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web API Key (for signInWithPassword REST call)
API_KEY=your-firebase-web-api-key
```

Start the backend:

```bash
npm run dev    # development with nodemon
npm start      # production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_SERVER_LINK=http://localhost:3000/api/auth

# Firebase Client SDK
VITE_API_KEY=your-firebase-api-key
VITE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_PROJECT_ID=your-project-id
VITE_STORAGE_BUCKET=your-project.appspot.com
VITE_MESSAGING_SENDER_ID=your-sender-id
VITE_APP_ID=your-app-id
VITE_MEASUREMENT_ID=your-measurement-id
```

Start the frontend:

```bash
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

### 4. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → create a new project
2. Enable **Email/Password** under Authentication → Sign-in method
3. Go to Project Settings → Service Accounts → **Generate new private key** → use for Admin SDK credentials in backend `.env`
4. Copy the web app config (Project Settings → General → Your apps) into frontend `.env`

### 5. Connect AI for Business Brain

Add these two routes to your backend to enable Business Brain:

```javascript
// Serper proxy — web search for market research
app.post('/api/serper-search', async (req, res) => {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'X-API-KEY': process.env.SERPER_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: req.body.query, gl: 'in', hl: 'en' })
  });
  res.json(await response.json());
});

// AI generation — Gemini or Claude
app.post('/api/generate', async (req, res) => {
  // Call your AI API with req.body.prompt and return { text: "..." }
  res.json({ text: aiResponse });
});
```

### 6. Zapier Setup for Growth Planner

1. Create a Zapier account → New Zap → **Webhooks by Zapier (Catch Hook)**
2. Copy the webhook URL
3. In `Scheduler.jsx`, replace `YOUR_HOOK_ID` in `ZAPIER_WEBHOOK_URL`
4. Add a **Buffer** action step in Zapier to schedule posts to Instagram

---

## 📡 API Reference

### Health Check

```
GET /api/health
```
```json
{ "status": "ok" }
```

### Auth — Register

```
POST /api/auth/register
{ "email": "you@business.com", "password": "min6chars", "displayName": "Arjun Sharma" }
```
```json
{ "success": true, "data": { "uid": "...", "email": "..." } }
```

### Auth — Login

```
POST /api/auth/login
{ "email": "you@business.com", "password": "yourpassword" }
```
```json
{ "success": true, "data": { "user": { "uid": "...", "email": "..." }, "token": "<jwt>" } }
```

### Auth — Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```
```json
{ "success": true, "data": { "user": { "uid": "...", "email": "...", "name": "...", "createdAt": "..." } } }
```

### Auth — Logout

```
POST /api/auth/logout
```
```json
{ "success": true, "message": "Logged out successfully" }
```

### Auth — Refresh Token

```
POST /api/auth/refresh
Authorization: Bearer <token>
```
```json
{ "success": true, "data": { "token": "<new_jwt>" } }
```

### Validation Errors

```json
{ "success": false, "errors": [{ "field": "email", "message": "Valid email required" }] }
```

### Rate Limit Error

```json
{ "success": false, "error": "Too many requests, please try again later." }
```

---

## 📁 Project Structure

```
GrowthOS/
├── Backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js                   ← App entry: middleware stack, route mount, server
│       ├── config/
│       │   ├── firebase-admin.js      ← Admin SDK init + createUser/getUser/signIn helpers
│       │   └── firebase.js            ← Client-side Firebase config
│       ├── controllers/
│       │   └── auth.controller.js     ← register, login, logout, refresh, me
│       ├── middlewares/
│       │   ├── auth.js                ← Dual-token: Firebase first, JWT fallback
│       │   ├── errorHandler.js        ← Global error handler
│       │   └── validate.js            ← express-validator result middleware
│       ├── routes/
│       │   ├── auth.routes.js         ← /register /login /logout /refresh /me
│       │   └── health.routes.js       ← /health
│       └── utils/
│           └── logger.js              ← Winston: JSON + colorized console
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx                    ← Router: 9 routes, persistent sidebar layout
        ├── Services/
        │   └── Auth.js                ← axios wrappers: Register(), Login()
        └── components/
            ├── Home/
            │   └── Home.jsx           ← Shell: sidebar, topbar, hero, chat, input bar
            ├── BusinessBrain/
            │   └── BusinessBrain.jsx  ← Module 01: multi-step AI analysis + result display
            ├── Scheduler/
            │   └── Scheduler.jsx      ← Module 02: post scheduler + Zapier + phone preview
            └── LoginSignup/
                └── LoginSignup.jsx    ← Auth modal: login/signup tabs + Google OAuth UI
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Foundation (Complete)
- [x] Express backend with Helmet, CORS, rate limiting, body parsing
- [x] Firebase Auth + JWT dual-token authentication
- [x] Winston structured logging
- [x] React 19 + Vite 8 frontend with React Router v7
- [x] Persistent sidebar + topbar shell with module navigation
- [x] Auth modal (login / sign up / Google OAuth UI)
- [x] AI Assistant chat panel (ready for API connection)

### ✅ Phase 2 — Core Modules (Complete)
- [x] Business Brain — full AI intelligence report with Serper + Gemini/Claude
- [x] Growth Planner — Instagram scheduler with Zapier webhook and phone preview

### 🔄 Phase 3 — Remaining Modules (In Progress)
- [ ] Caption Studio — 3 caption variants + hashtag generation
- [ ] Social Autopilot — batch scheduling + multi-platform
- [ ] Festival Radar — live calendar with auto-campaign suggestions
- [ ] Ad Engine — ad copy + audience targeting recommendations
- [ ] Performance dashboard — analytics + trend charts

### 🔮 Phase 4 — Growth & Polish
- [ ] Connect Gemini / Claude API endpoints in backend
- [ ] Google Sign-In (Firebase OAuth)
- [ ] User dashboard — saved reports, post history
- [ ] Pricing tiers — Free / Pro / Business
- [ ] Mobile PWA support
- [ ] Multi-language support (Hindi, Marathi, Tamil)

---

## 🔐 Security Notes

- `FIREBASE_PRIVATE_KEY` and `JWT_SECRET` must **never** be committed to git
- Request body size is capped at **10KB** to prevent payload attacks
- All `/api/*` routes are rate-limited at 100 requests per 15 minutes per IP
- CORS accepts requests only from the declared `CORS_ORIGIN`
- Input validation on all auth routes via `express-validator`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: describe your change"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

New frontend modules go in `src/components/YourModule/` with their own CSS file. Follow the existing controller/route pattern for backend endpoints.

---

## 📄 License

MIT License — Copyright (c) 2025 Darshan Walhe

---

<div align="center">

Built for India's 50M+ small businesses · Powered by AI · Made with ❤️

⭐ **Star this repo** if GrowthOS inspires you!

</div>
