import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LandingCard from "./components/LandingCard";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function HomePage() {
  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="main-content">
        <Hero />

        <LandingCard
          title="Why Us?"
          text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
          backgroundColor="#ffffff98"
          textColor="#111111"
          rightContent={<div className="doc-card">— — —</div>}
        />
        <LandingCard backgroundColor="#ffffff98"></LandingCard>
        <LandingCard backgroundColor="#ffffff98"></LandingCard>
      </main>

      <Footer />
    </div>
  );
}

function SignupPage() {
  return (
    <div className="signup-page-wrapper">
      <Navbar />
      <Signup />
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="dashboard-page-wrapper">
      <Navbar />
      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
