import React, { useState } from "react";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";

type TaskStatus = "toDo" | "InProgress" | "Completed" | "Approved";

interface StatusDropdownProps {
  currStatus: TaskStatus;
  taskId: string;
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedTask?: React.Dispatch<React.SetStateAction<any | null>>;
  selectedTask?: any | null;
}

const StatusDropdown = ({
  currStatus,
  taskId,
  setTasks,
  setSelectedTask,
  selectedTask,
}: StatusDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<TaskStatus>(currStatus);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const statuses: { label: TaskStatus; color: string }[] = [
    { label: "toDo", color: "bg-gray-100 text-gray-600" },
    { label: "InProgress", color: "bg-blue-100 text-blue-600" },
    { label: "Completed", color: "bg-yellow-100 text-yellow-600" },
    { label: "Approved", color: "bg-green-100 text-green-600" },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (newStatus === "toDo" || newStatus === "Approved") {
      toast.error("To Do & Approved status are not allowed");
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

        if (setSelectedTask && selectedTask?._id === taskId) {
          setSelectedTask((prev: any) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }

        toast.success(`Task status updated to ${newStatus}`);
        setStatus(newStatus);
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

  const selectStatus = (newStatus: TaskStatus) => {
    if (newStatus !== status) {
      handleStatusChange(taskId, newStatus);
    }
    setIsOpen(false);
  };

  // Find the color for the current status
  const currentColor =
    statuses.find((s) => s.label === status)?.color ||
    "bg-blue-100 text-blue-600";

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={`inline-flex items-center ${currentColor} text-xs rounded px-2 py-1`}
          onClick={toggleDropdown}
          disabled={updatingTaskId === taskId}
        >
          {updatingTaskId === taskId ? (
            <span className="inline-block w-4 h-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin mr-1"></span>
          ) : null}
          {status}
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-[--6px]"
          >
            <path
              d="M7.59976 0.904771L0.399555 0.90477C0.326657 0.90493 0.255201 0.918997 0.192879 0.945457C0.130557 0.971916 0.0797289 1.00977 0.0458663 1.05493C0.0120038 1.1001 -0.00361028 1.15087 0.000703183 1.20179C0.00501617 1.2527 0.0290941 1.30183 0.0703457 1.34388L3.67045 4.98211C3.81965 5.13296 4.17886 5.13296 4.32847 4.98211L7.92857 1.34388C7.97024 1.30191 7.99468 1.25276 7.99922 1.20176C8.00377 1.15077 7.98826 1.09987 7.95436 1.05461C7.92047 1.00935 7.8695 0.971448 7.80698 0.945031C7.74446 0.918615 7.67279 0.90469 7.59976 0.904771Z"
              fill="#2A2B2A"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-left absolute left-1/2 -translate-x-1/2 mt-1 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {statuses.map((statusOption) => (
              <button
                key={statusOption.label}
                onClick={() => selectStatus(statusOption.label)}
                className={`block w-full text-left px-4 py-2 text-xs ${
                  status === statusOption.label ? statusOption.color : ""
                } hover:bg-gray-50`}
                disabled={updatingTaskId === taskId}
              >
                <span
                  className={`inline-block rounded px-2 py-1 ${statusOption.color}`}
                >
                  {statusOption.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
