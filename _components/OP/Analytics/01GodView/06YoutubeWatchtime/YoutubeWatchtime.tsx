"use client";
import React from "react";
import styles from "./YoutubeWatchtime.module.css";
import dynamic from "next/dynamic";
import { notFoundIconSm } from "@/app/_utils/svgIcons";
const AreaChart3 = dynamic(
  () => import("@/app/_components/OP/Analytics/00Charts/AreaChart3"),
  {
    ssr: false,
  }
);
const upArrow = (
  <svg
    className="w-[--18px] h-[--10px]"
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.92387 0.67965C4.7286 0.484388 4.41202 0.484388 4.21676 0.67965L1.03478 3.86163C0.839516 4.05689 0.839516 4.37347 1.03478 4.56874C1.23004 4.764 1.54662 4.764 1.74189 4.56874L4.57031 1.74031L7.39874 4.56874C7.594 4.764 7.91058 4.764 8.10585 4.56874C8.30111 4.37347 8.30111 4.05689 8.10585 3.86163L4.92387 0.67965ZM4.07031 1.0332L4.07031 9.96643L5.07031 9.96643L5.07031 1.0332L4.07031 1.0332Z"
      fill="#5DB48A"
    />
  </svg>
);
const downArrow = (
  <svg
    className="w-[--18px] h-[--10px]"
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.21676 9.41959C4.41202 9.61486 4.7286 9.61486 4.92387 9.41959L8.10585 6.23761C8.30111 6.04235 8.30111 5.72577 8.10585 5.53051C7.91058 5.33524 7.594 5.33524 7.39874 5.53051L4.57031 8.35893L1.74189 5.53051C1.54662 5.33524 1.23004 5.33524 1.03478 5.53051C0.839516 5.72577 0.839516 6.04235 1.03478 6.23761L4.21676 9.41959ZM4.07031 0.132812L4.07031 9.06604L5.07031 9.06604L5.07031 0.132813L4.07031 0.132812Z"
      fill="#EB7487"
    />
  </svg>
);
const sidewaysIcon = (
  <svg
    className="w-[--18px] h-[--10px]"
    viewBox="0 0 18 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5L5 1M5 1L9 5M5 1L9 5M17 5L13 9M13 9L9 5"
      stroke="#808080"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function YoutubeWatchtime({
  fetchedYoutubeData,
  isLoadingYoutubeData,
}: {
  fetchedYoutubeData: any;
  isLoadingYoutubeData: boolean;
}) {
  return (
    <section className={styles.YoutubeWatchTime}>
      <p className={styles.title}>Youtube Watch time</p>
      <div className={styles.YoutubeWatchTimeContainer}>
        <div className={styles.YoutubeWatchTimeBody}>
          {/* ===== Start Table ===== */}
          <div className={`${styles.tableContainer} flex`}>
            <div className={styles.table + " w-full"}>
              {/* Table Header */}
              <ul className={styles.table_header}>
                <li className="w-[30%]">
                  <span>Channel</span>
                </li>
                <li className={`w-[70%] ${styles.center}`}>
                  <span>Daily Average</span>
                </li>
              </ul>

              {/* Table Body */}
              <div className={styles.table_body}>
                {isLoadingYoutubeData ? (
                  <div className={styles.table_body}>
                    {/* Skeleton Rows */}
                    {[...Array(2)].map((_, index) => (
                      <ul
                        key={index}
                        className="flex items-center justify-between gap-[15px] py-[15px] px-[15px] border-b border-[#dfdfdf] last:border-none"
                      >
                        <li className="w-[30%]">
                          <span className="block bg-gray-300 h-[15px] w-24 rounded animate-pulse"></span>
                        </li>
                        <li className="w-[70%] flex items-center justify-between">
                          <div
                            className={`${styles.chart} flex items-center justify-center`}
                            style={{ width: "60%", height: "40px" }} // Adjusted height and width to match CSS
                          >
                            <span className="block bg-gray-300 h-full w-full rounded animate-pulse"></span>
                          </div>
                          <div
                            className={`${styles.dailyAverage} flex items-center`}
                          >
                            <span className="block bg-gray-300 h-[15px] w-16 rounded animate-pulse"></span>
                          </div>
                        </li>
                      </ul>
                    ))}
                  </div>
                ) : fetchedYoutubeData &&
                  Array.isArray(fetchedYoutubeData) &&
                  fetchedYoutubeData.length ? (
                  // Map over brandsData and render each brand
                  fetchedYoutubeData.map((brand: any) => {
                    const brandName = brand.brandName;
                    const brandData =
                      brand.data && Array.isArray(brand.data.data)
                        ? brand.data.data
                        : [];

                    // Calculate the average daily value
                    const avgDailyValue =
                      brandData.length > 0 ? brandData?.slice(-1)[0][4] : 0;

                    // Prepare the chart data
                    const chartData = brandData.map((e: any) => e[4]);
                    const datesCategories = brandData.map((e: any) => e[0]);
                    return (
                      <ul
                        key={brand.brandId}
                        className="flex items-center justify-between gap-[15px] py-[15px] px-[15px] border-b border-[#dfdfdf] last:border-none"
                      >
                        <li className="w-[30%]">
                          <span>{brandName}</span>
                        </li>
                        <li className={`w-[70%] ${styles.center}`}>
                          <span className={styles.chart}>
                            <div className="h-[80%]">
                              <AreaChart3
                                seriesName={"Youtube Watchtime"}
                                chartData={chartData}
                                datesCategories={datesCategories}
                              />
                            </div>
                          </span>
                          <span className={styles.dailyAverage}>
                            <span>{avgDailyValue}</span>
                            <span>
                              {avgDailyValue === 0
                                ? sidewaysIcon
                                : avgDailyValue > 0
                                  ? upArrow
                                  : downArrow}
                            </span>
                          </span>
                        </li>
                      </ul>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-[--sy-16px]">
                    {notFoundIconSm}
                    <span className="text-[--16px] font-semibold text-gray-500">
                      No Data Available!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* ===== End Table ===== */}
        </div>
      </div>
    </section>
  );
}
