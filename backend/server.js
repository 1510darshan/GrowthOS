process.on("uncaughtException", (err) => console.error("🔥", err));
process.on("unhandledRejection", (err) => console.error("🔥", err));

const express = require("express");
const multer  = require("multer");
const { google } = require("googleapis");
const cors   = require("cors");
const fs     = require("fs");
const path   = require("path");
require("dotenv").config(); // ✅ Only once

const app  = express();
const PORT = 5000;

// ✅ Allow your React dev server origin (adjust port if needed)
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, "uploads/") });
const TOKEN_PATH = path.join(__dirname, "token.json");

// ✅ Use env vars directly — no client_secret.json needed
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "http://localhost:5000/auth/google/callback"
);

if (fs.existsSync(TOKEN_PATH)) {
  try {
    oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")));
    console.log("✅ Loaded saved token");
  } catch (e) {
    console.warn("⚠️  token.json unreadable:", e.message);
  }
}

app.get("/", (req, res) => res.send("✅ GrowthOS Backend is running!"));

app.get("/auth/status", (req, res) => {
  const c = oauth2Client.credentials;
  res.json({ authenticated: !!(c && (c.access_token || c.refresh_token)) });
});

app.get("/auth/google", (req, res) => {
  console.log("🔑 /auth/google hit");
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });
  console.log("➡️  Redirecting to:", url);
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.send(`<h2>Auth failed: ${error}</h2>`);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log("✅ Token saved!");

    // ✅ After auth, redirect back to the React app with ?authed=true
    // so the frontend knows auth succeeded
    res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:60px">
      <h2 style="color:#16a34a">✅ YouTube Connected!</h2>
      <p>Redirecting back to the app...</p>
      <script>
        // ✅ If opened as popup, notify the parent and close
        if (window.opener) {
          window.opener.postMessage({ type: 'YOUTUBE_AUTH_SUCCESS' }, 'http://localhost:3000');
          setTimeout(() => window.close(), 1000);
        } else {
          // Opened as full redirect — go back to app
          setTimeout(() => { window.location.href = 'http://localhost:3000'; }, 1500);
        }
      </script>
    </body></html>`);
  } catch (err) {
    console.error("❌ Token exchange failed:", err.message);
    res.status(500).send(`<h2>Token exchange failed: ${err.message}</h2>`);
  }
});

app.post("/schedule", upload.single("video"), async (req, res) => {
  const c = oauth2Client.credentials;
  if (!c || (!c.access_token && !c.refresh_token))
    return res.status(401).json({ error: "Not authenticated. Connect YouTube first." });
  if (!req.file) return res.status(400).json({ error: "No video file uploaded." });
  const { title, description, publishAt } = req.body;
  if (!title || !publishAt) return res.status(400).json({ error: "title and publishAt required." });
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    console.log(`📤 Uploading: "${title}" scheduled for ${publishAt}`);
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: { title, description: description || "", categoryId: "22" },
        status: { privacyStatus: "private", publishAt: new Date(publishAt).toISOString() },
      },
      media: { body: fs.createReadStream(req.file.path) },
    });
    fs.unlink(req.file.path, () => {});
    console.log("✅ Uploaded! Video ID:", response.data.id);
    res.json({ success: true, videoId: response.data.id, message: `Scheduled for ${publishAt}` });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error("❌ Upload failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔑 Auth URL:    http://localhost:${PORT}/auth/google`);
  console.log(`📊 Auth status: http://localhost:${PORT}/auth/status\n`);
});