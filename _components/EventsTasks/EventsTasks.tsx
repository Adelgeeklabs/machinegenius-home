//@ts-nocheck
"use client"; // Indicates that this file is intended for use on the client side
import { useContext, useEffect, useState } from "react"; // Importing React hooks for state management
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react"; // Importing the FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { globalContext } from "@/app/_context/store";
import Link from "next/link";
import TaskOrEvent from "@/app/_components/TaskOrEvent/TaskOrEvent";
import TaskModal from "@/app/_components/TaskModal/TaskModal";
import "./calender.css";
import "./events.css";
import toast from "react-hot-toast";
import {
  eventService,
  Event,
  EventFilter,
  EventEnum,
  EventInput,
} from "@/app/_services/eventCalendarService";
import { format } from "date-fns";
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";
import CustomBtn from "@/app/_components/Button/CustomBtn";
import { TestTubes } from "lucide-react";
// Add this helper function at the top of your component
const formatDateValue = (dateString?: string) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "yyyy-MM-dd");
  } catch (error) {
    console.error("Invalid date:", dateString);
    return "";
  }
};

// Add Task interface
interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: number;
  startNumber: number;
  endNumber: number;
  attachments: string[];
  checkList: Array<{ title: string; isChecked: boolean; _id: string }>;
  taskType: string;
  priorityLevel: string;
  status: string;
  createdBy: string;
  employee: string[];
  taskDependencies: any;
  department: string;
  createdAt: number;
  candidate: any;
}

// Add TaskStatus enum
enum TaskStatus {
  toDo = "toDo",
  InProgress = "InProgress",
  Completed = "Completed",
}

export default function EventsTasks() {
  const router = useRouter();
  const { handleSignOut } = useContext(globalContext);
  const [chooseTypeOpen, setChooseTypeOpen] = useState<boolean>(false);
  const [type, setType] = useState<"Task" | "Event" | null>(null);
  // Options for brand and content type select inputs
  const eventsOptions: string[] = [
    "All",
    "CompanyHolidays",
    "Birthdays",
    "Tasks",
  ];

  // Array of calendar events
  const [currentEvents, setCurrentEvents] = useState([]);

  // State to manage the selected event
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventInCreate, setSelectedEventInCreate] = useState<any>(null);
  const [selectedEventInDelete, setSelectedEventInDelete] = useState<any>(null);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [createTaskModal, setCreateTaskModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const { authState } = useContext(globalContext);
  const [taskSelectedDay, setTaskSelectedDay] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isHR, setIsHR] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const [decodedToken, setDecodedToken] = useState<any>({});

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("decodedToken") || "{}");
    setDecodedToken(token);
  }, []); // Runs only on the client

  const handleDateClick = (selected: any) => {
    console.log(selected.view);
    console.log(selected);
    setTaskSelectedDay(selected.startStr);

    setSelectedEventInCreate(selected);
    setChooseTypeOpen(true);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/task?limit=100&skip=0`,
        "GET"
      );
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  async function getEvents(filter?: string) {
    setIsLoading(true);
    try {
      let events = [];

      const test = await fetchTasks();
      console.log(test);

      events = await eventService.getMonthEvents();

      events = [
        ...events,
        ...test.map((t) => ({
          ...t,
          extendedProps: {
            isTask: true,
            taskData: t, // Assuming `t` is a task object
          },
        })),
      ];

      console.log(events);

      setCurrentEvents(events);
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function createSchedule() {
    const title = (document.getElementById("title") as HTMLInputElement)?.value;
    const bg = (document.getElementById("bg") as HTMLInputElement)?.value;
    const type = (document.getElementById("eventType") as HTMLSelectElement)
      ?.value as EventEnum;
    const start = (document.getElementById("startDate") as HTMLInputElement)
      ?.value;
    const end = (document.getElementById("endDate") as HTMLInputElement)?.value;

    if (!title || !bg || !type || !start || !end) {
      toast.error("All fields are required");
      return;
    }

    try {
      const eventData: EventInput = {
        title,
        type,
        start,
        end,
        backgroundColor: bg,
      };

      await eventService.createHREvent(eventData);
      toast.success("Event created successfully");
      setCreateModal(false);
      getEvents(selectedFilter);
    } catch (error) {
      toast.error("Failed to create event");
      console.error(error);
    }
  }

  async function deleteSchedule(id: string) {
    if (!isHR) {
      toast.error("Only HR members can delete events");
      return;
    }

    try {
      await eventService.deleteHREvent(id);
      toast.success("Event deleted successfully");
      setDeleteModal(false);
      getEvents(selectedFilter);
    } catch (error) {
      toast.error("Failed to delete event");
      console.error(error);
    }
  }

  async function updateSchedule(id: string) {
    if (!isHR) {
      toast.error("Only HR members can update events");
      return;
    }

    const title = (document.getElementById("titleEdit") as HTMLInputElement)
      ?.value;
    const bg = (document.getElementById("bgEdit") as HTMLInputElement)?.value;
    const type = (document.getElementById("eventTypeEdit") as HTMLSelectElement)
      ?.value as EventEnum;
    const start = (document.getElementById("start") as HTMLInputElement)?.value;
    const end = (document.getElementById("end") as HTMLInputElement)?.value;

    if (!title || !bg || !type || !start || !end) {
      toast.error("All fields are required");
      return;
    }

    try {
      const eventData: EventInput = {
        title,
        type,
        start,
        end,
        backgroundColor: bg,
      };

      await eventService.updateHREvent(id, eventData);
      toast.success("Event updated successfully");
      setEditModal(false);
      getEvents(selectedFilter);
    } catch (error) {
      toast.error("Failed to update event");
      console.error(error);
    }
  }

  async function getAllRoles() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : authState.token;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/role/getAll`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await res.json();
    console.log(json);
    setData(json);
    setAllRoles(
      (Array.isArray(json) &&
        json?.map((role: { roleName: string }) => role.roleName)) ||
        []
    );
  }
  useEffect(() => {
    getAllRoles();
  }, []);

  // Function to handle event click
  const handleEventClick = async (info: any) => {
    try {
      if (info.event.extendedProps.isTask) {
        setSelectedTask(info.event.extendedProps.taskData);
      } else {
        const eventId = info.event._def.extendedProps._id;
        const eventDetails = await eventService.getEventById(eventId);
        setSelectedEvent(eventDetails);
        setSelectedEventInDelete(eventId);
        setCandidateData(eventDetails);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  // Function to close the selected event
  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    getEvents(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole"); // Adjust based on how you store user roles
    // setIsHR(userRole?.includes("hr") || false);
    setIsHR(true);
  }, []);

  // Add function to handle status change
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === "toDo") {
      toast.error("To Do status is not allowed");
      return;
    }
    setUpdatingTaskId(taskId);
    try {
      const { response } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/task/change-status/${taskId}`,
        "PUT",
        { status: newStatus }
      );

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );

        if (selectedTask?._id === taskId) {
          setSelectedTask((prev) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }

        toast.success(`Task status updated to ${newStatus}`);
      } else {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Add this new function to handle checklist updates
  const handleChecklistToggle = async (
    taskId: string,
    checklistIndex: number,
    currentChecklist: Array<{ title: string; isChecked: boolean; _id: string }>
  ) => {
    try {
      // Create new checklist array with updated status
      const updatedChecklistStatus = currentChecklist.map((item, index) =>
        index === checklistIndex ? !item.isChecked : item.isChecked
      );

      const response = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/task/checklist/${taskId}`,
        "PUT",
        { checkList: updatedChecklistStatus }
      );

      if (response.response.ok) {
        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  checkList: task.checkList.map((item, index) =>
                    index === checklistIndex
                      ? { ...item, isChecked: !item.isChecked }
                      : item
                  ),
                }
              : task
          )
        );

        // Update selected task if it's currently displayed
        if (selectedTask?._id === taskId) {
          setSelectedTask((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              checkList: prev.checkList.map((item, index) =>
                index === checklistIndex
                  ? { ...item, isChecked: !item.isChecked }
                  : item
              ),
            };
          });
        }

        toast.success("Checklist updated successfully");
      } else {
        throw new Error("Failed to update checklist");
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
    }
  };

  // Update TaskDetailsPopup to include status change dropdown and checklist toggle
  const TaskDetailsPopup = ({
    task,
    onClose,
  }: {
    task: Task;
    onClose: () => void;
  }) => (
    <>
      <div className="event-content-overlay" onClick={onClose}></div>
      <div className="event-content">
        <div className="event-details">
          <div className="event-header">
            <div className="event-title-section">
              <h2 className="text-2xl font-bold">{task.title}</h2>
              <span className="event-type-badge">{task.taskType}</span>
              <span
                className={`priority-badge ${task.priorityLevel.toLowerCase()}`}
              >
                {task.priorityLevel}
              </span>
            </div>
          </div>

          <div className="event-info-grid">
            <div className="event-info-item">
              <span className="info-label">Status </span>
              {task.status !== "Approved" && task.status !== "Rejected" && (
                <div className="status-select-container">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value as TaskStatus)
                    }
                    className={`status-select ${updatingTaskId === task._id ? "disabled" : ""}`}
                    disabled={updatingTaskId === task._id}
                  >
                    {Object.values(TaskStatus).map((status) => {
                      return (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      );
                    })}
                  </select>
                  {updatingTaskId === task._id && (
                    <div className="status-loading-spinner"></div>
                  )}
                </div>
              )}
              {task.status === "Approved" ? (
                <span className="text-green-600">Approved</span>
              ) : task.status === "Rejected" ? (
                <span className="text-red-600">Rejected</span>
              ) : (
                ""
              )}
            </div>
            <div className="event-info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{task.department}</span>
            </div>
            <div className="event-info-item">
              <span className="info-label">Start Date</span>
              <span className="info-value">{task.start}</span>
            </div>
            <div className="event-info-item">
              <span className="info-label">Due Date</span>
              <span className="info-value">{task.end}</span>
            </div>
          </div>

          {task.description && (
            <div className="event-description">
              <span className="info-label">Description</span>
              <p className="info-value mt-2">{task.description}</p>
            </div>
          )}

          {task.checkList.length > 0 && (
            <div className="checklist-section mt-4">
              <h3 className="text-lg font-semibold mb-2">Checklist</h3>
              <ul className="list-none pl-5">
                {task.checkList.map((item, index) => (
                  <li key={item._id} className="mb-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => {
                        if (
                          item.status == "Done" ||
                          item.status == "Approved" ||
                          item.status == "Rejected"
                        ) {
                          toast.error("Task Is Not Available");
                          return;
                        }
                        handleChecklistToggle(task._id, index, task.checkList);
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span
                      className={
                        item.isChecked ? "line-through text-gray-500" : ""
                      }
                    >
                      {item.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {task.attachments.length > 0 && (
            <div className="attachments-section mt-4">
              <h3 className="text-lg font-semibold mb-2">Attachments</h3>
              <div className="flex flex-wrap gap-2">
                {task.attachments.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    Attachment {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
          {task.taskHistory.length > 0 && (
            <div className=" mt-4">
              <h3 className="text-lg font-semibold mb-2">Task History</h3>
              <div className="flex flex-col gap-2">
                {task.taskHistory.map((t, index) => (
                  <div className=" flex items-center gap-2">
                    <p className="text-[--16px] font-medium">{t.title}</p>
                    <span className="text-[--14px] font-medium">
                      {new Date(t.createdAt).toISOString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  // Render the calendar component
  return (
    <>
      <div className={`calendarContainer`}>
        <div className="pt-[1.5vw] h-full w-full full-calender relative eventsCalendar">
          {/* Add loading overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}

          {/* Filters section */}
          <div className="flex justify-between filters">
            <div className="w-[30%] flex items-center gap-[2vw]">
              <h3 className="font-bold text-[32px]">Calendar</h3>
              {decodedToken?.department?.includes("hr") && (
                <button
                  onClick={() => setCreateModal(true)}
                  className="create-event-btn"
                >
                  Create Event
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                {eventsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FullCalendar component */}
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={!isLoading} // Disable editing during loading
            selectable={!isLoading} // Disable selection during loading
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={(e) => handleEventClick(e)}
            events={currentEvents}
            editable={false} // 🔹 Prevent event dragging and resizing
          />
          {/* Selected event content */}
          {selectedEvent && (
            <>
              <div
                className="event-content-overlay"
                onClick={handleCloseEvent}
              ></div>
              <div className="event-content">
                <div className="event-details">
                  <div className="event-header">
                    <div className="event-title-section">
                      <h2 className="text-2xl font-bold">
                        {selectedEvent.title}
                      </h2>
                      {selectedEvent.type && (
                        <span className="event-type-badge">
                          {selectedEvent.type}
                        </span>
                      )}
                    </div>

                    {isHR && (
                      <div className="event-actions mt-auto">
                        <button
                          onClick={() => {
                            setSelectedEventId(selectedEvent._id);
                            setEditingEvent(selectedEvent);
                            setEditModal(true);
                            handleCloseEvent();
                          }}
                          className="edit-btn"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="event-info-grid">
                    <div className="event-info-item">
                      <span className="info-label">Start Date</span>
                      <span className="info-value">
                        {format(new Date(selectedEvent.start), "PPP")}
                      </span>
                    </div>
                    <div className="event-info-item">
                      <span className="info-label">End Date</span>
                      <span className="info-value">
                        {format(new Date(selectedEvent.end), "PPP")}
                      </span>
                    </div>
                    {selectedEvent.department && (
                      <div className="event-info-item">
                        <span className="info-label">Department</span>
                        <span className="info-value">
                          {selectedEvent.department}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedEvent.description && (
                    <div className="event-description">
                      <span className="info-label">Description</span>
                      <p className="info-value mt-2">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {selectedEvent.employee && (
                    <div className="employee-info">
                      <h3 className="text-lg font-semibold mb-3">
                        Employee Details
                      </h3>
                      <div className="event-info-grid">
                        <div className="event-info-item">
                          <span className="info-label">Name</span>
                          <span className="info-value">
                            {selectedEvent.employee.firstName}{" "}
                            {selectedEvent.employee.lastName}
                          </span>
                        </div>
                        <div className="event-info-item">
                          <span className="info-label">Department(s)</span>
                          <span className="info-value">
                            {selectedEvent.employee.department.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button className="close-button" onClick={handleCloseEvent}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* CV iframe if exists */}
                {candidateData?.candidate?.cvLink && (
                  <div className="cv-container mt-4">
                    <iframe
                      width="100%"
                      height="500px"
                      className="rounded-lg border border-gray-200"
                      src={`${
                        candidateData?.candidate?.cvLink.includes(".docx")
                          ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                              candidateData?.candidate?.cvLink
                            )}`
                          : candidateData?.candidate?.cvLink
                      }`}
                    ></iframe>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div
          className={`${
            createModal ? "block" : "hidden"
          } absolute inset-0 bg-black bg-opacity-20 z-50`}
        >
          <div
            className={` absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[6px] p-6 shadow-md bg-white z-[60] w-[550px]`}
          >
            <span
              className=" text-2xl absolute top-1 right-2 cursor-pointer font-bold"
              onClick={() => {
                (document.getElementById("title") as HTMLInputElement).value =
                  "";
                (document.getElementById("bg") as HTMLInputElement).value = "";
                setCreateModal(false);
              }}
            >
              x
            </span>
            <h3 className=" text-center uppercase mb-[30px] text-[24px] leading-[22px] font-bold">
              Enter your Event info
            </h3>
            <div className=" flex flex-col gap-[25px]">
              <div className=" flex flex-col gap-[10px]">
                <label
                  htmlFor="title"
                  className=" leading-[22px] font-bold text-[18px]"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className=" w-full rounded-[4px] p-2 border-[1px] border-black"
                />
              </div>
              <div className=" flex flex-col gap-[10px]">
                <label
                  htmlFor="eventType"
                  className=" leading-[22px] font-bold text-[18px]"
                >
                  Event Type
                </label>
                <select
                  id="eventType"
                  className=" w-full rounded-[4px] p-2 border-[1px] border-black bg-white!"
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  {Object.values(EventEnum).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className=" flex gap-4">
                <div className="flex flex-col gap-[10px] flex-1">
                  <label
                    htmlFor="startDate"
                    className="leading-[22px] font-bold text-[18px]"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full rounded-[4px] p-2 border-[1px] border-black"
                  />
                </div>
                <div className="flex flex-col gap-[10px] flex-1">
                  <label
                    htmlFor="endDate"
                    className="leading-[22px] font-bold text-[18px]"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full rounded-[4px] p-2 border-[1px] border-black"
                  />
                </div>
              </div>
              <div className=" flex flex-col gap-[10px]">
                <label
                  htmlFor="bg"
                  className=" leading-[22px] font-bold text-[18px]"
                >
                  Background Color
                </label>
                <input
                  type="color"
                  id="bg"
                  className=" w-full rounded-[4px] p-2 border-[1px] border-black"
                />
              </div>
              {isHR ? (
                <button
                  className=" bg-black text-white px-5 py-3 text-center rounded-[5px] w-fit ml-auto"
                  onClick={createSchedule}
                >
                  Create
                </button>
              ) : (
                <p className="text-red-500">
                  Only HR members can create events
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Add Edit Modal */}
      {editModal && selectedEventId && editingEvent && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3 className="text-xl font-bold mb-4">Edit Event</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const eventData: EventInput = {
                  title: formData.get("title") as string,
                  type: formData.get("type") as EventEnum,
                  start: formData.get("start") as string,
                  end: formData.get("end") as string,
                  backgroundColor: formData.get("backgroundColor") as string,
                };

                try {
                  await eventService.updateHREvent(selectedEventId, eventData);
                  toast.success("Event updated successfully");
                  getEvents(selectedFilter);
                  setEditModal(false);
                  setEditingEvent(null);
                } catch (error) {
                  toast.error("Failed to update event");
                }
              }}
              className="flex flex-col gap-4"
            >
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={editingEvent.title}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Event Type</label>
                <select
                  id="type"
                  name="type"
                  defaultValue={editingEvent.type || EventEnum.Meetings}
                  required
                  className="form-select bg-white!"
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  {Object.values(EventEnum).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="start">Start Date</label>
                <input
                  type="date"
                  id="start"
                  name="start"
                  defaultValue={formatDateValue(editingEvent.start)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="end">End Date</label>
                <input
                  type="date"
                  id="end"
                  name="end"
                  defaultValue={formatDateValue(editingEvent.end)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="backgroundColor">Color</label>
                <input
                  type="color"
                  id="backgroundColor"
                  name="backgroundColor"
                  defaultValue={editingEvent.backgroundColor}
                  required
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditModal(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedTask && (
        <TaskDetailsPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      <div className="flex justify-start items-center mt-[--sy-20px]">
        <CustomBtn
          onClick={() => router.back()}
          btnColor="black"
          word="Back"
        ></CustomBtn>
      </div>
    </>
  );
}
