"use client";
import React, {memo} from "react";
import styles from "@/app/(authPaths)/op/analytics/analytics.module.css";

function AnalyticsRightSideSkeleton() {
  return (
    <div
      className={`${styles.card} card grow px-[1vw] py-[0.6vw] rounded-xl h-full bg-[var(--dark)] `}
    >
      <div className="relative flex justify-center h-full items-center gap-[1.5vw]">
        <div className="w-full place-self-end">
          {/* Loading Skeleton for the AreaChart */}
          <div className="bg-gray-300 animate-pulse h-40 w-full rounded"></div>
        </div>

        <div className="flex justify-center items-center gap-3 absolute right-3 top-2 text-sm border border-[var(--dark)] shadow-[2px_2.18px_5.5px_0px_#00000075] py-2 px-3 text-[var(--white)] rounded-[5px]">
          {/* Loading Skeleton for the "Average" text */}
          <span className="bg-gray-300 animate-pulse h-4 w-16 block rounded"></span>
          <span>|</span>
          <span className="bg-gray-300 animate-pulse h-4 w-12 block rounded"></span>
        </div>
      </div>
    </div>
  );
}

export default memo(AnalyticsRightSideSkeleton);