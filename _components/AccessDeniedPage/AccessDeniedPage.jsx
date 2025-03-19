"use client";
import { memo, useEffect, useState } from "react";

function AccessDeniedPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md mx-4 border border-gray-700">
        <div className="mb-4 text-amber-500">
          <svg
            className="h-16 w-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-100 mb-3">Access Denied</h1>
        <p className="text-gray-400 mb-5">
          You are not authorized to access this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <button
          onClick={() => typeof window !== "undefined" && window.history.back()}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-medium px-6 py-2 rounded-md transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default memo(AccessDeniedPage);
