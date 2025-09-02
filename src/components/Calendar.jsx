import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCircle } from "react-icons/fa";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Contract Renewal - Aryan & Co.",
      date: new Date(2024, 0, 26),
      priority: "high",
      type: "deadline",
    },
    {
      id: 2,
      title: "Compliance Report Submission",
      date: new Date(2024, 0, 28),
      priority: "medium",
      type: "deadline",
    },
    {
      id: 3,
      title: "Privacy Policy Update",
      date: new Date(2024, 1, 1),
      priority: "low",
      type: "deadline",
    },
    {
      id: 4,
      title: "Tax Filing Deadline",
      date: new Date(2024, 1, 15),
      priority: "high",
      type: "deadline",
    },
    {
      id: 5,
      title: "Insurance Renewal",
      date: new Date(2024, 1, 20),
      priority: "medium",
      type: "deadline",
    },
  ];

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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
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

  const days = getDaysInMonth(currentDate);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-component">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => navigateMonth(-1)}>
          <FaChevronLeft />
        </button>
        <h2 className="current-month">{formatDate(currentDate)}</h2>
        <button className="nav-btn" onClick={() => navigateMonth(1)}>
          <FaChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day names header */}
        <div className="day-names">
          {dayNames.map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="calendar-days">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={`calendar-day ${!day ? "empty" : ""} ${
                  isCurrentDay ? "today" : ""
                }`}
              >
                {day && (
                  <>
                    <span className="day-number">{day.getDate()}</span>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="event-indicator"
                          style={{
                            backgroundColor: getPriorityColor(event.priority),
                          }}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="more-events">
                          +{dayEvents.length - 3}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <FaCircle style={{ color: "#dc2626" }} />
          <span>High Priority</span>
        </div>
        <div className="legend-item">
          <FaCircle style={{ color: "#f59e0b" }} />
          <span>Medium Priority</span>
        </div>
        <div className="legend-item">
          <FaCircle style={{ color: "#10b981" }} />
          <span>Low Priority</span>
        </div>
      </div>
    </div>
  );
}
