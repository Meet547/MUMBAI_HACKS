import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaSearch, FaFileAlt, FaCalendarAlt, FaExclamationTriangle, FaEdit, FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";
import "../styles/ComplianceCalendar.css";
import { createPortal } from "react-dom";

export default function ComplianceCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [deadlineForm, setDeadlineForm] = useState({
    type: "",
    dueDate: "",
    priority: "medium",
    description: "",
  });

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  const clients = useMemo(() => [
    "Aryan & Co.",
    "Kevin Law Associates",
    "Smith & Partners",
    "Johnson Legal Group",
  ], []);

  const [deadlines, setDeadlines] = useState([
    { id: 1, client: "Aryan & Co.", type: "Compliance", date: "2025-09-10", priority: "high", description: "ROC filing" },
    { id: 2, client: "Kevin Law Associates", type: "Contract", date: "2025-09-10", priority: "low", description: "NDA renewals" },
    { id: 3, client: "Smith & Partners", type: "Tax", date: "2025-09-13", priority: "medium", description: "Advance tax" },
    { id: 4, client: "Johnson Legal Group", type: "Policy", date: "2025-09-21", priority: "high", description: "Privacy update" },
  ]);

  const parseLocalDate = (iso) => {
    // Expect YYYY-MM-DD; construct local date to avoid UTC shift issues
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const formatDDMMYYYY = (date) => {
    if (!date) return "";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const events = useMemo(() => deadlines.map(d => ({
    id: d.id,
    title: `${d.type} - ${d.client}`,
    date: parseLocalDate(d.date),
    priority: d.priority,
    type: "deadline",
  })), [deadlines]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const openAdd = () => {
    setIsAddOpen(true);
    setSelectedClient(null);
    setClientQuery("");
    setDeadlineForm({ type: "", dueDate: "", priority: "medium", description: "" });
  };

  const closeAdd = () => setIsAddOpen(false);

  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    return clients.filter(c => c.toLowerCase().includes(q));
  }, [clientQuery, clients]);

  const selectedDateISO = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}` : null;
  const selectedDateDeadlines = useMemo(() => deadlines.filter(d => d.date === selectedDateISO), [deadlines, selectedDateISO]);

  // Inline Calendar (merged)
  const CalendarView = ({ events = [], onDateClick, selectedDate: externallySelectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [animateKey, setAnimateKey] = useState(0);

    useEffect(() => { setAnimateKey((k) => k + 1); }, [currentDate]);

    const navigateMonth = (direction) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setCurrentDate(newDate);
    };

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
      for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
      return days;
    };

    const getEventsForDate = (date) => {
      if (!date) return [];
      return events.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      );
    };

    const isToday = (date) => {
      if (!date) return false;
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const formatMonth = (date) =>
      date.toLocaleDateString("en-US", { year: "numeric", month: "long" });

    const days = getDaysInMonth(currentDate);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const isSameDay = (a, b) => {
      if (!a || !b) return false;
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    };

    return (
      <div className="calendar-component">
        <div className="calendar-header">
          <button className="nav-btn nav-arrow" onClick={() => navigateMonth(-1)}>
            <FaChevronLeft />
          </button>
          <h2 className="current-month month-navigation">{formatMonth(currentDate)}</h2>
          <button className="nav-btn nav-arrow" onClick={() => navigateMonth(1)}>
            <FaChevronRight />
          </button>
        </div>
        <div className="calendar-grid month-change" key={animateKey}>
          <div className="day-names">
            {dayNames.map((day) => (
              <div key={day} className="day-name">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = isSameDay(day, externallySelectedDate);
              return (
                <div
                  key={index}
                  className={`calendar-day ${!day ? "empty" : ""} ${isToday(day) ? "today" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => day && onDateClick && onDateClick(day)}
                >
                  {day && (
                    <>
                      <span className="day-number">{day.getDate()}</span>
                      <div className="day-events">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="event-indicator"
                            style={{ backgroundColor: event.priority === "high" ? "#dc2626" : event.priority === "medium" ? "#f59e0b" : "#10b981" }}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="more-events">+{dayEvents.length - 3}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="calendar-legend">
          <div className="legend-item"><FaCircle style={{ color: "#dc2626" }} /><span>High</span></div>
          <div className="legend-item"><FaCircle style={{ color: "#f59e0b" }} /><span>Medium</span></div>
          <div className="legend-item"><FaCircle style={{ color: "#10b981" }} /><span>Low</span></div>
        </div>
      </div>
    );
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
          <h1 className="page-title">Compliance Calendar</h1>
          <p className="page-subtitle">
            Track and manage all compliance deadlines
          </p>
        </div>

        {/* Split layout */}
        <div className="calendar-split">
          <div className="split-left">
            <CalendarView events={events} onDateClick={handleDateClick} selectedDate={selectedDate} />
          </div>
          <div className="split-right">
            <div className="right-header">
              <button className="add-deadline-btn" onClick={openAdd}>
                <FaPlus />
                Add Deadline for Client
              </button>
            </div>
            <h3 className="list-title date-title">{selectedDate ? formatDDMMYYYY(selectedDate) : "Select a date"}</h3>
            <div className="deadlines-list">
              {selectedDate ? (
                selectedDateDeadlines.length ? (
                  selectedDateDeadlines.map(item => (
                    <div key={item.id} className={`deadline-item ${item.priority}`}>
                      <div className="deadline-item-header">
                        <span className="deadline-badge" data-priority={item.priority}>
                          {item.priority}
                        </span>
                        <span className="deadline-type">{item.type}</span>
                      </div>
                      <div className="deadline-item-body">
                        <div className="deadline-client">{item.client}</div>
                        <div className="deadline-desc">{item.description}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">No deadlines for this date.</div>
                )
              ) : (
                <div className="empty-state">Pick a date on the calendar to view details.</div>
              )}
            </div>
          </div>
        </div>

        {/* Add Deadline Modal */}
        {isAddOpen && createPortal(
          <div className="modal-overlay" onClick={closeAdd}>
            <div className="modal wide-modal centered-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Deadline</h3>
                <button className="close" onClick={closeAdd}>×</button>
              </div>
              <div className="modal-body">
                {!selectedClient ? (
                  <div className="form-list">
                    <label>
                      <span className="form-label">Search Client</span>
                      <div className="input-with-icon">
                        <FaSearch className="field-icon" />
                        <input
                          type="text"
                          className="search-input"
                          value={clientQuery}
                          onChange={(e) => setClientQuery(e.target.value)}
                          placeholder="Type to search..."
                        />
                      </div>
                    </label>
                    <div className="client-results">
                      {filteredClients.map((c) => (
                        <button key={c} className="client-result" onClick={() => setSelectedClient(c)}>
                          {c}
                        </button>
                      ))}
                      {filteredClients.length === 0 && (
                        <div className="empty-state">No matches</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <form className="form-list" onSubmit={(e) => {
                    e.preventDefault();
                    const newItem = {
                      id: deadlines.length ? Math.max(...deadlines.map(d => d.id)) + 1 : 1,
                      client: selectedClient,
                      type: deadlineForm.type || "",
                      date: deadlineForm.dueDate,
                      priority: deadlineForm.priority,
                      description: deadlineForm.description || "",
                    };
                    setDeadlines(prev => [...prev, newItem]);
                    // Select the due date to show new item immediately
                    const parsed = parseLocalDate(newItem.date);
                    setSelectedDate(parsed);
                    closeAdd();
                  }}>
                    <div className="selected-client-box">Client: <strong>{selectedClient}</strong></div>
                    <label>
                      <span className="form-label">Deadline Type</span>
                      <div className="input-with-icon">
                        <FaFileAlt className="field-icon" />
                        <input type="text" value={deadlineForm.type} onChange={(e) => setDeadlineForm({ ...deadlineForm, type: e.target.value })} required />
                      </div>
                    </label>
                    <label>
                      <span className="form-label">Due Date</span>
                      <div className="input-with-icon">
                        <FaCalendarAlt className="field-icon" />
                        <input type="date" value={deadlineForm.dueDate} onChange={(e) => setDeadlineForm({ ...deadlineForm, dueDate: e.target.value })} required />
                      </div>
                    </label>
                    <label>
                      <span className="form-label">Priority</span>
                      <div className="input-with-icon">
                        <FaExclamationTriangle className="field-icon" />
                        <select value={deadlineForm.priority} onChange={(e) => setDeadlineForm({ ...deadlineForm, priority: e.target.value })}>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </label>
                    <label className="full">
                      <span className="form-label">Description (optional)</span>
                      <div className="input-with-icon textarea">
                        <FaEdit className="field-icon" />
                        <textarea rows="3" value={deadlineForm.description} onChange={(e) => setDeadlineForm({ ...deadlineForm, description: e.target.value })} />
                      </div>
                    </label>
                    <div className="modal-footer">
                      <div></div>
                      <div className="modal-footer-right">
                        <button type="button" className="action-btn secondary" onClick={() => setSelectedClient(null)}>Back</button>
                        <button type="submit" className="action-btn primary">Save Deadline</button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
