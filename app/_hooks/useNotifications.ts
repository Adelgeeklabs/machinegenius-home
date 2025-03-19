// hooks/useNotifications.js
import { useQueryClient } from "react-query";
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

const notificationTypeEnum = {
  complaint: {
    create_compliant: "/hr/complaints-management",
    update_compliant: "/complaints/[[id]]",
    user_comment: "/hr/complaints-management/[[id]]",
    user_feedback: "/hr/complaints-management/[[id]]",
    hr_comment: "complaints/[[id]]",
    default: "/complaints",
  },
  survey: "/survey/[[id]]",
  task: {
    create_new_task: "/events-tasks",
    approve_task: "/events-tasks",
    reject_task: "/events-tasks",
    update_task_status: "/tasks",
    escalade_task: "/tasks",
    schedule_interview: "/events-tasks",
    default: "/events-tasks",
  },

  vacation: {
    create_vacation: "/vacations",
    admin_update_Vacation: "/vacation-request",
    admin_approve_Vacation: "/vacations",
    hr_approve_or_reject_vacation: "/vacation-request",
    default: "/vacation-request",
  },

  resignation: {
    user_request_resignation: "/resignation-management",
    user_cancel_resignation: "/resignation-management",
    manager_request_resignation_user_notification: "/resignation",
    manager_request_resignation_hr_notification: "/resignation-management",
    hr_create_resignation_user_notification: "/resignation",
    hr_create_resignation_manager_notification: "/resignation-management",
    manager_approve_or_reject_resignation_for_hr: "/resignation-management",
    manager_approve_or_reject_resignation_for_user: "/resignation",
    hr_approve_or_reject_resignation_for_user: "/resignation",
    hr_approve_or_reject_resignation_for_manager: "/resignation-management",
    default: "/resignation",
  },

  hiring: "/hr/hiring/job-openings",
} as const;

type NotificationType = typeof notificationTypeEnum;

interface ISystemNotification {
  createdBy: string | null;
  eventId: string;
  content: string;
  type: keyof typeof notificationTypeEnum | "";
  process: string;
  department: Array<string>;
  employee: string[];
  seen: string[];
  createdAt: number;
}

export const useNotifications = (setUnseenCount: any) => {
  const queryClient = useQueryClient();
  // const router = useRouter();

  const markAsSeen = async (id: any) => {
    try {
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notification/seen/${id}`,
        "PATCH"
      );

      if (response.ok) {
        // Update the notification in the cache
        queryClient.setQueryData(["notifications"], (oldData: any) => {
          if (!oldData) return oldData;

          // Find if the notification was previously unseen
          let wasUnseen = false;
          let clickedNotification: ISystemNotification = {
            createdBy: "",
            eventId: "",
            content: "",
            type: "",
            process: "",
            department: [],
            employee: [],
            seen: [],
            createdAt: 0,
          };

          // Create a new pages array with the updated notification
          const newPages = oldData.pages.map((page: any) => {
            const newNotifications = page.notifications.map(
              (notification: any) => {
                if (notification._id === id) {
                  wasUnseen = !notification.seenStatus;
                  clickedNotification = { ...notification, seenStatus: true };
                  return clickedNotification;
                }
                return notification;
              }
            );

            return {
              ...page,
              notifications: newNotifications,
            };
          });

          // If the notification was previously unseen, decrease the unseen count
          if (wasUnseen && setUnseenCount) {
            setUnseenCount((prev: any) => Math.max(0, prev - 1));
          }

          // Navigate if we found the notification
          if (clickedNotification) {
            const type =
              clickedNotification.type in notificationTypeEnum
                ? clickedNotification.type
                : "/";

            console.log(
              "test1 module",
              notificationTypeEnum[type as keyof NotificationType]
            );

            console.log("test action ", clickedNotification.process);

            const route: string =
              typeof notificationTypeEnum[type as keyof NotificationType] ===
              "string"
                ? (notificationTypeEnum[
                    type as keyof NotificationType
                  ] as string)
                : ((
                    notificationTypeEnum[
                      type as keyof NotificationType
                    ] as Record<string, string>
                  )[clickedNotification.process] ??
                  (
                    notificationTypeEnum[
                      type as keyof NotificationType
                    ] as Record<string, string>
                  )["default"]);

            const finalRoute = route.replace(
              "[[id]]",
              `${clickedNotification.eventId}`
            );

            toast("Redirecting...", {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
              duration: 1500,
            });

            window.open(finalRoute, "_blank");
          }

          return {
            ...oldData,
            pages: newPages,
          };
        });
      } else {
        toast.error("Something Went Wrong!");
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  return { markAsSeen };
};
