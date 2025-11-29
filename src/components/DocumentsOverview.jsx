import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFileAlt,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import "../styles/DocumentsOverview.css";

export default function DocumentsOverview() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock document data
  const documents = [
    {
      id: 1,
      title: "Legal Contract Template",
      type: "Contract",
      client: "Aryan & Co.",
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      status: "Completed",
      size: "2.3 MB",
    },
    {
      id: 2,
      title: "Non-Disclosure Agreement",
      type: "Agreement",
      client: "Kevin Law Associates",
      createdDate: "2024-01-18",
      lastModified: "2024-01-22",
      status: "In Review",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Employment Contract",
      type: "Contract",
      client: "Smith & Partners",
      createdDate: "2024-01-20",
      lastModified: "2024-01-25",
      status: "Draft",
      size: "3.1 MB",
    },
    {
      id: 4,
      title: "Terms of Service",
      type: "Policy",
      client: "Johnson Legal Group",
      createdDate: "2024-01-22",
      lastModified: "2024-01-24",
      status: "Completed",
      size: "1.5 MB",
    },
    {
      id: 5,
      title: "Privacy Policy",
      type: "Policy",
      client: "Aryan & Co.",
      createdDate: "2024-01-25",
      lastModified: "2024-01-26",
      status: "In Review",
      size: "2.1 MB",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      doc.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#10b981";
      case "In Review":
        return "#f59e0b";
      case "Draft":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="standard-page-container">
      <div className="standard-content-container centered">
        {/* Header */}
        <div className="page-header">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="page-title">Documents Overview</h1>
          <p className="page-subtitle">
            Manage and track all your generated documents
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="overview-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="contract">Contract</option>
              <option value="agreement">Agreement</option>
              <option value="policy">Policy</option>
            </select>
          </div>
        </div>

        {/* Document Stats */}
        <div className="document-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>Total Documents</h3>
              <p className="stat-number">{documents.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>This Month</h3>
              <p className="stat-number">
                {
                  documents.filter(
                    (doc) =>
                      new Date(doc.createdDate).getMonth() ===
                      new Date().getMonth()
                  ).length
                }
              </p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaUser />
            </div>
            <div className="stat-content">
              <h3>Active Clients</h3>
              <p className="stat-number">
                {new Set(documents.map((doc) => doc.client)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="documents-list">
          <h2 className="list-title">All Documents</h2>
          <div className="documents-table">
            <div className="table-header">
              <div className="header-cell">Document</div>
              <div className="header-cell">Type</div>
              <div className="header-cell">Client</div>
              <div className="header-cell">Created</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Actions</div>
            </div>
            <div className="table-body">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="table-row">
                  <div className="table-cell document-info">
                    <div className="document-icon">
                      <FaFileAlt />
                    </div>
                    <div className="document-details">
                      <h4 className="document-title">{document.title}</h4>
                      <p className="document-size">{document.size}</p>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="document-type">{document.type}</span>
                  </div>
                  <div className="table-cell">
                    <span className="client-name">{document.client}</span>
                  </div>
                  <div className="table-cell">
                    <span className="created-date">
                      {new Date(document.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(document.status),
                      }}
                    >
                      {document.status}
                    </span>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button className="action-btn view" title="View">
                        <FaEye />
                      </button>
                      <button className="action-btn edit" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn download" title="Download">
                        <FaDownload />
                      </button>
                      <button className="action-btn delete" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
