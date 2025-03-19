import { useEffect, useState } from "react";

export const useDesktopNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null
  );

  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notifications");
      return;
    }

    // Set initial permission state
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied" as NotificationPermission;
    }
  };

  const sendNotification = (title: string, options?: any) => {
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    try {
      const notification = new Notification(title, options);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options && "onClick" in options) {
          (options as { onClick: () => void }).onClick();
        }
      };

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  return {
    permission,
    requestPermission,
    sendNotification,
  };
};
