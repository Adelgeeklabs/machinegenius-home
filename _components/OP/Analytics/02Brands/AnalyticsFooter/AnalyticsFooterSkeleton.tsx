"use client";
import React, { memo } from "react";
import styles from "@/app/(authPaths)/op/analytics/analytics.module.css";

function AnalyticsFooterSkeleton() {
  return (
    <div
      className={`${styles.card} flex gap-[3vw] grow px-[1vw] py-[0.6vw] rounded-xl bg-[var(--dark)]`}
    >
      {/* Left Section */}
      <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
        {/* Text Content Placeholder */}
        <div className="w-1/2 h-full flex flex-col">
          <div className="h-6 bg-gray-300 animate-pulse rounded-md mb-4"></div>
          <ul className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 animate-pulse rounded-md w-1/2"></div>
                <div className="h-4 bg-gray-300 animate-pulse rounded-md w-1/4"></div>
              </li>
            ))}
          </ul>
        </div>
        {/* Chart Placeholder */}
        <div className="w-1/2 py-2 h-full flex justify-center items-center">
          <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
            <div className="h-4 bg-gray-300 animate-pulse rounded-md m-4"></div>
            <div className="h-24 bg-gray-300 animate-pulse rounded-md m-4"></div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center w-1/2 h-full gap-[1.5vw] text-[var(--white)]">
        {/* Text Content Placeholder */}
        <div className="w-1/2 h-full flex flex-col">
          <div className="h-6 bg-gray-300 animate-pulse rounded-md mb-4"></div>
          <ul className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 animate-pulse rounded-md w-1/2"></div>
                <div className="h-4 bg-gray-300 animate-pulse rounded-md w-1/4"></div>
              </li>
            ))}
          </ul>
        </div>
        {/* Chart Placeholder */}
        <div className="w-1/2 py-2 h-full flex justify-center items-center">
          <div className="bg-[#0F0F0F] h-full w-full rounded-2xl overflow-hidden">
            <div className="h-4 bg-gray-300 animate-pulse rounded-md m-4"></div>
            <div className="h-24 bg-gray-300 animate-pulse rounded-md m-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AnalyticsFooterSkeleton);