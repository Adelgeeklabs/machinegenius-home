"use client";
import { useEffect, useState } from "react";
import { vacationService } from "@/app/_services/vacationService";
import { IVacation, VacationStatusEnum } from "@/app/_types/vacation";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import React from "react";

interface Props {
  refresh?: boolean;
}

const formatVacationDays = (days: number[]): string => {
  if (!days || days.length === 0) return "N/A";

  // Sort days chronologically
  const sortedDays = [...days].sort((a, b) => a - b);

  // Group consecutive days
  const groups: number[][] = [];
  let currentGroup: number[] = [sortedDays[0]];

  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = sortedDays[i];
    const previousDay = sortedDays[i - 1];

    // Check if days are consecutive (24 hours = 86400000 milliseconds)
    if (currentDay - previousDay <= 86400000) {
      currentGroup.push(currentDay);
    } else {
      groups.push([...currentGroup]);
      currentGroup = [currentDay];
    }
  }
  groups.push(currentGroup);

  // Format each group
  return groups
    .map((group) => {
      if (group.length === 1) {
        return format(group[0], "MMM dd, yyyy");
      }
      return `${format(group[0], "MMM dd")} - ${format(group[group.length - 1], "MMM dd, yyyy")}`;
    })
    .join(", ");
};

export default function VacationList({ refresh }: Props) {
  const [vacations, setVacations] = useState<IVacation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const fetchVacations = async () => {
    try {
      const data = await vacationService.getVacations();
      if (Array.isArray(data)) setVacations(data);
    } catch (error) {
      toast.error("Failed to fetch vacations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacations();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      await vacationService.deleteVacation(id);
      toast.success("Vacation request deleted successfully");
      fetchVacations();
    } catch (error) {
      toast.error("Failed to delete vacation request");
    }
  };

  const getStatusColor = (status: VacationStatusEnum) => {
    switch (status) {
      case VacationStatusEnum.APPROVED:
        return "bg-green-100 text-green-800";
      case VacationStatusEnum.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--dark]" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[93%]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-6 py-3"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vacations?.map((vacation) => (
            <React.Fragment key={vacation._id}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(vacation._id)}
              >
                <td className="px-6 py-4">
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedRows.has(vacation._id)
                        ? "transform rotate-90"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm text-gray-900 max-w-[250px] truncate"
                    title={formatVacationDays(vacation.days)}
                  >
                    {formatVacationDays(vacation.days)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vacation.vacationType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      vacation.status
                    )}`}
                  >
                    {vacation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {vacation.status === VacationStatusEnum.PENDING && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(vacation._id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
              {expandedRows.has(vacation._id) && (
                <tr className="bg-gray-50">
                  <td colSpan={5} className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Request Details</h4>
                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          {Object.values(vacation.details).reduce(
                            (acc, curr) => acc + curr.duration,
                            0
                          )}{" "}
                          days
                        </p>
                        <p>
                          <span className="font-medium">Dates:</span>{" "}
                          {formatVacationDays(vacation.days)}
                        </p>
                        <p>
                          <span className="font-medium">Reason:</span>{" "}
                          {vacation.reason || "No reason provided"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">
                          Processing Details
                        </h4>
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {format(vacation.createdAt, "MMM dd, yyyy HH:mm")}
                        </p>
                        {vacation.approval && vacation.approval.length > 0 && (
                          <p>
                            <span className="font-medium">Approver:</span>{" "}
                            {vacation.approval[0].firstName}{" "}
                            {vacation.approval[0].lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
