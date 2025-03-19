import React, { useEffect } from "react";
import dynamic from "next/dynamic";
const Notifications = dynamic(() => import("../notifications/Notifications"), {
  ssr: false,
});
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";
import { useSocket } from "@/app/_context/SocketProvider";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient(); // ✅ Create QueryClient instance

const WrapNotifications = () => {
  const { setUnseenCount, unseenCount } = useSocket();
  const path = usePathname();

  // Fetch unseen notification count
  const fetchUnseenCount = async () => {
    try {
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notification/un-seen`,
        "GET"
      );
      if (response.ok) {
        setUnseenCount((data as any).numberOfUnseen);
      } else {
        setUnseenCount(0);
      }
    } catch (error) {
      console.error("Error fetching unseen count:", error);
    }
  };

  useEffect(() => {
    fetchUnseenCount();
  }, []);

  return (
    <>
      {path.split("/").length > 2 && (
        <QueryClientProvider client={queryClient}>
          <Notifications
            setUnseenCount={setUnseenCount}
            unseenCount={unseenCount}
          />
        </QueryClientProvider>
      )}
    </>
  );
};

export default WrapNotifications;
