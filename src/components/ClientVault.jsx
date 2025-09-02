import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFileAlt,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import "../styles/ClientVault.css";

export default function ClientVault() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock client data
  const clients = [
    {
      id: 1,
      name: "Aryan & Co.",
      type: "Law Firm",
      email: "contact@aryanco.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2023-01-15",
      documents: 45,
      status: "Active",
    },
    {
      id: 2,
      name: "Kevin Law Associates",
      type: "Legal Practice",
      email: "info@kevinlaw.com",
      phone: "+1 (555) 987-6543",
      joinDate: "2023-03-22",
      documents: 32,
      status: "Active",
    },
    {
      id: 3,
      name: "Smith & Partners",
      type: "Corporate Law",
      email: "hello@smithpartners.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-05-10",
      documents: 28,
      status: "Active",
    },
    {
      id: 4,
      name: "Johnson Legal Group",
      type: "Family Law",
      email: "contact@johnsonlegal.com",
      phone: "+1 (555) 321-0987",
      joinDate: "2023-07-18",
      documents: 19,
      status: "Inactive",
    },
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="standard-page-container">
      <div className="standard-content-container">
        {/* Header */}
        <div className="vault-header">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="vault-title">Client Vault</h1>
          <p className="vault-subtitle">Manage and view all your clients</p>
        </div>

        {/* Search and Add Section */}
        <div className="vault-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-client-btn">
            <FaPlus />
            Add New Client
          </button>
        </div>

        {/* Client Stats */}
        <div className="client-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUser />
            </div>
            <div className="stat-content">
              <h3>Total Clients</h3>
              <p className="stat-number">{clients.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>Total Documents</h3>
              <p className="stat-number">
                {clients.reduce((sum, client) => sum + client.documents, 0)}
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaBuilding />
            </div>
            <div className="stat-content">
              <h3>Active Clients</h3>
              <p className="stat-number">
                {clients.filter((client) => client.status === "Active").length}
              </p>
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="client-list">
          <h2 className="list-title">All Clients</h2>
          <div className="clients-grid">
            {filteredClients.map((client) => (
              <div key={client.id} className="client-card">
                <div className="client-header">
                  <div className="client-avatar">
                    <FaBuilding />
                  </div>
                  <div className="client-info">
                    <h3 className="client-name">{client.name}</h3>
                    <p className="client-type">{client.type}</p>
                    <span
                      className={`status-badge ${client.status.toLowerCase()}`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>

                <div className="client-details">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span>{client.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>
                      Joined: {new Date(client.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaFileAlt className="detail-icon" />
                    <span>{client.documents} documents</span>
                  </div>
                </div>

                <div className="client-actions">
                  <button className="action-btn primary">View Details</button>
                  <button className="action-btn secondary">Edit Client</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
