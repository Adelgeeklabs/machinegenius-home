// ChartComponent.jsx
"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";

const ChartComponent = ({ data }) => {
  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false,
      },
      height: "100%",
    },

    dataLabels: {
      enabled: false,
    },

    series: [
      {
        name: "Revenue",
        data: data.map((item) => item[6] || 0),
      },
    ],

    colors: ["#31B2E9"],

    xaxis: {
      type: "datetime",
      categories: data.map((item) => item[0]),
    },

    yaxis: {
      labels: {
        formatter: function (val) {
          return Math.round(val).toLocaleString();
        },
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.5,
        stops: [0, 90, 100],
      },
    },

    markers: {
      size: 0,
    },

    stroke: {
      curve: "smooth",
    },

    legend: {
      show: false,
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString();
        },
      },
    },
  };

  return (
    <div style={{ height: "400px" }}>
      <ReactApexChart
        options={options}
        series={options.series}
        type="area"
        height="100%"
      />
    </div>
  );
};

export default ChartComponent;
