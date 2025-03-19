"use client";
import React from "react";
import styles from "./ActivityOverview.module.css";
import { IGetYoutubeEngagementOverview } from "../../00Types/OP_Analytics_Types";

export default function ActivityOverview({
  fetchedYoutubeEngagementOverview,
}: {
  fetchedYoutubeEngagementOverview: IGetYoutubeEngagementOverview;
}) {
  return (
    <section className={styles.ActivityOverview}>
      <p className={styles.ActivityOverviewTitle}>Engagement Overview</p>
      <div className={styles.ActivityOverviewContainer}>
        <div className={styles.ActivityBody}>
          {/* ===== Start Table ===== */}

          <div className={`${styles.tableContainer} flex`}>
            <div className={styles.table + " w-full"}>
              {/* Date display with proper formatting */}
              {fetchedYoutubeEngagementOverview?.youtubeAnalytics?.[0]
                ?.youtubeAnalytics?.[0]?.start ? (
                <span className={styles.dateDisplay}>
                  Data as of:{" "}
                  {
                    fetchedYoutubeEngagementOverview.youtubeAnalytics[0]
                      .youtubeAnalytics[0].start
                  }
                </span>
              ) : (
                <span className={styles.dateDisplay + " animate-pulse"}>
                  {" Loading..."}
                </span>
              )}

              {/* Table Header */}
              <ul className={styles.table_header}>
                <li className="w-[75%]">
                  <span>Brand</span>
                </li>
                <li className={`w-[25%] ${styles.center}`}>
                  <span>Engagement</span>
                </li>
              </ul>
              {/* Table Body */}
              <div className={styles.table_body}>
                {Array.isArray(
                  fetchedYoutubeEngagementOverview.youtubeAnalytics
                ) &&
                fetchedYoutubeEngagementOverview.youtubeAnalytics.length > 0
                  ? fetchedYoutubeEngagementOverview.youtubeAnalytics?.map(
                      (brand) => (
                        <ul key={brand.brandName}>
                          <li className="w-[75%]">
                            <span>{brand.brandName}</span>
                          </li>
                          <li className={`w-[25%] ${styles.center}`}>
                            <span>
                              {brand.youtubeAnalytics?.slice(-1)[0]
                                ?.engagementRate || "No Data Available!"}
                            </span>
                          </li>
                        </ul>
                      )
                    )
                  : [...Array(6)]?.map((_, i) => (
                      <li key={i} className="flex mb-[--sy-10px]">
                        <div className="w-[75%] h-4 bg-gray-300 rounded animate-pulse mr-2"></div>
                        <div className="w-[25%] h-4 bg-gray-300 rounded animate-pulse mr-2"></div>
                      </li>
                    ))}
              </div>
            </div>
          </div>
          {/* ===== End Table ===== */}
        </div>
      </div>
    </section>
  );
}
