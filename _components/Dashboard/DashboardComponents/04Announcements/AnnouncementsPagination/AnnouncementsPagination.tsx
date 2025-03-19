"use client";
import React from "react";
import styles from "./AnnouncementsPagination.module.css";
import { IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Customized arrows component to handle pagination
export const AnnouncementsPagination = ({
  onclickRight,
  onclickLeft,
  currentIndex,
  total,
}: {
  onclickRight?: () => void;
  onclickLeft?: () => void;
  currentIndex: number;
  total: number;
}) => {
  return (
    <div className="flex items-center gap-[1vw]">
      <IconButton
        className={styles.iconButton}
        size="sm"
        variant="text"
        onClick={onclickLeft}
        disabled={currentIndex === 0}
        placeholder="" // Add this if required by IconButtonProps
        onPointerEnterCapture={() => {}} // Add this if required by IconButtonProps
        onPointerLeaveCapture={() => {}} // Add this if required by IconButtonProps
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>

      <IconButton
        className={styles.iconButton}
        size="sm"
        variant="text"
        onClick={onclickRight}
        disabled={currentIndex === total - 1}
        placeholder="" // Add this if required by IconButtonProps
        onPointerEnterCapture={() => {}} // Add this if required by IconButtonProps
        onPointerLeaveCapture={() => {}} // Add this if required by IconButtonProps
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
};
