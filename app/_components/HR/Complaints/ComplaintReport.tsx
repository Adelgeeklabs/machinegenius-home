import React from "react";
import { HRComplaintService } from "@/app/_services/hrComplaintService";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ComplaintReport() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await HRComplaintService.getComplaintReport();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to fetch report data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="space-y-6 h-[65vh] overflow-y-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Resolution Time
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {reportData.avgResolutionTime?.avgResolutionMs
              ? (() => {
                  // Convert to a readable format, handle negative values correctly
                  const ms = Math.abs(
                    reportData.avgResolutionTime.avgResolutionMs
                  );
                  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
                  const hours = Math.floor(
                    (ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  );
                  const minutes = Math.floor(
                    (ms % (1000 * 60 * 60)) / (1000 * 60)
                  );

                  if (days > 0) {
                    return `${days}d ${hours}h ${minutes}m`;
                  }
                  return `${hours}h ${minutes}m`;
                })()
              : "No data"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Most Common Type
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {reportData.mostCommonComplaintTypes?.[0]?.department || "No data"}
          </p>
          <p className="text-sm text-gray-500">
            {reportData.mostCommonComplaintTypes?.[0]?.count
              ? `${reportData.mostCommonComplaintTypes[0].count} complaints`
              : "No complaints"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Most Affected Department
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {reportData.mostAgainstDepartment?._id || "No data"}
          </p>
          <p className="text-sm text-gray-500">
            {reportData.mostAgainstDepartment?.count
              ? `${reportData.mostAgainstDepartment.count} complaints`
              : "No complaints"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Most Complaints Against
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {reportData.mostAgainstEmployee?.employee?.firstName &&
            reportData.mostAgainstEmployee?.employee?.lastName
              ? `${reportData.mostAgainstEmployee.employee.firstName} ${reportData.mostAgainstEmployee.employee.lastName}`
              : "No data"}
          </p>
          <p className="text-sm text-gray-500">
            {reportData.mostAgainstEmployee?.count
              ? `${reportData.mostAgainstEmployee.count} complaints`
              : "No complaints"}
          </p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Monthly Complaint Trends
        </h3>
        {reportData?.monthlyComplaintTrends?.length > 0 ? (
          <div className="relative h-64">
            <div className="flex items-end space-x-2 absolute bottom-0 left-0 right-0 h-52">
              {reportData.monthlyComplaintTrends.map(
                (month: any, index: number) => {
                  // Calculate max count to avoid division by zero
                  const maxCount = Math.max(
                    ...reportData.monthlyComplaintTrends.map(
                      (m: any) => m.count || 1
                    )
                  );
                  // Calculate height percentage with a minimum of 5% for visibility
                  const heightPercentage = Math.max(
                    5,
                    (month.count / maxCount) * 100
                  );

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center justify-end"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{
                          height: `${heightPercentage}%`,
                          minHeight: "4px",
                        }}
                      ></div>
                      <div className="text-xs text-gray-600 mt-2">
                        {new Date(
                          month.year,
                          month.month - 1
                        ).toLocaleDateString(undefined, {
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                      <div className="text-xs font-semibold">
                        {month.count || 0}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No monthly trend data available
          </p>
        )}
      </div>

      {/* Complaint Types Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Complaint Types Distribution
        </h3>
        {reportData?.mostCommonComplaintTypes?.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {reportData.mostCommonComplaintTypes.map(
              (type: any, index: number) => {
                // Calculate max count to avoid division by zero
                const maxCount = Math.max(
                  ...reportData.mostCommonComplaintTypes.map(
                    (t: any) => t.count || 1
                  )
                );

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="w-32 text-sm text-gray-600 truncate"
                      title={type.department || "Unknown"}
                    >
                      {type.department || "Unknown"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="relative h-4 bg-gray-200 rounded">
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-500 rounded"
                          style={{
                            width: `${(type.count / maxCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-semibold shrink-0">
                      {type.count || 0}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No complaint type data available
          </p>
        )}
      </div>
    </div>
  );
}
