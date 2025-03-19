"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

interface ICandidate {
  _id: string;
  candidate: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    department: string;
    roleName: string;
  };
  questions: [];
  taskApprove: string;
  taskLink: string;
}

const JobCandidatesTable = ({ department }: { department: string }) => {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState<{
    isLoading: boolean;
    message: string;
    id: string;
  }>({ isLoading: false, message: "", id: "" });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchCandidates() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/task/all-candidate-with-answers?department=${department}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await response.json();
        console.log(data);
        if (data[0]?._id) {
          setCandidates(data);
        } else {
          setCandidates([]);
          toast.error("No candidates found");
        }
      } catch (error) {
        toast.error("Error fetching candidates: " + error);
        console.error("Error fetching candidates:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleAction = async (id: string, action: string) => {
    async function updateTaskApprove(id: string, action: string) {
      console.log(id, action);
      setLoading({
        id,
        isLoading: true,
        message: action === "Approved" ? "Approving" : "Rejecting",
      });
      try {
        const url =
          action === "Approved"
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/task/approve-candidate-task/${id}`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/task/reject-candidate-task/${id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setCandidates(() =>
          candidates.map((candidate) =>
            candidate.candidate._id === id
              ? { ...candidate, taskApprove: action }
              : candidate,
          ),
        );
        console.log(candidates);
      } catch (error) {
        setLoading({
          id,
          isLoading: false,
          message: "",
        });
        toast.error("Error updating task approve: " + error);
        console.error("Error updating task approve:", error);
      }
    }

    updateTaskApprove(id, action);
    // setCandidates(
    //   candidates.map((candidate) =>
    //     candidate._id === id ? { ...candidate, taskApprove: action } : candidate
    //   )
    // );
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate.candidate.firstName
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase()) &&
        (statusFilter === "All" || candidate.taskApprove === statusFilter),
    );
  }, [candidates, searchTerm, statusFilter]);

  useEffect(() => {
    setLoading({
      id: "",
      isLoading: false,
      message: "",
    });
  }, [candidates]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Job Candidates</h1>
      <div className="flex mb-4 space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 pr-10 border rounded-md"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="overflow-clip rounded-[--12px] border-[--3px] border-gray-200 shadow-lg">
        <div className="min-w-full bg-white divide-y divide-gray-200">
          <div>
            <ul className="bg-gray-100 font-extrabold text-center text-[--17px] text-[--dark] flex">
              <li className="px-[--24px] py-[--18px] w-[25%] uppercase tracking-wider">
                Name
              </li>
              <li className="px-[--24px] py-[--18px] w-[20%]  text 500 uppercase tracking-wider">
                CV
              </li>
              <li className="px-[--24px] py-[--18px] w-[20%]  uppercase tracking-wider">
                Task Link
              </li>
              <li className="px-[--24px] py-[--18px] w-[15%]  uppercase tracking-wider">
                Status
              </li>
              <li className="px-[--24px] py-[--18px] w-[25%] uppercase tracking-wider">
                Action
              </li>
            </ul>
          </div>
          <div className="bg-white divide-y text-center divide-gray-200 min-h-[30vh] max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center pt-[--96px] items-center">
                {/* Add a sspinner loading animation */}
                <div className="w-10 h-10 border-4 border-t-transparent border-[#DBDBD7] rounded-full animate-spin"></div>
              </div>
            ) : Array.isArray(filteredCandidates) &&
              filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <ul key={candidate._id} className="flex border-b">
                  <li className="px-[--24px] py-[--12px] whitespace-nowrap w-[25%]">
                    {candidate.candidate.firstName}{" "}
                    {candidate.candidate.lastName}
                  </li>
                  <li className="px-[--24px] py-[--12px] whitespace-nowrap w-[20%]">
                    <a
                      href={""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View CV
                    </a>
                  </li>
                  <li className="px-[--24px] py-[--12px] whitespace-nowrap w-[20%]">
                    {candidate.taskLink.length == 0 ||
                    candidate.taskLink == "" ? (
                      <p>Not Available</p>
                    ) : (
                      <a
                      href={candidate.taskLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                        View Task
                      </a>
                    )}
                  </li>
                  <li className="px-[--24px] py-[--12px] whitespace-nowrap w-[15%]">
                    <span
                      className={`px-[--12px] py-[--6px] rounded-full text-xs font-semibold
                  ${
                    candidate.taskApprove === "Approved"
                      ? "bg-green-200 text-green-800"
                      : candidate.taskApprove === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                  }`}
                    >
                      {candidate.taskApprove?.charAt(0)?.toUpperCase() +
                        candidate.taskApprove?.slice(1)}
                    </span>
                  </li>
                  <li className="px-[--24px] py-[--12px] whitespace-nowrap w-[25%]">
                    <div className="space-x-2">
                      <button
                        className={`px-[--12px] py-[--4px] rounded-md text-sm font-medium ${
                          candidate.taskApprove === "Approved" ||
                          (loading.isLoading &&
                            loading.message === "Rejecting" &&
                            loading.id === candidate.candidate._id)
                            ? "bg-gray-200 text-gray-800"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        onClick={() =>
                          handleAction(candidate.candidate._id, "Approved")
                        }
                        disabled={
                          (loading.isLoading &&
                            loading.id === candidate.candidate._id) ||
                          candidate.taskApprove === "Approved"
                        }
                      >
                        {loading.isLoading &&
                        loading.message === "Approving" &&
                        loading.id === candidate.candidate._id
                          ? loading.message + "..."
                          : "Approve"}
                      </button>
                      <button
                        className={`px-[--12px] py-[--4px] rounded-md text-sm font-medium ${
                          candidate.taskApprove !== "Pending" ||
                          (loading.isLoading &&
                            loading.message === "Approving" &&
                            loading.id === candidate.candidate._id)
                            ? "bg-gray-200 text-gray-800"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                        onClick={() =>
                          handleAction(candidate.candidate._id, "Rejected")
                        }
                        disabled={
                          (loading.isLoading &&
                            loading.id === candidate.candidate._id) ||
                          candidate.taskApprove !== "Pending"
                        }
                      >
                        {loading.isLoading &&
                        loading.message === "Rejecting" &&
                        loading.id === candidate.candidate._id
                          ? loading.message + "..."
                          : "Reject"}
                      </button>
                    </div>
                  </li>
                </ul>
              ))
            ) : (
              <ul>
                <li className="py-[--12px] h-[50vh]">No candidates found</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCandidatesTable;
