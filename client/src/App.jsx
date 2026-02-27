import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DatabasePage from "./pages/Database";
import Explanation from "./pages/Explanation";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/explanation" element={<Explanation />} />
      </Routes>
    </div>
  );
}

export default App;
