// pages/dashboard.tsx
"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import ProfileCard from "./DashboardComponents/ProfileCard/ProfileCard";
import PayrollCard from "./DashboardComponents/PayrollCard/PayrollCard";
import KPICard from "./DashboardComponents/KPICard/KPICard";
import TodayTasks from "./DashboardComponents/TodayTasks/TodayTasks";
import EventsCard from "./DashboardComponents/EventsCard/EventsCard";
import PerformanceCard from "./DashboardComponents/PerformanceCard/PerformanceCard";
import BalanceCard from "./DashboardComponents/BalanceCard/BalanceCard";
import BonusCard from "./DashboardComponents/BonusCard/BonusCard";
import QuickActions from "./DashboardComponents/QuickActions/QuickActions";
import LeaderboardCard from "./DashboardComponents/LeaderboardCard/LeaderboardCard";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Dashboard: NextPage = () => {
  const pathname = usePathname();
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      console.log(e.target);
    });
  }, []);

  return (
    <div className="p-8 pt-6">
      <h2 className=" font-bold text-[--40px] mb-3">Dashboard</h2>

      <div className="flex justify-between items-center mb-3">
        <p className=" text-headings font-medium text-[--20px]">
          Welcome Back,{" "}
          {JSON.parse(localStorage.getItem("decodedToken") || "{}").firstName}!
        </p>
        <div className=" flex gap-[10px] items-center">
          <div className=" w-fit relative">
            <button
              onClick={() => setShowActions((prev) => !prev)}
              className=" bg-[#114560] w-[40px] h-[40px] rounded-[5px] flex justify-center items-center gap-1"
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={` ${showActions ? "rotate-[135deg] scale-105" : "rotate-0 scale-100"} transition-transform duration-300`}
              >
                <g filter="url(#filter0_d_9862_8083)">
                  <rect
                    x="10"
                    y="8"
                    width="40"
                    height="40"
                    rx="5"
                    fill="#114560"
                  />
                  <path
                    d="M30 37C29.2903 37 28.7143 36.424 28.7143 35.7143V20.2857C28.7143 19.576 29.2903 19 30 19C30.7097 19 31.2857 19.576 31.2857 20.2857V35.7143C31.2857 36.424 30.7097 37 30 37Z"
                    fill="white"
                  />
                  <path
                    d="M37.7143 29.2857H22.2857C21.576 29.2857 21 28.7097 21 28C21 27.2903 21.576 26.7143 22.2857 26.7143H37.7143C38.424 26.7143 39 27.2903 39 28C39 28.7097 38.424 29.2857 37.7143 29.2857Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_9862_8083"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.0666667 0 0 0 0 0.270588 0 0 0 0 0.376471 0 0 0 0.2 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_9862_8083"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_9862_8083"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
            {showActions && (
              <div className=" absolute top-12 left-1/2 -translate-x-1/2 z-20">
                <QuickActions />
              </div>
            )}
          </div>
          <Link
            href={`/${pathname.split("/")[1]}/employees-hierarchy`}
            className=" bg-white py-3 px-2 rounded-[5px] flex justify-center items-center gap-1 text-headings font-semibold"
          >
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3333 5.33333V4H10C9.82319 4 9.65362 4.07024 9.5286 4.19526C9.40357 4.32029 9.33333 4.48986 9.33333 4.66667V11.3333C9.33333 11.5101 9.40357 11.6797 9.5286 11.8047C9.65362 11.9298 9.82319 12 10 12H11.3333V10.6667C11.3333 10.313 11.4738 9.97391 11.7239 9.72386C11.9739 9.47381 12.313 9.33333 12.6667 9.33333H16.6667C17.0203 9.33333 17.3594 9.47381 17.6095 9.72386C17.8595 9.97391 18 10.313 18 10.6667V14.6667C18 15.0203 17.8595 15.3594 17.6095 15.6095C17.3594 15.8595 17.0203 16 16.6667 16H12.6667C12.313 16 11.9739 15.8595 11.7239 15.6095C11.4738 15.3594 11.3333 15.0203 11.3333 14.6667V13.3333H10C9.46957 13.3333 8.96086 13.1226 8.58579 12.7475C8.21071 12.3725 8 11.8638 8 11.3333V8.66667H5.33333V9.33333C5.33333 9.68696 5.19286 10.0261 4.94281 10.2761C4.69276 10.5262 4.35362 10.6667 4 10.6667H1.33333C0.979711 10.6667 0.640573 10.5262 0.390524 10.2761C0.140476 10.0261 0 9.68696 0 9.33333V6.66667C0 6.31305 0.140476 5.97391 0.390524 5.72386C0.640573 5.47381 0.979711 5.33333 1.33333 5.33333H4C4.35362 5.33333 4.69276 5.47381 4.94281 5.72386C5.19286 5.97391 5.33333 6.31305 5.33333 6.66667V7.33333H8V4.66667C8 4.13623 8.21071 3.62753 8.58579 3.25245C8.96086 2.87738 9.46957 2.66667 10 2.66667H11.3333V1.33333C11.3333 0.979711 11.4738 0.640573 11.7239 0.390524C11.9739 0.140476 12.313 0 12.6667 0H16.6667C17.0203 0 17.3594 0.140476 17.6095 0.390524C17.8595 0.640573 18 0.979711 18 1.33333V5.33333C18 5.68696 17.8595 6.02609 17.6095 6.27614C17.3594 6.52619 17.0203 6.66667 16.6667 6.66667H12.6667C12.313 6.66667 11.9739 6.52619 11.7239 6.27614C11.4738 6.02609 11.3333 5.68696 11.3333 5.33333Z"
                fill="#114560"
              />
            </svg>
            My Team
          </Link>
          <Link
            href={"/faq"}
            className=" bg-white py-3 px-2 rounded-[5px] flex justify-center items-center gap-1 text-headings font-semibold"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 0C3.58667 0 0 3.58667 0 8C0 12.4133 3.58667 16 8 16C12.4133 16 16 12.4133 16 8C16 3.58667 12.4133 0 8 0ZM8 14.6667C4.32 14.6667 1.33333 11.68 1.33333 8C1.33333 4.32 4.32 1.33333 8 1.33333C11.68 1.33333 14.6667 4.32 14.6667 8C14.6667 11.68 11.68 14.6667 8 14.6667Z"
                fill="#114560"
              />
              <path
                d="M8.56973 3.40384C7.28973 3.08384 5.86306 3.89717 5.4764 5.1505C5.3564 5.5105 5.5564 5.88384 5.90306 5.9905C6.24973 6.09717 6.62306 5.9105 6.74306 5.5505C6.92973 4.96384 7.64973 4.5505 8.26306 4.69717C8.86306 4.84384 9.3164 5.5505 9.1964 6.16384C9.08973 6.77717 8.4364 7.2705 7.80973 7.1905C7.62306 7.16384 7.42306 7.2305 7.28973 7.3505C7.14306 7.48384 7.06306 7.65717 7.06306 7.85717L7.04973 9.93717C7.04973 10.3105 7.34306 10.6038 7.7164 10.6038C8.08973 10.6038 8.38306 10.3105 8.38306 9.93717L8.3964 8.48384C9.42306 8.28384 10.3297 7.44384 10.5164 6.3905C10.7564 5.09717 9.86306 3.72384 8.56973 3.40384Z"
                fill="#114560"
              />
              <path
                d="M7.74641 11.1875H7.73307C7.37307 11.1875 7.07974 11.4942 7.06641 11.8542C7.06641 11.8675 7.06641 11.9875 7.06641 12.0008C7.06641 12.3608 7.35974 12.6008 7.71974 12.6142H7.73307C8.09307 12.6142 8.38641 12.2808 8.39974 11.9208C8.39974 11.9075 8.39974 11.8275 8.39974 11.8142C8.38641 11.4542 8.10641 11.1875 7.74641 11.1875Z"
                fill="#114560"
              />
            </svg>
            Policies & FAQs
          </Link>
        </div>
      </div>

      <div className="w-full grid grid-cols-9 gap-4">
        <div className="grid col-span-6 grid-cols-8 gap-4 content-start">
          <div className="col-span-3">
            <ProfileCard />
          </div>
          <div className="col-span-5">
            <PerformanceCard />
          </div>
          <div className="col-span-8 h-auto">
            <TodayTasks />
          </div>
          <div className="col-span-3">
            <BalanceCard />
          </div>
          <div className="col-span-5">
            <BonusCard />
          </div>
        </div>
        <div className="col-span-3 grid gap-4 content-start">
          <div>
            <LeaderboardCard />
          </div>
          <div>
            <PayrollCard />
          </div>
          <div>
            <KPICard />
          </div>
          <div>
            <EventsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
