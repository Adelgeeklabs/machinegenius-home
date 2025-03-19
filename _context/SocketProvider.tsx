"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { globalContext } from "@/app/_context/store";
import toast from "react-hot-toast";
import chatToast from "@/app/_components/Chat/_components/ChatToast/chatToast";
// import { publicPaths } from "@/app/_context/store";
import { usePathname } from "next/navigation";
import useSessionStorage from "../_hooks/useSessionStorage";
import { useDesktopNotification } from "../_hooks/useDesktopNotification";
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";

interface Conversation {
  _id: string;
  type: string;
  lastMessage: string;
  lastSeen: number;
  updatedAt: number;
  members: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  name: string;
  media: [];
}

const SocketContext = createContext<any>(null);
const announcementIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    height="40px"
    width="40px"
    version="1.1"
    id="Layer_1"
    viewBox="0 0 239.563 239.563"
  >
    <g>
      <g>
        <g>
          <path d="M146.962,36.978h-1.953L85.568,69.611H42.605C19.113,69.611,0,88.723,0,112.216c0,21.012,15.301,38.474,35.334,41.943     L21.56,202.585h47.523l13.584-47.756h2.901l59.443,32.628h1.953c12.585,0,22.826-10.239,22.826-22.826V59.803     C169.787,47.219,159.546,36.978,146.962,36.978z M57.592,187.366H41.71l8.352-29.364h15.882L57.592,187.366z M109.459,150.581     l-19.988-10.972H42.605c-15.103,0-27.388-12.29-27.388-27.393c0-15.103,12.285-27.388,27.388-27.388h46.866l19.988-10.974     V150.581z M154.57,164.631c0,3.637-2.567,6.683-5.978,7.431l-23.916-13.127V65.502l23.916-13.13     c3.414,0.748,5.978,3.797,5.978,7.434V164.631z" />
          <path d="M198.989,79.377L188.106,90.26c5.623,7.789,8.976,17.32,8.976,27.637c0,10.32-3.353,19.851-8.976,27.637l10.883,10.883     c8.326-10.629,13.31-24,13.31-38.52C212.299,103.377,207.315,90.007,198.989,79.377z" />
          <path d="M218.358,60.009l-10.794,10.794c10.482,12.856,16.782,29.252,16.782,47.094c0,17.845-6.3,34.238-16.782,47.094     l10.794,10.794c13.216-15.648,21.205-35.849,21.205-57.888S231.574,75.657,218.358,60.009z" />
        </g>
      </g>
    </g>
  </svg>
);
const announcementIconWhite = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#ffffff"
    height="40px"
    width="40px"
    version="1.1"
    id="Layer_1"
    viewBox="0 0 239.563 239.563"
  >
    <g>
      <g>
        <g>
          <path d="M146.962,36.978h-1.953L85.568,69.611H42.605C19.113,69.611,0,88.723,0,112.216c0,21.012,15.301,38.474,35.334,41.943     L21.56,202.585h47.523l13.584-47.756h2.901l59.443,32.628h1.953c12.585,0,22.826-10.239,22.826-22.826V59.803     C169.787,47.219,159.546,36.978,146.962,36.978z M57.592,187.366H41.71l8.352-29.364h15.882L57.592,187.366z M109.459,150.581     l-19.988-10.972H42.605c-15.103,0-27.388-12.29-27.388-27.393c0-15.103,12.285-27.388,27.388-27.388h46.866l19.988-10.974     V150.581z M154.57,164.631c0,3.637-2.567,6.683-5.978,7.431l-23.916-13.127V65.502l23.916-13.13     c3.414,0.748,5.978,3.797,5.978,7.434V164.631z" />
          <path d="M198.989,79.377L188.106,90.26c5.623,7.789,8.976,17.32,8.976,27.637c0,10.32-3.353,19.851-8.976,27.637l10.883,10.883     c8.326-10.629,13.31-24,13.31-38.52C212.299,103.377,207.315,90.007,198.989,79.377z" />
          <path d="M218.358,60.009l-10.794,10.794c10.482,12.856,16.782,29.252,16.782,47.094c0,17.845-6.3,34.238-16.782,47.094     l10.794,10.794c13.216-15.648,21.205-35.849,21.205-57.888S231.574,75.657,218.358,60.009z" />
        </g>
      </g>
    </g>
  </svg>
);
const roleBasedRoute: Record<string, string> = {
  "content-creation": "/content-creator",
  ceo: "/content-creator",
  "video-editing": "/video-editor",
  "social-media": "/social-media",
  administrative: "/administrative",
  "customer-service": "/customer-service",
  creative: "/creative",
  hr: "/hr",
  accounting: "/accounting",
  "news-letter": "/newsletter",
  "out-reach": "/outreach",
  SEO: "/seo",
  OP: "/op",
};

export const chatEventEmitter = {
  listeners: new Set<Function>(),
  emit: (data: any) => {
    chatEventEmitter.listeners.forEach((listener) => listener(data));
  },
  subscribe: (listener: Function) => {
    chatEventEmitter.listeners.add(listener);
    return () => chatEventEmitter.listeners.delete(listener);
  },
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const { authState } = useContext(globalContext);
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [currentConversation, setCurrentConversation] = useSessionStorage<any>(
    "chat-currentConversation",
    null
  );
  const [currentChatBoxConversation, setCurrentChatBoxConversation] =
    useState<any>(null);
  const [allUnreadMessages, setAllUnreadMessages] = useState<number>(0);
  const { sendNotification, requestPermission } = useDesktopNotification();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [notiRoute, setNotiRoute] = useState("");
  let newSocket: Socket | null = null;
  const [isDisplaced, setIsDisplaced] = useState(false);
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  const notificationTypeEnum = {
    complaint: "/hr/complaints-management",
    survey: "/survey/[[id]]",
    task: "/events-tasks",
    vacation: "/vacations",
    resignation: "/resignation-management",
    hiring: "/hr/hiring/job-openings",
  };

  const notificationProcess = (data: {
    notificationType: string;
    notificationId: string;
    event: string;
    department: string;
    message: string;
  }) => {
    if (
      !notificationTypeEnum[
        data.notificationType as keyof typeof notificationTypeEnum
      ]
    ) {
      return;
    }
    const notificationType =
      data.notificationType as keyof typeof notificationTypeEnum;
    const route =
      notificationType == "survey"
        ? notificationTypeEnum[notificationType].replace(
            "[[id]]",
            `${data.event}`
          )
        : notificationTypeEnum[notificationType];

    setNotiRoute(route);
    fetchUnseenCount();
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } w-1/2 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          {/* Icon Section */}
          <div className="flex-shrink-0 flex items-center px-4 py-4">
            {announcementIcon}
          </div>

          {/* Content Section */}
          <div
            className="flex-1 w-0 p-4 cursor-pointer"
            onClick={() => {
              markAsSeen(data.notificationId);
              // Navigate to appropriate page based on notification type
              if (data.notificationType === "complaint") {
                window.open(`/hr/complaints-management`, "_blank");
              } else if (data.notificationType === "survey") {
                window.open(`/surveys/${data.event}`, "_blank");
              } else if (data.notificationType === "task") {
                window.open(`/events-tasks`, "_blank");
              } else if (data.notificationType === "vacation") {
                window.open(`/vacations`, "_blank");
              } else if (data.notificationType === "resignation") {
                window.open(`/resignation-management`, "_blank");
              } else if (data.notificationType === "hiring") {
                window.open(`/hr/hiring/job-openings`, "_blank");
              }
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                {data.notificationType}
              </p>
              <span className="ml-2 text-xs text-gray-500">
                {data.department}
              </span>
            </div>
            <div className="mt-1">
              <p className="text-sm text-gray-600">{data.message}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.remove(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-500 hover:bg-gray-100 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ),
      {
        duration: 7000,
        position: "top-center",
      }
    );
  };
  const markAsSeen = async (id: string) => {
    try {
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notification/seen/${id}`,
        "PATCH"
      );
      if (response.ok) {
        setUnseenCount((prev: any) => Math.max(0, prev - 1));
      } else {
        toast.error("Something Went Wrong!");
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };

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
      console.log(data);
    } catch (error) {
      console.error("Error fetching unseen count:", error);
    }
  };

  async function getAllUnseenMessages() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/get-all-unseen-messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const data = await response.json();
      setAllUnreadMessages(data.unseenData);
    } catch (error) {
      console.error("Error fetching unseen messages", error);
    }
  }

  async function fetchConversation() {
    if (!authState?.token) return;
    setIsLoadingConversations(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setConversation(data.result);
      }
    } catch (error) {
      console.error("Error fetchConversation", error);
    } finally {
      setIsLoadingConversations(false);
    }
  }

  useEffect(() => {
    if (authState.token && isConnected && !isReconnecting) {
      fetchConversation();
      getAllUnseenMessages();
    }
  }, [authState.token, isConnected, isReconnecting]);

  function getToken() {
    if (typeof window !== "undefined") {
      const token =
        typeof window !== "undefined" && localStorage.getItem("token");
      return token ? `Bearer ${token}` : null;
    } else {
      return `Bearer ${authState?.token}` || null;
    }
  }

  useEffect(() => {
    const handleFocus = () => {
      if (!socketRef.current || isReconnecting || isConnected) {
        return;
      }

      handleReconnect();
    };

    const handleVisibilityChange = () => {
      if (!socketRef.current || isReconnecting || isConnected) {
        return;
      }

      if (document.visibilityState === "visible") {
        handleReconnect();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected]);

  useEffect(() => {
    // Don't initialize if no token
    if (!authState.token) {
      console.log("No token, skipping initialization");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        console.log("No token, Socket disconnected");
      }
      return;
    }

    // Don't initialize if already connected
    if (socketRef.current?.connected || isConnected) {
      console.log("Socket already connected, skipping initialization");
      return;
    }

    console.log("Initializing new socket connection");

    newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: {
        token: getToken(),
      },
      transports: ["websocket"], // Use WebSocket transport
    });

    // Store the socket instance in the ref
    socketRef.current = newSocket;
    socketRef.current?.connect();

    const onConnect = () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
      setIsReconnecting(false);
      setIsDisplaced(false);
      // toast("Connected to socket server");
      // toast.success("Connected to chat");
    };

    newSocket.on("connect", onConnect);

    const onConnectError = (error: any) => {
      setIsReconnecting(false);
      console.error("Connection error:", error);
    };

    newSocket.on("connect_error", onConnectError);

    const onReconnectAttempt = (attempt: any) => {
      console.log(`Attempting to reconnect... (attempt ${attempt})`);
      setIsReconnecting(true);
    };

    newSocket.on("reconnect_attempt", onReconnectAttempt);

    const onReconnect = (attempt: any) => {
      console.log(`Reconnected after ${attempt} attempts`);
      setIsConnected(true);
      setIsReconnecting(false);
      toast.success("Reconnected to socket server");
    };

    newSocket.on("reconnect", onReconnect);

    const onDisconnect = (reason: any) => {
      console.log("Disconnected from Socket.IO server - reason:", reason || "");
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // This indicates another tab has connected with the same token
        setIsDisplaced(true);
        // Don't show the disconnection toast for this specific reason
      } else {
        // For other disconnect reasons, show the toast as before
        // toast("Disconnected from socket server");
      }
    };

    newSocket.on("disconnect", onDisconnect);

    const onReconnectFailed = () => {
      console.log("Reconnection failed");
      setIsReconnecting(false);
      toast.error("Failed to reconnect to socket server");
    };

    newSocket.on("reconnect_failed", onReconnectFailed);

    newSocket.on("userSeenMessage", (attempt) => {
      console.log(`I Saw Unseen Messages`);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    newSocket.on("onlineUsers", (users) => {
      console.log("users -- onlineUsers");

      setOnlineUsers((prev: any) => {
        if (users.length > 0) {
          return [...prev, ...users];
        } else {
          const i = prev.findIndex((u: any, i: number) => u._id === users._id);
          if (i !== -1) prev[i] = users;

          return [...prev, users];
        }
      });
    });

    // newSocket.on("unseenMessageCount", (unreadMessages) => {
    //   console.log("unseenMessageCount", unreadMessages);
    //   setAllUnreadMessages(unreadMessages);
    // });

    newSocket.on("disconnectedUser", (user) => {
      setOnlineUsers((prev: any) =>
        prev?.filter((u: any) => u._id !== user._id)
      );
    });

    newSocket.on("connectedUser", (user) => {
      setOnlineUsers((prev: any) => [...prev, user]);
    });

    newSocket.on("BroadCastMessage", (data) => {
      console.log("Received BroadCastMessage data:", data);
      const BroadCastMessageNoti = new Audio();
      BroadCastMessageNoti.src =
        "/audio/mixkit-software-interface-start-2574.wav";
      BroadCastMessageNoti.volume = 0.2;
      BroadCastMessageNoti.preload = "auto";
      BroadCastMessageNoti.play();
      // Check if we've already processed this announcementId`
      // if (processedAnnouncementIdsRef.current.has(data.messageId)) {
      //   console.log(
      //     `Announcement ${data.messageId} already processed, skipping.`
      //   );
      //   return;
      // }

      // Mark this tweetId as processed
      // processedAnnouncementIdsRef.current.add(data.messageId);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } w-1/2 bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-700`}
          >
            {/* Icon Section */}
            <div className="flex-shrink-0 flex items-center px-4 py-4">
              {announcementIconWhite}
            </div>

            {/* Content Section */}
            <div
              className="flex-1 w-0 p-4"
              onClick={() => {
                // toast.dismiss(t.id);
                // window.open(
                //   roleBasedRoute[authState.decodedToken.department[0]] +
                //     "/dashboard"
                // );
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-100">
                  {data.messageType}
                </p>
                <span className="ml-2 text-xs text-gray-400">
                  {data.firstName} {data.lastName}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-300">{data.message}</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex border-l border-gray-700">
              <button
                onClick={() => toast.remove(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-right",
        }
      );
    });
    newSocket?.on("NotifyOneDepartment", (data: any) => {
      notificationProcess(data);
    });

    newSocket.on("NotifyOneUser", (data) => {
      notificationProcess(data);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } w-1/2 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            {/* Icon Section */}
            <div className="flex-shrink-0 flex items-center px-4 py-4">
              {announcementIcon}
            </div>

            {/* Content Section */}
            <div
              className="flex-1 w-0 p-4 cursor-pointer"
              onClick={() => {
                // toast.dismiss(t.id); // Dismiss the toast
                window.open(
                  `/video-editor/render-status/video-preview?videoUrl=${data.videoUrl}`,
                  "_blank"
                );
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  Video Rendering Complete
                </p>
                <span className="ml-2 text-xs text-gray-500">
                  your video is ready
                </span>
              </div>
              <div className="mt-1">
                {/* <p className="text-sm text-gray-600">{data.message}</p> */}
                Video is ready for download
              </div>
            </div>

            {/* Close Button */}
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.remove(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-500 hover:bg-gray-100 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ),
        {
          duration: 7000,
          position: "top-right",
        }
      );
    });

    return () => {
      if (socketRef.current) {
        [
          "connect",
          "reconnect_attempt",
          "reconnect",
          "reconnect_error",
          "unseenMessageCount",
          "BroadCastMessage",
          "message",
          "disconnect",
          "NotifyOneUser",
          "onlineUsers",
          "disconnectedUser",
          "connectedUser",
        ].forEach((event) => {
          if (socketRef?.current) {
            socketRef.current?.off(event);
          }
        });
        socketRef.current?.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      if (newSocket) {
        newSocket?.disconnect();
        newSocket = null;
        setIsConnected(false);
      }
    };
  }, [authState.token]);

  useEffect(() => {
    // Request notification permission when component mounts
    requestPermission();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("message", (data: any) => {
        // Handle notifications if not in chat
        // console.log(
        //   "SocketProvider: Handling notification for message:",
        //   data.chat
        // );
        // console.log(currentConversation?._id);
        // console.log(data?.chat?._id);

        if (
          (currentConversation?._id !== data?.chat?._id ||
            currentChatBoxConversation?._id !== data?.chat?.id ||
            path?.split("/")[path?.split("/").length - 1] !== "chat") &&
          !data.offline
        ) {
          setAllUnreadMessages((prevState: any) => {
            const chatId = data?.chat?._id;
            const newTotalUnseenMessages =
              (prevState.totalUnseenMessages || 0) + 1;

            if (Object.keys(prevState).includes(chatId)) {
              // If the chat ID exists, increment the count for that chat
              return {
                ...prevState,
                [chatId]: (prevState[chatId] || 0) + 1,
                totalUnseenMessages: newTotalUnseenMessages,
              };
            } else {
              // If the chat ID doesn't exist, add it with an initial count of 1
              return {
                ...prevState,
                [chatId]: 1,
                totalUnseenMessages: newTotalUnseenMessages,
              };
            }
          });
        }

        // console.log("currentConversation", currentConversation?._id);
        // console.log("path", path.includes("chat"));

        const messageNoti = new Audio();
        messageNoti.src = "/audio/slack-new-message.mp3";
        messageNoti.volume = 0.2;
        messageNoti.preload = "auto";

        let message = "";
        let media = null;
        if (data[0]) {
          message = data[0].text;
          if (!message) media = data[0]?.media?.[0];
        } else if (data) {
          message = data.text;
          if (!message) media = data?.media?.[0];
        }

        const isBusy = onlineUsers.find(
          (u: any) => u._id === authState.decodedToken._id
        )?.isBusy;

        // Instead of emitting socket event, use the custom emitter
        chatEventEmitter.emit(data);

        if (isBusy) {
          // console.log("User is busy - skipping notification");
          return;
        }

        if (message || media) {
          messageNoti.play();
          // Check if the window/tab is not active

          if (!document.hasFocus()) {
            // Send desktop notification with Slack-like formatting
            sendNotification(
              `${data.sender.firstName} ${data.sender.lastName}`,
              {
                // Workspace/Company name as title
                body: `${message || `New ${media?.type} message`}`, // Hierarchical format
                icon: "/assets/profile_avatar_placeholder.png",
                badge: "/assets/profile_avatar_placeholder.png",
                silent: true,
                onClick: () => {
                  setCurrentConversation(data.chat);
                  window.open(
                    roleBasedRoute[authState.decodedToken.department[0]] +
                      "/chat",
                    "_blank"
                  );
                },
              }
            );
          } else if (
            (data.chat &&
              data.chat?._id !== currentConversation?._id &&
              path.includes("chat")) ||
            (!path.includes("chat") &&
              currentChatBoxConversation?.id !== data.chat?._id)
          ) {
            chatToast(message, data.sender, media?.type, () => {
              setCurrentConversation(data.chat);
              window.open(
                roleBasedRoute[authState.decodedToken.department[0]] + "/chat",
                "_blank"
              );
            });
          }
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message");
      }
    };
  }, [
    authState.token,
    socketRef.current,
    onlineUsers,
    path,
    currentConversation,
    currentChatBoxConversation,
  ]);

  // useEffect(
  //   () => console.log(currentChatBoxConversation),
  //   [currentChatBoxConversation]
  // );

  const handleReconnect = useCallback(() => {
    if (!socketRef.current || isReconnecting || isConnected) return;

    setIsReconnecting(true);
    socketRef?.current?.connect();

    const timeoutId = setTimeout(() => {
      if (socketRef.current && (!socketRef.current.connected || !isConnected)) {
        setIsReconnecting(false);
      }
    }, 2500);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isReconnecting, isConnected]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        setOnlineUsers,
        currentConversation,
        setCurrentConversation,
        currentChatBoxConversation,
        setCurrentChatBoxConversation,
        allUnreadMessages,
        setAllUnreadMessages,
        isConnected,
        isDisplaced,
        isReconnecting,
        handleReconnect,
        unseenCount,
        setUnseenCount,
        setNotiRoute,
        notiRoute,
        conversation,
        setConversation,
        fetchConversation,
        isLoadingConversations,
        setIsLoadingConversations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
