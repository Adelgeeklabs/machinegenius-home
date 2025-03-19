"use client";
import dynamic from "next/dynamic";
import React, { useContext, useState, useEffect } from "react";
import styles from "./RevenueOverview.module.css";
import CustomSelectInput from "@/app/_components/CustomSelectInput/CustomSelectInput";
import { globalContext } from "@/app/_context/store";
import toast from "react-hot-toast";
import { YoutubeDataRow } from "@/app/_components/OP/Analytics/00Types/OP_Analytics_Types";

const Chart1 = dynamic(() => import("./Chart1"), {
  ssr: false,
});

// Get the current date
const currentDate = new Date();

// Calculate dates for previous month
const previousFirstDay = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 1,
  1
)
  .toISOString()
  ?.split("T")[0]; // Format as YYYY-MM-DD

// Calculate dates for current month
const currentLastDay = new Date().toISOString()?.split("T")[0]; // Format as YYYY-MM-DD

export default function RevenueOverview() {
  const { brandMap, brandIdMap, getBrandsPlatform, authState, handleSignOut } =
    useContext(globalContext);
  const [pageState, setPageState] = useState<{
    brandsOptions: string[];
    selectedBrandId: string;
    isBrandsLoading: boolean;
    fetchedYoutubeRevenue: YoutubeDataRow[];
    isChartLoading: boolean;
  }>({
    brandsOptions: [],
    selectedBrandId: "",
    isBrandsLoading: false,
    fetchedYoutubeRevenue: [],
    isChartLoading: false,
  });

  async function handleGetBrandsPlatform(platform: string) {
    setPageState((prev) => ({
      ...prev,
      isBrandsLoading: true,
    }));
    const result = await getBrandsPlatform(platform);
    const brands: string[] = Array.isArray(result) ? result : [];
    setPageState((prev) => ({
      ...prev,
      brandsOptions: brands,
      isBrandsLoading: false,
    }));
  }

  useEffect(() => {
    handleGetBrandsPlatform("YOUTUBE");
  }, []);

  useEffect(() => {
    if (pageState.brandsOptions.length) {
      setPageState((prevState) => ({
        ...prevState,
        selectedBrandId: brandMap[pageState.brandsOptions[0]],
      }));
    }
  }, [pageState.brandsOptions]);

  const getYoutubeRevenue = async () => {
    setPageState((prevState) => ({
      ...prevState,
      isChartLoading: true,
      fetchedYoutubeRevenue: [],
    }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/op/analytics/get-youtube-revenues?brand=${pageState.selectedBrandId}&startDate=${previousFirstDay}&endDate=${currentLastDay}`,
        {
          headers: {
            Authorization: `bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      if (!res.ok && res.status !== 401) {
        toast.error(
          `Failed to fetch Youtube Revenue for ${brandIdMap?.[pageState.selectedBrandId]}!`
        );
        return;
      }
      const data = await res.json();
      if (data) {
        setPageState((prevState: any) => ({
          ...prevState,
          fetchedYoutubeRevenue: data.data.data,
        }));
      }
    } catch (error) {
      console.error(
        `Error fetching Youtube Revenue for ${brandIdMap?.[pageState.selectedBrandId]}:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to fetch Youtube Revenue for ${brandIdMap?.[pageState.selectedBrandId]}!`
      );
    } finally {
      setPageState((prevState) => ({
        ...prevState,
        isChartLoading: false,
      }));
    }
  };

  useEffect(() => {
    if (pageState.selectedBrandId && pageState.brandsOptions.length) {
      getYoutubeRevenue();
    }
  }, [pageState.selectedBrandId]);

  return (
    <section className={styles.RevenueOverView_Container}>
      <div className={styles.RevenueOverView_Header}>
        <p className={styles.RevenueOverView_Title}>Revenue Overview</p>
        <div className="flex justify-between">
          <div className="w-1/3">
            {pageState.isBrandsLoading ? (
              <div className="w-full flex justify-center items-center">
                <span className="custom-loader"></span>
              </div>
            ) : !pageState.brandsOptions ||
              !Array.isArray(pageState.brandsOptions) ||
              !pageState.brandsOptions.length ? (
              <div className="w-fit p-[--12px] bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-[--8px] text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[--20px] w-[--20px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No brands found!</span>
                </div>
              </div>
            ) : (
              <CustomSelectInput
                label={brandIdMap[pageState.selectedBrandId]}
                options={pageState.brandsOptions}
                getValue={(value: string) => {
                  setPageState((prevState) => ({
                    ...prevState,
                    selectedBrandId: brandMap[value],
                  }));
                }}
                hoverColor="hover:bg-[#E1C655]"
              />
            )}
          </div>

          {pageState.fetchedYoutubeRevenue.length ? (
            <div className="flex items-center gap-[--8px] px-[--10px] py-[--6px] bg-[--dark] rounded-[--8px]">
              <svg
                className="w-[--16px] h-[--16px] text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[--13px] text-gray-300 flex flex-col gap-[--4px]">
                <span>
                  Data as of: {`${previousFirstDay} ~ ${currentLastDay}`}
                </span>
                <span className="text-[--13px] text-gray-300">
                  YouTube data has a 3-period delay in reporting
                </span>
              </p>
            </div>
          ): null}
          {/* <div className={styles.chartLegend + " flex flex-col"}>
            <div className="flex items-center gap-2">
              <span className="w-[10px] h-[10px] rounded-sm bg-[#E1C655]"></span>
              <span>Street Politics</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-[10px] h-[10px] rounded-sm bg-[#31B2E9]"></span>
              <span>PST USA</span>
            </div>
          </div> */}
        </div>
      </div>
      <div className={styles.RevenueOverView_Body}>
        {pageState.isChartLoading ? (
          <div className="w-full flex justify-center items-center h-full">
            <span className="custom-loader"></span>
          </div>
        ) : pageState.fetchedYoutubeRevenue &&
          Array.isArray(pageState.fetchedYoutubeRevenue) &&
          pageState.fetchedYoutubeRevenue.length ? (
          <Chart1 data={pageState.fetchedYoutubeRevenue} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[--64px] w-[--64px] mb-[--sy-16px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-[--18px] font-medium">No Data Available!</p>
            <p className="text-[--14px] mt-[--sy-8px]">
              There is no revenue data to display for{" "}
              {brandIdMap?.[pageState.selectedBrandId] || "the selected brand"}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
