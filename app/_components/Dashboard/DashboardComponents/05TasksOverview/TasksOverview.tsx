"use client";
import React from "react";
import styles from "./TasksOverview.module.css";
import { TasksInDashboard } from "@/app/_data/data";

const renderTasksSec = TasksInDashboard.map((tasks, idx) => (
  <div
    className={`${styles.rightBorder} w-1/3 my-[0.7vw] text-center px-[0.75vw] flex flex-col gap-[0.8vw]`}
    key={idx}
  >
    <h5 className={`${styles.bottomBorder} pb-[0.7vw] `}>{tasks.taskType} </h5>
    <div className="flex flex-col gap-[0.25vw] items-center">
      {tasks.tasks.map((oneTask, i) => (
        <span
          key={i}
          className={`
        ${styles.coloredTxt} 
        ${
          tasks.taskType === "Completed"
            ? "bg-[#DBDBD7]"
            : oneTask === "PST USA"
              ? "bg-[#31B2E9B2]"
              : oneTask === "Canada"
                ? "bg-[#E9313EB2]"
                : oneTask === "PST Asia"
                  ? "bg-[#E1C655B2]"
                  : oneTask === "Investocracy"
                    ? "bg-[#5FA85BB5]"
                    : "bg-[#F36F24B2]"
        }
      `}
        >
          {oneTask}
        </span>
      ))}
    </div>
  </div>
));

export default function TasksOverview() {
  return (
    <>
      <div className={styles.halfHeader}>
        <h3>Tasks Overview</h3>
      </div>

      {/* his/her tasks over view */}
      <div className={`${styles.box} flex h-[20vh]`}>{renderTasksSec}</div>
    </>
  );
}
