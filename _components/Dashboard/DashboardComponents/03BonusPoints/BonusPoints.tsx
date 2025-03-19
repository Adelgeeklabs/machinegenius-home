"use client";
import React from "react";
import styles from "./BonusPoints.module.css";

const arrowIcon = (
  <svg
    className="w-[--60px]"
    viewBox="0 0 20 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.49598 21.7002C0.792921 21.7002 0.381329 22.4921 0.785322 23.0675L9.26354 35.1429C9.60932 35.6354 10.3391 35.6354 10.6849 35.1429L19.1631 23.0675C19.5671 22.4921 19.1555 21.7002 18.4524 21.7002L14.6273 21.7002C14.1477 21.7002 13.7589 21.3114 13.7589 20.8319L13.7589 1.7238C13.7589 1.24423 13.3702 0.855468 12.8906 0.855468L7.68058 0.855468C7.20101 0.855468 6.81225 1.24424 6.81225 1.7238L6.81225 20.8319C6.81225 21.3115 6.42348 21.7002 5.94391 21.7002L1.49598 21.7002Z"
      fill="#FFFFFB"
    />
  </svg>
);

export default function BonusPoints() {
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="mb-[--sy-8px]">Bonus Points</h3>

      <div className={`${styles.box} relative h-full flex`}>
        <div
          className={`${styles.sideBox} absolute left-0 right-0 top-0 bottom-0 h-full flex flex-col justify-between items-center`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-bold text-[--21px]">250</span>
            <span className="font-medium text-[--14px]">Points</span>
          </div>

          {arrowIcon}
          <div className="flex flex-col items-center justify-center h-full">
            <span className="font-bold text-[--21px]">500</span>
            <span className="font-medium text-[--14px]">EGP</span>
          </div>
        </div>

        <div className="pl-[35%] text-[#2A2B2A] flex flex-col justify-between gap-[--14px] overflow-y-auto max-h-[100%]">
          <p>No Exceeding Breaks</p>
          <p>Rectangle reesizing</p>
          <p>Vector subtract</p>
          <p>Export distribute</p>
          <p>6 Articles per day</p>
          <p>Arrived on time for 3 Months</p>
          <p>Written article reached 1000 Views</p>
        </div>
      </div>
    </div>
  );
}
