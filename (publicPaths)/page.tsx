"use client";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
// import { globalContext } from "./_context/store";
// import { useSocket } from "./_context/SocketProvider";
// import { toast } from "react-hot-toast";

export default function Page() {
  const HomePage = dynamic(() => import("./HomePage"), {
    ssr: false,
    loading: () => (
      <section className="min-h-screen flex flex-col items-center justify-center bg-[--dark] fixed inset-0 z-[99999999999999]">
        <img src="/assets/logo white.svg" className="w-[80px] animate-pulse" />
      </section>
    ),
  });
  // const { authState } = useContext(globalContext);
  // const { socket, setOnlineUsers } = useSocket();

  useEffect(() => {
    sessionStorage.removeItem("selected-role");

    // if (socket && !authState.token) {
    //   // toast("clearing socket");
    //   // console.log("clearing socket");
    //   socket.disconnect();
    //   setOnlineUsers([]);
    //   [
    //     "disconnect",
    //     "connect",
    //     "reconnect_attempt",
    //     "reconnect",
    //     "reconnect_error",
    //     "BroadCastMessage",
    //     "message",
    //     "NotifyOneUser",
    //     "onlineUsers",
    //     "disconnectedUser",
    //     "connectedUser",
    //   ].forEach((event) => {
    //     socket.off(event);
    //   });
    // }
    const handleBeforeUnload = (): void => {
      window.scrollTo(0, 0);
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null; // Clean up the event listener
    };
  }, []);

  return <HomePage />;
}
