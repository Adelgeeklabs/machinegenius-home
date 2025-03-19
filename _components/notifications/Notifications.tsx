import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";
import { useInfiniteQuery } from "react-query";
import { useNotifications } from "@/app/_hooks/useNotifications";

const Notifications = ({
  unseenCount,
  setUnseenCount,
}: {
  unseenCount: any;
  setUnseenCount: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { markAsSeen } = useNotifications(setUnseenCount);

  // Fetch all notifications
  const fetchNotifications = async ({ pageParam = 0 }) => {
    try {
      setLoading(true);
      // In a real implementation, this would be a fetch to your API
      const limit = 10; // Number of notifications per request
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notification/all?skip=${pageParam}&limit=${limit}`,
        "GET"
      );

      return {
        notifications: (data as any).notifications,
        nextSkip:
          (data as any).notifications.length < limit
            ? undefined
            : pageParam + limit,
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { notifications: [], nextSkip: undefined };
    } finally {
      setLoading(false);
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    getNextPageParam: (lastPage: any) => lastPage.nextSkip ?? undefined,
  });

  // Get all notifications from all pages
  const allNotifications =
    data?.pages?.flatMap((page) => page.notifications) || [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        notificationRef.current &&
        !(notificationRef.current as any).contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle notification panel
  const toggleNotifications = () => {
    if (!isOpen) {
      refetch(); // Fetch notifications only when opening
    }
    setIsOpen(!isOpen);
  };

  // Format date from timestamp
  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell Icon with Counter */}
      <button
        onClick={toggleNotifications}
        className="p-2 rounded-[--5px] bg-[#E7EBED] hover:bg-gray-200 transition-colors fixed top-4 right-8 z-50"
      >
        <svg
          width="24"
          height="28"
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0C11.0517 0 10.2855 0.782031 10.2855 1.75V2.8C6.37444 3.60938 3.42772 7.14219 3.42772 11.375V12.7641C3.42772 15.2469 2.59728 17.6586 1.08105 19.5945L0.282759 20.6172C-0.0279864 21.0109 -0.0869209 21.5523 0.127386 22.0063C0.341693 22.4602 0.791738 22.75 1.28464 22.75H22.7154C23.2083 22.75 23.6583 22.4602 23.8726 22.0063C24.0869 21.5523 24.028 21.0109 23.7172 20.6172L22.9189 19.6C21.4027 17.6586 20.5723 15.2469 20.5723 12.7641V11.375C20.5723 7.14219 17.6256 3.60938 13.7145 2.8V1.75C13.7145 0.782031 12.9483 0 12 0ZM12 5.25C15.3164 5.25 18.0006 7.98984 18.0006 11.375V12.7641C18.0006 15.3836 18.7453 17.9375 20.1276 20.125H3.8724C5.25468 17.9375 5.9994 15.3836 5.9994 12.7641V11.375C5.9994 7.98984 8.6836 5.25 12 5.25ZM15.4289 24.5H12H8.57109C8.57109 25.4297 8.93005 26.3211 9.57297 26.9773C10.2159 27.6336 11.0892 28 12 28C12.9108 28 13.7841 27.6336 14.427 26.9773C15.0699 26.3211 15.4289 25.4297 15.4289 24.5Z"
            fill="#114560"
          />
        </svg>

        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {unseenCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-12 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          onScroll={(e: any) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (
              scrollTop + clientHeight >= scrollHeight - 10 &&
              hasNextPage &&
              !isFetchingNextPage
            ) {
              fetchNextPage();
            }
          }}
        >
          <div className="sticky top-0 bg-gray-50 p-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {status === "loading" ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : allNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              allNotifications.map((notification: any) => (
                <div
                  key={notification._id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.seenStatus ? "bg-blue-50" : ""}`}
                  onClick={() => markAsSeen(notification._id)}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                      <span className="inline-block px-2 py-1 mt-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        {notification.type}
                      </span>
                    </div>
                    {!notification.seenStatus && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                    )}
                  </div>
                </div>
              ))
            )}
            {isFetchingNextPage && (
              <div className="p-3 text-center text-gray-500">
                Loading more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
