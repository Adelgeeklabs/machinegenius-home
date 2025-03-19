"use client";
import React, { memo } from "react";
import ReactApexChart from "react-apexcharts";
import { getSlicedChartData } from "./getSlicedChartData";
import { IPageState } from "../00Types/OP_Analytics_Types";

// todo: change the colors based on the trend
const options: any = {
  chart: {
    zoom: {
      enabled: false,
    },
    toolbar: false,
  },
  fill: {
    type: "gradient",
    colors: ["#31B2E9"],
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.1,
    },
  },
  stroke: {
    colors: ["#31B2E9"],
    width: 3,
  },
  dataLabels: {
    enabled: false, // Disable data labels here
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    show: false,
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
};

const AreaChart = ({
  seriesName,
  chartData,
  chartOptions,
  timeframe,
}: {
  seriesName: string;
  chartData: number[];
  chartOptions?: any;
  timeframe?: IPageState["activeAnalyticsTimeframe"];
}) => {
  const series = [
    {
      name: seriesName,
      data: timeframe ? getSlicedChartData(chartData, timeframe) : chartData,
    },
  ];

  return (
    <ReactApexChart
      type="area"
      options={chartOptions ? chartOptions : options}
      series={series}
      height={"100%"}
      width={"100%"}
    />
  );
};

export default memo(AreaChart);
