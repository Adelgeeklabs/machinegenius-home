"use client";
import dynamic from "next/dynamic";
import React from "react";
const NotFoundPage = dynamic(
  () => import("@/app/_components/NotFoundPage/NotFoundPage"),
  {
    ssr: false,
  }
);

export default function NotFound() {
  return <NotFoundPage />;
}
