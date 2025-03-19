"use client";
import React, { memo } from "react";
import styles from "@/app/(authPaths)/op/analytics/analytics.module.css";
import dynamic from "next/dynamic";
const AreaChart = dynamic(
  () => import("@/app/_components/OP/Analytics/00Charts/AreaChart"),
  {
    ssr: false,
  }
);

function AnalyticsRightSide() {
  return (
    <div
      className={`${styles.card} card grow px-[1vw] py-[0.6vw] rounded-xl h-full bg-[var(--dark)] `}
    >
      <div className="relative flex justify-center h-full items-center gap-[1.5vw]">
        <div className="w-full place-self-end">
          <AreaChart
          seriesName={"AnalyticsRightSide"}
            chartData={[0, 0, 0, 0, 0, 0, 0]}
            // chartData={pageState.fetchedGroupInsightsChart.map(
            //   (e) => e?.result || 0
            // )}
          />
        </div>
        <div className="flex justify-center items-center gap-3 absolute right-3 top-2 text-sm border border-[var(--dark)] shadow-[2px_2.18px_5.5px_0px_#00000075] py-2 px-3 text-[var(--white)] rounded-[5px]">
          <span>Average</span>
          <span>|</span>
          {/* <span className="font-bold">{renderAvgValue()}</span> */}
          {/* <span>
                            <svg
                              width="18"
                              height="9"
                              viewBox="0 0 18 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.900543 9L17.101 9C17.265 8.99965 17.4258 8.96944 17.566 8.91261C17.7062 8.85579 17.8206 8.7745 17.8968 8.67749C17.973 8.58049 18.0081 8.47144 17.9984 8.36209C17.9887 8.25274 17.9345 8.14723 17.8417 8.05692L9.74149 0.242982C9.40578 -0.0809961 8.59756 -0.080996 8.26095 0.242982L0.160722 8.05692C0.066962 8.14705 0.0119789 8.25261 0.00174654 8.36214C-0.00848579 8.47167 0.0264241 8.58098 0.102683 8.67819C0.178943 8.7754 0.293634 8.8568 0.434298 8.91353C0.574961 8.97027 0.736217 9.00017 0.900543 9Z"
                                fill="#5FA85B"
                              />
                            </svg>
                          </span> */}
        </div>
      </div>
    </div>
  );
}

export default memo(AnalyticsRightSide);
