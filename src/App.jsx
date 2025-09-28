import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LandingCard from "./components/LandingCard";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ClientVault from "./components/ClientVault";
import DocumentsOverview from "./components/DocumentsOverview";
import PendingDocuments from "./components/PendingDocuments";
import ComplianceCalendar from "./components/ComplianceCalendar";
import Notifications from "./components/Notifications";
import ProfileSettings from "./components/ProfileSettings";
import UpgradePlan from "./components/UpgradePlan";
import AccountSettings from "./components/AccountSettings";
import Help from "./components/Help";
import DraftingPage from "./components/DraftingPage";

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

function ClientVaultPage() {
  return (
    <div className="client-vault-page">
      <Navbar />
      <ClientVault />
    </div>
  );
}

function DocumentsOverviewPage() {
  return (
    <div className="documents-overview-page">
      <Navbar />
      <DocumentsOverview />
    </div>
  );
}

function PendingDocumentsPage() {
  return (
    <div className="pending-documents-page">
      <Navbar />
      <PendingDocuments />
    </div>
  );
}

function ComplianceCalendarPage() {
  return (
    <div className="compliance-calendar-page">
      <Navbar />
      <ComplianceCalendar />
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
        <Route path="/client-vault" element={<ClientVaultPage />} />
        <Route path="/documents-overview" element={<DocumentsOverviewPage />} />
        <Route path="/pending-documents" element={<PendingDocumentsPage />} />
        <Route
          path="/compliance-calendar"
          element={<ComplianceCalendarPage />}
        />
        <Route path="/notifications" element={<div className="client-vault-page"><Navbar /><Notifications /></div>} />
        <Route path="/profile-settings" element={<div className="client-vault-page"><Navbar /><ProfileSettings /></div>} />
        <Route path="/upgrade-plan" element={<div className="client-vault-page"><Navbar /><UpgradePlan /></div>} />
        <Route path="/account-settings" element={<div className="client-vault-page"><Navbar /><AccountSettings /></div>} />
        <Route path="/help" element={<div className="client-vault-page"><Navbar /><Help /></div>} />
        <Route path="/drafting" element={<DraftingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
