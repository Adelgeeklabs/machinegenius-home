"use client";
import React from "react";
import styles from "./CareerProgression.module.css";
import { Positions } from "@/app/_data/data";
import { EmblaOptionsType } from "embla-carousel";
import dynamic from "next/dynamic";
const EmblaCarousel = dynamic(
  () => import("@/app/_components/new-carousel/NewCarousel"),
  { ssr: false }
);
const OPTIONS: EmblaOptionsType = { axis: "y", loop: true };

export default function CareerProgression() {
  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="mb-[--sy-8px]">Career Progression</h3>
      <div className={`${styles.box} p-[2vw] flex items-center bg-[#2A2B2A]`}>
        <div className="min-w-fit flex-grow">
          <EmblaCarousel slides={Positions} options={OPTIONS} />
        </div>

        <div className="w-[2px] h-[90%] bg-[#dbdbd7] mx-[--8px]"></div>

        <div
          className={`${styles.waysToTakeBonus} flex flex-col max-w-[60%] gap-[1vw] justify-center ${styles.careerSec} overflow-y-auto max-h-[100%]`}
        >
          <span>Reached 1 year mark</span>
          <p>100 Articles in 1 Year</p>
          <span>3 times Employee Of The Month</span>
          <p>Articles reached 1000+ Views</p>
        </div>
      </div>
    </div>
  );
}
