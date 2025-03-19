"use client";
import { useContext, useEffect, useState } from "react";
import { globalContext } from "@/app/_context/store";
import { FileQuestion, LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { authState, handleSignOut } = useContext(globalContext);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg text-center">
        <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <a
          href={getDashboardRoute()}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Go to Dashboard
        </a>

        <button
          onClick={() => typeof window !== "undefined" && window.history.back()}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
}
