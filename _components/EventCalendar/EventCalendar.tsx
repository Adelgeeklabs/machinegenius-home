//@ts-nocheck
"use client";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import {
  eventService,
  Event,
  EventFilter,
} from "@/app/_services/eventCalendarService";
import { Tooltip } from "react-tooltip";
import { format } from "date-fns";
import "./EventCalendar.css";

const EVENT_TYPES = [
  { label: "All Events", value: "" },
  { label: "Company Holidays", value: "CompanyHolidays" },
  { label: "Birthdays", value: "Birthdays" },
  // Add more event types as needed
];

const EventCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState("dayGridMonth");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (selectedType) {
      fetchFilteredEvents();
    } else {
      fetchEvents();
    }
  }, [selectedType]);

  const fetchFilteredEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: EventFilter = {
        type: selectedType,
      };
      const eventData = await eventService.getFilteredEvents(filters);
      const formattedEvents = formatEvents(eventData);
      setEvents(formattedEvents);
    } catch (error) {
      setError("Failed to fetch filtered events. Please try again later.");
      console.error("Error fetching filtered events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventService.getMonthEvents();
      const formattedEvents = eventData.map((event: Event) => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor,
        borderColor: event.backgroundColor,
        textColor: getContrastColor(event.backgroundColor),
        extendedProps: {
          description: event.description,
          employee: event.employee,
          department: event.department,
          type: event.type,
        },
      }));
      setEvents(formattedEvents);
    } catch (error) {
      setError("Failed to fetch events. Please try again later.");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = async (info: EventClickArg) => {
    try {
      const eventDetails = await eventService.getEventById(info.event.id);
      showEventDetails(eventDetails);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const showEventDetails = (event: Event) => {
    const modal = document.getElementById("eventModal");
    const modalContent = document.getElementById("modalContent");
    if (modal && modalContent) {
      modalContent.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${format(new Date(event.start), "PPP")}</p>
        ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ""}
        ${
          event.employee
            ? `
          <p><strong>Employee:</strong> ${event.employee.firstName} ${event.employee.lastName}</p>
          <p><strong>Department:</strong> ${event.employee.department.join(", ")}</p>
        `
            : ""
        }
        ${event.type ? `<p><strong>Type:</strong> ${event.type}</p>` : ""}
      `;
      modal.style.display = "block";
    }
  };

  const getContrastColor = (hexcolor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const formatEvents = (eventData: Event[]) => {
    return eventData.map((event: Event) => ({
      id: event._id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.backgroundColor,
      borderColor: event.backgroundColor,
      textColor: getContrastColor(event.backgroundColor),
      extendedProps: {
        description: event.description,
        employee: event.employee,
        department: event.department,
        type: event.type,
      },
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="custom-loader"></span>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>Event Calendar</h2>
          <div className="calendar-controls">
            <div className="filter-selector">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="view-selector">
              <button
                className={selectedView === "dayGridMonth" ? "active" : ""}
                onClick={() => setSelectedView("dayGridMonth")}
              >
                Month
              </button>
              <button
                className={selectedView === "timeGridWeek" ? "active" : ""}
                onClick={() => setSelectedView("timeGridWeek")}
              >
                Week
              </button>
              <button
                className={selectedView === "listWeek" ? "active" : ""}
                onClick={() => setSelectedView("listWeek")}
              >
                List
              </button>
            </div>
          </div>
        </div>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView={selectedView}
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          height="auto"
          eventContent={(eventInfo) => (
            <div
              className="custom-event"
              data-tooltip-id={eventInfo.event.id}
              data-tooltip-content={`${eventInfo.event.title}${
                eventInfo.event.extendedProps.description
                  ? ` - ${eventInfo.event.extendedProps.description}`
                  : ""
              }`}
            >
              <div className="event-title">{eventInfo.event.title}</div>
              {eventInfo.event.extendedProps.employee && (
                <div className="event-employee">
                  {eventInfo.event.extendedProps.employee.firstName}{" "}
                  {eventInfo.event.extendedProps.employee.lastName}
                </div>
              )}
            </div>
          )}
        />
        <Tooltip className="event-tooltip" />
      </div>

      {/* Event Details Modal */}
      <div id="eventModal" className="modal">
        <div className="modal-content">
          <span
            className="close"
            onClick={() => {
              const modal = document.getElementById("eventModal");
              if (modal) modal.style.display = "none";
            }}
          >
            &times;
          </span>
          <div id="modalContent"></div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
