"use client";
import React from "react";
import IconComponent from "../IconComponent/IconComponent";
import { usePathname } from "next/navigation";
import Link from "next/link";

const QuickActions = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white p-6 rounded-[--15px] shadow">
      <h3 className="font-medium text-headings mb-4 text-lg text-nowrap">
        Quick Actions
      </h3>

      <div className=" w-full flex flex-col justify-between items-center gap-4">
        <div className=" px-4 py-[15.2px] rounded-[--5px] flex flex-col gap-y-3 shadow-[1px_2px_10px_0px_#00000017] w-full">
          <div className=" w-full flex justify-between items-center">
            <svg
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.1045 5.19922L15.0961 2.87115L8.03281 0.292055C7.69428 0.169142 7.32032 0.185807 6.99326 0.337888L6.27038 0.674332C5.91831 0.839951 5.84644 1.30869 6.13392 1.57015L10.1045 5.19922ZM23.8321 1.65559C23.4185 0.770201 22.3655 0.383759 21.4801 0.797267L4.59816 8.66904L2.31073 7.49302C2.01178 7.33886 1.65971 7.33261 1.35348 7.47427L0.313936 7.95967C-0.024588 8.11696 -0.106879 8.56485 0.153524 8.83463L2.88678 11.6399C3.34823 12.1117 4.04402 12.2607 4.65755 12.019L12.2573 9.00553L12.5209 15.2667C12.5365 15.6562 12.9417 15.901 13.2938 15.7385L14.0166 15.4021C14.3448 15.25 14.5958 14.9729 14.7208 14.6344L17.6812 6.48051L22.98 4.00872C23.8654 3.59518 24.2466 2.54209 23.8331 1.65671L23.8321 1.65559Z"
                fill="#114560"
              />
            </svg>
            <Link href={`/${pathname.split("/")[1]}/vacation-request`}>
              <IconComponent
                svg={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12C5.52686 12 5.14286 11.616 5.14286 11.1429V0.857143C5.14286 0.384 5.52686 0 6 0C6.47314 0 6.85714 0.384 6.85714 0.857143V11.1429C6.85714 11.616 6.47314 12 6 12Z"
                      fill="#114560"
                    />
                    <path
                      d="M11.1429 6.85714H0.857143C0.384 6.85714 0 6.47314 0 6C0 5.52686 0.384 5.14286 0.857143 5.14286H11.1429C11.616 5.14286 12 5.52686 12 6C12 6.47314 11.616 6.85714 11.1429 6.85714Z"
                      fill="#114560"
                    />
                  </svg>
                }
                size="small"
              />
            </Link>
          </div>
          <p className=" text-headings font-semibold text-sm text-nowrap">
            Request Leave
          </p>
        </div>
        <div className=" p-4 rounded-[--5px] flex flex-col gap-y-3 shadow-[1px_2px_10px_0px_#00000017] w-full">
          <div className=" w-full flex justify-between items-center">
            <svg
              width="21"
              height="14"
              viewBox="0 0 21 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.33333 0C1.04635 0 0 1.04635 0 2.33333V4.66667C0 4.9875 0.269792 5.23906 0.572396 5.34479C1.25781 5.58177 1.75 6.23438 1.75 7C1.75 7.76562 1.25781 8.41823 0.572396 8.65521C0.269792 8.76094 0 9.0125 0 9.33333V11.6667C0 12.9536 1.04635 14 2.33333 14H18.6667C19.9536 14 21 12.9536 21 11.6667V9.33333C21 9.0125 20.7302 8.76094 20.4276 8.65521C19.7422 8.41823 19.25 7.76562 19.25 7C19.25 6.23438 19.7422 5.58177 20.4276 5.34479C20.7302 5.23906 21 4.9875 21 4.66667V2.33333C21 1.04635 19.9536 0 18.6667 0H2.33333ZM4.66667 4.08333V9.91667C4.66667 10.2375 4.92917 10.5 5.25 10.5H15.75C16.0708 10.5 16.3333 10.2375 16.3333 9.91667V4.08333C16.3333 3.7625 16.0708 3.5 15.75 3.5H5.25C4.92917 3.5 4.66667 3.7625 4.66667 4.08333ZM3.5 3.5C3.5 2.85469 4.02135 2.33333 4.66667 2.33333H16.3333C16.9786 2.33333 17.5 2.85469 17.5 3.5V10.5C17.5 11.1453 16.9786 11.6667 16.3333 11.6667H4.66667C4.02135 11.6667 3.5 11.1453 3.5 10.5V3.5Z"
                fill="#114560"
              />
            </svg>
            <Link href={`/${pathname.split("/")[1]}/complaints`}>
              <IconComponent
                svg={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12C5.52686 12 5.14286 11.616 5.14286 11.1429V0.857143C5.14286 0.384 5.52686 0 6 0C6.47314 0 6.85714 0.384 6.85714 0.857143V11.1429C6.85714 11.616 6.47314 12 6 12Z"
                      fill="#114560"
                    />
                    <path
                      d="M11.1429 6.85714H0.857143C0.384 6.85714 0 6.47314 0 6C0 5.52686 0.384 5.14286 0.857143 5.14286H11.1429C11.616 5.14286 12 5.52686 12 6C12 6.47314 11.616 6.85714 11.1429 6.85714Z"
                      fill="#114560"
                    />
                  </svg>
                }
                size="small"
              />
            </Link>
          </div>
          <p className=" text-headings font-semibold text-sm text-nowrap">
            Fill Complaint
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
