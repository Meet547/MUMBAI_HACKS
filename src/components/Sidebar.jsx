import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaBell, 
  FaCog, 
  FaStar, 
  FaWrench, 
  FaQuestionCircle, 
  FaSignOutAlt 
} from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar({ userName = "rj007", currentPage = "" }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar on outside click when expanded
  useEffect(() => {
    const handleOutsidePointer = (event) => {
      if (!isCollapsed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsCollapsed(true);
      }
    };

    // Use capture phase to ensure we detect clicks anywhere on the page
    document.addEventListener("pointerdown", handleOutsidePointer, true);
    document.addEventListener("touchstart", handleOutsidePointer, true);
    document.addEventListener("mousedown", handleOutsidePointer, true);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer, true);
      document.removeEventListener("touchstart", handleOutsidePointer, true);
      document.removeEventListener("mousedown", handleOutsidePointer, true);
    };
  }, [isCollapsed]);

  const menuItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
      path: "/notifications"
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: <FaCog />,
      path: "/profile-settings"
    },
    {
      id: "upgrade",
      label: "Upgrade Plan",
      icon: <FaStar />,
      path: "/upgrade-plan"
    },
    {
      id: "account",
      label: "Account Settings",
      icon: <FaWrench />,
      path: "/account-settings"
    },
    {
      id: "help",
      label: "Help",
      icon: <FaQuestionCircle />,
      path: "/help"
    },
    {
      id: "logout",
      label: "Log out",
      icon: <FaSignOutAlt />,
      action: "logout"
    }
  ];

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      // Handle logout logic here
      console.log("Logging out...");
      // navigate("/login");
    } else {
      navigate(item.path);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* User Profile Section */}
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">
            <FaUser />
          </div>
          {!isCollapsed && <span className="user-name">{userName}</span>}
        </div>
      </div>

      {/* Main Menu Items */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-item ${currentPage === item.id ? "active" : ""}`}
                onClick={() => handleMenuClick(item)}
                title={isCollapsed ? item.label : ""}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>


      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span className={`toggle-arrow ${isCollapsed ? 'collapsed' : ''}`}>‹</span>
      </button>
    </div>
  );
}