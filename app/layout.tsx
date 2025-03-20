"use client";
import { useEffect, useState } from "react";
import "./globals.css"; // Importing global styles
import { Toaster } from "react-hot-toast";
// import dynamic from "next/dynamic";
// import { usePathname } from "next/navigation";
import { loadPolyfills } from "@/app/_utils/polyfills";

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  function getOnlineStatus() {
    return typeof navigator !== "undefined" &&
      typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true;
  }

  const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus);

  useEffect(() => {
    const goOnline = () => setOnlineStatus(true);
    const goOffline = () => setOnlineStatus(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    loadPolyfills()
      .then(() => {
        console.log("Polyfills loaded");
      })
      .catch((error) => {
        console.error("Error loading polyfills:", error);
      });
  }, []);

  // const path = usePathname();
  return (
    <html lang="en">
      <head>
        {/* <!-- Preload Acumin Pro Bold Italic --> */}
        <link
          rel="preload"
          href="/fonts/Acumin-BdItPro.woff"
          as="font"
          crossOrigin="anonymous"
        />

        {/* <!-- Preload Hellix Black --> */}
        <link
          rel="preload"
          href="/fonts/Hellix-Black.woff2"
          as="font"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div className="main_wrapper overflow-hidden bg-[--dark]">
          <div className="w-full h-100vh p-0 overflow-hidden">{children}</div>
        </div>
        <Toaster
          position="top-center"
          containerStyle={{
            zIndex: 50001,
          }}
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"
          defer
        ></script>
        {!onlineStatus && (
          <div className="offlineMsg">
            Oops! It seems like you&apos;re currently offline
          </div>
        )}
      </body>
    </html>
  );
}
