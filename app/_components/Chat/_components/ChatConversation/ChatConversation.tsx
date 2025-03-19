"use client";
import React, { useEffect, useRef, useState, memo, useContext } from "react";
import styles from "@/app/_components/Chat/Chat.module.css";
import { truncateText } from "@/app/_utils/text";
import CustomCheckBox from "@/app/_components/CustomCheckBox/CustomCheckBox";
import { ProfileImageFrame } from "../../Chat";
import Fuse from "fuse.js";
import { useSocket } from "@/app/_context/SocketProvider";
import { toast } from "react-hot-toast";
import { msgSentCheckIcon } from "../../_helpers/chatIcons";
import { globalContext } from "@/app/_context/store";

interface Employee {
  _id: string;
  userId?: string;
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

interface ChatConversationProps {
  currentConversation: Conversation;
  searchBarFocus: boolean;
  setSearchBarFocus: (focus: boolean) => void;
  conversation: Conversation[];
  setConversation: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentConversation: (conversation: Conversation) => void;
  user: any;
  unreadRef: React.RefObject<any[]>;
}

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembers: Employee[];
  onCreateGroup: (groupName: string) => void;
  onRemoveMember: (memberId: string) => void;
}

function GroupCreateModal({
  isOpen,
  onClose,
  selectedMembers,
  onCreateGroup,
  onRemoveMember,
}: GroupCreateModalProps) {
  const [groupName, setGroupName] = useState("");

  if (!isOpen) return null;

  if (selectedMembers.length === 0) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          className="w-full p-2 border rounded mb-4"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="mb-4">
          <h3 className="font-medium mb-2">
            Selected Members ({selectedMembers.length}):
          </h3>
          <div className="max-h-40 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((member: any) => (
                <div
                  key={member._id}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                >
                  <span>
                    {member.firstName} {member.lastName}
                  </span>
                  <button
                    onClick={() => onRemoveMember(member._id)}
                    className="text-[--20px] text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setGroupName("");
              onClose();
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (groupName?.trim()) {
                onCreateGroup(groupName);
                onClose();
                setGroupName("");
              } else {
                toast.error("Group name is required");
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            // disabled={!groupName?.trim()}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}

function ConnectionStatus({
  isConnected,
  isDisplaced,
  isReconnecting,
  handleReconnect,
}: {
  isConnected: boolean;
  isDisplaced: boolean;
  isReconnecting: boolean;
  handleReconnect: any;
}) {
  const getStatusText = () => {
    if (isDisplaced) return "You're Inactive ...";
    if (!isConnected) return "You're Offline ...";
    return "Chats";
  };

  const showReconnectButton = isDisplaced || !isConnected;
  const statusColor = isDisplaced
    ? "!text-gray-500 animate-pulse"
    : !isConnected
      ? "!text-red-500 animate-pulse"
      : "";

  return (
    <div className="flex items-center gap-[--10px]">
      <h2 className={`text-[--24px] font-semibold ${statusColor}`}>
        {getStatusText()}
      </h2>

      {showReconnectButton && (
        <button
          onClick={handleReconnect}
          disabled={isReconnecting}
          className={`
            text-xs px-2 py-0.5 rounded
            ${
              isReconnecting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }
            text-white transition-colors duration-200
          `}
        >
          {isReconnecting ? (
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Connecting...</span>
            </div>
          ) : (
            "Reconnect"
          )}
        </button>
      )}
    </div>
  );
}

function ChatConversation({
  currentConversation,
  searchBarFocus,
  setSearchBarFocus,
  conversation,
  setConversation,
  setCurrentConversation,
  user,
  unreadRef,
}: ChatConversationProps) {
  const { handleSignOut } = useContext(globalContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchResult, setSearchResult] = useState(employees);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );
  const [toggleCreateGroup, setToggleCreateGroup] = useState(false);
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const {
    onlineUsers,
    allUnreadMessages,
    isConnected,
    isDisplaced,
    isReconnecting,
    handleReconnect,
    isLoadingConversations,
    fetchConversation,
  } = useSocket();

  async function fetchEmployees() {
    setIsLoadingEmployees(true);
    setEmployeesError(null);

    try {
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
      const data = await response.json();

      if (data.success) {
        setEmployees(data.data);
        setSearchResult(data.data);
      } else {
        setEmployeesError(data.message || "Failed to load contacts");
        toast.error(data.message || "Failed to load contacts");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployeesError("Network error. Please try again later.");
      toast.error("Network error. Please try again later.");
    } finally {
      setIsLoadingEmployees(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  // useEffect(() => console.log(newGroupMembers), [newGroupMembers]);

  async function createConversation(
    type: string,
    members: string[],
    groupName?: string
  ) {
    setIsCreatingConversation(true);
    setConversationError(null);

    try {
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

      if (data.Success) {
        console.log("Created new conversation:", data);
        setCurrentConversation(data.result);
        setConversation((prev) => [data.result, ...prev]);
        toast.success("Conversation created successfully");
      } else if (data.message === "Exist") {
        // console.log("Using existing conversation:", data.data);
        setCurrentConversation(data.data);
      } else {
        console.error("Failed to create conversation:", data.message);
        setConversationError(data.message || "Failed to create conversation");
        toast.error(data.message || "Failed to create conversation");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      setConversationError("Network error. Please try again later.");
      toast.error("Network error. Please try again later.");
    } finally {
      setIsCreatingConversation(false);
    }
  }

  async function handleCreateGroup(groupName: string) {
    setIsCreatingConversation(true);
    setConversationError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "group",
            members: [user._id, ...newGroupMembers],
            groupName: groupName,
          }),
        }
      );

      const data = await response.json();

      if (data.Success) {
        // set the new group as current conversation
        setCurrentConversation(data.result);
        setConversation((prev) => [data.result, ...prev]);
        setEmployees((prev) => [...prev, data.result]);
        toast.success(`Group "${groupName}" created successfully`);
      } else {
        console.error("Failed to create group:", data.message);
        setConversationError(data.message || "Failed to create group");
        toast.error(data.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setConversationError("Network error. Please try again later.");
      toast.error("Network error. Please try again later.");
    } finally {
      setIsCreatingConversation(false);
      setNewGroupMembers([]);
      setToggleCreateGroup(false);
    }
  }

  async function createGroup() {
    if (!toggleCreateGroup || newGroupMembers.length === 0) return;
    setIsGroupModalOpen(true);
  }

  useEffect(() => {
    const handleSearch = (text: string) => {
      const fuse = new Fuse(employees, {
        keys: ["firstName", "lastName", "groupName"],
        threshold: 0.5, // Default is 0.6
      });
      const result = fuse.search(text);
      setSearchResult(result.map((r) => r.item));
    };

    if (searchQuery?.trim() === "") {
      setSearchResult(employees);
      return;
    }

    handleSearch(searchQuery?.trim());
  }, [searchQuery, employees]);

  useEffect(() => {
    const handleUserClickOutside = (event: MouseEvent) => {
      // if the user clicks outside the search bar but not on the list of users, set the search bar focus to false
      if (
        event.target !== searchBarRef.current &&
        event.target !== searchBarRef.current?.children[0]
      ) {
        if (!(event.target as Element)?.closest("#employee-list")) {
          setTimeout(() => {
            setSearchBarFocus(false);
            if (
              toggleCreateGroup &&
              !(event.target as Element)?.closest("#create-group-button")
            ) {
              setToggleCreateGroup(false);
              setNewGroupMembers([]);
            }
          }, 0);
        }
      }
    };

    document.addEventListener("mousedown", handleUserClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleUserClickOutside);
    };
  }, [
    toggleCreateGroup,
    // , setSearchBarFocus
  ]);

  useEffect(() => {
    const uncheckOnGroupChange = () => {
      document.querySelectorAll("#chat-list input").forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
      });
    };
    if (toggleCreateGroup) {
      uncheckOnGroupChange();
    }
  }, [toggleCreateGroup]);

  // Render loading state for the entire conversation list
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-60 text-gray-500">
      <div className="w-10 h-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
      <p>Loading conversations...</p>
    </div>
  );

  // Render error state for the entire conversation list
  const renderErrorState = (errorMessage: string) => (
    <div className="flex flex-col items-center justify-center h-60 text-gray-600">
      <svg
        className="w-12 h-12 text-red-500 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-center mb-2">{errorMessage}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Render empty state for the conversation list
  const renderEmptyConversationState = () => (
    <div className="flex flex-col items-center justify-center h-60 text-gray-500">
      <svg
        className="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <p className="text-center mb-2">No conversations yet</p>
      <p className="text-center text-sm text-gray-400 mb-4">
        Start a new conversation by searching for a contact
      </p>
      <button
        onClick={() => setSearchBarFocus(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Find Contacts
      </button>
    </div>
  );

  // Render empty search results
  const renderEmptySearchResults = () => (
    <div className="flex flex-col items-center justify-center h-60 text-gray-500">
      <svg
        className="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <p className="text-center mb-1">No results found</p>
      <p className="text-center text-sm text-gray-400">
        Try a different search term
      </p>
    </div>
  );

  return (
    <>
      <div
        className={`flex flex-col h-full ${styles.chat__chat__aside} ${
          toggleCreateGroup ? styles.chat__chat__aside__create_group : ""
        }`}
      >
        {/* <div>
          <h2 className="mb-5 text-2xl font-semibold">Chats</h2>
          <Dropdown title="Brand" items={["All", "Unread", "Read"]} />
        </div> */}
        <div
          className={`flex flex-col border-2 [border-color:#DBDBD7] rounded-[20px] h-[50vh] overflow-hidden shrink-0 grow py-[--21px] ${styles.chat__chat__aside__menu}`}
        >
          <div className="flex justify-between items-center mx-5">
            <ConnectionStatus
              isConnected={isConnected}
              isDisplaced={isDisplaced}
              isReconnecting={isReconnecting}
              handleReconnect={handleReconnect}
            />

            <div className="relative flex items-center gap-3">
              <div className="relative">
                <button
                  className={`absolute top-[50%] -translate-y-[50%] right-0 border-1 text-[--10px] font-semibold text-[--white] border-[#DBDBD7] rounded-[--7px] bg-[#E9313E] px-[--10px] py-[--5px] ${
                    toggleCreateGroup
                      ? "opacity-100 visible transition-all duration-300 ease-in-out -translate-x-[--72px]"
                      : "opacity-0 invisible transition-all duration-300 ease-in-out -translate-x-[--40px]"
                  }`}
                  onClick={() => {
                    setToggleCreateGroup(false);
                    setNewGroupMembers([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="flex flex-col gap-1 items-center"
                  onClick={() => {
                    if (newGroupMembers.length > 0) {
                      createGroup();
                    }
                    setToggleCreateGroup(!toggleCreateGroup);
                  }}
                  id="create-group-button"
                  disabled={isCreatingConversation}
                >
                  {toggleCreateGroup ? (
                    <>
                      <svg
                        viewBox="0 0 27 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-[--26px] h-[--26px] cursor-pointer ${isCreatingConversation ? "opacity-50" : ""}`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M26.5 13C26.5 20.1796 20.6796 26 13.5 26C6.32029 26 0.5 20.1796 0.5 13C0.5 5.82029 6.32029 0 13.5 0C20.6796 0 26.5 5.82029 26.5 13ZM18.7394 9.06057C19.1202 9.44133 19.1202 10.0587 18.7394 10.4394L12.2394 16.9394C11.8586 17.3202 11.2414 17.3202 10.8606 16.9394L8.26057 14.3394C7.87981 13.9586 7.87981 13.3414 8.26057 12.9606C8.64133 12.5798 9.25867 12.5798 9.63943 12.9606L11.55 14.8711L14.4552 11.9658L17.3606 9.06057C17.7414 8.67981 18.3586 8.67981 18.7394 9.06057Z"
                          fill="#5FA85B"
                        />
                      </svg>
                      <span className="text-[#5FA85B] font-semibold text-[--9px]">
                        {isCreatingConversation
                          ? "Creating..."
                          : "Create Group"}
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[--27px] h-[--26px] cursor-pointer"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.97848 4.5221C12.9149 4.5221 15.3063 6.912 15.3063 9.8499V11.3721C15.3063 13.0131 14.5452 14.4638 13.3746 15.4426C14.6411 15.6298 15.8954 15.9129 17.1193 16.3118C18.7663 16.8476 19.873 18.4064 19.873 20.1889V22.8848L19.5122 23.1085C17.5151 24.3507 14.2377 25.8333 9.97848 25.8333C7.62664 25.8333 4.06158 25.3599 0.443229 23.1085L0.0839844 22.8848V20.3366C0.0839844 18.4444 1.28502 16.7974 3.0706 16.2357C4.21989 15.8764 5.392 15.61 6.57326 15.435C5.40874 14.4562 4.65068 13.0085 4.65068 11.3721V9.8499C4.65068 6.912 7.04058 4.5221 9.97848 4.5221ZM16.0065 0C18.9429 0 21.3343 2.3899 21.3343 5.32781V6.85004C21.3343 8.491 20.5732 9.94322 19.4026 10.9205C20.6691 11.1077 21.9219 11.3924 23.1473 11.7897C24.7944 12.3285 25.901 13.8858 25.901 15.6683V18.3642L25.5418 18.588C24.4975 19.238 23.0956 19.9473 21.3952 20.4816V20.1893C21.3952 17.7447 19.8669 15.6044 17.5912 14.8646C17.0959 14.7031 16.5953 14.5584 16.0902 14.4307C16.5713 13.4915 16.8285 12.4473 16.8285 11.3726V9.85035C16.8285 6.48014 14.3793 3.68837 11.1719 3.12057C12.0152 1.28476 13.8571 0 16.0065 0Z"
                          fill="#2A2B2A"
                        />
                      </svg>
                      <span className="text-[#2A2B2A] font-semibold text-[--9px]">
                        New Group
                      </span>
                    </>
                  )}
                </button>
              </div>

              <button
                className="flex flex-col gap-1 items-center"
                onClick={() => {
                  fetchEmployees();
                  fetchConversation();
                }}
                disabled={isLoadingEmployees || isLoadingConversations}
                title="Refresh"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-[--27px] h-[--26px] ${isLoadingEmployees || isLoadingConversations ? "animate-spin text-blue-500" : ""}`}
                >
                  <path
                    d="M21.5 8C20.1667 4.5 16.8333 2 13 2C8 2 4 6 4 11C4 16 8 20 13 20C16.8333 20 20.1667 17.5 21.5 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M22 2V8H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[#2A2B2A] font-semibold text-[--9px]">
                  {isLoadingEmployees || isLoadingConversations
                    ? "Syncing..."
                    : "Refresh"}
                </span>
              </button>
            </div>
          </div>

          <div
            className="h-min flex items-center justify-between border mx-5 my-[--17px] [border-color:var(--dark)] rounded-[--7px] text-sm placeholder:[color:var(--dark)] py-[--8px] px-[--15px]"
            ref={searchBarRef}
          >
            <input
              type="text"
              placeholder="Search"
              className="outline-none grow"
              onFocus={() => setSearchBarFocus(true)}
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

          <div className="h-[1px] bg-[#DBDBD7] mx-5"></div>

          <ul
            className="flex flex-col relative max-h-[90%] overflow-y-auto [border-color:#DBDBD7] w-full"
            id="chat-list"
          >
            {/* LOADING STATE - When employees or conversations are loading */}
            {(isLoadingEmployees || isLoadingConversations) &&
              renderLoadingState()}

            {/* ERROR STATE - When there's an error fetching employees or conversations */}
            {!isLoadingEmployees &&
              employeesError &&
              renderErrorState(employeesError)}
            {!isLoadingConversations &&
              conversationError &&
              renderErrorState(conversationError)}

            {/* SEARCH MODE - When search bar is focused and not in group creation mode */}
            {!isLoadingEmployees &&
              !employeesError &&
              searchBarFocus &&
              !toggleCreateGroup && (
                <>
                  {searchResult &&
                  Array.isArray(searchResult) &&
                  searchResult.length > 0
                    ? searchResult.map((employee, index) => (
                        <li
                          className={`cursor-pointer ${styles.chat__chat__aside__menu__item} group transition-colors duration-300 ease-in-out hover:[background-color:var(--dark)] !transition-none employee-list`}
                          key={index}
                          // ref={(el) => (unreadRef.current = el)}
                          onClick={() => {
                            if (isCreatingConversation) return;

                            if (employee.type === "group") {
                              setCurrentConversation(
                                employee as unknown as Conversation
                              );
                              return;
                            }

                            createConversation("oneToOne", [
                              user._id,
                              employee.userId || employee._id,
                            ]);
                          }}
                          id="employee-list"
                        >
                          <div className="flex items-center relative mx-5 gap-5 py-[23px] group-hover:border-transparent">
                            <CustomCheckBox
                              checked={newGroupMembers.includes(employee._id)}
                            />
                            <ProfileImageFrame />
                            {employee.type !== "group" ? (
                              onlineUsers?.find(
                                (u: any) => u._id == employee._id
                              )?.isBusy ? (
                                <div className="animate-pulse bg-red-500 w-[--11px] h-[--11px] rounded-[--10px]"></div>
                              ) : onlineUsers?.find(
                                  (u: any) => u._id == employee._id
                                ) ? (
                                <div className="animate-pulse bg-green-500 w-[--11px] h-[--11px] rounded-[--10px]"></div>
                              ) : (
                                <div className="animate-pulse bg-gray-300 w-[--11px] h-[--11px] rounded-[--10px]"></div>
                              )
                            ) : (
                              <div className="w-[--11px] h-[--11px] rounded-[--10px]"></div>
                            )}
                            <div className="flex flex-col justify-center gap-1 w-[80%]">
                              <h3 className="font-bold text-xl transition-colors duration-100 overflow-hidden whitespace-nowrap text-ellipsis">
                                {employee.type === "group"
                                  ? employee.groupName
                                  : employee.firstName +
                                    " " +
                                    employee.lastName}
                              </h3>
                              <p className="text-base [color:#828282] overflow-hidden whitespace-nowrap text-ellipsis">
                                {/* {truncateText(message.lastMessage || "Message", 60)} */}
                              </p>
                            </div>
                            {/* <div className="absolute flex justify-center items-center right-4 top-0 bottom-0">
                        {message.lastSeen < message.updatedAt &&
                        message?._id !== currentConversation?._id &&
                        user._id !==
                          message.members[
                            user._id === message.members[0]?._id ? 1 : 0
                          ]._id ? (
                          <div className="w-3 h-3 rounded-full bg-[#E9313E]"></div>
                        ) : null} 
                      </div> */}
                          </div>
                        </li>
                      ))
                    : renderEmptySearchResults()}
                </>
              )}

            {/* GROUP CREATION MODE - When toggle create group is active */}
            {!isLoadingEmployees && !employeesError && toggleCreateGroup && (
              <>
                {searchResult &&
                searchResult.filter((conv: any) => conv.type !== "group")
                  .length > 0 ? (
                  searchResult
                    .filter((conv: any) => conv.type !== "group")
                    .map((employee, index) => (
                      <li
                        className={`cursor-pointer ${styles.chat__chat__aside__menu__item} group transition-colors duration-300 ease-in-out hover:[background-color:var(--dark)] !transition-none employee-list`}
                        key={index}
                        // ref={(el) => (unreadRef.current = el)}
                        onClick={() => {
                          if (isCreatingConversation) return;

                          // create group
                          if (
                            newGroupMembers.includes(
                              employee.userId || employee._id
                            )
                          ) {
                            setNewGroupMembers((prev) =>
                              prev.filter(
                                (member) =>
                                  member !== (employee.userId || employee._id)
                              )
                            );
                          } else {
                            setNewGroupMembers((prev) => [
                              ...prev,
                              employee.userId || employee._id,
                            ]);
                          }
                        }}
                        id="employee-list"
                      >
                        <div className="flex items-center relative mx-5 gap-5 py-[23px] group-hover:border-transparent">
                          <CustomCheckBox
                            checked={newGroupMembers.includes(
                              employee.userId || employee._id
                            )}
                          />
                          <ProfileImageFrame />
                          {employee.type !== "group" ? (
                            onlineUsers?.find((u: any) => u._id == employee._id)
                              ?.isBusy ? (
                              <div className="animate-pulse bg-red-500 w-[--11px] h-[--11px] rounded-[--10px]"></div>
                            ) : onlineUsers?.find(
                                (u: any) => u._id == employee._id
                              ) ? (
                              <div className="animate-pulse bg-green-500 w-[--11px] h-[--11px] rounded-[--10px]"></div>
                            ) : (
                              <div className="animate-pulse bg-gray-300 w-[--11px] h-[--11px] rounded-[--10px]"></div>
                            )
                          ) : (
                            <div className="w-[--11px] h-[--11px] rounded-[--10px]"></div>
                          )}
                          <div className="flex flex-col justify-center gap-1 w-[80%]">
                            <h3 className="font-bold text-xl transition-colors duration-100 overflow-hidden whitespace-nowrap text-ellipsis">
                              {employee.type === "group"
                                ? employee.groupName
                                : employee.firstName + " " + employee.lastName}
                            </h3>
                            <p className="text-base [color:#828282] overflow-hidden whitespace-nowrap text-ellipsis">
                              {/* {truncateText(message.lastMessage || "Message", 60)} */}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-center mb-1">No contacts available</p>
                    <p className="text-center text-sm text-gray-400">
                      You need contacts to create a group
                    </p>
                  </div>
                )}
              </>
            )}

            {/* NORMAL MODE - Default conversation list */}
            {!isLoadingEmployees &&
              !employeesError &&
              !isLoadingConversations &&
              !conversationError &&
              !searchBarFocus &&
              !toggleCreateGroup && (
                <>
                  {conversation && conversation.length > 0
                    ? conversation.map((conversation: any, index) => (
                        <li
                          className={`cursor-pointer ${styles.chat__chat__aside__menu__item} group transition-colors duration-300 ease-in-out hover:[background-color:var(--dark)] ${conversation._id == currentConversation?._id ? "bg-gray-300" : ""}`}
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
                            if (!toggleCreateGroup)
                              setCurrentConversation(conversation);
                          }}
                        >
                          <div className="flex items-center relative mx-5 gap-5 py-[23px] group-hover:border-transparent">
                            <CustomCheckBox />
                            <ProfileImageFrame
                              currentConversation={conversation}
                              onlineUsers={onlineUsers}
                              user={user}
                            />
                            <div className="flex flex-col justify-center gap-1 w-[80%]">
                              <h3 className="font-bold text-xl !transition-none overflow-hidden whitespace-nowrap text-ellipsis">
                                {conversation.type === "group"
                                  ? conversation.groupName
                                  : conversation.members[
                                      user._id === conversation.members[0]?._id
                                        ? 1
                                        : 0
                                    ]?.firstName?.split(" ")[0] +
                                    " " +
                                    conversation.members[
                                      user._id === conversation.members[0]?._id
                                        ? 1
                                        : 0
                                    ]?.lastName?.split(" ")[0]}
                              </h3>
                              <div className="flex items-center gap-[--6px]">
                                <div className="shrink-0">
                                  {conversation?.message?.sender ==
                                  user?._id ? (
                                    conversation.message.received ||
                                    conversation.message.seen ? (
                                      <svg
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`w-[--15px] h-[--15px] ${conversation?.message.seen ? "text-[#2c80cf]" : "text-[#828282]"}`}
                                      >
                                        <g
                                          id="SVGRepo_bgCarrier"
                                          strokeWidth="0"
                                        ></g>
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
                                <p className="text-base [color:#828282] overflow-hidden whitespace-nowrap text-ellipsis">
                                  {truncateText(
                                    conversation.lastMessage || "Message",
                                    60
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="absolute flex justify-center items-center right-4 top-0 bottom-0">
                              {allUnreadMessages[conversation?._id] ? (
                                <div
                                  className="
                          bg-red-600 rounded-full z-50 text-white text-[--11px] min-w-[--16px] min-h-[--16px] px-[--5px] py-[--2px] flex items-center justify-center"
                                >
                                  {allUnreadMessages[conversation?._id]}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))
                    : renderEmptyConversationState()}
                </>
              )}
          </ul>
          <div className="h-[1px] bg-[#DBDBD7] mx-5"></div>
        </div>
      </div>
      <GroupCreateModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setNewGroupMembers([]);
          setIsGroupModalOpen(false);
        }}
        selectedMembers={
          Array.isArray(employees)
            ? employees.filter((emp) =>
                newGroupMembers.includes(emp.userId || emp._id)
              )
            : []
        }
        onCreateGroup={handleCreateGroup}
        onRemoveMember={(memberId) => {
          setNewGroupMembers((prev) => prev.filter((id) => id !== memberId));
        }}
      />
    </>
  );
}

export default memo(ChatConversation);
