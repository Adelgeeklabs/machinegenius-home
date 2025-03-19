"use client";
import React from "react";
import styles from "./UpComingEvents.module.css";

export default function UpComingEvents() {
  return (
    <div className="flex-grow flex flex-col gap-[1.2vw]">
      <div className={`${styles.events} h-full`}>
        <div className={`${styles.eventsBox} flex flex-col gap-[0.4vw]`}>
          <h5>This Week</h5>
          <p>No Events</p>
        </div>

        <div className={`${styles.eventsBox} flex flex-col gap-[0.4vw]`}>
          <h5>This Month</h5>
          <p>No Events</p>
        </div>

        <div className={`${styles.eventsBox} flex flex-col gap-[0.4vw]`}>
          <h5>Next Month</h5>
          <p>No Events</p>
        </div>
      </div>
    </div>
  );
}
