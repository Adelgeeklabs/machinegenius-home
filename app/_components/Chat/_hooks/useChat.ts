import { useState, useEffect, useCallback, useContext } from "react";
import { useSocket } from "@/app/_context/SocketProvider";
import { globalContext } from "@/app/_context/store";
// import useSessionStorage from "@/app/_hooks/useSessionStorage";
import { chatEventEmitter } from "@/app/_context/SocketProvider";
import { usePathname } from "next/navigation";

interface Message {
  [x: string]: any;
  text: string;
  sender: {
    _id: string;
  };
  isEdited: boolean;
  received: boolean;
  seen: boolean;
  reply: Message;
  media: { url: string; type: string }[];
  createdAt: number;
}

interface GroupNameUpdate {
  groupId: string;
  groupName: string;
  updatedBy: string;
  text: string;
}

const useChat = () => {
  const {
    socket,
    currentConversation,
    setCurrentConversation,
    currentChatBoxConversation,
    setAllUnreadMessages,
    allUnreadMessages,
    conversation,
    setConversation,
  } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState<{ [key: string]: any } | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<any>([]);
  const [seenMessages, setSeenMessages] = useState<any>([]);
  const { authState } = useContext(globalContext);
  const pathName = usePathname();

  function updateConversation(conversation: any) {
    console.log(`Updating conversation
    id: ${conversation._id}
    text: ${conversation.text}
    lastSeen: ${conversation.lastSeen}
    updatedAt: ${conversation.updatedAt}
    `);

    setConversation((prev: any) => {
      const index = prev.findIndex((c: any) => c._id === conversation._id);
      if (index === -1) {
        return [conversation, ...prev];
      }
      const newConversations = [...prev];
      newConversations[index].lastMessage = conversation.lastMessage;
      if (conversation.lastSeen) {
        newConversations[index].lastSeen = conversation.lastSeen;
      }
      newConversations[index].updatedAt = conversation.updatedAt;
      // remove updated conversation from the list & add it to the top
      const updatedConversation = newConversations.splice(index, 1);
      newConversations.unshift(updatedConversation[0]);
      console.log("New Conversations", newConversations);
      return newConversations;
    });
  }

  useEffect(() => {
    console.log("new conversation", conversation);
  }, [conversation]);

  useEffect(() => {
    console.log("receivedMessages", receivedMessages);
    setMessages((prev) => {
      const newMessages = [...prev];
      receivedMessages.forEach((message: Message) => {
        const index = newMessages.findIndex(
          (m) => m._id === message.message_id
        );
        if (index !== -1) {
          console.log("Replacing message");
          newMessages[index].received = true;
        }
      });
      console.log("new messages", newMessages);

      return newMessages;
    });
    console.log("Setting received messages to empty array");
  }, [receivedMessages]);

  useEffect(() => {
    console.log("seenMessages", seenMessages);
    setMessages((prev) => {
      const newMessages = [...prev];
      seenMessages.forEach((message: Message) => {
        const index = newMessages.findIndex(
          (m) => m._id === message.message_id
        );
        if (index !== -1) {
          console.log("Replacing message");
          newMessages[index].seen = true;
        }
      });
      console.log("new messages", newMessages);

      return newMessages;
    });
    console.log("Setting seen messages to empty array");
  }, [seenMessages]);

  function getToken() {
    if (typeof window !== "undefined") {
      const token =
        typeof window !== "undefined" && localStorage.getItem("token");
      return token ? `Bearer ${token}` : null;
    } else {
      return `Bearer ${authState?.token}` || null;
    }
  }

  function getUserId() {
    // console.log("User", JSON.parse(user)._id);
    // console.log("User", authState?.decodedToken._id);
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("decodedToken");
      // console.log("User", JSON.parse(user));
      // console.log("User", authState?.decodedToken);
      return user ? JSON.parse(user)._id : null;
    } else {
      return authState?.decodedToken?._id || null;
    }
  }
  // Send a new message
  const sendMessage = useCallback(
    (message: {
      conversationId: string;
      text: string;
      media: { url: string; type: string }[];
      replay?: string;
    }) => {
      if (socket) {
        console.log("Sending message", message);
        if ((message.text && message?.text?.trim()) || message?.media?.length) {
          socket.emit("sendMessage", message);
          updateConversation({
            _id: message.conversationId,
            lastMessage: message?.text ? message.text : message.media[0].type,
            lastSeen: new Date().getTime(),
            updatedAt: new Date().getTime(),
          });
        }
      }
    },
    [socket]
  );

  useEffect(() => {
    console.log(allUnreadMessages);
  }, [allUnreadMessages]);

  // function to handle user seeing a message
  const handleUserSeenMessage = useCallback(() => {
    if (socket && currentConversation) {
      console.log(
        "Emitting userSeenMessage event",
        currentChatBoxConversation?._id || currentConversation._id
      );
      socket.emit("userSeenMessage", {
        conversationId:
          currentChatBoxConversation?._id || currentConversation._id,
        userId: getToken(),
      });

      const id = currentChatBoxConversation?._id || currentConversation?._id;
      const unreadMessagesKeys = Object.keys(allUnreadMessages);

      if (unreadMessagesKeys?.includes(id)) {
        if (unreadMessagesKeys?.length === 2) {
          // If there are exactly 2 keys, reset the totalUnseenMessages
          setAllUnreadMessages((prevState: any) => {
            const { [id]: _, ...updatedState } = prevState;
            return { ...updatedState, totalUnseenMessages: 0 };
          });
        } else if (unreadMessagesKeys?.length > 2) {
          console.log(unreadMessagesKeys?.length);

          setAllUnreadMessages((prevState: any) => {
            const { [id]: _, ...updatedState } = prevState;
            const totalUnseenMessages =
              prevState[id] && prevState.totalUnseenMessages
                ? prevState.totalUnseenMessages - prevState[id]
                : prevState.totalUnseenMessages;

            return {
              ...updatedState,
              totalUnseenMessages,
            };
          });
        }
      }

      // Update the conversation to mark the message as seen
      console.log("Updating conversation", currentConversation);
      setConversation((prev: any) => {
        const index = prev.findIndex(
          (c: any) =>
            c._id ===
            (currentChatBoxConversation?._id || currentConversation._id)
        );
        if (index === -1) {
          return prev;
        }
        const newConversations = [...prev];
        newConversations[index].lastSeen = new Date().getTime();
        return newConversations;
      });
    }
  }, [socket, currentConversation, currentChatBoxConversation]);

  // Listen for typing events
  const handleUserTyping = useCallback(
    (user: {
      _id: string;
      firstName: string;
      lastName: string;
      theme: string;
    }) => {
      if (socket && (currentConversation || currentChatBoxConversation)) {
        console.log("User typing", user);
        socket.emit("userTyping", {
          conversationId:
            currentChatBoxConversation?._id || currentConversation._id,
          user,
        });
      }
    },
    [socket, currentConversation, currentChatBoxConversation]
  );

  useEffect(() => {
    if (!socket || (!currentConversation && !currentChatBoxConversation))
      return;
    socket.on("messageReceived", (data: { chat: string; message: string }) => {
      console.log("why received message", data);
      console.log("currentConversation", currentConversation._id);
      console.log("data.chat", data.chat);
      console.log("received message", data);
      console.log(currentConversation._id === data.chat);
      if (
        (currentConversation && currentConversation?._id === data?.chat) ||
        (currentChatBoxConversation &&
          currentChatBoxConversation?._id === data?.chat)
      ) {
        console.log("message received", data);
        setReceivedMessages((prev: any) => {
          return [...prev, data];
        });
      }
    });

    socket.on("messageSeen", (data: { seenMessages: Message }) => {
      console.log("why seen message", data);
      console.log("currentConversation", currentConversation._id);
      console.log("data.chat", data.seenMessages.chat);
      console.log("seen message", data);
      console.log(currentConversation._id === data.seenMessages.chat);
      if (
        (currentConversation &&
          currentConversation?._id === data?.seenMessages.chat) ||
        (currentChatBoxConversation &&
          currentChatBoxConversation?._id === data?.seenMessages.chat)
      ) {
        console.log("message seen", data);
        setSeenMessages((prev: any) => {
          return [...prev, { message_id: data.seenMessages._id }];
        });
      }
    });
  }, [socket, currentConversation, currentChatBoxConversation]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (event: { [key: string]: any }) => {
      console.log("Typing event", event);
      if (event.user._id === getUserId()) {
        return;
      }
      setIsTyping((prev) => {
        if (!prev) {
          return { [event.conversationId]: { user: event.user } };
        }
        return { ...prev, [event.conversationId]: { user: event.user } };
      });
      setTimeout(() => {
        setIsTyping((prev) => {
          if (!prev) {
            return null;
          }
          const newTyping = { ...prev };
          delete newTyping[event.conversationId];
          return newTyping;
        });
      }, 2000);
    };

    socket.on("userTyping", handleTyping);

    return () => {
      socket.removeListener("userTyping", handleTyping);
    };
  }, [socket, currentConversation, currentChatBoxConversation]);

  useEffect(() => {
    console.log("Setting up chat message listener");
    if (!currentConversation && !currentChatBoxConversation) return;

    const handleChatMessage = (event: { [key: string]: any }) => {
      console.log("useChat: Received chat message:", event);
      let data = null;
      if (event.chat) {
        data = event;
      }
      if (!data) return;
      if (data.sender._id === getUserId()) return;

      updateConversation({
        _id: data.chat._id,
        lastMessage: data?.text ? data.text : data.media[0].type,
        lastSeen:
          data.chat._id === currentChatBoxConversation?._id ||
          data.chat._id === currentConversation._id
            ? new Date().getTime()
            : null,
        updatedAt: new Date().getTime(),
        type: data.chat?.type,
        groupName: data?.chat.groupName,
        members: data.chat.members,
        media: data.media,
      });

      if (
        data.chat._id !== currentChatBoxConversation?._id &&
        data.chat._id !== currentConversation._id
      ) {
        console.log("Skipping message processing");
        return;
      }

      //@ts-ignore
      setMessages((prev) => [
        ...prev,
        {
          _id: data._id,
          text: data.text,
          media: data.media,
          sender: {
            _id: data.sender._id,
            firstName: data.sender.firstName,
            lastName: data.sender.lastName,
          },
          createdAt: data.createdAt,
          reply: data.reply,
          seen: data.seen,
          recevied: data.recevied,
        },
      ]);

      if (
        (data.chat._id === currentConversation._id &&
          pathName.includes("/chat")) ||
        (!pathName.includes("/chat") &&
          data.chat._id === currentChatBoxConversation?._id)
      ) {
        handleUserSeenMessage();
      }
    };

    // Subscribe to the custom event emitter instead of socket
    const unsubscribe = chatEventEmitter.subscribe(handleChatMessage);

    return () => {
      unsubscribe();
    };
  }, [currentConversation, currentChatBoxConversation]);

  useEffect(() => {
    setIsLoaded((prev) => {
      if (prev) {
        return true;
      }
      if (messages.length > 0) {
        return true;
      }
      return false;
    });
  }, [messages]);

  // Add editMessage function
  const editMessage = useCallback(
    (messageData: {
      messageId: string;
      conversationId: string;
      newText: string;
      newMedia: any[];
      lastMessage: string;
    }) => {
      if (socket) {
        console.log("Editing message", messageData);
        socket.emit("editMessage", messageData);

        // Update messages locally
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageData.messageId
              ? {
                  ...msg,
                  text: messageData.newText,
                  media: messageData.newMedia,
                  isEdited: true,
                }
              : msg
          )
        );

        // Update conversation
        updateConversation({
          _id: messageData.conversationId,
          lastMessage: messageData.lastMessage,
          updatedAt: new Date().getTime(),
        });
      }
    },
    [socket]
  );

  // Add socket listener for edited messages
  useEffect(() => {
    if (!socket) return;

    const handleEditedMessage = (data: {
      messageId: string;
      newText: string;
      newMedia: any[];
      chat: string;
    }) => {
      console.log("Message edited:", data);

      if (
        (currentChatBoxConversation?._id || currentConversation?._id) ===
        data.chat
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId
              ? { ...msg, text: data.newText, media: data.newMedia }
              : msg
          )
        );
      }
    };

    socket.on("messageEdited", handleEditedMessage);

    return () => {
      socket.off("messageEdited", handleEditedMessage);
    };
  }, [socket, currentConversation, currentChatBoxConversation]);

  useEffect(() => {
    if (!socket) return;

    // Add listener for messageUpdated event
    socket.on(
      "messageUpdated",
      ({
        messageId,
        updatedMessage,
      }: {
        messageId: string;
        updatedMessage: Message;
      }) => {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === messageId
              ? {
                  ...message,
                  text: updatedMessage.text,
                  media: updatedMessage.media,
                  isEdited: true,
                  // Preserve other message properties that might be needed
                  sender: message.sender,
                  createdAt: message.createdAt,
                  received: updatedMessage.received,
                  seen: updatedMessage.seen,
                }
              : message
          )
        );
      }
    );

    // Cleanup listener on unmount
    return () => {
      socket.off("messageUpdated");
    };
  }, [socket]);

  // Add delete message handler
  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      if (!socket || (!currentConversation?._id && !currentChatBoxConversation))
        return;

      socket.emit("deleteMessage", {
        messageId,
        conversationId:
          currentChatBoxConversation?._id || currentConversation._id,
      });

      // Optimistically update UI
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    },
    [socket, currentConversation?._id, currentChatBoxConversation?._id]
  );

  // Add socket listener for messageDeleted
  useEffect(() => {
    if (!socket) return;

    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    });

    return () => {
      socket.off("messageDeleted");
    };
  }, [socket]);

  const updateGroupName = async (groupId: string, newName: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/update/group-name/${groupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ groupName: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update group name");
      }

      // Update local state
      setConversation((prevConversations: any) => {
        return prevConversations.map((conv: any) => {
          if (conv._id === groupId) {
            return {
              ...conv,
              groupName: newName,
            };
          }
          return conv;
        });
      });
    } catch (error) {
      console.error("Error updating group name:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("groupNameUpdated", (data: GroupNameUpdate) => {
      setConversation((prevConversations: any) => {
        return prevConversations.map((conv: any) => {
          if (conv._id === data.groupId) {
            return {
              ...conv,
              name: data.groupName,
            };
          }
          return conv;
        });
      });
    });

    return () => {
      socket.off("groupNameUpdated");
    };
  }, [socket]);

  return {
    messages,
    sendMessage,
    setMessages,
    currentConversation,
    setCurrentConversation,
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
  };
};

export default useChat;
