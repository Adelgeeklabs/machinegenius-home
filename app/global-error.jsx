"use client";
import dynamic from "next/dynamic";
import React from "react";
const ErrorPage = dynamic(
  () => import("@/app/_components/ErrorPage/ErrorPage"),
  {
    ssr: false,
    loading: () => (
      <section className="min-h-screen flex flex-col items-center justify-center bg-[--dark] fixed inset-0 z-[99999999999999]">
        <img src="/assets/logo white.svg" className="w-[80px] animate-pulse" />
      </section>
    ),
  }
);

export default function Error({ error, reset }) {
  return <ErrorPage error={error} reset={reset} isGlobalError={true} />;
}
