import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";

// Import your actual module components as they exist
// Replace these placeholder imports with your real ones when ready
import GrowthPlanner from "./components/Scheduler/Scheduler";
// import CaptionStudio from "./components/CaptionStudio/CaptionStudio";
// etc.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
          All routes render inside Home — Home reads location.pathname
          and decides what to show in the content area.
          This keeps your sidebar + topbar + input bar persistent across pages.
        */}
        <Route path="/" element={<Home />} />
        <Route path="/business-brain" element={<Home />} />
        <Route path="/growth-planner" element={<GrowthPlanner />} />
        <Route path="/caption-studio" element={<Home />} />
        <Route path="/social-autopilot" element={<Home />} />
        <Route path="/festival-radar" element={<Home />} />
        <Route path="/ad-engine" element={<Home />} />
        <Route path="/performance" element={<Home />} />
        <Route path="/chat" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}