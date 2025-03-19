"use client";
import { useContext, useEffect, useState } from "react";
import { globalContext } from "@/app/_context/store";
import {
  AlertCircle,
  RefreshCw,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

export default function ErrorPage({ error, reset, isGlobalError }) {
  const { authState, handleSignOut } = useContext(globalContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // TODO: Optionally log the error to an error reporting/tracking service
    console.error("Error:", error);
    console.error("Error details:", {
      message: error?.message || "-",
      digest: error?.digest || "-", // Error ID
      stack: error?.stack || "-",
    });
  }, [error]);

  // Determine dashboard route based on user's department
  const getDashboardRoute = () => {
    if (!authState.token || !authState.decodedToken) {
      handleSignOut("");
      return "/";
    }

    const departmentRouteMappings = {
      "content-creation": "/content-creator/dashboard",
      ceo: "/content-creator/dashboard",
      "video-editing": "/video-editor/dashboard",
      "social-media": "/social-media/dashboard",
      administrative: "/administrative/dashboard",
      "customer-service": "/customer-service/dashboard",
      creative: "/creative/dashboard",
      hr: "/hr/dashboard",
      accounting: "/accounting/dashboard",
      "news-letter": "/newsletter/dashboard",
      "Out Reach": "/outreach/dashboard",
      SEO: "/seo/dashboard",
      OP: "/op/dashboard",
    };

    const matchingRoute =
      Object.entries(departmentRouteMappings).find(([dept]) =>
        authState.decodedToken?.department?.includes(dept)
      )?.[1] || "/";

    return matchingRoute;
  };

  const ErrorContent = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isGlobalError ? "Critical Error!" : "Something went wrong!"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isGlobalError
              ? "A critical error has occurred in the application."
              : "We apologize for the inconvenience. An unexpected error has occurred."}
          </p>
          <div className="space-y-[--12px] w-full">
            <div className="flex items-center justify-between gap-[--12px]">
              <button
                onClick={() => reset()}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </button>

              <button
                onClick={() =>
                  typeof window !== "undefined" && window.location.reload()
                }
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </button>
            </div>

            <div className="flex items-center justify-between gap-[--12px]">
              <a
                href={getDashboardRoute()}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </a>

              <button
                onClick={() =>
                  typeof window !== "undefined" && window.history.back()
                }
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </div>

            {/* {process.env.NODE_ENV === "development" && ( */}
            <div className="mt-6 w-full">
              <details className="text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  View Debug Information
                </summary>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  <p className="text-red-600">
                    Error Message: {error?.message || "-"}
                  </p>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  <p className="text-red-600">
                    Error ID: {error?.digest || "-"}
                  </p>
                </div>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono max-h-[35vh] overflow-auto">
                  <p className="text-red-600">
                    Error Stack: {error?.stack || "-"}
                  </p>
                </div>
              </details>
            </div>
            {/* )} */}

            <div className="text-sm text-gray-500 pt-2">
              If the problem persists, please contact support
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isClient) {
    return null;
  }

  // Return full HTML structure for global error, just the content for regular error
  return isGlobalError ? (
    <html>
      <body>
        <ErrorContent />
      </body>
    </html>
  ) : (
    <ErrorContent />
  );
}
