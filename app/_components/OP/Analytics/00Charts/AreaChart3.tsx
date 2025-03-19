"use client";
import React, { memo } from "react";
import ReactApexChart from "react-apexcharts";

// todo: change the colors based on the trend
const AreaChart3 = ({
  seriesName,
  chartData,
  chartOptions,
  datesCategories,
}: {
  seriesName: string;
  chartData: number[];
  chartOptions?: any;
  datesCategories: string[];
}) => {
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
      type: "category",
      categories: datesCategories,
      labels: {
        show: false  // This hides the x-axis dates
      },
      axisBorder: {
        show: false  // Optional: also hides the x-axis line
      },
      axisTicks: {
        show: false  // Optional: hides the x-axis ticks
      }
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

  const series = [
    {
      name: seriesName,
      data:  chartData,
    },
  ];

  return (
    <ReactApexChart
      type="area"
      options={chartOptions ? chartOptions : options}
      series={series}
      width={"100%"}
    />
  );
};

export default memo(AreaChart3);
