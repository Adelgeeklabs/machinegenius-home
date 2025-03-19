// @ts-nocheck
"use client";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { globalContext } from "@/app/_context/store";
import {
  fetchMessages,
  mimeTypes,
} from "@/app/_components/Chat/_helpers/chatUtils";
import useChat from "../../_hooks/useChat";
import {
  ExpandableCircleMenu,
  ForwardModal,
  MemoizedEmojiPicker,
  MessageContextBackdrop,
  MessageContextMenu,
} from "../../Chat";
import styles from "./FloatingChatMessages.module.css";
import { attachmentIcon, toast } from "react-hot-toast";
import {
  alertIcon,
  attachmentIconChatBox,
  replyIcon,
  replyIcon2,
  sendIcon,
  sendIconChatBox,
  xMarkIcon,
  msgSentCheckIcon,
  msgSentCheckIconChatBox,
  replyIcon2ChatBox,
} from "../../_helpers/chatIcons";
import { faceEmojis, formatTime } from "../../_helpers/chatUtils";
import { v4 as uuidv4 } from "uuid";
import VoiceRecorder from "../../_components/VoiceRecorder/VoiceRecorder";
import { useSocket } from "@/app/_context/SocketProvider";
import { FilePreview } from "../../_components/FilePreview/FilePreview";
import MessageImageGrid from "../../_components/MessageImageGrid/MessageImageGrid";
import { TextareaAutosize } from "@mui/material";
import useSessionStorage from "@/app/_hooks/useSessionStorage";
import throttle from "lodash/throttle";
import VoiceMessage from "@/app/_components/Chat/_components/VoiceMessage/VoiceMessage";
import { FileMessage } from "@/app/_components/Chat/_components/FilePreview/FilePreview";

const imageSVG = (
  <svg
    fill="var(--dark)"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 399.9 399.9"
    className="w-[--20px] h-[--20px]"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <g>
        <g>
          <path d="M366.5,89.1h-24.1l-23.2-50.3c-1.8-3.9-5.8-6.5-10.1-6.5H201.7c-4.3,0-8.3,2.5-10.1,6.5l-23.2,50.3h-49.9V62.4 c0-6.1-5-11.1-11.1-11.1H50.2c-6.1,0-11.1,5-11.1,11.1v26.7h-5.8c-18.4,0-33.3,15-33.3,33.3v211.9c0,18.4,15,33.3,33.3,33.3h333.3 c18.4,0,33.3-15,33.3-33.3V122.4C399.8,104.1,384.8,89.1,366.5,89.1z M208.8,54.6H302l15.9,34.5H192.8L208.8,54.6z M61.2,73.5h35 v15.6h-35V73.5z M366.5,345.4H33.1c-6.1,0-11.1-5-11.1-11.1V227h17.3c6.1,0,11.1-5,11.1-11.1c0-6.1-5-11.1-11.1-11.1H22v-22.2 h39.5c6.1,0,11.1-5,11.1-11.1c0-6.1-5-11.1-11.1-11.1H22v-37.9c0-6.1,5-11.1,11.1-11.1h333.3c6.1,0,11.1,5,11.1,11.1v211.8h0.1 C377.6,340.4,372.6,345.4,366.5,345.4z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M255.4,130.8c-53.8,0-97.6,43.8-97.6,97.6s43.8,97.6,97.6,97.6c53.8,0,97.6-43.8,97.6-97.6 C352.9,174.6,309.1,130.8,255.4,130.8z M255.4,303.7c-41.5,0-75.3-33.8-75.3-75.3s33.8-75.3,75.3-75.3s75.3,33.8,75.3,75.3 C330.7,269.9,296.9,303.7,255.4,303.7z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M255.4,175.3c-29.3,0-53.1,23.8-53.1,53.1s23.8,53.1,53.1,53.1c29.3,0,53.1-23.8,53.1-53.1 C308.5,199.1,284.6,175.3,255.4,175.3z M255.4,259.3c-17,0-30.9-13.9-30.9-30.9s13.9-30.9,30.9-30.9s30.9,13.9,30.9,30.9 S272.4,259.3,255.4,259.3z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M353.8,127.8h-9.9c-6.1,0-11.1,5-11.1,11.1c0,6.1,5,11.1,11.1,11.1h9.9c6.1,0,11.1-5,11.1-11.1 C364.9,132.8,360,127.8,353.8,127.8z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M117.2,138.8c-6.1,0-11.1,5-11.1,11.1v156.9c0,6.1,5,11.1,11.1,11.1c6.1,0,11.1-5,11.1-11.1V149.9 C128.3,143.8,123.3,138.8,117.2,138.8z"></path>
        </g>
      </g>
    </g>
  </svg>
);

const fileSVG = (
  <svg
    fill="var(--dark)"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512.001 512.001"
    className="w-[--20px] h-[--20px]"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <g>
        <g>
          <path d="M463.996,126.864L340.192,3.061C338.231,1.101,335.574,0,332.803,0H95.726C67.724,0,44.944,22.782,44.944,50.784v410.434 c0,28.001,22.781,50.783,50.783,50.783h320.547c28.002,0,50.783-22.781,50.783-50.783V134.253 C467.056,131.482,465.955,128.824,463.996,126.864z M343.255,35.679l88.127,88.126H373.14c-7.984,0-15.49-3.109-21.134-8.753 c-5.643-5.643-8.752-13.148-8.751-21.131V35.679z M446.158,461.217c0,16.479-13.406,29.885-29.884,29.885H95.726 c-16.479,0-29.885-13.406-29.885-29.885V50.784c0.001-16.479,13.407-29.886,29.885-29.886h226.631v73.021 c-0.002,13.565,5.28,26.318,14.871,35.909c9.592,9.592,22.345,14.874,35.911,14.874h73.018V461.217z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M275.092,351.492h-4.678c-5.77,0-10.449,4.678-10.449,10.449s4.679,10.449,10.449,10.449h4.678 c5.77,0,10.449-4.678,10.449-10.449S280.862,351.492,275.092,351.492z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M236.61,351.492H135.118c-5.77,0-10.449,4.678-10.449,10.449s4.679,10.449,10.449,10.449H236.61 c5.77,0,10.449-4.678,10.449-10.449S242.381,351.492,236.61,351.492z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M376.882,303.747H135.119c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h241.763 c5.77,0,10.449-4.678,10.449-10.449C387.331,308.425,382.652,303.747,376.882,303.747z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M376.882,256H135.119c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h241.763 c5.77,0,10.449-4.678,10.449-10.449C387.331,260.678,382.652,256,376.882,256z"></path>
        </g>
      </g>
      <g>
        <g>
          <path d="M376.882,208.255H135.119c-5.77,0-10.449,4.678-10.449,10.449c0,5.771,4.679,10.449,10.449,10.449h241.763 c5.77,0,10.449-4.678,10.449-10.449S382.652,208.255,376.882,208.255z"></path>
        </g>
      </g>
    </g>
  </svg>
);

const audioSVG = (
  <svg
    viewBox="0 0 100 100"
    fill="var(--dark)"
    className="w-[--20px] h-[--20px]"
    style={{ enableBackgroundnew: "0 0 100 100" }}
  >
    <switch>
      <foreignObject
        requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/"
        x="0"
        y="0"
        width="1"
        height="1"
      />
      <g>
        <g>
          <path d="M79.4,31.7c-1.9,0-3.4,1.5-3.4,3.4v29.8c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V35.1C82.8,33.2,81.3,31.7,79.4,31.7z" />
          <path d="M64.7,23.9c-1.9,0-3.4,1.5-3.4,3.4v45.4c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V27.3C68.1,25.4,66.6,23.9,64.7,23.9z" />
          <path d="M35.3,39.5c-1.9,0-3.4,1.5-3.4,3.4v14.1c0,1.9,1.5,3.4,3.4,3.4c1.9,0,3.4-1.5,3.4-3.4V42.9C38.7,41,37.2,39.5,35.3,39.5z     " />
          <path d="M20.6,31.7c-1.9,0-3.4,1.5-3.4,3.4v29.8c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V35.1C24,33.2,22.5,31.7,20.6,31.7z" />
          <path d="M94.1,39.5c-1.9,0-3.4,1.5-3.4,3.4v14.1c0,1.9,1.5,3.4,3.4,3.4c1.9,0,3.4-1.5,3.4-3.4V42.9C97.5,41,96,39.5,94.1,39.5z" />
          <path d="M50,31.7c-1.9,0-3.4,1.5-3.4,3.4v29.8c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V35.1C53.4,33.2,51.9,31.7,50,31.7z" />
          <path d="M5.9,39.5c-1.9,0-3.4,1.5-3.4,3.4v14.1c0,1.9,1.5,3.4,3.4,3.4s3.4-1.5,3.4-3.4V42.9C9.3,41,7.8,39.5,5.9,39.5z" />
        </g>
      </g>
    </switch>
  </svg>
);

const TypingIndicator = ({ firstName, lastName, theme }: any) => {
  return (
    <div className="flex items-center space-x-[--4px] h-full py-[--5px] px-[--10px]">
      <div
        className={`text-[--16px]`}
        style={{
          color: theme,
        }}
      >
        {firstName} {lastName} is typing
      </div>
      <div className="flex space-x-[--4px]">
        <div className="w-[--4px] h-[--4px] bg-gray-500 rounded-full animate-bounce"></div>
        <div
          className="w-[--4px] h-[--4px] bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-[--4px] h-[--4px] bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

interface Attachment {
  id: string;
  loading: boolean;
  url: string;
  type: string;
  name: string;
  info: string;
}
interface ProfileImageFramePropsChatBox {
  reversed?: boolean;
  onlineUsers?: any;
  currentChatBoxConversation?: any;
  user?: any;
}

// Memoize the ProfileImageFrame component
export const ProfileImageFrameChatBox = memo(
  ({
    reversed,
    onlineUsers,
    currentChatBoxConversation,
    user,
  }: ProfileImageFramePropsChatBox) => {
    return reversed ? (
      <div
        className={`[background-color:var(--dark)] flex items-center justify-center ${styles.chat__chat__aside__menu__profileChatBox} group-hover:[background-color:var(--white)] shrink-0 relative`}
      >
        {/* <img src="/images/profile.png" alt="profile" /> */}
        {currentChatBoxConversation?.type == "oneToOne" && (
          <div
            className={`w-3 h-3 rounded-full ${
              onlineUsers.find(
                (s: any) =>
                  s._id ==
                  currentChatBoxConversation?.members?.find(
                    (member: any) => member._id !== user?._id
                  )?._id
              )?.isBusy
                ? "bg-red-500"
                : onlineUsers?.find(
                      (s: any) =>
                        s._id ==
                        currentChatBoxConversation?.members?.find(
                          (member: any) => member?._id !== user?._id
                        )?._id
                    )?.isBusy === false
                  ? "bg-green-500"
                  : "bg-gray-300"
            } absolute top-full left-0 -translate-y-full`}
          ></div>
        )}
      </div>
    ) : (
      <div
        className={`[background-color:var(--dark)] flex items-center justify-center ${styles.chat__chat__aside__menu__profileChatBox_reversed} group-hover:[background-color:var(--white)] shrink-0 relative`}
      >
        {/* <img src="/images/profile.png" alt="profile" /> */}
        {currentChatBoxConversation?.type == "oneToOne" && (
          <div
            className={`w-3 h-3 rounded-full ${
              onlineUsers?.find(
                (s: any) =>
                  s._id ==
                  currentChatBoxConversation?.members?.find(
                    (member: any) => member._id !== user?._id
                  )?._id
              )?.isBusy
                ? "bg-red-500"
                : onlineUsers.find(
                      (s: any) =>
                        s._id ==
                        currentChatBoxConversation?.members?.find(
                          (member: any) => member._id !== user?._id
                        )?._id
                    )?.isBusy === false
                  ? "bg-green-500"
                  : "bg-gray-300"
            } absolute top-full left-0 -translate-y-full`}
          ></div>
        )}
      </div>
    );
  }
);

function FloatingChatMessages({ unreadRef, user }) {
  const { authState, handleSignOut } = useContext(globalContext);
  const {
    messages,
    sendMessage,
    setMessages,
    conversation,
    setConversation,
    handleUserSeenMessage,
    isLoaded,
    setIsLoaded,
    isTyping,
    setIsTyping,
    handleUserTyping,
    editMessage,
    handleDeleteMessage,
  } = useChat();
  const {
    onlineUsers,
    currentChatBoxConversation,
    setCurrentChatBoxConversation,
    isReconnecting,
    isConnected,
  } = useSocket();

  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(
    null
  );
  const [messagesUpdated, setMessagesUpdated] = useState(false);
  const [replyMessage, setReplyMessage] = useState<Map<string, Message>>(
    new Map()
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleMenu = () => setIsExpanded(!isExpanded);
  const [waitForMedia, setWaitForMedia] = useState<
    {
      id: string;
      waiting: boolean;
    }[]
  >([]);
  const [textMessage, setTextMessage] = useState("");

  const [isClient, setIsClient] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Map<string, Message>>(
    new Map()
  );
  const [message, setMessage] = useState<Map<string, Message>>(new Map());

  const [storedInqueueAttachments, setStoredInqueueAttachments] =
    useSessionStorage<Map<string, Attachment>>(
      "storedInqueueAttachments",
      null
    );
  const [presignedURLData, setPresignedURLData] = useState<any>(null);
  const [inQueueAttachments, setInQueueAttachments] = useState<Map>(new Map());
  const [toBeSentAttachments, setToBeSentAttachments] = useState<
    {
      id: string;
      data: Attachment[];
    }[]
  >([]);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (!isClient || !storedInqueueAttachments) return;
    setInQueueAttachments(storedInqueueAttachments);
  }, [isClient]);

  useEffect(() => {
    if (isClient && inQueueAttachments) {
      // only store that isLoaded is true
      setStoredInqueueAttachments(
        Object.entries(inQueueAttachments).reduce((acc, [key, value]) => {
          acc[key] = value.filter((attachment) => !attachment.loading);
          return acc;
        }, {})
      );
    }
  }, [inQueueAttachments]);

  const ref = useRef<any>(null);
  const containerRef = useRef(null);
  const messageRefs = useRef([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ===== 01. get Presigned URL =====
  async function getPresignedURL(type: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/get-presigned-url?type=octet-stream`,
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
        // handleSignOut();
      }
      const json = await res.json();
      if (!json) {
        // toast.error("Something went wrong!");
        return;
      } else {
        // setPresignedURLData(json);
        return json;
      }
    } catch (error) {
      // toast.error("Something went wrong!");
      console.error("Error getPresignedURL:", error);
    }
  }

  async function createConversation(
    type: string,
    members: string[],
    groupName?: string
  ) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          type,
          members,
          groupName,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.Success) {
      console.log(data);
      setConversation((prev) => [data.result, ...prev]);
    } else if (data.message == "Exist") {
      console.log("Already Exist");
    } else {
      console.log(data.message);
    }
    return data;
  }
  const handleMouseEnterEmojiPicker = useCallback((e) => {
    const randomEmoji =
      faceEmojis[Math.floor(Math.random() * faceEmojis.length)];
    e.currentTarget.textContent = randomEmoji;
  }, []);
  // =============== End Emoji Picker ===============

  const AddMessage = (message: Message) => {
    if (message?.text?.trim() === "" && !message?.media?.length) return;

    setMessages((prev) => [...prev, message]);
    setInQueueAttachments((prev) => {
      return {
        ...prev,
        [currentChatBoxConversation._id]: [],
      };
    });
  };
  const getTextDirection = (text: string): "rtl" | "ltr" => {
    const arabicRegex = /[\u0600-\u06FF]/; // الحروف العربية
    return arabicRegex.test(text) ? "rtl" : "ltr";
  };

  const checkURL = (text: string, id: string) => {
    const parts = text?.split(/(\s+)/); // Split by spaces but keep the spaces

    return (
      <div
        id={id}
        className={
          getTextDirection(text?.split(" ")[0]) === "rtl"
            ? "text-right"
            : "text-left"
        }
      >
        {parts?.map((part, index) => {
          // Try to create a URL from the part
          try {
            const url = new URL(part);
            return (
              <a href={url} target="_blank" key={index} id={id}>
                {part}
              </a>
            );
          } catch (error) {
            const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i; // Regex for email addresses
            if (emailRegex?.test(part)) {
              return (
                <a href={`mailto:${part}`} key={index} target="_blank" id={id}>
                  {part}
                </a>
              );
            } else if (/\s+/.test(part)) {
              // If the part is a space, render it as plain space
              return <span key={index}>{part}</span>;
            } else {
              return (
                <span key={index} id={id}>
                  {part}
                </span>
              ); // Plain text part
            }
          }
        })}
      </div>
    );
  };

  useEffect(() => {
    if (messages.length > 0 && isLoaded) {
      handleUserSeenMessage();
    }
  }, [handleUserSeenMessage, isLoaded]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (
      waitForMedia.every((attachment) => attachment.waiting) ||
      !toBeSentAttachments.length
    )
      return;
    //console.log("Exit Here to get presigned URL from backend");
    //console.log(toBeSentAttachments);
    //console.log(message);

    // get the ids of the attachments that are waiting
    const waitedAttachments = waitForMedia
      .filter((attachment) => !attachment.waiting)
      .map((attachment) => attachment.id);
    //console.log(waitedAttachments);

    waitedAttachments.forEach((attachment) => {
      // get the attachments that are not waiting
      const attachments = toBeSentAttachments.find(
        (toBeSentAttachment) =>
          toBeSentAttachment.id === attachment && toBeSentAttachment.ready
      )?.data;

      // check if the same attachments in toBeSentAttachments exists in the inQueueAttachments
      const goodToGo = attachments?.some((attachment) =>
        inQueueAttachments[currentChatBoxConversation._id].some(
          (inQueueAttachment) => inQueueAttachment.id === attachment.id
        )
      );

      // if there are attachments that are not waiting
      if (attachments && !goodToGo) {
        console.log("=========================================");
        console.log("attachments sent", attachments);
        console.log("attachments", attachments);
        console.log("=========================================");
        // send the message with the attachments
        sendMessage({
          _id: uuidv4(),
          conversationId: currentChatBoxConversation?._id,
          text: textMessage,
          media: attachments,
          lastMessage: textMessage || attachments[0].type,
        });
      }
    });

    setToBeSentAttachments((prev) =>
      prev.filter((attachment) => !waitedAttachments.includes(attachment.id))
    );
  }, [waitForMedia]);

  const handleForwardMessage = async (selectedConversations: string[]) => {
    if (!messageToForward) return;

    // Emit forward event for each selected conversation
    selectedConversations.forEach(async (conversation) => {
      if (conversation.type === "group") {
        sendMessage({
          _id: uuidv4(),
          conversationId: conversation._id,
          text: messageToForward.text,
          media: messageToForward.media,
          forward: true,
          lastMessage:
            messageToForward.text || messageToForward.media?.[0]?.type,
        });
      } else {
        const response = await createConversation("oneToOne", [
          user._id,
          conversation._id,
        ]);
        sendMessage({
          _id: uuidv4(),
          conversationId: response.data._id,
          text: messageToForward.text,
          media: messageToForward.media,
          forward: true,
          lastMessage:
            messageToForward.text || messageToForward.media?.[0]?.type,
        });
      }
    });
  };

  // Memoize the MessageBubble component
  const MessageBubble = memo(({ message, children }) => {
    const [contextMenu, setContextMenu] = useState({
      isOpen: false,
      messageRect: null,
    });
    const messageRef = useRef(null);

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = messageRef.current.getBoundingClientRect();
      setContextMenu({
        isOpen: true,
        messageRect: rect,
      });
    };

    const handleClose = () => {
      setContextMenu({ isOpen: false, messageRect: null });
    };

    const handleEdit = () => {
      setEditingMessage((prev) => ({
        ...prev,
        [currentChatBoxConversation._id]: message,
      }));
      setMessage((prev) => ({
        ...prev,
        [currentChatBoxConversation._id]: message.text,
      }));
      if (message.media?.length) {
        setInQueueAttachments((prev) => ({
          ...prev,
          [currentChatBoxConversation._id]: message.media,
        }));
      }
      handleClose();
      // Focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    const handleDelete = () => {
      handleDeleteMessage(message._id);
      handleClose(); // Close context menu
    };
    // Update MessageContextMenu to handle forward

    return (
      <>
        <div
          ref={messageRef}
          onContextMenu={handleContextMenu}
          className={`p-[--10px] rounded-[20px] max-w-[90%] flex flex-col gap-[--8px] relative transition-transform duration-200 
            ${message?.sender?._id == user?._id ? "bg-[#CEEAE9] self-end" : "self-start bg-[--white]"}
            ${contextMenu.isOpen ? styles.messageHighlight : ""}
            ${styles.chat__box__message__container}`}
        >
          {children}
          <div className="flex gap-[--8px] items-center justify-between">
            <p
              className={`text-[#828282] text-[--7px] place-content-start flex gap-[--3px]`}
            >
              {formatTime(new Date(message.createdAt))}
              {message.isEdited && (
                <span className="text-[#828282] text-[--7px] font-bold">
                  Edited
                </span>
              )}
            </p>

            {message?.sender?._id == user?._id ? (
              message.received ? (
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-[--10px] h-[--10px] ${message.seen ? "text-[#2c80cf]" : "text-[#828282]"}`}
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M2.305,11.235a1,1,0,0,1,1.414.024l3.206,3.319L14.3,7.289A1,1,0,0,1,15.7,8.711l-8.091,8a1,1,0,0,1-.7.289H6.9a1,1,0,0,1-.708-.3L2.281,12.649A1,1,0,0,1,2.305,11.235ZM20.3,7.289l-7.372,7.289-.263-.273a1,1,0,1,0-1.438,1.39l.966,1a1,1,0,0,0,.708.3h.011a1,1,0,0,0,.7-.289l8.091-8A1,1,0,0,0,20.3,7.289Z"></path>
                  </g>
                </svg>
              ) : (
                msgSentCheckIconChatBox
              )
            ) : null}
          </div>
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[--20px] w-[--20px] bg-[--dark] rounded-full flex justify-center items-center opacity-0 
                                      ${message?.sender?._id == user?._id ? "-left-[--40px] " : "-right-[--40px]"}
                                      [.reply[data-group='reply']:hover_&]:opacity-100
                                      transition-opacity duration-100 cursor-pointer`}
            onClick={() => {
              setReplyMessage((prev) => ({
                ...prev,
                [currentChatBoxConversation._id]: message,
              }));
            }}
          >
            <span className="text-[--white] text-[--20px] font-bold">
              {replyIcon2ChatBox}
            </span>
          </div>
        </div>

        <MessageContextBackdrop
          isOpen={contextMenu.isOpen}
          onClose={handleClose}
        >
          <MessageContextMenu
            isOpen={contextMenu.isOpen}
            messageRect={contextMenu.messageRect}
            onClose={handleClose}
            onReply={() => {
              setReplyMessage((prev) => ({
                ...prev,
                [currentChatBoxConversation._id]: message,
              }));
              handleClose();
            }}
            onForward={() => {
              setMessageToForward(message);
              setForwardModalOpen(true);
              handleClose();
            }}
            onCopy={() => {
              if (message.text) {
                navigator.clipboard.writeText(message.text);
                toast.success("Copied to clipboard");
              }
              handleClose();
            }}
            onEdit={message?.sender?._id === user?._id ? handleEdit : undefined}
            onDelete={
              message?.sender?._id === user?._id ? handleDelete : undefined
            } // Add delete handler
            isOwnMessage={message?.sender?._id === user?._id}
          />
        </MessageContextBackdrop>
      </>
    );
  });

  const handleForward = (message: Message) => {
    setMessageToForward(message);
    setForwardModalOpen(true);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files = [];

    for (const item of items) {
      if (item.type.indexOf("image/") === 0) {
        // Handle image paste
        const file = item.getAsFile();
        if (file) {
          const pasteEvent = { target: { files: [file] } };
          handleFileUpload(pasteEvent, "img");
        }
      } else if (
        item.type.indexOf("application/") === 0 ||
        item.type.indexOf("text/") === 0
      ) {
        // Handle file paste
        const file = item.getAsFile();
        if (file) {
          const pasteEvent = { target: { files: [file] } };
          handleFileUpload(pasteEvent, "file");
        }
      }
    }
  };

  // Memoize fetch functions
  const fetchMessagesForChat = useCallback(async () => {
    // console.log(currentChatBoxConversation?._id);
    if (currentChatBoxConversation?._id) {
      const data = await fetchMessages(currentChatBoxConversation._id, handleSignOut);
      if (data.success) {
        setMessages(data?.messages);
      }
    }
  }, [currentChatBoxConversation?._id]);

  useEffect(() => {
    const updateScroll = () => {
      if (containerRef.current && ref.current) {
        const currentScrollHeight = containerRef.current.scrollHeight;

        // Run the effect only when scrollHeight increases
        if (currentScrollHeight > prevScrollHeight) {
          ref.current.scrollTo({
            bottom: `${currentScrollHeight + 2}px`, // Scroll to the bottom
            behavior: "smooth",
          });

          // Update the previous scroll height
          setPrevScrollHeight(currentScrollHeight);
        }
      }
    };

    // Initial run
    updateScroll();

    // Use a MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      // Explicitly call updateScroll on DOM changes
      updateScroll();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true, // Listen for child nodes added/removed
        subtree: true, // Watch all descendants
        characterData: true, // Listen for text content changes
      });
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect(); // Cleanup observer on unmount
      }
    };
  }, [prevScrollHeight, isLoaded]);

  const handleFileUpload = useCallback(
    async (e: any, type: string) => {
      const files = Array.from(e.target.files);
      console.log("================================================>");

      console.log("files");
      console.log(files);

      console.log("================================================>");
      //console.log(files);
      setTextMessage(message[currentChatBoxConversation._id]?.text);

      if (files.length === 0) return;

      const id = Date.now().toString() + Math.random();
      +conversation._id;

      const media = files.map((file, index) => ({
        id: uuidv4(),
        file_id: file.name + index,
        loading: true,
        preview: URL.createObjectURL(file),
        url: URL.createObjectURL(file),
        type,
        name: file.name,
        info: `${(file.size / 1024).toFixed(1)}KB`,
      }));

      console.log("media", media);

      // Add to queue with temporary URLs
      setInQueueAttachments((prev) => {
        return {
          ...prev,
          [currentChatBoxConversation._id]: prev?.hasOwnProperty(
            currentChatBoxConversation._id
          )
            ? prev[currentChatBoxConversation._id].concat(media)
            : media,
        };
      });

      setToBeSentAttachments((prev) => [
        ...prev,
        {
          id,
          ready: false,
          data: media,
        },
      ]);

      const getFileExtension = (filename: string) => {
        return `${filename?.split(".").pop()}`;
      };

      setWaitForMedia((prev) => [
        ...prev,
        {
          id,
          waiting: true,
        },
      ]);

      await Promise.all(
        files.map(async (file: File, index) => {
          const presignedURLData = await getPresignedURL();
          //console.log("Enter Here to get presigned URL from backend");
          //console.log(presignedURLData);
          if (presignedURLData) {
            const { presignedURL, mediaUrl } = presignedURLData;
            setInQueueAttachments((prev) => {
              return {
                ...prev,
                [currentChatBoxConversation._id]: prev[
                  currentChatBoxConversation._id
                ].map((attachment) =>
                  attachment.file_id === file.name + index
                    ? {
                        ...attachment,
                        url: mediaUrl,
                      }
                    : attachment
                ),
              };
            });

            setToBeSentAttachments((prev) => {
              return prev.map((toBeSentAttachment) => {
                if (toBeSentAttachment.id === id) {
                  return {
                    ...toBeSentAttachment,
                    data: toBeSentAttachment.data.map((attachment) =>
                      attachment.file_id === file.name + index
                        ? {
                            ...attachment,
                            loading: false,
                            url: mediaUrl,
                          }
                        : attachment
                    ),
                  };
                }
                return toBeSentAttachment;
              });
            });
            try {
              const res = await fetch(presignedURL, {
                method: "PUT",
                headers: {
                  "Content-Type":
                    type === "file"
                      ? mimeTypes.file[getFileExtension(file.name)] ||
                        "application/octet-stream"
                      : mimeTypes.img[getFileExtension(file.name)] ||
                        "image/jpeg",
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                  "Content-Disposition": "inline",
                },
                body: file,
              });
              // Update queue attachments
              setInQueueAttachments((prev) => {
                return {
                  ...prev,
                  [currentChatBoxConversation._id]: prev[
                    currentChatBoxConversation._id
                  ].map((attachment) =>
                    attachment.file_id === file.name + index
                      ? {
                          ...attachment,
                          loading: false,
                        }
                      : attachment
                  ),
                };
              });

              setToBeSentAttachments((prev) =>
                prev.map((toBeSentAttachment) => {
                  if (toBeSentAttachment.id === id) {
                    return {
                      ...toBeSentAttachment,
                      ready: true,
                      data: toBeSentAttachment.data.map((attachment) =>
                        attachment.id === file.name + index
                          ? {
                              ...attachment,
                              loading: false,
                              url: mediaUrl,
                            }
                          : attachment
                      ),
                    };
                  }
                  return toBeSentAttachment;
                })
              );
            } catch (error) {
              console.error("Error uploading file:", error);
              // Handle upload error - maybe remove the message or show error state
            }
          }
        })
      );

      setWaitForMedia((prev) => [
        ...prev.map((attachment) =>
          attachment.id === id ? { ...attachment, waiting: false } : attachment
        ),
      ]);
    },
    [currentChatBoxConversation?._id, getPresignedURL]
  );

  const handleVoiceMessage = async (audioBlob: Blob, duration: string) => {
    try {
      const _id = uuidv4();
      // Get presigned URL for audio upload
      AddMessage({
        _id,
        text: "",
        media: [
          {
            id: Date.now().toString(),
            loading: true,
            url: URL.createObjectURL(audioBlob),
            type: "audio",
            name: "Voice Message",
            info: duration,
          },
        ],
        sender: {
          _id: user._id,
          firstName: currentChatBoxConversation?.members?.find(
            (member: any) => member._id === user._id
          )?.firstName,
          lastName: currentChatBoxConversation?.members?.find(
            (member: any) => member._id === user._id
          )?.lastName,
          theme: user.theme || "#FF0000", // Default theme color
        },
        reply:
          currentChatBoxConversation?._id in replyMessage &&
          replyMessage[currentChatBoxConversation._id],
        createdAt: new Date().getTime(),
      });

      setReplyMessage((prev) => ({
        ...prev,
        [currentChatBoxConversation._id]: null,
      }));
      const presignedURLData = await getPresignedURL("audio");
      if (presignedURLData) {
        const { presignedURL, mediaUrl } = presignedURLData;

        // Upload audio blob
        const res = await fetch(presignedURL, {
          method: "PUT",
          headers: {
            "Content-Type": "audio/wav",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Content-Disposition": "inline",
          },
          body: audioBlob,
        });

        if (res.status === 200) {
          // Send message with audio
          sendMessage({
            _id,
            conversationId: currentChatBoxConversation?._id,
            text: "",
            media: [
              {
                id: Date.now().toString(),
                loading: false,
                url: mediaUrl,
                type: "audio",
                name: "Voice Message",
                info: duration,
              },
            ],
            reply: replyMessage[currentChatBoxConversation._id],
          });
        }
      }
    } catch (error) {
      console.error("Error uploading voice message:", error);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentChatBoxConversation, replyMessage]);

  const handleSendingMessage = useCallback(async () => {
    try {
      if (
        !message[currentChatBoxConversation?._id]?.trim() &&
        !inQueueAttachments[currentChatBoxConversation?._id]?.length
      )
        return;

      // Check if we're editing a message
      if (editingMessage[currentChatBoxConversation?._id]) {
        editMessage({
          messageId: editingMessage[currentChatBoxConversation?._id]._id,
          conversationId: currentChatBoxConversation?._id,
          newText: message[currentChatBoxConversation?._id],
          newMedia: inQueueAttachments[currentChatBoxConversation?._id] || [],
          lastMessage:
            message[currentChatBoxConversation?._id] ||
            inQueueAttachments[currentChatBoxConversation?._id]?.[0]?.type,
        });

        // Clear edit state
        setEditingMessage((prev) => ({
          ...prev,
          [currentChatBoxConversation._id]: null,
        }));
      } else {
        // Existing send message logic
        const _id = uuidv4();
        // console.log("_id", _id);
        if (!waitForMedia.some((attachment) => attachment.waiting)) {
          sendMessage({
            _id,
            conversationId: currentChatBoxConversation?._id,
            lastMessage:
              message[currentChatBoxConversation?._id] ||
              inQueueAttachments[currentChatBoxConversation?._id][0]?.type,
            text: message[currentChatBoxConversation?._id],
            reply:
              currentChatBoxConversation?._id in replyMessage &&
              replyMessage[currentChatBoxConversation._id],
            media:
              currentChatBoxConversation?._id in inQueueAttachments &&
              inQueueAttachments[currentChatBoxConversation?._id],
          });
        } else if (
          !inQueueAttachments[currentChatBoxConversation?._id].length
        ) {
          sendMessage({
            _id,
            conversationId: currentChatBoxConversation?._id,
            lastMessage: message[currentChatBoxConversation?._id],
            text: message[currentChatBoxConversation?._id],
            reply:
              currentChatBoxConversation?._id in replyMessage &&
              replyMessage[currentChatBoxConversation._id],
            media: [],
          });
        }
        AddMessage({
          _id,
          text: message[currentChatBoxConversation?._id],
          media:
            currentChatBoxConversation?._id in inQueueAttachments &&
            inQueueAttachments[currentChatBoxConversation?._id],
          sender: {
            _id: user._id,
            firstName: currentChatBoxConversation?.members?.find(
              (member: any) => member._id === user._id
            )?.firstName,
            lastName: currentChatBoxConversation?.members?.find(
              (member: any) => member._id === user?._id
            )?.lastName,
            theme: user.theme || "#FF0000", // Default theme color
          },
          reply:
            currentChatBoxConversation?._id in replyMessage &&
            replyMessage[currentChatBoxConversation._id],
          createdAt: new Date().getTime(),
        });
      }

      // Clear message and attachments
      setMessage((prev) => ({
        ...prev,
        [currentChatBoxConversation._id]: "",
      }));
      setReplyMessage((prev) => ({
        ...prev,
        [currentChatBoxConversation._id]: null,
      }));
      setInQueueAttachments((prev) => ({
        ...prev,
        [currentChatBoxConversation._id]: [],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Add proper error handling
    }
  }, [
    currentChatBoxConversation?._id,
    message,
    inQueueAttachments,
    editingMessage,
    waitForMedia,
    replyMessage,
    sendMessage,
    AddMessage,
    editMessage,
    handleDeleteMessage,
  ]);

  // Memoize helper functions
  const isSameDay = useCallback((date1: number, date2: number) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }, []);

  const formatMessageDate = useCallback(
    (timestamp: number) => {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (isSameDay(date.getTime(), today.getTime())) {
        return "Today";
      } else if (isSameDay(date.getTime(), yesterday.getTime())) {
        return "Yesterday";
      }
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    },
    [isSameDay]
  );

  useEffect(() => {
    if (isLoaded) {
      setMessagesUpdated(true);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setMessagesUpdated(true);
      }, 50);
    }
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isLoaded]);

  // Memoized scroll handler with null check
  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      requestAnimationFrame(() => {
        // Check if scrollHeight is a number before setting scrollTop
        const scrollHeight = ref.current?.scrollHeight;
        if (typeof scrollHeight === "number") {
          ref.current.scrollTop = scrollHeight;
        }
      });
    }
  }, []);

  // Optimize useEffect dependencies
  useLayoutEffect(() => {
    if (messagesUpdated && ref.current) {
      scrollToBottom();
      // setTimeout(scrollToBottom, 100);
      setMessagesUpdated(false);
    }
  }, [messagesUpdated, scrollToBottom]);

  useEffect(() => {
    setIsLoaded(false);
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (ref.current) {
      ref.current.scrollTop = ref.current?.scrollHeight || 0;
    }
  }, [currentChatBoxConversation]);

  useEffect(() => {
    try {
      if (
        authState.token &&
        isConnected &&
        !isReconnecting &&
        currentChatBoxConversation?._id
      ) {
        fetchMessagesForChat();
      }
    } catch (error) {
      console.log("error fetchMessagesForChat:", error);
    }
  }, [
    authState.token,
    isConnected,
    isReconnecting,
    currentChatBoxConversation,
  ]);

  function handleGoToMessage(messageId: string) {
    const messageElement = document.getElementById(messageId);

    if (messageElement) {
      // Apply the highlight
      messageElement.style.backgroundColor = "#2222222a";

      // Revert to normal after a delay
      setTimeout(() => {
        messageElement.style.backgroundColor = ""; // Reset to the original style
      }, 1000); // 2 seconds delay
    }
  }

  useEffect(() => {
    //console.log(messages);
    setIsLoaded(true);
    if (ref.current) {
      ref.current.scrollTop = ref.current?.scrollHeight || 0;
    }
  }, [messages]);

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData, event: MouseEvent) => {
      const emoji = emojiData.emoji;

      setMessage((prev) => ({
        ...prev,
        [currentChatBoxConversation?._id]:
          (prev[currentChatBoxConversation?._id] || "") + emoji,
      }));

      // Bring focus back to the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    },
    [currentChatBoxConversation?._id]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Preload the EmojiPicker component on mount
    import("emoji-picker-react");
  }, []);

  const throttledHandleUserTyping = useCallback(
    throttle(
      () => {
        handleUserTyping({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          theme: user.theme || "#FF0000",
        });
      },
      2000,
      { trailing: false }
    ), // 2 second throttle, don't call on trailing edge
    [user._id, handleUserTyping]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 h-[90%] overflow-y-auto" ref={ref}>
        {isLoaded ? (
          <div className="flex flex-col gap-8 p-3" ref={containerRef}>
            {messages?.map((message: Message, index: number) => (
              <div key={message._id || index} className="relative">
                {/* Add relative positioning here */}
                {/* Date separator with correct sticky positioning */}
                {(index === 0 ||
                  !isSameDay(
                    messages[index - 1].createdAt,
                    message.createdAt
                  )) && (
                  <div className="sticky top- z-10 flex items-center justify-center py-2">
                    <div className="bg-white/80 shadow-lg outline outline-1 outline-gray-200 rounded-full px-4 py-1 text-[--12px] text-gray-600">
                      {formatMessageDate(message.createdAt)}
                    </div>
                  </div>
                )}
                {conversation &&
                  currentChatBoxConversation &&
                  unreadRef?.current && (
                    <>
                      {message.createdAt >
                        (unreadRef.current[
                          conversation.indexOf(currentChatBoxConversation)
                        ] || 0) &&
                      messages[index - 1]?.createdAt <=
                        (unreadRef.current[
                          conversation.indexOf(currentChatBoxConversation)
                        ] || 0) &&
                      user?._id !== message.sender._id ? (
                        <div className="text-center text-[#FFFFFB] font-bold  text-[--16px] bg-[--dark] p-[--10px] my-[--10px]">
                          New Message
                        </div>
                      ) : null}
                    </>
                  )}
                {/* <div className="text-center text-[#828282] text-sm p-[--10px]">
                      1 New Message
                    </div> */}
                {message.isAnnouncement ? (
                  <div className="flex items-center justify-center py-1">
                    <div className="bg-white/80 shadow-lg outline outline-1 outline-gray-200 rounded-full px-4 py-1 text-[--10px] text-center text-gray-600">
                      {(() => {
                        const regex = /\(([\w\d]+),\s*([^)]+)\)/;
                        const match = message.text.match(regex);

                        if (match) {
                          const [fullMatch, id, name] = match;
                          const restOfMessage = message.text?.slice(
                            fullMatch.length
                          );

                          // If the ID matches current user's ID, replace with "You"
                          const displayName =
                            id === user?._id ? "You" : name?.trim();

                          return displayName + restOfMessage;
                        }

                        // Return original text if no match found
                        return message.text;
                      })()}
                    </div>
                  </div>
                ) : (
                  <div
                    data-group="reply"
                    className={`flex gap-[--8px] whitespace-pre-wrap reply  ${
                      message?.sender?._id == user?._id
                        ? "items-end flex-row-reverse"
                        : ""
                    }`}
                  >
                    {messages[index - 1]?.sender?._id !==
                    message?.sender?._id ? (
                      message?.sender?._id == user?._id ? (
                        <ProfileImageFrameChatBox reversed />
                      ) : (
                        <ProfileImageFrameChatBox />
                      )
                    ) : (
                      <div
                        className={`bg-transparent flex items-center justify-center ${styles.chat__chat__aside__menu__profile} shrink-0`}
                      ></div>
                    )}
                    <div
                      className={`flex flex-col flex-1 w-full
                       break-words ${
                         message?.sender?._id == user?._id ? "items-end" : ""
                       }`}
                      id={message?._id}
                    >
                      <>
                        <MessageBubble message={message}>
                          {message?.isForwarded ? (
                            <div className="flex gap-2 items-center text-[--10px] text-[#828282]">
                              ↪ Forwarded
                            </div>
                          ) : message?.reply?._id ? (
                            <div
                              className={`px-[--10px] py-[--7px] border-l-[--3px] w-full rounded-[--15px] flex flex-col gap-[--3px] bg-[#2222222a] cursor-pointer
                              ${message?.sender?._id == user?._id ? "self-end" : "self-start"}`}
                              style={{
                                borderColor:
                                  message.reply?.sender?.theme || "#FF0000",
                              }}
                              onClick={() => {
                                const messageId = message?.reply?._id;

                                if (messageId) {
                                  // Scroll to the message smoothly
                                  const messageElement =
                                    document.getElementById(messageId);
                                  if (messageElement) {
                                    messageElement.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                      inline: "center",
                                    });

                                    // Highlight the message after scrolling
                                    setTimeout(() => {
                                      handleGoToMessage(messageId); // This will apply the highlight
                                    }, 200); // Delay to ensure scroll has finished before highlighting
                                  }
                                }
                              }}
                            >
                              <div className="flex gap-2 items-center">
                                {replyIcon}
                                <p
                                  className="font-semibold text-[--9px]"
                                  style={{
                                    color:
                                      message.reply?.sender?.theme || "#FF0000",
                                  }}
                                >
                                  {message?.reply.sender.firstName +
                                    " " +
                                    message?.reply.sender.lastName}
                                </p>
                              </div>
                              <p className="flex w-full break-words element.style [word-break:break-word] text-[--10px]">
                                {message?.reply.text ? (
                                  message.reply.text
                                ) : message.reply?.media[0].type === "img" ? (
                                  <>{imageSVG} Image</>
                                ) : message.reply?.media[0].type === "file" ? (
                                  <>{fileSVG} File</>
                                ) : message.reply?.media[0].type === "audio" ? (
                                  <>{audioSVG} Voice Message</>
                                ) : null}
                              </p>
                            </div>
                          ) : null}

                          {message?.media?.length &&
                          message.media.some(
                            (file: any) => file.type === "file"
                          ) ? (
                            <div className="grid grid-cols-1 w-full gap-[--10px] ">
                              {message.media
                                .filter((file: any) => file.type === "file")
                                .map((file: any, index: number) => (
                                  <FileMessage
                                    file={file}
                                    key={index}
                                    length={
                                      message.media.filter(
                                        (file: any) => file.type === "file"
                                      ).length
                                    }
                                    index={index}
                                    isUser={message?.sender?._id == user?._id}
                                  />
                                ))}
                            </div>
                          ) : null}
                          {message?.media?.length &&
                          message.media.some(
                            (file: any) => file.type === "audio"
                          ) ? (
                            <div
                              className={`w-full ${
                                message?.sender?._id == user?._id
                                  ? "bg-[#CEEAE9] self-end"
                                  : "self-start"
                              }`}
                            >
                              {message.media
                                .filter((file: any) => file.type === "audio")
                                .map((file: any, index: number) => {
                                  return (
                                    <VoiceMessage
                                      key={index}
                                      url={file.url}
                                      isUser={message?.sender?._id == user?._id}
                                      calcDuration={file.info}
                                    />
                                  );
                                })}
                            </div>
                          ) : null}
                          {message.text ||
                          message?.media?.some(
                            (file: any) => file.type === "img"
                          ) ? (
                            <>
                              {currentChatBoxConversation?.type === "group" &&
                                message.sender._id !== user?._id && (
                                  <p
                                    className="font-semibold text-[--12px]"
                                    style={{
                                      color: message.sender.theme || "#2A2B2A",
                                    }}
                                  >
                                    {message.sender.firstName +
                                      " " +
                                      message.sender.lastName}
                                  </p>
                                )}
                              <p
                                className={`break-words text-[--12px] ${styles.chat__box__message__text}`}
                                ref={(el) => (messageRefs.current[index] = el)}
                              >
                                {message?.media?.length &&
                                message.media.some(
                                  (file: any) => file.type === "img"
                                ) ? (
                                  <div
                                    className={
                                      message.text ? "mb-[--10px]" : ""
                                    }
                                  >
                                    <MessageImageGrid
                                      containerRef={containerRef}
                                      images={message.media.filter(
                                        (file: any) => file.type === "img"
                                      )}
                                      loading={message.media.some(
                                        (file: any) => file.loading
                                      )}
                                    />
                                  </div>
                                ) : null}

                                {checkURL(message?.text, message?._id)}
                              </p>
                            </>
                          ) : null}
                        </MessageBubble>
                      </>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center pt-[--50px] h-full items-center">
            {/* Add a sspinner loading animation */}
            <div className="w-8 h-8 border-4 border-t-transparent border-[#DBDBD7] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="h-[--50px]">
        {/* ... existing message rendering code ... */}
        {currentChatBoxConversation &&
          isTyping &&
          isTyping[currentChatBoxConversation._id] && (
            <TypingIndicator
              firstName={
                isTyping[currentChatBoxConversation._id]?.user?.firstName
              }
              lastName={
                isTyping[currentChatBoxConversation._id]?.user?.lastName
              }
              theme={isTyping[currentChatBoxConversation._id]?.user?.theme}
            />
          )}
      </div>
      {currentChatBoxConversation?.type === "oneToOne" &&
        onlineUsers.find(
          (s: any) =>
            s._id ===
            currentChatBoxConversation?.members?.find(
              (member: any) => member._id !== user?._id
            )?._id
        )?.isBusy && (
          <div className="flex items-center gap-[--7px] px-[--14px] py-[--6px] bg-[#FEEDE0] border-t border-[#F36F24]">
            {alertIcon}
            <span className="text-[#F36F24] text-[--10px] font-medium">
              This user is currently busy and won't receive notifications
            </span>
          </div>
        )}

      {currentChatBoxConversation?._id &&
        replyMessage &&
        replyMessage[currentChatBoxConversation?._id] && (
          <div className="flex items-center justify-between gap-[--10px] px-[--14px] py-[--10px] border-t border-[var(--dark)]">
            <div className="flex flex-col gap-[--10px] justify-center w-full">
              <div className="flex gap-[--10px]">
                <span className="text-[#2A2B2A] text-[--16px] font-semibold">
                  Reply to:
                </span>
                <p
                  className="text-[#2A2B2A] font-semibold text-[--16px]"
                  style={{
                    color:
                      replyMessage[currentChatBoxConversation._id].sender
                        .theme || "#FF0000",
                  }}
                >
                  {replyMessage[currentChatBoxConversation._id].sender
                    .firstName?.split(" ")[0] +
                    " " +
                    replyMessage[currentChatBoxConversation?._id].sender
                      .lastName?.split(" ")[0]}
                </p>
              </div>
              <p className="flex gap-[--5px] items-center text-[#2A2B2A] text-[--14px]">
                {replyMessage[currentChatBoxConversation?._id].text ? (
                  replyMessage[currentChatBoxConversation?._id].text
                ) : replyMessage[currentChatBoxConversation?._id].media[0]
                    .type === "img" ? (
                  <>{imageSVG} Image</>
                ) : replyMessage[currentChatBoxConversation._id].media[0]
                    .type === "file" ? (
                  <>{fileSVG} File</>
                ) : replyMessage[currentChatBoxConversation._id].media[0]
                    .type === "audio" ? (
                  <>{audioSVG} Voice Message</>
                ) : null}
              </p>
            </div>
            <button
              onClick={() =>
                setReplyMessage((prev) => ({
                  ...prev,
                  [currentChatBoxConversation._id]: null,
                }))
              }
              className="flex items-center gap-[--5px] bg-[#DBDBD7] rounded-[12px] px-[--10px] py-[--5px]"
            >
              {xMarkIcon}
            </button>
          </div>
        )}

      {currentChatBoxConversation?._id &&
        editingMessage &&
        editingMessage[currentChatBoxConversation?._id] && (
          <div className="flex items-center justify-between gap-[--15px] px-[--18px] py-[--15px] border-t border-[var(--dark)]">
            <div className="flex flex-col gap-[--10px] justify-center w-full">
              <div className="flex gap-[--10px]">
                <span className="text-[#2A2B2A] text-[--16px] font-semibold">
                  Editing message:
                </span>
              </div>
              <p className="flex gap-[--5px] items-center text-[#2A2B2A] text-[--14px]">
                {editingMessage[currentChatBoxConversation?._id].text ? (
                  editingMessage[currentChatBoxConversation?._id].text
                ) : editingMessage[currentChatBoxConversation?._id].media[0]
                    ?.type === "img" ? (
                  <>{imageSVG} Image</>
                ) : editingMessage[currentChatBoxConversation._id].media[0]
                    ?.type === "file" ? (
                  <>{fileSVG} File</>
                ) : editingMessage[currentChatBoxConversation._id].media[0]
                    ?.type === "audio" ? (
                  <>{audioSVG} Voice Message</>
                ) : null}
              </p>
            </div>
            <button
              onClick={() => {
                setMessage((prev) => ({
                  ...prev,
                  [currentChatBoxConversation._id]: null,
                }));
                setEditingMessage((prev) => ({
                  ...prev,
                  [currentChatBoxConversation._id]: null,
                }));
              }}
              className="flex items-center gap-[--5px] bg-[#DBDBD7] rounded-[12px] px-[--10px] py-[--5px]"
            >
              {xMarkIcon}
            </button>
          </div>
        )}

      {currentChatBoxConversation?._id &&
        inQueueAttachments?.hasOwnProperty(currentChatBoxConversation._id) &&
        inQueueAttachments[currentChatBoxConversation._id]?.length > 0 && (
          <div className="flex items-center gap-[--25px] px-[--18px] py-[--15px] border-t border-[var(--dark)] overflow-x-auto">
            {inQueueAttachments[currentChatBoxConversation._id].map(
              (attachment, index) =>
                attachment.type === "img" ? (
                  <div
                    className="relative w-[--58px] h-[--58px] shrink-0 border-[--1px] border-[var(--dark)] rounded-[12px]"
                    key={attachment.id}
                  >
                    <div className="h-full w-full rounded-[12px] overflow-hidden">
                      <img
                        src={attachment.preview}
                        alt={attachment.type}
                        className={`w-full h-full object-cover rounded-[12px] ${
                          attachment.loading ? "blur-sm" : ""
                        }`}
                      />
                    </div>
                    {attachment.loading ? (
                      <div className="absolute -top-[--5px] -right-[--5px] flex items-center justify-center w-[--20px] h-[--20px] bg-[#DBDBD7] rounded-full border-[--2px] border-[var(--white)]">
                        <div className="w-[--10px] h-[--10px] border-2 border-[--dark] border-t-transparent border-b-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="absolute -top-[--5px] -right-[--5px] flex items-center justify-center w-[--20px] h-[--20px] bg-[#DBDBD7] rounded-full border-[--2px] border-[var(--white)]">
                        <button
                          onClick={() => {
                            setInQueueAttachments((prev) => {
                              return {
                                ...prev,
                                [currentChatBoxConversation._id]: prev[
                                  currentChatBoxConversation._id
                                ].filter((_, i) => i !== index),
                              };
                            });
                          }}
                        >
                          {xMarkIcon}
                        </button>
                      </div>
                    )}
                  </div>
                ) : attachment.type === "file" ? (
                  <FilePreview
                    file={attachment}
                    onRemove={() => {
                      setInQueueAttachments((prev) => {
                        return {
                          ...prev,
                          [currentChatBoxConversation._id]: prev[
                            currentChatBoxConversation._id
                          ].filter((_, i) => i !== index),
                        };
                      });
                    }}
                  />
                ) : null
            )}
          </div>
        )}

      <div className="flex items-center gap-[--20px] px-[--10px] pb-[--15px] pt-[--10px] border-t border-[var(--dark)]">
        <TextareaAutosize
          ref={textareaRef}
          className="flex-1 resize-none text-[--14px] border [border-color:var(--dark)] rounded-[12px] py-[--6px] px-[--10px] placeholder:[color:var(--dark)] bg-[#DBDBD73D]"
          placeholder="Type your reply here..."
          maxRows={5}
          onPaste={handlePaste}
          value={message[currentChatBoxConversation?._id]}
          dir={getTextDirection(
            message[currentChatBoxConversation?._id]?.split(" ")[0]
          )}
          onChange={(e) => {
            console.log(e.target.value);

            setMessage((prev) => ({
              ...prev,
              [currentChatBoxConversation._id]: e.target.value,
            }));
            throttledHandleUserTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault();
              setMessage((prev) => ({
                ...prev,
                [currentChatBoxConversation._id]:
                  prev[currentChatBoxConversation._id] + "\n",
              }));
            }
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendingMessage();
            }
          }}
        />

        <div className="relative flex items-center">
          {/* Emoji Picker Toggle Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="emoji-picker-toggle-button text-[--15px] hover:scale-125 transform transition-transform"
            ref={emojiButtonRef}
            onMouseEnter={handleMouseEnterEmojiPicker}
          >
            😊
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              className="absolute bottom-full mb-2 right-0"
              ref={emojiPickerRef}
            >
              <MemoizedEmojiPicker
                onEmojiClick={handleEmojiClick}
                lazyLoadEmojis={true}
                searchDisabled={true}
                skinTonesDisabled={true}
                previewConfig={{ showPreview: false }}
                width={250} // Reduced width
                height={300} // Reduced height
                emojiVersion="1.0"
                categories={[
                  "suggested",
                  "smileys_people",
                  "animals_nature",
                  "food_drink",
                  "travel_places",
                  "activities",
                  "objects",
                  "symbols",
                ]}
              />
            </div>
          )}
        </div>

        {/* // center the button */}
        <div
          className="relative flex items-center justify-center"
          ref={menuRef}
        >
          <span onClick={toggleMenu}>{attachmentIconChatBox}</span>
          <ExpandableCircleMenu
            isExpanded={isExpanded}
            handleFileUpload={handleFileUpload}
            setShowVoiceRecorder={setShowVoiceRecorder}
            setIsExpanded={setIsExpanded}
            // handleImageUpload={handleImageUpload}
            // handleAudioUpload={handleAudioUpload}
          />
        </div>
        <button
          onClick={() => {
            handleSendingMessage();
          }}
        >
          {sendIconChatBox}
        </button>
      </div>

      {showVoiceRecorder && (
        <VoiceRecorder
          onClose={() => setShowVoiceRecorder(false)}
          onSave={handleVoiceMessage}
        />
      )}
      {forwardModalOpen && (
        <ForwardModal
          isOpen={forwardModalOpen}
          onClose={() => {
            setForwardModalOpen(false);
            setMessageToForward(null);
          }}
          message={messageToForward}
          conversations={conversation}
          onForward={handleForwardMessage}
        />
      )}
    </div>
  );
}

export default memo(FloatingChatMessages);
