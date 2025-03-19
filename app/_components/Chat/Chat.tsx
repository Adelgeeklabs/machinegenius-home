// @ts-nocheck
"use client";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
  use,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import styles from "@/app/_components/Chat/Chat.module.css";
import { globalContext } from "@/app/_context/store";
import { useSocket } from "@/app/_context/SocketProvider";
import useChat from "@/app/_components/Chat/_hooks/useChat";
import ChatConversation from "@/app/_components/Chat/_components/ChatConversation/ChatConversation";
import ChatSearch from "@/app/_components/Chat/_components/ChatSearch/ChatSearch";
import {
  FilePreview,
  FileMessage,
} from "@/app/_components/Chat/_components/FilePreview/FilePreview";
import MessageImageGrid from "@/app/_components/Chat/_components/MessageImageGrid/MessageImageGrid";
import OptionsDropdown from "@/app/_components/OptionsDropdown/OptionsDropdown";
import VoiceRecorder from "@/app/_components/Chat/_components/VoiceRecorder/VoiceRecorder";
import VoiceMessage from "@/app/_components/Chat/_components/VoiceMessage/VoiceMessage";
import { v4 as uuidv4 } from "uuid";
import { TextareaAutosize } from "@mui/material";
// const TextareaAutosize = dynamic(
//   () => import("@mui/material/TextareaAutosize"),
//   {
//     ssr: false,
//   }
// );
import AutoLinkText from "react-autolink-text2";
import throttle from "lodash/throttle";
import { EmojiClickData } from "emoji-picker-react";
import { fetchMessages } from "@/app/_components/Chat/_helpers/chatUtils";
// import EmojiPicker from "emoji-picker-react";
const EmojiPicker = dynamic(
  () => import("emoji-picker-react").then((mod) => mod.default),
  {
    ssr: false,
    preload: true,
    loading: () => <EmojiPickerLoading />,
  }
);
export const MemoizedEmojiPicker = memo(EmojiPicker);
import {
  audioIcon,
  filesIcon,
  mediaIcon,
  msgSentCheckIcon,
  editPencilIcon,
  replyIcon,
  replyIcon2,
  alertIcon,
  xMarkIcon,
  attachmentIcon,
  sendIcon,
  ellipsisChatVerticalDotsIcon,
} from "@/app/_components/Chat/_helpers/chatIcons";
import {
  mimeTypes,
  formatTime,
  faceEmojis,
} from "@/app/_components/Chat/_helpers/chatUtils";
import toast from "react-hot-toast";
import useSessionStorage from "@/app/_hooks/useSessionStorage";
import Fuse from "fuse.js";
import CustomBtn from "../Button/CustomBtn";
import { PencilIcon } from "@heroicons/react/24/outline";
import { RefreshCw } from "lucide-react";
import AddGroupMembers, {
  Member,
} from "@/app/_components/Chat/_components/AddGroupMembers/AddGroupMembers";

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

export const ExpandableCircleMenu = ({
  isExpanded,
  handleFileUpload,
  setShowVoiceRecorder,
  setIsExpanded,
}: any) => {
  const menuItems = [
    {
      icon: audioIcon,
      label: "Audio",
      color: "#31B2E9B2",
      onClick: () => {
        setShowVoiceRecorder(true);
      },
    },

    {
      icon: mediaIcon,
      label: "Media",
      color: "#5FA85BB5",
      onClick: () => {},
    },
    {
      icon: filesIcon,
      label: "Files",
      color: "#E1C655B2",
      onClick: () => {},
    },
  ];

  return (
    <>
      <div
        className={`${isExpanded ? "visible" : "invisible"} absolute bottom-[--30px] flex flex-col-reverse items-center`}
      >
        {menuItems.map((item, index) => (
          <label
            key={index}
            className={`
              relative w-12 h-12 rounded-full
              text-white flex items-center justify-center transition-all duration-300 ease-in-out
              backdrop-blur-xl bg-opacity-90 cursor-pointer group
              ${isExpanded ? "mb-4 translate-y-0 opacity-100" : "mb-0 -translate-y-4 opacity-0"}
            `}
            style={{
              boxShadow: `0 0 0 2px white, 0 0 0 4px ${item.color}, 0 0 10px 2px ${item.color}`,
              transitionDelay: `${index * 50}ms`,
              backgroundColor: item.color,
            }}
            onClick={item?.onClick}
            htmlFor={item.label}
          >
            {item.icon}
            {index === 2 ? (
              <>
                <input
                  type="file"
                  id={item.label}
                  name="docpicker"
                  accept="application/*,text/*,.tsx,.jsx,.ts,.js,.py,.java,.cpp,.c,.cs,.rb,.php,.html,.css,.scss,.less,.json,.csv,.xlsx,.xml,.yaml,.yml,.md,.markdown,.sql,.sh,.bash,.zsh,.env,.ini,.conf,.toml,.lock"
                  multiple
                  onChange={(e) => {
                    handleFileUpload(e, "file");
                    e.target.value = null;
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer invisible"
                  onClick={() => {
                    setIsExpanded(false);
                  }}
                />
                <span className="absolute top-1/2 -translate-y-1/2 left-[--50px] group-hover:left-[--60px] px-[--5px] py-[--3px] text-nowrap border border-slate-500 rounded-[--1px] bg-slate-900 text-white text-[--10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  Upload Files
                </span>
              </>
            ) : index === 1 ? (
              <>
                <input
                  type="file"
                  id={item.label}
                  name="img"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleFileUpload(e, "img");
                    e.target.value = null;
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer invisible"
                  onClick={() => setIsExpanded(false)}
                />
                <span className="absolute top-1/2 -translate-y-1/2 left-[--50px] group-hover:left-[--60px] px-[--5px] py-[--3px] text-nowrap border border-slate-500 rounded-[--1px] bg-slate-900 text-white text-[--10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                  Upload Media
                </span>
              </>
            ) : index === 0 ? (
              <span className="absolute top-1/2 -translate-y-1/2 left-[--50px] group-hover:left-[--60px] px-[--5px] py-[--3px] text-nowrap border border-slate-500 rounded-[--1px] bg-slate-900 text-white text-[--10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                Record Audio
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </>
  );
};

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

interface ProfileImageFrameProps {
  reversed?: boolean;
  onlineUsers?: any;
  currentConversation?: any;
  user?: any;
}

// Memoize the ProfileImageFrame component
export const ProfileImageFrame = memo(
  ({
    reversed,
    onlineUsers,
    currentConversation,
    user,
  }: ProfileImageFrameProps) => {
    return reversed ? (
      <div
        className={`[background-color:var(--dark)] flex items-center justify-center ${styles.chat__chat__aside__menu__profile} group-hover:[background-color:var(--white)] shrink-0 relative`}
      >
        {/* <img src="/images/profile.png" alt="profile" /> */}
        {currentConversation?.type == "oneToOne" && (
          <div
            className={`w-3 h-3 rounded-full ${
              onlineUsers.find(
                (s: any) =>
                  s?._id ==
                  currentConversation?.members?.find(
                    (member: any) => member?._id !== user?._id
                  )?._id
              )?.isBusy
                ? "bg-red-500"
                : onlineUsers?.find(
                      (s: any) =>
                        s?._id ==
                        currentConversation?.members?.find(
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
        className={`[background-color:var(--dark)] flex items-center justify-center ${styles.chat__chat__aside__menu__profile_reversed} group-hover:[background-color:var(--white)] shrink-0 relative`}
      >
        {/* <img src="/images/profile.png" alt="profile" /> */}
        {currentConversation?.type == "oneToOne" && (
          <div
            className={`w-3 h-3 rounded-full ${
              onlineUsers?.find(
                (s: any) =>
                  s?._id ==
                  currentConversation?.members?.find(
                    (member: any) => member?._id !== user?._id
                  )?._id
              )?.isBusy
                ? "bg-red-500"
                : onlineUsers.find(
                      (s: any) =>
                        s?._id ==
                        currentConversation?.members?.find(
                          (member: any) => member?._id !== user?._id
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
interface ChatProps {
  children: React.ReactNode;
}

// interface Message {
//   _id: string;
//   text: string;
//   sender: {
//     _id: string;
//   };
// }

interface Message {
  _id?: string;
  text: string;
  media: [
    {
      url: string;
      type: string;
    },
  ];
  reply?: {
    text: string;
    media: [
      {
        url: string;
        type: string;
      },
    ];
    sender: {
      _id: string;
    };
  };
  createdAt?: number;
  sender: {
    _id: string;
  };
  seen?: boolean;
  received?: boolean;
  isEdited?: boolean;
  forwarded?: {
    from?: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    originalMessageId?: string;
  };
}

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
}

// First, add this interface above the MessageBubble component
interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onReply: () => void;
  onForward: () => void;
  onCopy: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwnMessage: boolean;
  content?: any;
}

// Update the MessageContextMenu component positioning and animation
export const MessageContextMenu = ({
  isOpen,
  messageRect,
  onClose,
  onReply,
  onForward,
  onCopy,
  onEdit,
  onDelete,
  isOwnMessage,
  content,
}: MessageContextMenuProps & { messageRect: DOMRect }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 flex flex-col items-center"
      style={{
        top: messageRect.top + messageRect.height + 8,
        left: messageRect.left + messageRect.width / 2 - 140,
      }}
    >
      {/* Quick Reactions Bar */}
      <div
        className={`bg-[#2A2A2A] rounded-full px-4 py-2 shadow-lg transform transition-all duration-200 ease-out absolute ${styles.reactionsBar}`}
        style={{
          top: -(messageRect.height + 65),
        }}
      >
        <div className="flex gap-4">
          <button className="hover:scale-125 transition-transform text-xl">
            👍
          </button>
          <button className="hover:scale-125 transition-transform text-xl">
            ❤️
          </button>
          <button className="hover:scale-125 transition-transform text-xl">
            😂
          </button>
          <button className="hover:scale-125 transition-transform text-xl">
            😮
          </button>
          <button className="hover:scale-125 transition-transform text-xl">
            😢
          </button>
          <button className="hover:scale-125 transition-transform text-xl">
            🙏
          </button>
          <button className="hover:scale-125 transition-transform text-xl">
            ➕
          </button>
        </div>
      </div>

      {/* Context Menu */}
      <div
        className={`bg-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden w-[280px] transform transition-all duration-200 ease-out ${styles.contextMenu}`}
      >
        <div className="text-white divide-y divide-gray-700">
          <button
            className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center gap-3"
            onClick={onReply}
          >
            <span className="text-xl">↩</span> Reply
          </button>
          <button
            className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center gap-3"
            onClick={onForward}
          >
            <span className="text-xl">↪</span> Forward
          </button>
          <button
            className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center gap-3"
            onClick={onCopy}
          >
            <span className="text-xl">📋</span> Copy
          </button>
          {isOwnMessage && (
            <>
              {content?.text && (
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center gap-3"
                  onClick={onEdit}
                >
                  <span className="text-xl">✏️</span> Edit
                </button>
              )}
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center gap-3 text-red-500"
                onClick={onDelete}
              >
                <span className="text-xl">🗑️</span> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Update the MessageContextBackdrop component
export const MessageContextBackdrop = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-40 backdrop-blur-[2px] bg-black/20 ${styles.backdropBlur}`}
      onClick={onClose}
    >
      {children}
    </div>
  );
};

// Add new interface for forward modal
interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message;
  conversations: Conversation[];
  onForward: (selectedConversations: string[]) => void;
}

// Create new ForwardModal component
export const ForwardModal = ({
  isOpen,
  onClose,
  message,
  conversations,
  onForward,
}: ForwardModalProps) => {
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(conversations);

  useEffect(() => {
    const handleSearch = (text: string) => {
      const fuse = new Fuse(conversations, {
        keys: ["firstName", "lastName", "groupName"],
        threshold: 0.5, // Default is 0.6
      });
      const result = fuse.search(text);
      // console.log(result);
      setSearchResult(result.map((r) => r.item));
    };

    if (searchQuery?.trim() === "") {
      setSearchResult(conversations);
      return;
    }

    handleSearch(searchQuery?.trim());
  }, [searchQuery]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] bg-white rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Forward Message</h3>

        {/* Message Preview */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          {message?.text && (
            <p className="text-sm mb-2 truncate">{message.text}</p>
          )}
          {message?.media?.length > 0 && (
            <div className="text-sm text-gray-500">
              {message.media.length} attachment(s)
            </div>
          )}
        </div>

        <div className="h-min flex items-center justify-between border my-[--10px] [border-color:var(--dark)] rounded-[--7px] text-sm placeholder:[color:var(--dark)] py-[--8px] px-[--15px]">
          <input
            type="text"
            placeholder="Search"
            className="outline-none grow"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${searchQuery ? "invisible" : ""} w-[--20px] h-[--20px] ml-[--5px]`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.246094 10.377C0.246094 4.92206 4.66815 0.5 10.123 0.5C15.5779 0.5 20 4.92206 20 10.377C20 15.8318 15.5779 20.2539 10.123 20.2539C4.66815 20.2539 0.246094 15.8318 0.246094 10.377ZM7.15996 9.88311C7.15996 8.51939 8.26549 7.41387 9.6292 7.41387C10.9929 7.41387 12.0984 8.51939 12.0984 9.88311C12.0984 11.2468 10.9929 12.3523 9.6292 12.3523C8.26549 12.3523 7.15996 11.2468 7.15996 9.88311ZM9.6292 5.43848C7.1745 5.43848 5.18457 7.42841 5.18457 9.88311C5.18457 12.3378 7.1745 14.3277 9.6292 14.3277C10.4989 14.3277 11.3103 14.0779 11.9954 13.6462L13.3754 15.0261C13.7611 15.4118 14.3865 15.4118 14.7722 15.0261C15.1579 14.6404 15.1579 14.015 14.7722 13.6293L13.3923 12.2493C13.824 11.5642 14.0738 10.7528 14.0738 9.88311C14.0738 7.42841 12.0839 5.43848 9.6292 5.43848Z"
              fill="#323232"
            />
          </svg>
        </div>

        {/* Conversation Selection */}
        <div className="max-h-[200px] overflow-y-auto mb-4">
          {searchResult.map((conv) => (
            <label
              key={conv?._id}
              className="flex items-center p-2 hover:bg-gray-100 rounded"
            >
              <input
                type="checkbox"
                checked={selectedConversations.includes(conv)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedConversations([...selectedConversations, conv]);
                  } else {
                    setSelectedConversations(
                      selectedConversations.filter(
                        (item) => item?._id !== conv?._id
                      )
                    );
                  }
                }}
                className="mr-3"
              />
              <span>
                {conv.type === "group"
                  ? conv?.groupName
                  : `${conv?.firstName} ${conv?.lastName}`}
              </span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <CustomBtn
            onClick={() => {
              onForward(selectedConversations);
              onClose();
            }}
            disabled={selectedConversations.length === 0}
            word="↪ Forward"
            paddingVal="py-2 px-4"
          ></CustomBtn>
        </div>
      </div>
    </div>
  );
};

// Message state components
const LoadingMessages = () => (
  <div className="flex justify-center items-center h-full">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-[#DBDBD7] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 text-[--16px]">Loading messages...</p>
    </div>
  </div>
);

const EmptyMessages = () => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="bg-gray-100 rounded-full p-6 mb-4">
      <svg
        className="w-16 h-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        ></path>
      </svg>
    </div>
    <h3 className="text-xl font-medium text-gray-900 mb-2">No messages yet</h3>
    <p className="text-gray-500 text-center">
      Start the conversation by sending a message below.
    </p>
  </div>
);

const ErrorMessages = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="bg-red-50 rounded-full p-6 mb-4">
      <svg
        className="w-16 h-16 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </div>
    <h3 className="text-xl font-medium text-gray-900 mb-2">
      Error loading messages
    </h3>
    <p className="text-gray-500 text-center mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[var(--dark)] text-white rounded-[--8px] hover:opacity-90 transition-opacity"
    >
      Try Again
    </button>
  </div>
);

const ConnectionError = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full p-4">
    <div className="bg-yellow-50 rounded-full p-6 mb-4">
      <svg
        className="w-16 h-16 text-yellow-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        ></path>
      </svg>
    </div>
    <h3 className="text-xl font-medium text-gray-900 mb-4">Connection lost</h3>

    <div className="flex flex-col item-center gap-[--10px]">
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-[var(--dark)] text-white rounded-[--8px] hover:opacity-90 transition-opacity inline-flex items-center justify-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reconnect without Refresh
      </button>

      <button
        onClick={() =>
          typeof window !== "undefined" && window.location.reload()
        }
        className="px-4 py-2 bg-[var(--dark)] text-white rounded-[--8px] hover:opacity-90 transition-opacity inline-flex items-center justify-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </button>
    </div>
  </div>
);

const EmojiPickerLoading = () => (
  <div class="w-[300px] h-[350px] border border-slate-200 rounded-lg flex justify-center items-center bg-slate-50">
    <div class="w-10 h-10 border-4 border-black/10 rounded-full border-l-blue-500 animate-spin"></div>
  </div>
);

const EmptyConversationState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-medium mb-3">No conversations yet</h2>

        <p className="text-gray-600 mb-6">
          Start a new conversation by searching for a contact in the sidebar.
        </p>

        <div className="flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-500 mr-2 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span className="text-gray-600">Search in the sidebar</span>
        </div>
      </div>
    </div>
  );
};

function Chat() {
  const { authState, handleSignOut } = useContext(globalContext);
  const {
    onlineUsers,
    setCurrentConversation,
    currentConversation,
    isReconnecting,
    isConnected,
    handleReconnect,
  } = useSocket();
  const [scrolled, setScrolled] = useState(false);
  const [message, setMessage] = useState<Map<string, Message>>(new Map());
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [replyMessage, setReplyMessage] = useState<Map<string, Message>>(
    new Map()
  );
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("decodedToken");
      return token ? JSON.parse(token) : "";
    } else {
      return authState?.decodedToken || "";
    }
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleMenu = () => setIsExpanded(!isExpanded);
  const [waitForMedia, setWaitForMedia] = useState<
    {
      id: string;
      waiting: boolean;
    }[]
  >([]);
  const [textMessage, setTextMessage] = useState("");
  const ref = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const unreadRef = useRef<any>([]);
  const initialRef = useRef(true);
  const [storedInqueueAttachments, setStoredInqueueAttachments] =
    useSessionStorage<Map<string, Attachment>>(
      "storedInqueueAttachments",
      null
    );

  const [isClient, setIsClient] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
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
    updateGroupName,
  } = useChat();

  // useEffect(() => {
  // console.log("replyMessage", replyMessage);
  // }, [replyMessage]);

  // =============== Start Emoji Picker ===============
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData, event: MouseEvent) => {
      const emoji = emojiData.emoji;

      setMessage((prev) => ({
        ...prev,
        [currentConversation?._id]:
          (prev[currentConversation?._id] || "") + emoji,
      }));

      // Bring focus back to the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    },
    [currentConversation?._id]
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

  useEffect(() => {
    async function fetchEmployees() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/all-groups`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 401) {
        handleSignOut();
      }
      // console.log(`
      //   ${JSON.stringify(response)}
      //   `);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setAllConversations(data.data);
      } else {
        console.log(data.message);
      }
    }

    try {
      fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleMouseEnterEmojiPicker = useCallback((e) => {
    const randomEmoji =
      faceEmojis[Math.floor(Math.random() * faceEmojis.length)];
    e.currentTarget.textContent = randomEmoji;
  }, []);
  // =============== End Emoji Picker ===============

  // =============== Start Chat Search ===============
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndexes, setHighlightedIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const messageRefs = useRef([]);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const containerRef = useRef(null);

  const getTextDirection = (text: string): "rtl" | "ltr" => {
    const arabicRegex = /[\u0600-\u06FF]/; // Arabic letters
    const latinRegex = /[a-zA-Z]/; // Latin letters
    if (arabicRegex.test(text)) return "rtl";
    if (latinRegex.test(text)) return "ltr";
    return "ltr"; // Default if no clear direction
  };

  const checkURL = (text: string, id: string) => {
    if (
      searchTerm?.trim() &&
      text?.toLowerCase()?.includes(searchTerm?.trim()?.toLowerCase())
    ) {
      const regex = new RegExp(`(${searchTerm})`, "gi");
      const parts = text?.split(regex);

      return parts.map((part, index) => {
        if (part?.toLowerCase() === searchTerm?.toLowerCase()) {
          return (
            <mark key={index} className="bg-yellow-200">
              {part}
            </mark>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      });
    }

    const parts = text?.split(/(\s+)/); // Split by spaces but keep the spaces

    return (
      <div
        id={id}
        className={
          getTextDirection(text) === "rtl" ? "text-right" : "text-left"
        }
        dir={getTextDirection(text)}
      >
        {parts?.map((part, index) => {
          // Check if part looks like a valid URL (with or without protocol)
          const urlPattern = /^(https?:\/\/|www\.)[^\s]+$/i;
          if (urlPattern.test(part)) {
            const url =
              part.startsWith("http://") || part.startsWith("https://")
                ? part
                : `http://${part}`; // Add 'http://' if missing
            return (
              <a href={url} target="_blank" key={index} id={id}>
                {part}
              </a>
            );
          }

          // Check if part looks like a domain name without the protocol
          const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
          if (domainPattern.test(part)) {
            const url = `http://${part}`; // Assume 'http://' for domain-like parts
            return (
              <a href={url} target="_blank" key={index} id={id}>
                {part}
              </a>
            );
          }

          // Check if part is an email address
          const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}\b/i;
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
        })}
      </div>
    );
  };

  // Function in question
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

  useEffect(() => {
    // Scroll to the current highlighted message
    if (currentIndex !== -1 && highlightedIndexes[currentIndex] !== undefined) {
      const messageElement =
        messageRefs.current[highlightedIndexes[currentIndex]];
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentIndex, highlightedIndexes]);

  const handleArrowClick = (direction) => {
    if (highlightedIndexes.length) {
      setCurrentIndex((prevIndex) => {
        if (direction === "up") {
          return prevIndex > 0 ? prevIndex - 1 : highlightedIndexes.length - 1;
        } else if (direction === "down") {
          return prevIndex < highlightedIndexes.length - 1 ? prevIndex + 1 : 0;
        }
        return prevIndex;
      });
    }
  };

  // =============== End Chat Search ===============

  useEffect(() => {
    // Update highlighted indexes when search term changes
    if (searchTerm?.trim()) {
      const indexes = messages
        .map((message: any) => message?.text)
        .map((msg, idx) => (msg?.includes(searchTerm) ? idx : -1))
        .filter((idx) => idx !== -1);
      setHighlightedIndexes(indexes);
      setCurrentIndex(indexes.length ? 0 : -1); // Start at the first match
    } else {
      setHighlightedIndexes([]);
      setCurrentIndex(-1);
    }
  }, [searchTerm, messages]);

  // useEffect(() => {
  //   console.log("message", messages);
  // }, [messages]);

  const AddMessage = (message: Message) => {
    if (message?.text?.trim() === "" && !message?.media?.length) return;

    setMessages((prev) => [...prev, message]);
    setInQueueAttachments((prev) => {
      return {
        ...prev,
        [currentConversation?._id]: [],
      };
    });
  };

  const [messagesUpdated, setMessagesUpdated] = useState(false);
  const scrollTimeoutRef = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    console.log("isExpanded", isExpanded);
  }, [isExpanded]);

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

  // Memoize scroll handler
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
  }, [currentConversation]);

  useEffect(() => {
    try {
      if (
        authState.token &&
        isConnected &&
        !isReconnecting &&
        currentConversation?._id
      ) {
        fetchMessagesForChat();
      }
    } catch (error) {
      console.log("error fetchMessagesForChat:", error);
    }
  }, [authState.token, isConnected, isReconnecting, currentConversation]);

  useEffect(() => {
    //console.log(messages);
    setIsLoaded(true);
    if (ref.current) {
      ref.current.scrollTop = ref.current?.scrollHeight || 0;
    }
  }, [messages]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current?.scrollHeight || 0;
    }

    setIsClient(true);
  }, []);

  useEffect(() => {
    if (searchBarFocus) {
      setSearchBarFocus(false);
    }
    if (conversation.length > 0 && initialRef.current) {
      if (!currentConversation) setCurrentConversation(conversation[0]);
      initialRef.current = false;
    }
  }, [conversation, currentConversation]);

  useEffect(() => {
    if (messages.length > 0 && isLoaded) {
      handleUserSeenMessage();
    }
  }, [handleUserSeenMessage, isLoaded]);

  const throttledHandleUserTyping = useCallback(
    throttle(
      () => {
        handleUserTyping({
          _id: user?._id,
          firstName: user.firstName,
          lastName: user.lastName,
          theme: user.theme || "#FF0000",
        });
      },
      2000,
      { trailing: false }
    ), // 2 second throttle, don't call on trailing edge
    [user?._id, handleUserTyping]
  );

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
        handleSignOut();
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
  const [presignedURLData, setPresignedURLData] = useState<any>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // In Chat component, add forward handling
  // In Chat component, add forward handling
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(
    null
  );

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

  const handleForwardMessage = async (selectedConversations: string[]) => {
    if (!messageToForward) return;

    // Emit forward event for each selected conversation
    selectedConversations.forEach(async (conversation) => {
      if (conversation.type === "group") {
        sendMessage({
          _id: uuidv4(),
          conversationId: conversation?._id,
          text: messageToForward.text,
          media: messageToForward.media,
          forward: true,
          lastMessage:
            messageToForward.text || messageToForward.media?.[0]?.type,
        });
      } else {
        const response = await createConversation("oneToOne", [
          user?._id,
          conversation.userId || conversation?._id,
        ]);
        sendMessage({
          _id: uuidv4(),
          conversationId: response.Success
            ? response.result?._id
            : response.data?._id,
          text: messageToForward.text,
          media: messageToForward.media,
          forward: true,
          lastMessage:
            messageToForward.text || messageToForward.media?.[0]?.type,
        });
      }
    });
  };
  interface Attachment {
    id: string;
    loading: boolean;
    url: string;
    type: string;
    name: string;
    info: string;
  }

  const [inQueueAttachments, setInQueueAttachments] = useState<Map>(new Map());
  const [toBeSentAttachments, setToBeSentAttachments] = useState<
    {
      id: string;
      data: Attachment[];
    }[]
  >([]);

  useEffect(() => {
    if (!isClient || !storedInqueueAttachments) return;
    setInQueueAttachments(storedInqueueAttachments);
  }, [isClient]);

  // Add to existing state declarations
  const [editingMessage, setEditingMessage] = useState<Map<string, Message>>(
    new Map()
  );
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
        inQueueAttachments[currentConversation?._id].some(
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
          conversationId: currentConversation?._id,
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

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  useEffect(() => {
    console.log("showVoiceRecorder", showVoiceRecorder);
  }, [showVoiceRecorder]);

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

  // Memoize fetch functions
  const fetchMessagesForChat = useCallback(async () => {
    if (currentConversation?._id) {
      setFetchingMessages(true);
      setMessageError(null);

      try {
        const data = await fetchMessages(currentConversation?._id, handleSignOut);
        if (data?.success) {
          setMessages(data?.messages);
        } else {
          setMessageError(data?.message || "Failed to load messages");
        }
      } catch (error) {
        setMessageError(error?.message || "Failed to load messages");
        console.error("Error fetching messages:", error);
      } finally {
        setFetchingMessages(false);
        setIsLoaded(true);
      }
    }
  }, [currentConversation?._id]);

  // Optimize file upload handling
  const handleFileUpload = useCallback(
    async (e: any, type: string) => {
      const files = Array.from(e.target.files);
      console.log("================================================>");

      console.log("files");
      console.log(files);

      console.log("================================================>");
      //console.log(files);
      setTextMessage(message[currentConversation?._id]?.text);

      if (files.length === 0) return;

      const id = Date.now().toString() + Math.random();
      +conversation?._id;

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
          [currentConversation?._id]: prev?.hasOwnProperty(
            currentConversation?._id
          )
            ? prev[currentConversation?._id].concat(media)
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
                [currentConversation?._id]: prev[currentConversation?._id].map(
                  (attachment) =>
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
                  [currentConversation?._id]: prev[
                    currentConversation?._id
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
    [currentConversation?._id, getPresignedURL]
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
          _id: user?._id,
          firstName: currentConversation?.members?.find(
            (member: any) => member?._id === user?._id
          )?.firstName,
          lastName: currentConversation?.members?.find(
            (member: any) => member?._id === user?._id
          )?.lastName,
          theme: user.theme || "#FF0000", // Default theme color
        },
        reply:
          currentConversation?._id in replyMessage &&
          replyMessage[currentConversation?._id],
        createdAt: new Date().getTime(),
      });

      setReplyMessage((prev) => ({
        ...prev,
        [currentConversation?._id]: null,
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
            conversationId: currentConversation?._id,
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
            reply: replyMessage[currentConversation?._id],
          });
        }
      }
    } catch (error) {
      console.error("Error uploading voice message:", error);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, [currentConversation, replyMessage]);

  const handleSendingMessage = useCallback(async () => {
    try {
      if (
        !message[currentConversation?._id]?.trim() &&
        !inQueueAttachments[currentConversation?._id]?.length
      )
        return;

      // Check if we're editing a message
      if (editingMessage[currentConversation?._id]) {
        editMessage({
          messageId: editingMessage[currentConversation?._id]?._id,
          conversationId: currentConversation?._id,
          newText: message[currentConversation?._id],
          newMedia: inQueueAttachments[currentConversation?._id] || [],
          lastMessage:
            message[currentConversation?._id] ||
            inQueueAttachments[currentConversation?._id]?.[0]?.type,
        });

        // Clear edit state
        setEditingMessage((prev) => ({
          ...prev,
          [currentConversation?._id]: null,
        }));
      } else {
        // Existing send message logic
        const _id = uuidv4();
        // console.log("_id", _id);
        if (!waitForMedia.some((attachment) => attachment.waiting)) {
          sendMessage({
            _id,
            conversationId: currentConversation?._id,
            lastMessage:
              message[currentConversation?._id] ||
              inQueueAttachments[currentConversation?._id][0]?.type,
            text: message[currentConversation?._id],
            reply:
              currentConversation?._id in replyMessage &&
              replyMessage[currentConversation?._id],
            media:
              currentConversation?._id in inQueueAttachments &&
              inQueueAttachments[currentConversation?._id],
          });
        } else if (!inQueueAttachments[currentConversation?._id].length) {
          sendMessage({
            _id,
            conversationId: currentConversation?._id,
            lastMessage: message[currentConversation?._id],
            text: message[currentConversation?._id],
            reply:
              currentConversation?._id in replyMessage &&
              replyMessage[currentConversation?._id],
            media: [],
          });
        }
        AddMessage({
          _id,
          text: message[currentConversation?._id],
          media:
            currentConversation?._id in inQueueAttachments &&
            inQueueAttachments[currentConversation?._id],
          sender: {
            _id: user?._id,
            firstName: currentConversation?.members?.find(
              (member: any) => member?._id === user?._id
            )?.firstName,
            lastName: currentConversation?.members?.find(
              (member: any) => member?._id === user?._id
            )?.lastName,
            theme: user.theme || "#FF0000", // Default theme color
          },
          reply:
            currentConversation?._id in replyMessage &&
            replyMessage[currentConversation?._id],
          createdAt: new Date().getTime(),
        });
      }

      // Clear message and attachments
      setMessage((prev) => ({
        ...prev,
        [currentConversation?._id]: "",
      }));
      setInQueueAttachments((prev) => ({
        ...prev,
        [currentConversation?._id]: [],
      }));
      setReplyMessage((prev) => ({
        ...prev,
        [currentConversation?._id]: null,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Add proper error handling
    }
  }, [
    currentConversation?._id,
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

  useEffect(() => {
    console.log(onlineUsers, "onlineUsers");
    console.log(currentConversation, "currentConversation");
  }, [onlineUsers, currentConversation]);

  const highlightText = (text) => {
    if (!searchTerm?.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(
      regex,
      (match) => `<mark class="bg-yellow-200">${match}</mark>`
    );
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

  // Memoize conversation filtering
  const filteredConversations = useMemo(() => {
    return allConversations.filter((conv) => {
      // Add your filtering logic here
      return true;
    });
  }, [allConversations]);

  // Optimize message grouping by date
  const messagesByDate = useMemo(() => {
    return messages.reduce((acc, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  }, [messages]);

  // Optimize scroll handling with debounce
  const handleScroll = useCallback(
    throttle(() => {
      if (ref.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current;
        setScrolled(scrollTop < scrollHeight - clientHeight - 100);
      }
    }, 100),
    []
  );
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
        [currentConversation?._id]: message,
      }));
      setMessage((prev) => ({
        ...prev,
        [currentConversation?._id]: message.text,
      }));
      if (message.media?.length) {
        setInQueueAttachments((prev) => ({
          ...prev,
          [currentConversation?._id]: message.media,
        }));
      }
      handleClose();
      // Focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    const handleDelete = () => {
      handleDeleteMessage(message?._id);
      handleClose(); // Close context menu
    };
    // Update MessageContextMenu to handle forward
    const handleForward = (message: Message) => {
      setMessageToForward(message);
      setForwardModalOpen(true);
    };

    return (
      <>
        <div
          ref={messageRef}
          onContextMenu={handleContextMenu}
          className={`p-[--15px] rounded-[20px] max-w-[550px] flex flex-col gap-[--10px] relative transition-transform duration-200 
            ${message?.sender?._id == user?._id ? "bg-[#CEEAE9] self-end" : "self-start bg-[--white]"}
            ${contextMenu.isOpen ? styles.messageHighlight : ""}
            ${styles.chat__box__message__container}`}
        >
          {children}
          <div className="flex gap-[--10px] items-center justify-between">
            <p
              className={`text-[#828282] text-[--10px] place-content-start flex gap-[--5px]`}
            >
              {formatTime(new Date(message.createdAt))}
              {message.isEdited && (
                <span className="text-[#828282] text-[--10px] font-bold">
                  Edited
                </span>
              )}
            </p>

            {message?.sender?._id == user?._id ? (
              message.received || message.seen ? (
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-[--15px] h-[--15px] ${message.seen ? "text-[#2c80cf]" : "text-[#828282]"}`}
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
                msgSentCheckIcon
              )
            ) : null}
          </div>
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[--40px] w-[--40px] bg-[--dark] rounded-full flex justify-center items-center opacity-0 
                                      ${message?.sender?._id == user?._id ? "-left-[--60px] " : "-right-[--60px]"}
                                      [.reply[data-group='reply']:hover_&]:opacity-100
                                      transition-opacity duration-100 cursor-pointer`}
            onClick={handleContextMenu}
          >
            <span className="text-[--white] text-[--20px] font-bold">
              {ellipsisChatVerticalDotsIcon}
            </span>
          </div>
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[--40px] w-[--40px] bg-[--dark] rounded-full flex justify-center items-center opacity-0 
                                      ${message?.sender?._id == user?._id ? "-left-[--111px] " : "-right-[--111px]"}
                                      [.reply[data-group='reply']:hover_&]:opacity-100
                                      transition-opacity duration-100 cursor-pointer`}
            onClick={() => {
              setReplyMessage((prev) => ({
                ...prev,
                [currentConversation?._id]: message,
              }));
            }}
          >
            <span className="text-[--white] text-[--20px] font-bold">
              {replyIcon2}
            </span>
          </div>
        </div>

        <MessageContextBackdrop
          isOpen={contextMenu.isOpen}
          onClose={handleClose}
        >
          <MessageContextMenu
            content={message}
            isOpen={contextMenu.isOpen}
            messageRect={contextMenu.messageRect}
            onClose={handleClose}
            onReply={() => {
              setReplyMessage((prev) => ({
                ...prev,
                [currentConversation?._id]: message,
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

  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // Add this new handler
  const handleGroupNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !currentConversation ||
      !currentConversation.admin ||
      currentConversation.admin !== user?._id
    )
      return;

    const trimmedName = newGroupName?.trim();
    if (!trimmedName) {
      toast.error("Group name cannot be empty");
      return;
    }

    try {
      await updateGroupName(currentConversation?._id, trimmedName);
      setCurrentConversation((prev) => {
        return {
          ...prev,
          groupName: trimmedName,
        };
      });
      setIsEditingGroupName(false);
      toast.success("Group name updated successfully");
    } catch (error) {
      console.error("Failed to update group name:", error);
      toast.error("Failed to update group name. Please try again.");
      // Reset to previous name
      setNewGroupName(currentConversation.groupName);
    }
  };

  // Add these state variables
  const [showAddMembers, setShowAddMembers] = useState(false);

  // Add this handler
  const handleAddMembers = async (newMembers: Member[]) => {
    try {
      console.log(newMembers);
      const updatedConversation = {
        ...currentConversation,
        members: [...currentConversation.members, ...newMembers],
      };
      setCurrentConversation(updatedConversation);

      // Update the conversations list
      setConversation((prev) =>
        prev.map((conv) =>
          conv?._id === currentConversation?._id ? updatedConversation : conv
        )
      );
    } catch (error) {
      console.error("Error updating group members:", error);
      toast.error("Failed to update group members");
    }
  };

  return (
    <>
      {/* {Object.values(inQueueAttachments).some(
        (attachment) => attachment.length
      ) && <BeforeReloading inQueueAttachments={inQueueAttachments} />} */}
      <div className="flex gap-[--22px] h-[90vh] py-[1.5vw]">
        <ChatConversation
          conversation={conversation}
          setConversation={setConversation}
          setCurrentConversation={setCurrentConversation}
          currentConversation={currentConversation}
          user={user}
          unreadRef={unreadRef}
          searchBarFocus={searchBarFocus}
          setSearchBarFocus={setSearchBarFocus}
        />

        {/*
          chat main section / chat Box
        */}
        <div className={`flex flex-col h-full ${styles.chat__box__container}`}>
          {!currentConversation ? (
            <EmptyConversationState />
          ) : (
            <>
              <div
                className={`flex justify-between items-center ${styles.chat__box__header}`}
              >
                <div className="flex w-full items-center gap-5 relative">
                  <ProfileImageFrame
                    currentConversation={currentConversation}
                    onlineUsers={onlineUsers}
                    user={user}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-[--8px]">
                      {currentConversation ? (
                        currentConversation?.type === "group" ? (
                          isEditingGroupName &&
                          currentConversation.admin === user?._id ? (
                            <form
                              onSubmit={handleGroupNameUpdate}
                              className="flex gap-2 w-fit items-center"
                            >
                              <input
                                type="text"
                                value={newGroupName}
                                onChange={(e) =>
                                  setNewGroupName(e.target.value)
                                }
                                className={styles.groupNameInput}
                                autoFocus
                                onBlur={(e) => {
                                  // Check if the related target is the submit button
                                  if (
                                    !e.relatedTarget?.classList.contains(
                                      "update-group-name-btn"
                                    )
                                  ) {
                                    setIsEditingGroupName(false);
                                  }
                                }}
                                placeholder={currentConversation.groupName}
                                minLength={1}
                                maxLength={50}
                                required
                              />
                              <button
                                className={`update-group-name-btn border-1 text-[--10px] font-semibold text-[--white] border-[#DBDBD7] rounded-[--7px] bg-[#2aab19f6] px-[--10px] py-[--5px] ${
                                  isEditingGroupName
                                    ? "opacity-100 visible transition-all duration-300 ease-in-out translate-x-0"
                                    : "opacity-0 invisible transition-all duration-300 ease-in-out -translate-x-[--40px]"
                                }`}
                                type="submit"
                              >
                                Update
                              </button>
                            </form>
                          ) : (
                            <div className="flex items-center gap-[--50px]">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[--20px]">
                                  {currentConversation.groupName}
                                </h3>
                                {currentConversation.admin === user?._id && (
                                  <button
                                    onClick={() => {
                                      setNewGroupName(
                                        currentConversation.groupName
                                      );
                                      setIsEditingGroupName(true);
                                    }}
                                    className={styles.editButton}
                                    title="Edit group name"
                                  >
                                    {editPencilIcon}
                                  </button>
                                )}
                              </div>

                              {currentConversation?.type === "group" &&
                                currentConversation.admin === user?._id && (
                                  <button
                                    onClick={() => setShowAddMembers(true)}
                                    className="text-gray-600 hover:text-gray-800"
                                  >
                                    + Add Members
                                  </button>
                                )}
                            </div>
                          )
                        ) : (
                          <h3 className="font-bold text-[--20px]">
                            {currentConversation?.members[
                              user?._id === currentConversation?.members[0]?._id
                                ? 1
                                : 0
                            ]?.firstName?.split(" ")[0] +
                              " " +
                              currentConversation?.members[
                                user?._id ===
                                currentConversation?.members[0]?._id
                                  ? 1
                                  : 0
                              ]?.lastName?.split(" ")[0]}
                          </h3>
                        )
                      ) : (
                        <div className="animate-pulse bg-[#DBDBD7] w-[--111px] h-[--30px] rounded-[--10px]"></div>
                      )}
                    </div>

                    {currentConversation?.type == "oneToOne" && (
                      <p
                        className={`w-3 h-3 rounded-full text-[--12px] ${
                          onlineUsers.find(
                            (s: any) =>
                              s?._id ==
                              currentConversation?.members?.find(
                                (member: any) => member?._id !== user?._id
                              )?._id
                          )?.isBusy
                            ? "text-red-500"
                            : onlineUsers.find(
                                  (s: any) =>
                                    s?._id ==
                                    currentConversation?.members?.find(
                                      (member: any) => member?._id !== user?._id
                                    )?._id
                                )?.isBusy === false
                              ? "text-green-500"
                              : "text-gray-500"
                        }  `}
                      >
                        {onlineUsers.find(
                          (s: any) =>
                            s?._id ==
                            currentConversation?.members?.find(
                              (member: any) => member?._id !== user?._id
                            )?._id
                        )?.isBusy
                          ? "Busy"
                          : onlineUsers.find(
                                (s: any) =>
                                  s?._id ==
                                  currentConversation?.members?.find(
                                    (member: any) => member?._id !== user?._id
                                  )?._id
                              )?.isBusy === false
                            ? "Online"
                            : "Offline"}
                      </p>
                    )}
                    <p className="text-[--14px] [color:#828282] overflow-hidden w-[--800px] whitespace-nowrap text-ellipsis min-w-0 truncate">
                      {currentConversation?.type === "group"
                        ? currentConversation?.members
                            ?.map(
                              (member: any) =>
                                member?.firstName + " " + member?.lastName
                            )
                            ?.join(", ")
                        : null}
                    </p>
                  </div>
                </div>
                {/* <OptionsDropdown
              icon={files}
              options={["Send To Sales Team", "Escalate To Manager"]}
              openIndecator
            /> */}
                <ChatSearch
                  setSearchTerm={setSearchTerm}
                  handleArrowClick={handleArrowClick}
                  searchTerm={searchTerm}
                  currentIndex={currentIndex}
                  highlightedIndexes={highlightedIndexes}
                />
              </div>
              
              <div
                className="flex-1 overflow-y-auto"
                ref={ref}
              >
                {fetchingMessages ? (
                  <LoadingMessages />
                ) : messageError ? (
                  <ErrorMessages
                    message={messageError}
                    onRetry={() => fetchMessagesForChat()}
                  />
                ) : !isConnected ? (
                  <ConnectionError onRetry={() => handleReconnect()} />
                ) : isLoaded && messages.length === 0 ? (
                  <EmptyMessages />
                ) : isLoaded ? (
                  <div className="flex flex-col gap-8 p-5" ref={containerRef}>
                    {messages?.map((message: Message, index: number) => (
                      <div key={message?._id || index} className="relative">
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
                          currentConversation &&
                          unreadRef?.current && (
                            <>
                              {message.createdAt >
                                (unreadRef.current[
                                  conversation.indexOf(currentConversation)
                                ] || 0) &&
                              messages[index - 1]?.createdAt <=
                                (unreadRef.current[
                                  conversation.indexOf(currentConversation)
                                ] || 0) &&
                              user?._id !== message.sender?._id ? (
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
                            <div className="bg-white/80 shadow-lg outline outline-1 outline-gray-200 rounded-full px-4 py-1 text-[--12px] text-gray-600">
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
                            className={`flex gap-5 whitespace-pre-wrap reply  ${
                              message?.sender?._id == user?._id
                                ? "items-end flex-row-reverse"
                                : ""
                            }`}
                          >
                            {messages[index - 1]?.sender?._id !==
                            message?.sender?._id ? (
                              message?.sender?._id == user?._id ? (
                                <ProfileImageFrame reversed />
                              ) : (
                                <ProfileImageFrame />
                              )
                            ) : (
                              <div
                                className={`bg-transparent flex items-center justify-center ${styles.chat__chat__aside__menu__profile} shrink-0`}
                              ></div>
                            )}
                            <div
                              className={`flex flex-col flex-1 w-fit break-words rounded-[--20px] ${
                                message?.sender?._id == user?._id
                                  ? "items-end"
                                  : ""
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
                                      className={`p-[--10px] border-l-[--5px] w-full rounded-[--15px] flex flex-col gap-[--5px] bg-[#2222222a] cursor-pointer
                              ${message?.sender?._id == user?._id ? "self-end" : "self-start"}`}
                                      style={{
                                        borderColor:
                                          message.reply?.sender?.theme ||
                                          "#FF0000",
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
                                            }, 200);
                                          }
                                        }
                                      }}
                                    >
                                      <div className="flex gap-2 items-center">
                                        {replyIcon}
                                        <p
                                          className="font-semibold text-[--12px]"
                                          style={{
                                            color:
                                              message.reply?.sender?.theme ||
                                              "#FF0000",
                                          }}
                                        >
                                          {message?.reply.sender.firstName +
                                            " " +
                                            message?.reply.sender.lastName}
                                        </p>
                                      </div>
                                      <p className="break-words text-[--14px] truncate">
                                        {message?.reply.text ? (
                                          message.reply.text
                                        ) : message.reply?.media[0].type ===
                                          "img" ? (
                                          <>{imageSVG} Image</>
                                        ) : message.reply?.media[0].type ===
                                          "file" ? (
                                          <>{fileSVG} File</>
                                        ) : message.reply?.media[0].type ===
                                          "audio" ? (
                                          <>{audioSVG} Voice Message</>
                                        ) : null}
                                      </p>
                                    </div>
                                  ) : null}

                                  {message?.media?.length &&
                                  message.media.some(
                                    (file: any) => file.type === "file"
                                  ) ? (
                                    <div className="grid grid-cols-1 w-fit gap-[--10px] ">
                                      {message.media
                                        .filter(
                                          (file: any) => file.type === "file"
                                        )
                                        .map((file: any, index: number) => (
                                          <FileMessage
                                            file={file}
                                            key={index}
                                            length={
                                              message.media.filter(
                                                (file: any) =>
                                                  file.type === "file"
                                              ).length
                                            }
                                            index={index}
                                            isUser={
                                              message?.sender?._id == user?._id
                                            }
                                          />
                                        ))}
                                    </div>
                                  ) : null}
                                  {message?.media?.length &&
                                  message.media.some(
                                    (file: any) => file.type === "audio"
                                  ) ? (
                                    <div
                                      className={`${
                                        message?.sender?._id == user?._id
                                          ? "bg-[#CEEAE9] self-end"
                                          : "self-start"
                                      }`}
                                    >
                                      {message.media
                                        .filter(
                                          (file: any) => file.type === "audio"
                                        )
                                        .map((file: any, index: number) => {
                                          return (
                                            <VoiceMessage
                                              key={index}
                                              url={file.url}
                                              isUser={
                                                message?.sender?._id ==
                                                user?._id
                                              }
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
                                      {currentConversation?.type === "group" &&
                                        message.sender?._id !== user?._id && (
                                          <p
                                            className="font-semibold text-[--16px]"
                                            style={{
                                              color:
                                                message.sender.theme ||
                                                "#2A2B2A",
                                            }}
                                          >
                                            {message.sender.firstName?.split(
                                              " "
                                            )[0] +
                                              " " +
                                              message.sender.lastName?.split(
                                                " "
                                              )[0]}
                                          </p>
                                        )}
                                      <p
                                        className={`break-words ${styles.chat__box__message__text}`}
                                        ref={(el) =>
                                          (messageRefs.current[index] = el)
                                        }
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
                                              // searchText={searchTerm}
                                              // containerRef={containerRef}
                                              images={message.media.filter(
                                                (file: any) =>
                                                  file.type === "img"
                                              )}
                                              // loading={message.media.some(
                                              //   (file: any) => file.loading
                                              // )}
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
                  <div className="flex justify-center pt-[--111px] items-center">
                    {/* Add a spinner loading animation */}
                    <div className="w-10 h-10 border-4 border-t-transparent border-[#DBDBD7] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="h-[--50px]">
                {/* ... existing message rendering code ... */}
                {isTyping && isTyping[currentConversation?._id] && (
                  <TypingIndicator
                    firstName={
                      isTyping[currentConversation?._id]?.user?.firstName
                    }
                    lastName={
                      isTyping[currentConversation?._id]?.user?.lastName
                    }
                    theme={isTyping[currentConversation?._id]?.user?.theme}
                  />
                )}
              </div>
              {currentConversation?.type === "oneToOne" &&
                onlineUsers.find(
                  (s: any) =>
                    s?._id ===
                    currentConversation?.members?.find(
                      (member: any) => member?._id !== user?._id
                    )?._id
                )?.isBusy && (
                  <div className="flex items-center gap-[--10px] px-[--18px] py-[--10px] bg-[#FEEDE0] border-t border-[#F36F24]">
                    {alertIcon}
                    <span className="text-[#F36F24] text-[--14px] font-medium">
                      This user is currently busy and won't receive
                      notifications
                    </span>
                  </div>
                )}
              {currentConversation?._id &&
                replyMessage &&
                replyMessage[currentConversation?._id] && (
                  <div className="flex items-center justify-between gap-[--15px] px-[--18px] py-[--15px] border-t border-[var(--dark)]">
                    <div className="flex flex-col gap-[--10px] justify-center w-full max-w-[90%] ">
                      <div className="flex gap-[--10px]">
                        <span className="text-[#2A2B2A] text-[--16px] font-semibold">
                          Reply to:
                        </span>
                        <p
                          className="text-[#2A2B2A] font-semibold text-[--16px]"
                          style={{
                            color:
                              replyMessage[currentConversation?._id].sender
                                .theme || "#FF0000",
                          }}
                        >
                          {replyMessage[
                            currentConversation?._id
                          ].sender.firstName?.split(" ")[0] +
                            " " +
                            replyMessage[
                              currentConversation?._id
                            ].sender.lastName?.split(" ")[0]}
                        </p>
                      </div>
                      <p className="text-[#2A2B2A] text-[--14px] truncate">
                        {replyMessage[currentConversation?._id].text ? (
                          replyMessage[currentConversation?._id].text
                        ) : replyMessage[currentConversation?._id].media[0]
                            .type === "img" ? (
                          <>{imageSVG} Image</>
                        ) : replyMessage[currentConversation?._id].media[0]
                            .type === "file" ? (
                          <>{fileSVG} File</>
                        ) : replyMessage[currentConversation?._id].media[0]
                            .type === "audio" ? (
                          <>{audioSVG} Voice Message</>
                        ) : null}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setReplyMessage((prev) => ({
                          ...prev,
                          [currentConversation?._id]: null,
                        }))
                      }
                      className="flex items-center gap-[--5px] bg-[#DBDBD7] rounded-[12px] px-[--10px] py-[--5px]"
                    >
                      {xMarkIcon}
                    </button>
                  </div>
                )}
              {currentConversation?._id &&
                editingMessage &&
                editingMessage[currentConversation?._id] && (
                  <div className="flex items-center justify-between gap-[--15px] px-[--18px] py-[--15px] border-t border-[var(--dark)]">
                    <div className="flex flex-col gap-[--10px] justify-center w-full">
                      <div className="flex gap-[--10px]">
                        <span className="text-[#2A2B2A] text-[--16px] font-semibold">
                          Editing message:
                        </span>
                      </div>
                      <p className="flex gap-[--5px] items-center text-[#2A2B2A] text-[--14px]">
                        {editingMessage[currentConversation?._id].text ? (
                          editingMessage[currentConversation?._id].text
                        ) : editingMessage[currentConversation?._id].media[0]
                            ?.type === "img" ? (
                          <>{imageSVG} Image</>
                        ) : editingMessage[currentConversation?._id].media[0]
                            ?.type === "file" ? (
                          <>{fileSVG} File</>
                        ) : editingMessage[currentConversation?._id].media[0]
                            ?.type === "audio" ? (
                          <>{audioSVG} Voice Message</>
                        ) : null}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setMessage((prev) => ({
                          ...prev,
                          [currentConversation?._id]: null,
                        }));
                        setEditingMessage((prev) => ({
                          ...prev,
                          [currentConversation?._id]: null,
                        }));
                      }}
                      className="flex items-center gap-[--5px] bg-[#DBDBD7] rounded-[12px] px-[--10px] py-[--5px]"
                    >
                      {xMarkIcon}
                    </button>
                  </div>
                )}
              {currentConversation?._id &&
                inQueueAttachments?.hasOwnProperty(currentConversation?._id) &&
                inQueueAttachments[currentConversation?._id]?.length > 0 && (
                  <div className="flex items-center gap-[--25px] px-[--18px] py-[--15px] border-t border-[var(--dark)] overflow-x-auto">
                    {inQueueAttachments[currentConversation?._id].map(
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
                                        [currentConversation?._id]: prev[
                                          currentConversation?._id
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
                                  [currentConversation?._id]: prev[
                                    currentConversation?._id
                                  ].filter((_, i) => i !== index),
                                };
                              });
                            }}
                          />
                        ) : null
                    )}
                  </div>
                )}
              <div className="flex items-center gap-[--38px] px-[--18px] py-[--21px] border-t border-[var(--dark)]">
                {/* <textarea
              placeholder="Type a message"
              className="flex-1 resize-none border md:max-w-[90%] lg:max-w-[85%] text-3xl:max-w-[80%] [border-color:var(--dark)] rounded-[12px] py-2 px-4 placeholder:[color:var(--dark)] bg-[#DBDBD73D]"
              rows={1}
            /> */}

                <TextareaAutosize
                  ref={textareaRef}
                  className="flex-1 resize-none border [border-color:var(--dark)] rounded-[12px] py-2 px-4 placeholder:[color:var(--dark)] bg-[#DBDBD73D]"
                  placeholder="Type your reply here..."
                  maxRows={5}
                  onPaste={handlePaste}
                  value={message[currentConversation?._id]}
                  dir={getTextDirection(
                    message[currentConversation?._id]?.split(" ")[0]
                  )}
                  onChange={(e) => {
                    console.log(e.target.value);

                    setMessage((prev) => ({
                      ...prev,
                      [currentConversation?._id]: e.target.value,
                    }));
                    throttledHandleUserTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.shiftKey) {
                      e.preventDefault();
                      setMessage((prev) => ({
                        ...prev,
                        [currentConversation?._id]:
                          prev[currentConversation?._id] + "\n",
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
                    className="emoji-picker-toggle-button text-[--20px] hover:scale-125 transform transition-transform"
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
                        width={300} // Reduced width
                        height={350} // Reduced height
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
                  <span onClick={toggleMenu}>{attachmentIcon}</span>
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
                  {sendIcon}
                </button>
              </div>
            </>
          )}
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
            conversations={allConversations}
            onForward={handleForwardMessage}
          />
        )}
      </div>
      {currentConversation?.type === "group" ? (
        <AddGroupMembers
          isOpen={showAddMembers}
          onClose={() => setShowAddMembers(false)}
          currentGroupId={currentConversation?._id}
          currentMembers={currentConversation?.members || []}
          onAddMembers={handleAddMembers}
        />
      ) : null}
    </>
  );
}

export default memo(Chat);
