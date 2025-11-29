import React from "react";
import Hero from "./Hero";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import DocumentsShowcase from "./DocumentsShowcase";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <DocumentsShowcase />
    </>
  );
}
