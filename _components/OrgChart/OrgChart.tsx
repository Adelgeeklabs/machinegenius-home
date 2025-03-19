"use client";

import { useState, useEffect } from "react";
import FullTreeView from "./_component/FullTreeView";

const fetchOrgData = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/employee/employee-structure`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch organization data: ${response.status}`);
  }

  return response.json();
};

export default function OrgChartPage() {
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchOrgData();
      setOrgData(data);
    } catch (err) {
      setError("Failed to load organization data");
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center w-full h-[80vh] pt-[10%] rounded-xl mt-[--20px] overflow-hidden bg-gray-50 border border-gray-300 relative">
        <div className="relative w-64 h-64">
          {/* Organization tree animation */}
          <div className="absolute left-1/2 top-5 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg animate-pulse flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="w-0.5 h-8 bg-gray-300 mx-auto mt-1 animate-expandDown"></div>
          </div>

          {/* First level subordinates - appear with delay */}
          <div
            className="flex justify-center space-x-20 absolute top-32 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            {/* Left subordinate */}
            <div>
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md flex items-center justify-center animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="w-0.5 h-6 bg-gray-300 mx-auto mt-1 animate-expandDown"
                style={{ animationDelay: "0.7s" }}
              ></div>
            </div>

            {/* Right subordinate */}
            <div>
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 shadow-md flex items-center justify-center animate-bounce"
                style={{ animationDuration: "1.7s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="w-0.5 h-6 bg-gray-300 mx-auto mt-1 animate-expandDown"
                style={{ animationDelay: "0.8s" }}
              ></div>
            </div>
          </div>

          {/* Connecting lines for first level - appear with delay */}
          <div
            className="absolute left-1/2 top-28 w-32 h-0.5 bg-gray-300 transform -translate-x-1/2 scale-x-0 animate-expandWidth"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          ></div>

          {/* Second level subordinates - appear with longer delay */}
          <div
            className="flex justify-center absolute top-48 left-0 right-0 space-x-10 opacity-0 animate-fadeIn"
            style={{ animationDelay: "1s", animationFillMode: "forwards" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm flex items-center justify-center animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-lg font-medium text-gray-700 mt-4 animate-pulse">
          Loading organization chart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="flex justify-center items-center h-screen">
        No data available
      </div>
    );
  }

  return <FullTreeView data={orgData} />;
}
