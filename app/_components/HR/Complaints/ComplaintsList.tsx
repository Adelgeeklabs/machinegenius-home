import React, { useEffect, useState } from "react";
import { HRComplaintService } from "@/app/_services/hrComplaintService";
import { IComplaint } from "@/app/_types/complaint";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface ComplaintFilters {
  complaintType?: string;
  complaintStatus?: string;
  priority?: string;
  dateSubmitted?: string;
  dateResolved?: string;
  search?: string;
}

interface ComplaintsListProps {
  type: "assigned" | "unassigned" | "all";
}

export default function HRComplaintsList({ type }: ComplaintsListProps) {
  const [complaints, setComplaints] = useState<IComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ComplaintFilters>({});

  const fetchComplaints = async () => {
    try {
      const data = await HRComplaintService.getComplaints(type, filters);
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to fetch complaints");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (complaintId: string) => {
    try {
      await HRComplaintService.assignComplaint(complaintId);
      toast.success("Complaint assigned successfully");
      fetchComplaints();
    } catch (error) {
      console.error("Error assigning complaint:", error);
      toast.error("Failed to assign complaint");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [type, filters]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "text-red-600";
      case "High":
        return "text-orange-500";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <select
          className="bg-transparent border rounded-md p-2"
          onChange={(e) =>
            setFilters({ ...filters, complaintType: e.target.value })
          }
        >
          <option value="">All Types</option>
          <option value="Employee">Employee</option>
          <option value="Department">Department</option>
          <option value="General">General</option>
        </select>

        <select
          className="bg-transparent border rounded-md p-2"
          onChange={(e) =>
            setFilters({ ...filters, complaintStatus: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          className="bg-transparent border rounded-md p-2"
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md p-2"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden overflow-y-scroll h-[60vh]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{/* ... table headers ... */}</tr>
          </thead>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : complaints.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No complaints found</p>
                    <p className="text-sm">
                      There are no complaints matching your current filters
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {complaint.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {complaint.confidential
                        ? "Anonymous"
                        : complaint.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {complaint.complaintType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        complaint.complaintStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : complaint.complaintStatus === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {complaint.complaintStatus}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPriorityColor(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(complaint.dateSubmitted, {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center gap-4">
                      {complaint.assignedTo ? (
                        <Link
                          href={`/hr/complaints-management/${complaint._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAssign(complaint._id)}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                              !JSON.parse(
                                localStorage.getItem("decodedToken") || "{}"
                              )?.department?.some(
                                (dept: string) => dept === "hr"
                              )
                            }
                          >
                            Assign to Me
                          </button>
                          {JSON.parse(
                            localStorage.getItem("decodedToken") || "{}"
                          )?.department?.some(
                            (dept: string) => dept === "hr" || dept === "ceo"
                          ) ? (
                            <Link
                              href={`/hr/complaints-management/${complaint._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </Link>
                          ) : (
                            <span className="text-gray-400 cursor-not-allowed">
                              View Details
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
