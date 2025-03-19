"use client";
import React, { memo } from "react";
import styles from "./DashboardLeaderboard.module.css";

function DashboardLeaderboard() {
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="mb-[--sy-8px]">Employee Leaderboard</h3>

      <div
        className={`${styles.box} flex flex-col gap-[--sy-8px] w-full
      
      `}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={`${styles.smallBox}`}>
            <h5 className={`${styles.rightBorder} pe-[1vw]`}>{index + 1}</h5>
            <h5>John Doe</h5>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DashboardLeaderboard);
