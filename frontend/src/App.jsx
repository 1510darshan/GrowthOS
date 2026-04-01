import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx"; // default page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Home />} />

        {/* Future Routes (you can add later) */}
        {/* <Route path="/email" element={<Email />} /> */}
        {/* <Route path="/code" element={<CodeHelper />} /> */}
        {/* <Route path="/research" element={<Research />} /> */}
      </Routes>
    </Router>
  );
}

export default App;