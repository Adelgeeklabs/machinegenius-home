"use client";
import dynamic from "next/dynamic";
import React from "react";
const SignInPage = dynamic(() => import("./SignIn"), {
  ssr: false,
  loading: () => (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[--dark] fixed inset-0 z-[99999999999999]">
      <img src="/assets/logo white.svg" className="w-[80px] animate-pulse" />
    </section>
  ),
});

export default function Page() {
  return <SignInPage />;
}
