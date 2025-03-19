import React from "react";

const PayrollCard = () => {
  return (
    <div className="bg-white px-6 py-4 rounded-[--15px] shadow">
      <div className="flex items-center mb-4">
        <div className="bg-[#11456012] w-[--32px] h-[--32px] flex justify-center items-center rounded-[--4px] mr-3">
          <svg
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.333984 3.44444C0.333984 2.09442 1.52789 1 3.00065 1H19.0007C20.4734 1 21.6673 2.09441 21.6673 3.44444V13.2222C21.6673 14.5723 20.4734 15.6667 19.0007 15.6667H3.00065C1.52789 15.6667 0.333984 14.5723 0.333984 13.2222V3.44444ZM3.00065 2.22222C2.26427 2.22222 1.66732 2.76943 1.66732 3.44444V4.66667H20.334V3.44444C20.334 2.76943 19.737 2.22222 19.0007 2.22222H3.00065ZM20.334 7.11111H1.66732V13.2222C1.66732 13.8972 2.26427 14.4444 3.00065 14.4444H19.0007C19.737 14.4444 20.334 13.8972 20.334 13.2222V7.11111Z"
              fill="#114560"
            />
            <path
              d="M3.00065 10.7778C3.00065 10.1028 3.5976 9.55556 4.33398 9.55556H5.66732C6.4037 9.55556 7.00065 10.1028 7.00065 10.7778V12C7.00065 12.675 6.4037 13.2222 5.66732 13.2222H4.33398C3.5976 13.2222 3.00065 12.675 3.00065 12V10.7778Z"
              fill="#114560"
            />
            <path
              d="M0.333984 3.44444C0.333984 2.09442 1.52789 1 3.00065 1H19.0007C20.4734 1 21.6673 2.09441 21.6673 3.44444V13.2222C21.6673 14.5723 20.4734 15.6667 19.0007 15.6667H3.00065C1.52789 15.6667 0.333984 14.5723 0.333984 13.2222V3.44444ZM3.00065 2.22222C2.26427 2.22222 1.66732 2.76943 1.66732 3.44444V4.66667H20.334V3.44444C20.334 2.76943 19.737 2.22222 19.0007 2.22222H3.00065ZM20.334 7.11111H1.66732V13.2222C1.66732 13.8972 2.26427 14.4444 3.00065 14.4444H19.0007C19.737 14.4444 20.334 13.8972 20.334 13.2222V7.11111Z"
              stroke="#114560"
              stroke-width="0.25"
            />
            <path
              d="M3.00065 10.7778C3.00065 10.1028 3.5976 9.55556 4.33398 9.55556H5.66732C6.4037 9.55556 7.00065 10.1028 7.00065 10.7778V12C7.00065 12.675 6.4037 13.2222 5.66732 13.2222H4.33398C3.5976 13.2222 3.00065 12.675 3.00065 12V10.7778Z"
              stroke="#114560"
              stroke-width="0.25"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-[#114560] text-base">
          My Next Payroll
        </h3>
      </div>

      <span className="text-xs font-medium mb-2 text-[#2A2B2A80]">
        Estimated
      </span>

      <div className="flex justify-between">
        <div className=" flex gap-3 items-center">
          <p className=" font-semibold text-headings">01 Mar 2025</p>
          <span className=" text-sm font-semibold text-[#2A2B2A80]">
            In 05 Days
          </span>
        </div>
        <a href="#" className="text-[#007AFF] text-sm font-semibold">
          Payroll details
        </a>
      </div>
    </div>
  );
};

export default PayrollCard;
