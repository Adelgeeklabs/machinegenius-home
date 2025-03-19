"use client";
import React, { memo } from "react";
import styles from "../CardStyles.module.css";
import convertTimestampToDate from "@/app/_utils/convertTimestampToDate";

interface IProps {
  platformName:
    | "TELEGRAM"
    | "FACEBOOK"
    | "REDDIT"
    | "TWITTER"
    | "YOUTUBE"
    | "LINKEDIN"
    | "NEWSLETTER";
  brandName: string;
  acquisitionDate?: number;
  niche?: string;
  isActive: boolean;
  onClick?: () => void;
}

function SocialMediaAccountCard({
  platformName,
  brandName,
  acquisitionDate,
  niche,
  isActive,
  onClick,
}: IProps) {
  return (
    <div
      className={`${
        styles.card
      } px-[1vw] pt-[0.6vw] pb-[1vw] rounded-xl group overflow-hidden ${
        isActive ? "bg-[var(--dark)] text-[var(--white)]" : ""
      } hover:bg-[var(--dark)] hover:text-[var(--white)] cursor-pointer`}
      onClick={onClick}
    >
      <div
        className={`flex justify-between items-center pb-[0.5vw] border-b-[1px] ${
          isActive ? "border-b-[var(--white)]" : "border-b-[#2A2B2A]"
        } group-hover:border-b-[var(--white)] mb-[0.5vw]`}
      >
        <h3 className="grow font-bold text-center">
          {platformName[0] + platformName?.slice(1)?.toLowerCase()}
        </h3>
      </div>
      <div className="grid mx-auto w-full grid-cols-2">
        <span className="font-bold text-left">Brand:</span>
        <span className="text-right">{brandName}</span>
        {acquisitionDate && (
          <>
            <span className="font-bold text-left">Acquisition Date:</span>
            <span className="text-right">
              {convertTimestampToDate(acquisitionDate)}
            </span>
          </>
        )}
        {niche && (
          <>
            <span className="font-bold text-left">Niche:</span>
            <span className="text-right">{niche}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(SocialMediaAccountCard);
