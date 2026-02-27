import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DatabasePage from "./pages/Database";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/database" element={<DatabasePage />} />
    </Routes>
  );
}

export default App;
