"use client";
import React, { memo } from "react";
import styles from "../CardStyles.module.css";
import { notFoundIcon } from "@/app/_utils/svgIcons";
function AnalyticsTabsCardNotFound() {
  return (
    <div
      className={`${styles.card} w-1/2 h-[200px] px-[1vw] rounded-xl overflow-hidden bg-white border border-gray-200`}
    >
      <div className="flex flex-col justify-center items-center h-full gap-4">
        {notFoundIcon}
        <p className="font-semibold text-gray-500">No Data Available!</p>
      </div>
    </div>
  );
}

export default memo(AnalyticsTabsCardNotFound);
