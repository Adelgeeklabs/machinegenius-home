// @ts-nocheck
"use client";
import { useState, useEffect, useContext, useRef, useMemo, memo } from "react";
import styles from "./FloatingChatBox.module.css";
import { useSocket } from "@/app/_context/SocketProvider";
import { globalContext } from "@/app/_context/store";
import { truncateText } from "@/app/_utils/text";
import useChat from "../_hooks/useChat";
import FloatingChatConversation from "./FloatingChatConversation/FloatingChatConversation";
import FloatingChatMessages from "./FloatingChatMessages/FloatingChatMessages";
import { useRouter } from "next/navigation";
import useClickOutside from "@/app/_hooks/useClickOutside";

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

const FloatingChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const {
    socket,
    onlineUsers,
    currentChatBoxConversation,
    setCurrentChatBoxConversation,
    allUnreadMessages,
    isConnected,
    // isDisplaced,
    isReconnecting,
    handleReconnect,
  } = useSocket();
  const { conversation, setConversation, setMessages } = useChat();
  const { authState } = useContext(globalContext);

  const router = useRouter();

  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("decodedToken");
      return token ? JSON.parse(token) : "";
    } else {
      return authState?.decodedToken || "";
    }
  });

  const unreadRef = useRef<any>([]);
  const [mounted, setMounted] = useState(false);
  const [isHoverDisabled, setIsHoverDisabled] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // console.log(currentChatBoxConversation?._id);
  }, [currentChatBoxConversation]);

  useEffect(() => {
    if (isClient) setMounted(true);
  }, [isClient]);

  useEffect(() => {
    setCurrentChatBoxConversation(null);

    return () => setCurrentChatBoxConversation(null);
  }, []);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      const { disableHoverInteraction } = JSON.parse(savedPreferences);
      setIsHoverDisabled(disableHoverInteraction);
    }
  }, []);

  useEffect(() => {
    if (isOpen || (!isHoverDisabled && isHovering)) {
      if (!socket || isReconnecting || isConnected) {
        return;
      }

      handleReconnect();
    }
  }, [isOpen, isHovering, isHoverDisabled, isConnected]);

  useClickOutside(
    chatBoxRef,
    () => {
      if (isHoverDisabled && isOpen) {
        setIsOpen(false);
      }
    },
    isHoverDisabled
  );

  const onlineCount = useMemo(() => {
    // Create a Set of online user IDs for O(1) lookup
    const onlineUserIds = new Set(onlineUsers.map((user: any) => user._id));

    return conversation
      .filter((conv) => conv.type === "oneToOne")
      .reduce((count, conv) => {
        const otherMemberId = conv.members.find(
          (member) => member._id !== user._id
        )?._id;

        return count + (onlineUserIds.has(otherMemberId) ? 1 : 0);
      }, 0);
  }, [onlineUsers, conversation, user._id]); // Only recalculate when these dependencies change

  if (!isVisible) return null;

  return (
    <>
      {isClient ? (
        <div className="fixed bottom-0 right-[--50px] z-[9999]">
          <div
            ref={chatBoxRef}
            className={`${styles.chatContainer} mx-auto overflow-hidden chatBox ${
              isHoverDisabled ? styles.hoverDisabled : ""
            }
            ${isOpen ? styles.open : ""}
            `}
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling up
              if (isHoverDisabled && !isOpen) {
                setIsOpen(true);
              }
            }}
            onMouseEnter={() => !isHoverDisabled && setIsHovering(true)}
            onMouseLeave={() => !isHoverDisabled && setIsHovering(false)}
          >
            <div
              className={`
                ${mounted && currentChatBoxConversation ? "-translate-x-full duration-300" : "duration-300"}
                transition-transform absolute top-0 left-0 w-full h-full
          `}
            >
              <div
                className={`${styles.chatHeader} [.chatBox:hover_&]:border-b-[--1px]
            [.chatBox:hover_&]:bg-[--dark] [.chatBox:hover_&]:text-[--white] [.chatBox:hover_&]:border-[--dark] [.chatBox:hover_&]:shadow-[--md]
            ${isOpen ? "!border-[--1px] !bg-[--dark] !text-[--white] !border-[--dark] !shadow-[--md]" : ""}
            transition-all duration-100
          `}
              >
                <div className="flex items-center gap-[0.3vw]">
                  <span
                    className={` w-[--11px] h-[--11px] rounded-full ${
                      onlineUsers.find((user: any) => user?._id === user?._id)
                        ?.isBusy
                        ? "bg-orange-600"
                        : "bg-green-600"
                    } border-[1px] border-white cursor-pointer`}
                  ></span>
                  <h3 className="relative">
                    Chat
                    {allUnreadMessages?.totalUnseenMessages ? (
                      <div className="absolute -top-[--5px] -right-[--10px] bg-red-600 rounded-full z-50 text-white text-[10px] min-w-[16px] min-h-[16px] p-[--2px]  flex items-center justify-center">
                        {allUnreadMessages?.totalUnseenMessages}
                      </div>
                    ) : null}
                  </h3>
                </div>

                <div
                  className={`${styles.onlineCount} flex items-center gap-2
    [.chatBox:hover_&]:text-[--white] [.chatBox:hover_&]:decoration-solid [.chatBox:hover_&]:decoration-underline [.chatBox:hover_&]:decoration-[--white] [.chatBox:hover_&]:transition-color 
    ${isOpen ? "!text-[--white] !decoration-solid !decoration-underline !decoration-[--white] !transition-color duration-100" : ""}
    duration-100`}
                >
                  <span>
                    {/* {isDisplaced
                      ? "You're Inactive"
                      : !isConnected
                        ? "You're Offline"
                        : `${onlineCount} Online`} */}
                    {`${onlineCount} Online`}
                  </span>
                </div>
              </div>
              <div
                className={`h-0 overflow-hidden [interpolate-size:allow-keywords] [.chatBox:hover_&]:h-auto 
              ${isOpen ? "!h-auto" : ""}
               transition-all duration-200`}
              >
                <div
                  className={`${styles.chatList} 
            ${currentChatBoxConversation && "overflow-hidden"}
            `}
                >
                  <FloatingChatConversation
                    conversation={conversation}
                    setConversation={setConversation}
                    currentChatBoxConversation={currentChatBoxConversation}
                    setCurrentChatBoxConversation={
                      setCurrentChatBoxConversation
                    }
                    handleConversationChange={setCurrentChatBoxConversation}
                    user={user}
                    unreadRef={unreadRef}
                  />
                </div>

                <div
                  onClick={() =>
                    window.open(
                      roleBasedRoute[authState.decodedToken.department[0]] +
                        "/chat",
                      "_blank"
                    )
                  }
                  className={styles.viewAllButton}
                >
                  View All in Chat
                </div>
              </div>
            </div>
            <div
              className={`
                ${mounted && !currentChatBoxConversation ? "translate-x-full duration-300" : "translate-x-0 duration-300"}
                transition-transform absolute top-0 left-0 w-full h-full
          `}
            >
              <div
                className={`${styles.chatHeader} [.chatBox:hover_&]:border-b-[--1px]
          [.chatBox:hover_&]:bg-[--dark] [.chatBox:hover_&]:text-[--white] [.chatBox:hover_&]:border-[--dark] [.chatBox:hover_&]:shadow-[--md]  transition-all duration-100
          ${isOpen ? "!border-[--1px] !bg-[--dark] !text-[--white] !border-[--dark] !shadow-[--md] transition-all duration-100" : ""}
          `}
              >
                {/* show current conversation name */}
                <div className="flex items-center gap-[0.3vw]">
                  <span
                    className="relative text-[--white] text-[--20px] cursor-pointer"
                    onClick={() => {
                      setMessages([]);
                      setCurrentChatBoxConversation(null);
                    }}
                  >
                    <svg
                      fill="currentColor"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 100 100"
                      enableBackground="new 0 0 100 100"
                      stroke="currentColor"
                      strokeWidth="4.7"
                      className="w-[--20px] h-[--20px]"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <path d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657 c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824 c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723 C33.234,53.39,33.446,54.017,33.934,54.458z"></path>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                    {allUnreadMessages?.totalUnseenMessages ? (
                      <div className="absolute -top-[--5px] -left-[--7px] bg-red-600 rounded-full z-50 text-white text-[10px] min-w-[16px] min-h-[16px] p-[--2px]  flex items-center justify-center">
                        {allUnreadMessages?.totalUnseenMessages}
                      </div>
                    ) : null}
                  </span>
                  <span
                    className={` w-[--11px] h-[--11px] rounded-full ${
                      onlineUsers.find((user: any) => user?._id === user?._id)
                        ?.isBusy
                        ? "bg-red-600 animate-pulse"
                        : "bg-green-600"
                    } border-[1px] border-white cursor-pointer`}
                  ></span>
                  <h3>
                    {currentChatBoxConversation
                      ? truncateText(
                          currentChatBoxConversation?.type === "group"
                            ? currentChatBoxConversation.groupName
                            : currentChatBoxConversation.members.find(
                                (member: any) => member._id !== user._id
                              )?.firstName +
                                " " +
                                currentChatBoxConversation.members.find(
                                  (member: any) => member._id !== user._id
                                )?.lastName,
                          20
                        )
                      : "Chat"}
                  </h3>
                </div>
              </div>
              <div
                className={`h-0 overflow-hidden [interpolate-size:allow-keywords] [.chatBox:hover_&]:h-auto transition-all duration-200
              ${isOpen ? "!h-auto" : ""}
              `}
              >
                <div className={`${styles.chatList} overflow-clip`}>
                  <FloatingChatMessages unreadRef={unreadRef} user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default memo(FloatingChatBox);
