"use client";
import React, { useContext, useEffect } from "react";
import Navbar from "@/app/_components/Navbar/Navbar";
import Footer from "@/app/_components/Footer/Footer";
// import { globalContext } from "@/app/_context/store";
// import { useSocket } from "@/app/_context/SocketProvider";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  // const {
  //   handleSignOut,
  //   setAuthState,
  //   signOut,
  // } = useContext(globalContext);
  // const { socket } = useSocket();
  useEffect(() => {
    sessionStorage.removeItem("selected-role");
    // handleSignOut(""); // until handle case without redirect to homepage
    // signOut();
    // setAuthState({
    //   token: "",
    //   decodedToken: null,
    // });
    // localStorage.removeItem("token");
    // localStorage.removeItem("decodedToken");
    // if (socket) {
    //   socket.disconnect();
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
  }, []);

  return (
    <>
      <div className=" w-full">
        <Navbar />
        <div className=" w-full">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default layout;
