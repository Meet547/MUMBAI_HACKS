import React from "react";
import { useLocation } from "react-router-dom";

export default function DraftingPage() {
  const location = useLocation();
  const client = location.state?.client;

  return (
    <div className="standard-page-container">
      <div className="standard-content-container">
        <h1>Drafting Page</h1>
        {client && <p>Drafting document for: {client.name}</p>}
        <p>This page is under construction.</p>
      </div>
    </div>
  );
}

