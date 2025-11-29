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
  FaEdit,
  FaThumbtack,
  FaTrash,
} from "react-icons/fa";
import "../styles/ClientVault.css";
import { createPortal } from "react-dom";
const createConfetti = () => {
  // GitHub's exact color palette - bright and saturated
  const colors = [
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", 
    "#dda0dd", "#98d8c8", "#f7dc6f", "#bb8fce", "#85c1e9"
  ];
  
  // GitHub's shapes: squares, circles, and thin rectangles
  const shapes = ["square", "circle", "rectangle"];
  
  // 50-100 particles responsive to screen width
  const count = Math.min(100, Math.max(50, Math.floor(window.innerWidth / 12)));

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.position = "fixed";
    confetti.style.zIndex = "10000";
    confetti.style.pointerEvents = "none";
    confetti.style.willChange = "transform, opacity";
    
    // Start from random X positions across full screen width
    confetti.style.left = Math.random() * 100 + "vw";
    // Start slightly above viewport
    confetti.style.top = (-20 - Math.random() * 30) + "px";
    
    // Shape creation with GitHub's exact sizing
    if (shape === "square") {
      const size = Math.random() * 4 + 4; // 4-8px
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      confetti.style.backgroundColor = color;
    } else if (shape === "circle") {
      const size = Math.random() * 4 + 4; // 4-8px
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = "50%";
    } else if (shape === "rectangle") {
      // Thin rectangles: 2-3px wide by 8-15px tall
      const width = Math.random() * 1 + 2; // 2-3px
      const height = Math.random() * 7 + 8; // 8-15px
      confetti.style.width = width + "px";
      confetti.style.height = height + "px";
      confetti.style.backgroundColor = color;
      confetti.style.borderRadius = "1px";
    }
    
    document.body.appendChild(confetti);
    
    // GitHub's exact animation parameters
    const horizontalDrift = (Math.random() - 0.5) * 300; // ±150px max
    const rotationAmount = Math.random() * 1440 + 360; // continuous rotation
    const fallDistance = window.innerHeight + 100;
    const fallDuration = Math.random() * 2000 + 4000; // 4-6 seconds
    const delay = Math.random() * 500; // particles released over first 500ms
    
    // Natural gravity curve with GitHub's exact easing
    const animation = confetti.animate([
      {
        transform: `translateX(0px) translateY(0px) rotate(0deg)`,
        opacity: 1
      },
      {
        transform: `translateX(${horizontalDrift * 0.2}px) translateY(${fallDistance * 0.2}px) rotate(${rotationAmount * 0.2}deg)`,
        opacity: 1,
        offset: 0.2
      },
      {
        transform: `translateX(${horizontalDrift * 0.5}px) translateY(${fallDistance * 0.5}px) rotate(${rotationAmount * 0.5}deg)`,
        opacity: 0.9,
        offset: 0.5
      },
      {
        transform: `translateX(${horizontalDrift * 0.8}px) translateY(${fallDistance * 0.8}px) rotate(${rotationAmount * 0.8}deg)`,
        opacity: 0.7,
        offset: 0.8
      },
      {
        transform: `translateX(${horizontalDrift}px) translateY(${fallDistance}px) rotate(${rotationAmount}deg)`,
        opacity: 0
      }
    ], {
      duration: fallDuration,
      delay: delay,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // GitHub's exact easing
      fill: "forwards"
    });
    
    // Clean up when animation completes
    animation.addEventListener('finish', () => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    });
  }
};

// Format date to dd-mm-yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function ClientVault() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [cardsPopKey, setCardsPopKey] = useState(0);
  const [popActive, setPopActive] = useState(false);

  // Local state for clients to enable add/edit
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Aryan & Co.",
      firmName: "Aryan & Co.",
      email: "contact@aryanco.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2023-01-15",
      documents: 45,
      firmAddress: "12, Business Park, Mumbai",
      clientIndustry: "Technology",
      gstNumber: "27AAAAA0000A1Z5",
      notes: "Priority corporate client.",
      pinned: false,
    },
    {
      id: 2,
      name: "Kevin Law Associates",
      firmName: "Kevin Law Associates",
      email: "info@kevinlaw.com",
      phone: "+1 (555) 987-6543",
      joinDate: "2023-03-22",
      documents: 32,
      firmAddress: "21, Central Ave, Bengaluru",
      clientIndustry: "Legal Services",
      gstNumber: "29BBBBB1111B2Z6",
      notes: "Focus: IP and trademarks.",
      pinned: false,
    },
    {
      id: 3,
      name: "Smith & Partners",
      firmName: "Smith & Partners",
      email: "hello@smithpartners.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-05-10",
      documents: 28,
      firmAddress: "45, Corporate Park, Delhi",
      clientIndustry: "Manufacturing",
      gstNumber: "07CCCCC2222C3Z7",
      notes: "International contracts.",
      pinned: false,
    },
    {
      id: 4,
      name: "Johnson Legal Group",
      firmName: "Johnson Legal Group",
      email: "contact@johnsonlegal.com",
      phone: "+1 (555) 321-0987",
      joinDate: "2023-07-18",
      documents: 19,
      firmAddress: "88, Lake View, Pune",
      clientIndustry: "Healthcare",
      gstNumber: "27DDDDD3333D4Z8",
      notes: "Family law desk.",
      pinned: false,
    },
    // Additional seeded clients (10 more)
    {
      id: 5,
      name: "BrightFuture LLP",
      firmName: "BrightFuture LLP",
      email: "contact@brightfuture.com",
      phone: "+1 (555) 210-3344",
      joinDate: "2023-08-04",
      documents: 12,
      firmAddress: "77, Tech Park, Hyderabad",
      clientIndustry: "Technology",
      gstNumber: "36EEEEE4444E5Z9",
      notes: "Startup compliance.",
      pinned: false,
    },
    {
      id: 6,
      name: "Urban Realty",
      firmName: "Urban Realty",
      email: "hello@urbanrealty.com",
      phone: "+1 (555) 654-2211",
      joinDate: "2023-09-16",
      documents: 25,
      firmAddress: "9, Market Street, Chennai",
      clientIndustry: "Real Estate",
      gstNumber: "33FFFFF5555F6Z0",
      notes: "Property contracts",
      pinned: false,
    },
    {
      id: 7,
      name: "GreenLeaf Ventures",
      firmName: "GreenLeaf Ventures",
      email: "info@greenleaf.com",
      phone: "+1 (555) 740-9988",
      joinDate: "2023-10-01",
      documents: 7,
      firmAddress: "16, Eco Towers, Jaipur",
      clientIndustry: "Manufacturing",
      gstNumber: "08GGGGG6666G7Z1",
      notes: "Sustainability M&A",
      pinned: false,
    },
    {
      id: 8,
      name: "PrimeTextiles",
      firmName: "PrimeTextiles",
      email: "legal@primetextiles.com",
      phone: "+1 (555) 993-2210",
      joinDate: "2023-10-21",
      documents: 18,
      firmAddress: "2, Industrial Area, Surat",
      clientIndustry: "Manufacturing",
      gstNumber: "24HHHHH7777H8Z2",
      notes: "Labour compliance",
      pinned: false,
    },
    {
      id: 9,
      name: "BlueOcean Shipping",
      firmName: "BlueOcean Shipping",
      email: "contact@blueocean.com",
      phone: "+1 (555) 112-3344",
      joinDate: "2023-11-02",
      documents: 15,
      firmAddress: "Dockyard Road, Kochi",
      clientIndustry: "Manufacturing",
      gstNumber: "32IIIII8888I9Z3",
      notes: "Admiralty matters",
      pinned: false,
    },
    {
      id: 10,
      name: "Zen Health Pvt Ltd",
      firmName: "Zen Health Pvt Ltd",
      email: "legal@zenhealth.com",
      phone: "+1 (555) 554-8899",
      joinDate: "2023-11-20",
      documents: 22,
      firmAddress: "Wellness Park, Ahmedabad",
      clientIndustry: "Healthcare",
      gstNumber: "24JJJJJ9999J1Z4",
      notes: "Healthcare compliance",
      pinned: false,
    },
    {
      id: 11,
      name: "Nimbus Tech",
      firmName: "Nimbus Tech",
      email: "counsel@nimbustech.io",
      phone: "+1 (555) 775-6600",
      joinDate: "2023-12-05",
      documents: 30,
      firmAddress: "Cloud Hub, Gurugram",
      clientIndustry: "Technology",
      gstNumber: "06KKKKK0000K2Z5",
      notes: "SaaS contracts",
      pinned: false,
    },
    {
      id: 12,
      name: "Aurora Foods",
      firmName: "Aurora Foods",
      email: "legal@aurorafoods.co",
      phone: "+1 (555) 442-8822",
      joinDate: "2023-12-18",
      documents: 11,
      firmAddress: "Food Park, Indore",
      clientIndustry: "Manufacturing",
      gstNumber: "23LLLLL1111L3Z6",
      notes: "FSSAI & labeling",
      pinned: false,
    },
    {
      id: 13,
      name: "Velocity Motors",
      firmName: "Velocity Motors",
      email: "law@velocitymotors.com",
      phone: "+1 (555) 909-1010",
      joinDate: "2024-01-02",
      documents: 14,
      firmAddress: "Auto Zone, Nashik",
      clientIndustry: "Manufacturing",
      gstNumber: "27MMMMM2222M4Z7",
      notes: "Vendor agreements",
      pinned: false,
    },
    {
      id: 14,
      name: "Crest Finance",
      firmName: "Crest Finance",
      email: "gc@crestfinance.in",
      phone: "+1 (555) 300-7700",
      joinDate: "2024-01-09",
      documents: 26,
      firmAddress: "IFSC Complex, GIFT City",
      clientIndustry: "Others",
      gstNumber: "24NNNNN3333N5Z8",
      notes: "NBFC compliance",
      pinned: false,
    },
  ]);

  // Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [newClient, setNewClient] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    firmName: "",
    firmAddress: "",
    clientIndustry: "",
    gstNumber: "",
    documents: 0,
    joinDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  // Helper function to normalize search terms (remove dashes, spaces, etc.)
  const normalizeSearchTerm = (term) => {
    return term.toLowerCase().replace(/[-\s]/g, '');
  };

  const filteredClients = clients
    .filter((client) => {
      if (!searchTerm) return true;

      const searchLower = normalizeSearchTerm(searchTerm);

      if (searchFilter === "all") {
        const haystack = normalizeSearchTerm(
          `${client.name} ${client.firmName} ${client.email} ${client.phone} ${client.id} ${client.gstNumber} ${client.clientIndustry || ''}`
        );
        return haystack.includes(searchLower);
      }
      if (searchFilter === "name")
        return normalizeSearchTerm(client.name).includes(searchLower);
      if (searchFilter === "id")
        return client.id.toString().includes(searchLower);
      if (searchFilter === "phone")
        return normalizeSearchTerm(client.phone).includes(searchLower);
      if (searchFilter === "email")
        return normalizeSearchTerm(client.email).includes(searchLower);
      if (searchFilter === "firm")
        return normalizeSearchTerm(client.firmName || '').includes(searchLower);
      if (searchFilter === "industry")
        return normalizeSearchTerm(client.clientIndustry || '').includes(searchLower);
      if (searchFilter === "gst")
        return normalizeSearchTerm(client.gstNumber || '').includes(searchLower);

      return true;
    })
    .sort((a, b) => {
      // Pinned clients first, then by pinnedAt (latest pin first), then by ID (latest first)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (a.pinned && b.pinned) {
        return new Date(b.pinnedAt || 0) - new Date(a.pinnedAt || 0);
      }
      return b.id - a.id; // Latest first
    });

  // Trigger a subtle pop ONLY when result set changes
  React.useEffect(() => {
    const resultSignature = filteredClients.map((c) => c.id).join(',');
    setPopActive(true);
    setCardsPopKey((k) => k + 1);
    const t = setTimeout(() => setPopActive(false), 180);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredClients.length, filteredClients.map((c) => c.id).join(',')]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleOpenAdd = () => setIsAddOpen(true);
  const handleCloseAdd = () => {
    setIsAddOpen(false);
    // Reset form when closing
    setNewClient({
      id: "",
      name: "",
      phone: "",
      email: "",
      firmName: "",
      firmAddress: "",
      clientIndustry: "",
      gstNumber: "",
      documents: 0,
      joinDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
  };

  const handleOpenView = (client) => {
    setSelectedClient(client);
    setIsViewOpen(true);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedClient(null);
  };

  const handleOpenEdit = (client) => {
    setSelectedClient({ ...client }); // Create a copy to avoid direct mutation
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedClient(null);
  };

  const handleDraftNewDoc = (client) => {
    navigate("/drafting", { state: { client } });
  };

  const handleTotalDocumentsClick = () => {
    navigate("/documents-overview");
  };

  const handlePinClient = (clientId) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? {
              ...client,
              pinned: !client.pinned,
              pinnedAt: client.pinned ? null : new Date().toISOString(),
            }
          : client
      )
    );
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newClient.id || !newClient.name || !newClient.phone || !newClient.email) {
      return;
    }

    // Check if ID already exists
    if (clients.some(client => client.id.toString() === newClient.id.toString())) {
      alert("Client ID already exists. Please use a different ID.");
      return;
    }

    // Create new client with proper ID conversion
    const clientToAdd = {
      ...newClient,
      id: parseInt(newClient.id, 10),
      documents: 0,
      pinned: false,
    };

    setClients((prev) => [...prev, clientToAdd]);
    
    // Reset form
    setNewClient({
      id: "",
      name: "",
      phone: "",
      email: "",
      firmName: "",
      firmAddress: "",
      clientIndustry: "",
      gstNumber: "",
      documents: 0,
      joinDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    
    setIsAddOpen(false);

    // Trigger confetti effect
    createConfetti();
  };

  const handleEditClient = (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...selectedClient,
              documents: Number(selectedClient.documents) || 0,
            }
          : c
      )
    );
    setIsEditOpen(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedClient.name}? This action cannot be undone.`)) {
      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
      setIsEditOpen(false);
      setSelectedClient(null);
    }
  };

  return (
    <div className="standard-page-container">
      <div className="standard-content-container centered">
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="search-input"
            />
            <select
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="search-filter"
            >
              <option value="all">All Clients</option>
              <option value="name">Name</option>
              <option value="id">ID</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="firm">Firm Name</option>
              <option value="industry">Industry</option>
              <option value="gst">GST Number</option>
            </select>
          </div>

          <button className="add-client-btn" onClick={handleOpenAdd}>
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
          <div
            className="stat-card clickable"
            onClick={handleTotalDocumentsClick}
          >
            <div className="stat-icon">
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>Total Documents</h3>
              <p className="stat-number">
                {clients.reduce(
                  (sum, client) => sum + (Number(client.documents) || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="client-list">
          <div className="list-header">
            <h2 className="list-title">All Clients</h2>
            <div className="view-toggle" role="group" aria-label="View toggle">
              <input
                id="toggle-list"
                type="radio"
                name="view-mode"
                checked={viewMode === "list"}
                onChange={() => setViewMode("list")}
              />
              <label htmlFor="toggle-list">List</label>
              <input
                id="toggle-grid"
                type="radio"
                name="view-mode"
                checked={viewMode === "grid"}
                onChange={() => setViewMode("grid")}
              />
              <label htmlFor="toggle-grid">Tile</label>
              <span className={`slider ${viewMode}`}></span>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="clients-grid">
              {filteredClients.map((client) => (
                <div
                  key={`${client.id}-${cardsPopKey}`}
                  className={`client-card ${popActive ? 'pop' : ''} ${client.pinned ? "pinned" : ""}`}
                >
                  <button
                    className="pin-btn"
                    onClick={() => handlePinClient(client.id)}
                    title={client.pinned ? "Unpin client" : "Pin client"}
                  >
                    <FaThumbtack className={client.pinned ? "pinned" : ""} />
                  </button>
                  <div className="client-header">
                    <div className="client-avatar">
                      <FaBuilding />
                    </div>
                    <div className="client-info">
                      <h3 className="client-name">{client.name}</h3>
                      <p className="client-type">
                        {client.firmName || "Individual"}
                      </p>
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
                      <span>Joined: {formatDate(client.joinDate)}</span>
                    </div>
                    <div className="detail-item">
                      <FaFileAlt className="detail-icon" />
                      <span>{client.documents} documents</span>
                    </div>
                  </div>

                  <div className="client-actions">
                    <button
                      className="action-btn primary"
                      onClick={() => handleOpenView(client)}
                    >
                      View Details
                    </button>
                    <button
                      className="action-btn secondary"
                      onClick={() => handleDraftNewDoc(client)}
                    >
                      Draft New Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="clients-list">
              {/* Header row */}
              <div className="list-header-row">
                <div className="header-cell">Pin</div>
                <div className="header-cell">Client Name</div>
                <div className="header-cell">ID</div>
                <div className="header-cell">Phone</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Firm Name</div>
                <div className="header-cell">Address</div>
                <div className="header-cell">Industry</div>
                <div className="header-cell">GST</div>
                <div className="header-cell center">Docs</div>
                <div className="header-cell">Joined</div>
              </div>
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`client-row ${client.pinned ? "pinned" : ""}`}
                >
                  <button
                    className="pin-btn list-pin"
                    onClick={() => handlePinClient(client.id)}
                    title={client.pinned ? "Unpin client" : "Pin client"}
                  >
                    <FaThumbtack className={client.pinned ? "pinned" : ""} />
                  </button>
                  <div className="row-main">
                    <div className="row-cell wide name">{client.name}</div>
                    <div className="row-cell id">{client.id}</div>
                    <div className="row-cell">{client.phone}</div>
                    <div className="row-cell">{client.email}</div>
                    <div className="row-cell">
                      {client.firmName || "Individual"}
                    </div>
                    <div className="row-cell">{client.firmAddress}</div>
                    <div className="row-cell">{client.clientIndustry || "-"}</div>
                    <div className="row-cell">{client.gstNumber || "-"}</div>
                    <div className="row-cell center">{client.documents}</div>
                    <div className="row-cell">
                      {formatDate(client.joinDate)}
                    </div>
                  </div>
                  <div className="row-actions">
                    <button
                      className="action-btn primary"
                      onClick={() => handleOpenView(client)}
                    >
                      View
                    </button>
                    <button
                      className="action-btn secondary plus-btn"
                      onClick={() => handleDraftNewDoc(client)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Client Modal */}
{isAddOpen &&
  createPortal(
    <div className="modal-overlay" onClick={handleCloseAdd}>
      <div
        className="modal wide-modal centered-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Add New Client</h3>
          <button className="close" onClick={handleCloseAdd}>
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleAddClient}>
          <div className="form-list">
            <label>
              <span className="form-label">Client Name</span>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">Client ID</span>
              <input
                type="number"
                min="1"
                value={newClient.id}
                onChange={(e) =>
                  setNewClient({ ...newClient, id: e.target.value })
                }
                placeholder="15"
                required
              />
            </label>
            <label>
              <span className="form-label">Firm Name (optional)</span>
              <input
                type="text"
                value={newClient.firmName}
                onChange={(e) =>
                  setNewClient({ ...newClient, firmName: e.target.value })
                }
              />
            </label>
            <label>
              <span className="form-label">Address (Firm/Residence)</span>
              <input
                type="text"
                value={newClient.firmAddress}
                onChange={(e) =>
                  setNewClient({ ...newClient, firmAddress: e.target.value })
                }
              />
            </label>
            <label>
              <span className="form-label">Client Industry</span>
              <select
                value={newClient.clientIndustry}
                onChange={(e) =>
                  setNewClient({ ...newClient, clientIndustry: e.target.value })
                }
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Legal Services">Legal Services</option>
                <option value="Others">Others</option>
              </select>
            </label>
            <label>
              <span className="form-label">Contact Number</span>
              <input
                type="text"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({ ...newClient, phone: e.target.value })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">Email</span>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">GST Number (optional)</span>
              <input
                type="text"
                value={newClient.gstNumber}
                onChange={(e) =>
                  setNewClient({ ...newClient, gstNumber: e.target.value })
                }
              />
            </label>
            <label>
              <span className="form-label">Joined Date</span>
              <input
                type="date"
                value={newClient.joinDate}
                onChange={(e) =>
                  setNewClient({ ...newClient, joinDate: e.target.value })
                }
              />
            </label>
            <label className="full">
              <span className="form-label">Additional Notes (optional)</span>
              <textarea
                rows="3"
                value={newClient.notes}
                onChange={(e) =>
                  setNewClient({ ...newClient, notes: e.target.value })
                }
              />
            </label>
          </div>
          <div className="modal-footer">
  <button
    type="button"
    className="action-btn secondary"
    onClick={handleCloseAdd}
  >
    Cancel
  </button>
  <button type="submit" className="action-btn primary">
    Add Client
  </button>
</div>
</form>
</div>
</div>,
document.body
)}


{/* View Client Modal */}
{isViewOpen && selectedClient &&
  createPortal(
    <div className="modal-overlay" onClick={handleCloseView}>
      <div
        className="modal wide-modal centered-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Client Details</h3>
          <button className="close" onClick={handleCloseView}>
            ×
          </button>
        </div>
        <div className="modal-body read">
          <div className="detail-list">
            <div className="detail-row highlight">
              <span className="detail-label">Documents Created:</span>
              <span className="detail-value large">
                {selectedClient.documents}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Client Name:</span>
              <span className="detail-value">{selectedClient.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Client ID:</span>
              <span className="detail-value">{selectedClient.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Firm Name:</span>
              <span className="detail-value">
                {selectedClient.firmName || "-"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address (Firm/Residence):</span>
              <span className="detail-value">
                {selectedClient.firmAddress || "-"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Client Industry:</span>
              <span className="detail-value">
                {selectedClient.clientIndustry || "-"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Contact Number:</span>
              <span className="detail-value">{selectedClient.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedClient.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">GST Number:</span>
              <span className="detail-value">
                {selectedClient.gstNumber || "-"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Joined Date:</span>
              <span className="detail-value">
                {formatDate(selectedClient.joinDate)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Additional Notes:</span>
              <span className="detail-value">
                {selectedClient.notes || "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="action-btn primary"
            onClick={() => handleOpenEdit(selectedClient)}
          >
            Edit Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}

{/* Edit Client Modal */}
{isEditOpen && selectedClient &&
  createPortal(
    <div className="modal-overlay" onClick={handleCloseEdit}>
      <div
        className="modal wide-modal centered-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Edit Client</h3>
          <button className="close" onClick={handleCloseEdit}>
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleEditClient}>
          <div className="form-list">
            <label className="highlight">
              <span className="form-label">Documents Created</span>
              <input
                type="number"
                min="0"
                value={selectedClient.documents}
                readOnly
                className="readonly-input"
              />
            </label>
            <label>
              <span className="form-label">Client Name</span>
              <input
                type="text"
                value={selectedClient.name}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    name: e.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">Client ID</span>
              <input
                type="number"
                min="1"
                value={selectedClient.id}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    id: parseInt(e.target.value, 10) || "",
                  })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">Firm Name (optional)</span>
              <input
                type="text"
                value={selectedClient.firmName || ""}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    firmName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <span className="form-label">Address (Firm/Residence)</span>
              <input
                type="text"
                value={selectedClient.firmAddress || ""}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    firmAddress: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <span className="form-label">Client Industry</span>
              <select
                value={selectedClient.clientIndustry || ""}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    clientIndustry: e.target.value,
                  })
                }
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Legal Services">Legal Services</option>
                <option value="Others">Others</option>
              </select>
            </label>
            <label>
              <span className="form-label">Contact Number</span>
              <input
                type="text"
                value={selectedClient.phone}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    phone: e.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">Email</span>
              <input
                type="email"
                value={selectedClient.email}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    email: e.target.value,
                  })
                }
                required
              />
            </label>
            <label>
              <span className="form-label">GST Number (optional)</span>
              <input
                type="text"
                value={selectedClient.gstNumber || ""}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    gstNumber: e.target.value,
                  })
                }
              />
            </label>
            <label>
              <span className="form-label">Joined Date</span>
              <input
                type="date"
                value={selectedClient.joinDate}
                className="readonly-input"
                readOnly
              />
            </label>
            <label className="full">
              <span className="form-label">Additional Notes (optional)</span>
              <textarea
                rows="3"
                value={selectedClient.notes || ""}
                onChange={(e) =>
                  setSelectedClient({
                    ...selectedClient,
                    notes: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div className="modal-footer">
            <div className="modal-footer-left">
              <button
                type="button"
                className="action-btn delete-btn"
                onClick={handleDeleteClient}
              >
                <FaTrash />
                Delete Client
              </button>
            </div>
            <div className="modal-footer-right">
              <button
                type="button"
                className="action-btn secondary"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>
              <button type="submit" className="action-btn primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )}
</div>
</div>
);
}
