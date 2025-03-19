"use client";
import React, { memo } from "react";
import styles from "@/app/(authPaths)/op/analytics/analytics.module.css";

function AnalyticsFooterNotFound() {
  return (
    <div
      className={`${styles.card} flex grow px-[1vw] py-[2.8vw] rounded-[--12px] bg-[var(--dark)] h-full items-center justify-center`}
    >
      <div className="text-center">
        <svg
          className="w-[--64px] h-[--64px] text-gray-400 mb-[--sy-16px] mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-gray-400 text-[--18px] font-medium">
          No Engagement Data Available!
        </p>
      </div>
    </div>
  );
}

export default memo(AnalyticsFooterNotFound);
