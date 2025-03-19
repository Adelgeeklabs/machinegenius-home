"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./Announcements.module.css";
import { globalContext } from "@/app/_context/store";
// import toast from "react-hot-toast";
import { AnnouncementsPagination } from "./AnnouncementsPagination/AnnouncementsPagination";

interface IAnnouncement {
  _id: string;
  messageType: string;
  message: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IAnnouncements {
  data: IAnnouncement[];
}

export default function Announcements() {
  const { authState, handleSignOut } = useContext(globalContext);
  const [pageState, setPageState] = useState<{
    announcements: IAnnouncement[];
    loading: boolean;
  }>({
    announcements: [],
    loading: true,
  });

  // State to keep track of the current announcement index
  const [currentIndex, setCurrentIndex] = useState(0);

  async function getAnnouncements() {
    try {
      setPageState((prev) => ({ ...prev, loading: true }));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get-broad-cast-message`,
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      const json: IAnnouncements = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        setPageState((prev) => ({ ...prev, announcements: json.data }));
      } else {
        setPageState((prev) => ({ ...prev, announcements: [] }));
        // toast.error("No announcements found!");
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.error("Error getAnnouncements:", error);
    } finally {
      setPageState((prev) => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => {
    getAnnouncements();
  }, []);

  // Reset currentIndex if announcements change
  useEffect(() => {
    setCurrentIndex(0);
  }, [pageState.announcements]);

  // Handlers for pagination buttons
  const handleNext = () => {
    if (currentIndex < pageState.announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Get the current announcement
  const currentAnnouncement = pageState.announcements?.[currentIndex];
  const employee = currentAnnouncement?.employee;

  if (pageState.loading) {
    return (
      <div className="flex p-[0.8vw] h-[13vh] bg-[#2A2B2A] rounded-[--25px]">
        <div className="w-1/6 flex items-center gap-[0.25vw]">
          <div className="relative">
            <div className="w-10 h-12 bg-gray-500 animate-pulse rounded"></div>
            <div className="absolute top-0 right-0">
              <div className="w-3 h-3 bg-gray-500 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="w-full space-y-2">
            <div className="h-4 bg-gray-500 animate-pulse rounded w-3/4"></div>
            <div className="h-3 bg-gray-500 animate-pulse rounded w-1/2"></div>
          </div>
        </div>
        {/* <!-- Announcement body --> */}
        <div className="flex items-center w-5/6">
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-500 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-500 animate-pulse rounded w-5/6"></div>
            <div className="h-4 bg-gray-500 animate-pulse rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case when there are no announcements
  if (pageState.announcements.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-[--sy-8px]">
          <h3>Announcements</h3>
        </div>
        <div
          className={`${styles.box} flex justify-center items-center !text-white p-[0.8vw] h-[13vh] bg-[#2A2B2A]`}
        >
          No announcements found!
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-[--sy-8px]">
        <h3>Announcements</h3>
        <AnnouncementsPagination
          currentIndex={currentIndex}
          total={pageState.announcements.length}
          onclickRight={handleNext}
          onclickLeft={handlePrev}
        />
      </div>

      <div className={`${styles.box} flex p-[0.8vw] h-[13vh] bg-[#2A2B2A]`}>
        {/* annoucement owner and his status */}
        <div
          className={`flex items-center gap-[0.25vw] ${styles.profileAndStatus}`}
        >
          <div className={`relative`}>
            <svg
              viewBox="0 0 41 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.632812 4.03324C0.632812 2.08188 2.2147 0.5 4.16606 0.5C24.0048 0.5 40.0874 16.5825 40.0874 36.4213V45.6818C40.0874 47.7905 38.3779 49.5 36.2692 49.5H4.45099C2.34226 49.5 0.632812 47.7905 0.632812 45.6818V4.03324Z"
                fill="#FFFFFB"
              />
            </svg>
            {/* <div className={styles.movedStatus}>
              <svg
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5.5" cy="5.5" r="5.5" fill="#5FA85B" />
              </svg>
            </div> */}
          </div>
          <div>
            <h5>
              {employee?.firstName?.split(" ")[0] || ""}{" "}
              {employee?.lastName?.split(" ")[0] || ""}
            </h5>
            {/* If you have a role or position, include it here */}
            <p>{currentAnnouncement?.messageType || "Announcement"}</p>
          </div>
        </div>
        <div
          className={`${styles.annoucementBody} flex items-center flex-grow`}
          title={currentAnnouncement?.message}
        >
          <p>{currentAnnouncement.message}</p>
        </div>
      </div>
    </div>
  );
}
