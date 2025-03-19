import React, { useState, useEffect } from "react";
import { IComplaint } from "@/app/_types/complaint";
import { HRComplaintService } from "@/app/_services/hrComplaintService";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ComplaintService } from "@/app/_services/complaintService";
import ConfirmationModal from "@/app/_components/Common/ConfirmationModal";
import { useRouter } from "next/navigation";

interface ComplaintDetailsProps {
  complaint: IComplaint;
  onUpdate?: () => void;
}

interface HREmployee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string[];
}

export default function ComplaintDetails({
  complaint,
  onUpdate,
}: ComplaintDetailsProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [hrEmployees, setHREmployees] = useState<HREmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"hr" | "manager" | null>(
    null
  );
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    loadHREmployees();
    const currentUserId =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("decodedToken") || "{}")._id
        : null;

    setCanEdit(complaint.assignedTo?._id === currentUserId);
  }, [complaint.assignedTo]);

  const loadHREmployees = async () => {
    try {
      const employees = await HRComplaintService.getHREmployees(complaint._id);
      setHREmployees(employees);
    } catch (error) {
      console.error("Error loading HR employees:", error);
      toast.error("Failed to load HR employees");
    }
  };

  const handleAddComment = async () => {
    if (!comment?.trim()) return;

    setIsSubmitting(true);
    try {
      await HRComplaintService.addComment(complaint._id, comment);
      toast.success("Comment added successfully");
      setComment("");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setIsUpdatingStatus(true);
    try {
      await HRComplaintService.updateComplaintStatus(complaint._id, status);
      toast.success("Status updated successfully");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssign = async (type: "hr" | "manager") => {
    if (!selectedEmployee && type === "hr") {
      toast.error("Please select an employee");
      return;
    }
    setAssignmentType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmAssign = async () => {
    if (!assignmentType) return;

    setShowConfirmModal(false);
    setIsAssigning(true);
    try {
      if (assignmentType === "hr") {
        await HRComplaintService.assignToHR(complaint._id, selectedEmployee);
      } else {
        await HRComplaintService.assignToManager(complaint._id);
      }
      router.push("/hr/complaints-management");
      toast.success("Complaint assigned successfully");
      setSelectedEmployee("");
      onUpdate?.();
    } catch (error) {
      console.error("Error assigning complaint:", error);
      toast.error("Failed to assign complaint");
    } finally {
      setIsAssigning(false);
      setAssignmentType(null);
    }
  };

  const getConfirmationMessage = () => {
    if (assignmentType === "hr") {
      const selectedEmployeeName = hrEmployees.find(
        (emp) => emp._id === selectedEmployee
      );
      return `Are you sure you want to assign this complaint to ${selectedEmployeeName?.firstName} ${selectedEmployeeName?.lastName}?`;
    }
    return "Are you sure you want to escalate this complaint to a manager?";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Awaiting Review":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderAssignmentSection = () =>
    canEdit && (
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">
          Assign/Escalate Complaint
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label
                htmlFor="assignTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Employee
              </label>
              <select
                id="assignTo"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full rounded-md border bg-white border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an employee</option>
                {hrEmployees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName} - {employee.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAssign("hr")}
                disabled={isAssigning || !selectedEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Assign to HR"}
              </button>
              <button
                onClick={() => handleAssign("manager")}
                disabled={isAssigning}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                {isAssigning ? "Escalating..." : "Escalate to Manager"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <div className="bg-white relative rounded-lg max-h-[75vh] overflow-y-auto shadow-md">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 px-6 py-6 pb-4 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {complaint.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Submitted{" "}
                {formatDistanceToNow(complaint.dateSubmitted, {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                complaint.priority === "Urgent"
                  ? "bg-red-100 text-red-800"
                  : complaint.priority === "High"
                    ? "bg-orange-100 text-orange-800"
                    : complaint.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
              }`}
            >
              {complaint.priority}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Tracking */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Status Tracking</h2>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                  complaint.trackComplaintStatus
                )}`}
              >
                {complaint.trackComplaintStatus}
              </span>
              <span className="text-sm text-gray-500">
                Last updated:{" "}
                {formatDistanceToNow(complaint.dateSubmitted, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Complaint Details</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {complaint.complaintDetails}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                Additional Information
              </h2>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="text-sm text-gray-900">
                    {complaint.complaintType}
                  </dd>
                </div>
                {complaint.ageinstEmployee && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Against Employee
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {complaint.ageinstEmployee.firstName}{" "}
                      {complaint.ageinstEmployee.lastName}
                    </dd>
                  </div>
                )}
                {complaint.ageinstDepartment && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Against Department
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {complaint.ageinstDepartment}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    {complaint.complaintStatus}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Assignment Section */}
          {renderAssignmentSection()}

          {/* Status Update Section - Only for assigned HR */}
          {canEdit && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Update Status</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus("In Progress")}
                  disabled={
                    isUpdatingStatus ||
                    complaint.complaintStatus === "In Progress" ||
                    complaint.complaintStatus === "Resolved"
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus("Resolved")}
                  disabled={
                    isUpdatingStatus || complaint.complaintStatus === "Resolved"
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          )}

          {/* Feedback Section - Show if exists */}
          {complaint.feedback && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-2">Employee Feedback</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{complaint.feedback}</p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-2">Attachments</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {complaint.attachments.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Attachment {index + 1}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Comments</h2>
            <div className="space-y-4">
              {complaint.comments?.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-50 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.employee
                        ? `${comment.employee.firstName} ${comment.employee.lastName}`
                        : "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(comment.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
              ))}

              {canEdit && (
                <div className="mt-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={isSubmitting || !comment?.trim()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Comment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setAssignmentType(null);
        }}
        onConfirm={handleConfirmAssign}
        title={
          assignmentType === "hr" ? "Assign Complaint" : "Escalate Complaint"
        }
        message={getConfirmationMessage()}
        confirmText={assignmentType === "hr" ? "Assign" : "Escalate"}
      />
    </>
  );
}
