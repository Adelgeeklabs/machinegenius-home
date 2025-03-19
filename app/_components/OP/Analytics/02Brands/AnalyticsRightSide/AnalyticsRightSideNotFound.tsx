"use client";
import React, { memo } from "react";
import styles from "@/app/(authPaths)/op/analytics/analytics.module.css";

function AnalyticsRightSideNotFound() {
  return (
    <div
      className={`${styles.card} card grow px-[1vw] py-[0.6vw] rounded-[--12px] h-full bg-[var(--dark)] flex flex-col items-center justify-center`}
    >
      <svg
        className="w-[--64px] h-[--64px] text-gray-400 mb-[--sy-16px]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-gray-400 text-[--18px] font-medium">
        No Analytics Data Available!
      </p>
    </div>
  );
}

export default memo(AnalyticsRightSideNotFound);
