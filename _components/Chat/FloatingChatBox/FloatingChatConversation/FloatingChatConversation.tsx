// @ts-nocheck
"use client";
import React, {
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
  useCallback,
} from "react";
import styles from "@/app/_components/Chat/Chat.module.css";
import { truncateText } from "@/app/_utils/text";
import CustomCheckBox from "@/app/_components/CustomCheckBox/CustomCheckBox";
import { ProfileImageFrame } from "../../Chat";
import Fuse from "fuse.js";
import { useSocket } from "@/app/_context/SocketProvider";
import { toast } from "react-hot-toast";
import { msgSentCheckIcon } from "../../_helpers/chatIcons";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  groupName: string;
  type: string;
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

interface FloatingChatConversationProps {
  currentChatBoxConversation: Conversation;
  conversation: Conversation[];
  setConversation: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentChatBoxConversation: (conversation: Conversation) => void;
  user: any;
  unreadRef: React.RefObject<any[]>;
  handleConversationChange: (conversation: Conversation) => void;
}

function FloatingChatConversation({
  currentChatBoxConversation,
  conversation,
  setConversation,
  setCurrentChatBoxConversation,
  user,
  unreadRef,
  handleConversationChange,
}: FloatingChatConversationProps) {
  const { onlineUsers, allUnreadMessages } = useSocket();

  const sortedConversations = useMemo(() => {
    const onlineUsersIds = onlineUsers.map((user: any) => user._id);
    if (!Array.isArray(onlineUsersIds)) return;
    else
      return [...conversation].sort((a, b) => {
        // Find the other user's ID in each conversation
        const otherUserA = a.members.find(
          (member) => member._id !== user._id
        )?._id;
        const otherUserB = b.members.find(
          (member) => member._id !== user._id
        )?._id;

        const aIsOnline = otherUserA && onlineUsersIds?.includes(otherUserA);
        const bIsOnline = otherUserB && onlineUsersIds?.includes(otherUserB);

        // console.log(
        //   `Comparing: User A (${otherUserA}): ${aIsOnline}, User B (${otherUserB}): ${bIsOnline}`
        // );

        if (aIsOnline && !bIsOnline) return -1;
        if (!aIsOnline && bIsOnline) return 1;
        return 0;
      });
  }, [conversation, onlineUsers, user._id]);

  // console.log("After sort - Sorted conversations:", sortedConversations);

  return (
    <>
      <ul
        className="flex flex-col relative overflow-y-auto w-full"
        id="chat-list"
      >
        {sortedConversations?.map((conversation: any, index) => (
          <li
            className={`cursor-pointer ${styles.chat__chat__aside__menu__item} group transition-colors duration-300 ease-in-out hover:[background-color:var(--dark)]`}
            key={index}
            ref={(el: HTMLLIElement | null) => {
              if (unreadRef.current) {
                unreadRef.current[index] = el;
              }
            }}
            onClick={() => {
              if (unreadRef.current) {
                unreadRef.current[index] = conversation.lastSeen;
              }
              handleConversationChange(conversation);
              setCurrentChatBoxConversation(conversation);
            }}
          >
            <div className="flex items-center relative mx-5 gap-5 py-[23px] group-hover:border-transparent">
              <CustomCheckBox />
              <ProfileImageFrame
                currentConversation={conversation}
                onlineUsers={onlineUsers}
                user={user}
              />
              <div className="flex flex-col justify-center gap-[2px] w-[80%]">
                <h3 className="font-bold text-lg !transition-none overflow-hidden whitespace-nowrap text-ellipsis">
                  {conversation.type === "group"
                    ? conversation.groupName
                    : conversation.members[
                        user._id === conversation.members[0]?._id ? 1 : 0
                      ]?.firstName +
                      " " +
                      conversation.members[
                        user._id === conversation.members[0]?._id ? 1 : 0
                      ]?.lastName}
                </h3>
                <div className="flex items-center gap-[--6px]">
                  <div className="shrink-0">
                    {conversation?.message?.sender == user?._id ? (
                      conversation.message.received ||
                      conversation.message.seen ? (
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-[--15px] h-[--15px] ${conversation?.message.seen ? "text-[#2c80cf]" : "text-[#828282]"}`}
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
                  <p className="text-sm [color:#828282] group-hover:text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis">
                    {truncateText(conversation.lastMessage || "Message", 60)}
                  </p>
                </div>
              </div>
              <div className="absolute flex justify-center items-center right-4 top-0 bottom-0">
                {
                  //console.log("messag sender in line 1146 : ",conversation, user?._id),
                  allUnreadMessages[conversation?._id] ? (
                    // message?._id !== currentChatBoxConversation?._id ? (
                    <div
                      className="
                            bg-red-600 rounded-full z-50 text-white text-[--11px] min-w-[--16px] min-h-[--16px] px-[--5px] py-[--2px] flex items-center justify-center"
                    >
                      {allUnreadMessages[conversation?._id]}
                    </div>
                  ) : null
                }
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default memo(FloatingChatConversation);
