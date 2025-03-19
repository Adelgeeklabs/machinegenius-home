"use client";
import { memo } from "react";
import { usePathname } from "next/navigation";
import styles from "./TitleOfPage.module.css";

const TitleOfPage = ({ title }: { title: string }) => {
  const pathname = usePathname(); // example: /content-creator/dashboard

  if (pathname.includes("dashboard")) {
    return null;
  }


  return (
    <div className={styles.title_of_page + " relative"}>
      <h3>{title}</h3>
    </div>
  );
};

export default memo(TitleOfPage);
