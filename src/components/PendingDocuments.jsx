import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEdit,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaFileAlt,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import "../styles/PendingDocuments.css";

export default function PendingDocuments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  // Mock pending documents data
  const pendingDocuments = [
    {
      id: 1,
      title: "Employment Contract Review",
      client: "Aryan & Co.",
      priority: "High",
      submittedDate: "2024-01-20",
      dueDate: "2024-01-25",
      daysPending: 3,
      reviewer: "John Smith",
      status: "Pending Review",
    },
    {
      id: 2,
      title: "Non-Disclosure Agreement",
      client: "Kevin Law Associates",
      priority: "Medium",
      submittedDate: "2024-01-22",
      dueDate: "2024-01-28",
      daysPending: 1,
      reviewer: "Sarah Johnson",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Terms of Service Update",
      client: "Smith & Partners",
      priority: "Low",
      submittedDate: "2024-01-23",
      dueDate: "2024-02-01",
      daysPending: 0,
      reviewer: "Mike Davis",
      status: "Pending Review",
    },
    {
      id: 4,
      title: "Privacy Policy Revision",
      client: "Johnson Legal Group",
      priority: "High",
      submittedDate: "2024-01-24",
      dueDate: "2024-01-26",
      daysPending: 1,
      reviewer: "Lisa Wilson",
      status: "Urgent",
    },
    {
      id: 5,
      title: "Contract Amendment",
      client: "Aryan & Co.",
      priority: "Medium",
      submittedDate: "2024-01-25",
      dueDate: "2024-01-30",
      daysPending: 0,
      reviewer: "Tom Brown",
      status: "Pending Review",
    },
  ];

  const filteredDocuments = pendingDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterPriority === "all" ||
      doc.priority.toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#dc2626";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Urgent":
        return "#dc2626";
      case "In Progress":
        return "#f59e0b";
      case "Pending Review":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="standard-page-container">
      <div className="standard-content-container">
        {/* Header */}
        <div className="pending-header">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="pending-title">Pending Documents</h1>
          <p className="pending-subtitle">
            Review and manage documents awaiting approval
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="pending-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search pending documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <FaFilter className="filter-icon" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Pending Stats */}
        <div className="pending-stats">
          <div className="stat-card urgent">
            <div className="stat-icon">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>Urgent</h3>
              <p className="stat-number">
                {
                  pendingDocuments.filter(
                    (doc) => doc.priority === "High" || doc.status === "Urgent"
                  ).length
                }
              </p>
            </div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-number">
                {
                  pendingDocuments.filter((doc) => doc.status === "In Progress")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>Pending Review</h3>
              <p className="stat-number">
                {
                  pendingDocuments.filter(
                    (doc) => doc.status === "Pending Review"
                  ).length
                }
              </p>
            </div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-icon">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>Overdue</h3>
              <p className="stat-number">
                {
                  pendingDocuments.filter((doc) => isOverdue(doc.dueDate))
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Pending Documents List */}
        <div className="pending-list">
          <h2 className="list-title">Pending Documents</h2>
          <div className="documents-grid">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className={`document-card ${
                  isOverdue(document.dueDate) ? "overdue" : ""
                }`}
              >
                <div className="document-header">
                  <div className="document-title-section">
                    <h3 className="document-title">{document.title}</h3>
                    <div className="document-meta">
                      <span className="client-name">{document.client}</span>
                      <span className="days-pending">
                        {document.daysPending} day
                        {document.daysPending !== 1 ? "s" : ""} pending
                      </span>
                    </div>
                  </div>
                  <div
                    className="priority-badge"
                    style={{
                      backgroundColor: getPriorityColor(document.priority),
                    }}
                  >
                    {document.priority}
                  </div>
                </div>

                <div className="document-details">
                  <div className="detail-row">
                    <FaUser className="detail-icon" />
                    <span>Reviewer: {document.reviewer}</span>
                  </div>
                  <div className="detail-row">
                    <FaCalendarAlt className="detail-icon" />
                    <span>
                      Due: {new Date(document.dueDate).toLocaleDateString()}
                    </span>
                    {isOverdue(document.dueDate) && (
                      <span className="overdue-indicator">OVERDUE</span>
                    )}
                  </div>
                  <div className="detail-row">
                    <FaClock className="detail-icon" />
                    <span>
                      Submitted:{" "}
                      {new Date(document.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="document-status">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(document.status) }}
                  >
                    {document.status}
                  </span>
                </div>

                <div className="document-actions">
                  <button className="action-btn primary">
                    <FaEye />
                    Review
                  </button>
                  <button className="action-btn secondary">
                    <FaEdit />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
