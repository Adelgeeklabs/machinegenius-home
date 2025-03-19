"use client ";
import { globalContext } from "@/app/_context/store";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

const ProfileCard = () => {
  const { authState } = useContext(globalContext);
  const [data, setData] = useState<any>([]);

  async function checkAuth() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/check-auth`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="bg-white py-6 px-4 rounded-[--15px] shadow h-full">
      <div className="flex items-start justify-between text-[#2A2B2A80]">
        <div className="flex items-center">
          <div className="relative h-12 w-12 mr-4">
            <div className="w-[--48px] h-[--48px] bg-black rounded-full"></div>
          </div>
          <div className="text-[#2A2B2A]">
            <h2 className="font-semibold text-[--18px]">
              {JSON.parse(localStorage.getItem("decodedToken") || "{}")
                .firstName +
                " " +
                JSON.parse(localStorage.getItem("decodedToken") || "{}")
                  .lastName}
            </h2>
            <div className=" flex items-center gap-2">
              <p className="text-sm font-medium">
                {data?.result?.role?.roleName || ""}
              </p>
              <div className=" flex justify-end items-center">
                <span className=" text-[#007AFF] text-xs px-2 py-1 rounded-[--20px] font-medium">
                  Mid-level
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-[#2A2B2A80]">Employee ID : <span className=" text-sm font-normal">{data?.result?.employeeID || "N/A"}</span></p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="bg-[#F7F7F7] rounded-[--3px] flex justify-center items-center w-[--32px] h-[--32px]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="3.25203" fill="#F7F7F7" />
              <path
                d="M23.1909 8.80928C22.9343 8.5527 22.6297 8.34918 22.2945 8.21032C21.9593 8.07147 21.6 8 21.2371 8C20.8743 8 20.515 8.07147 20.1797 8.21032C19.8445 8.34918 19.5399 8.5527 19.2833 8.80928L9.61524 18.4789C9.31037 18.7835 9.09314 19.1646 8.98638 19.5822L8.01549 23.3765C7.99407 23.4605 7.99488 23.5487 8.01784 23.6323C8.0408 23.716 8.08513 23.7922 8.14646 23.8535C8.20779 23.9149 8.28403 23.9592 8.36767 23.9822C8.45132 24.0051 8.5395 24.0059 8.62355 23.9845L12.4187 23.0148C12.8365 22.9082 13.2179 22.691 13.5228 22.386L23.1909 12.7164C23.709 12.1982 24 11.4955 24 10.7628C24 10.0301 23.709 9.32743 23.1909 8.80928ZM19.9906 9.51653C20.3212 9.18589 20.7696 9.00011 21.2372 9.00007C21.7048 9.00004 22.1532 9.18574 22.4838 9.51633C22.8145 9.84693 23.0003 10.2953 23.0003 10.7629C23.0004 11.2305 22.8146 11.6789 22.484 12.0095L21.6012 12.8924L19.1081 10.399L19.9906 9.51653ZM18.4009 11.1063L20.8939 13.5997L12.8155 21.6787C12.6376 21.8568 12.415 21.9837 12.1711 22.046L9.1936 22.8068L9.95527 19.8302C10.0177 19.5862 10.1445 19.3637 10.3221 19.1861L18.4009 11.1063Z"
                fill="#114560"
                stroke="#114560"
                stroke-width="0.666667"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
        <div className=" col-span-2">
          <div className=" flex justify-between col-span-2 mb-4">
            <p className="text-[#00000066] text-xs">Department</p>
            <p className="text-sm font-semibold">
              {
                JSON.parse(localStorage.getItem("decodedToken") || "{}")
                  .department[0]
              }
            </p>
          </div>
          <div className=" flex justify-between col-span-2">
            <p className="text-[#00000066] text-xs">Hiring Date</p>
            <p className="text-sm font-semibold">
              {data?.result?.createdAt
                ? new Date(data?.result?.createdAt).toLocaleDateString()
                : "Not Available"}
            </p>
          </div>
        </div>
        <div className="col-span-2 justify-end flex items-center">
          <Link
            href={"/profile"}
            className="bg-[#fff] flex justify-center items-center gap-2 py-2 px-[10px] rounded-[4px] border-[0.5px] border-[#114560]"
          >
            <svg
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.3827 6.85L0.214844 12.2786V2.28571C0.214844 1.025 1.23984 0 2.50056 0H6.69699C7.30413 0 7.88627 0.239286 8.31484 0.667857L9.26127 1.61429C9.68984 2.04286 10.272 2.28214 10.8791 2.28214L15.072 2.28571C16.3327 2.28571 17.3577 3.31071 17.3577 4.57143V5.71429H5.3577C4.54342 5.71429 3.79342 6.14643 3.3827 6.85ZM4.36842 7.425C4.57556 7.07143 4.95056 6.85714 5.3577 6.85714H19.6434C20.0541 6.85714 20.4291 7.075 20.6327 7.43214C20.8363 7.78929 20.8363 8.225 20.6291 8.57857L16.6291 15.4357C16.4256 15.7857 16.0506 16 15.6434 16H1.3577C0.946987 16 0.571987 15.7821 0.368415 15.425C0.164844 15.0679 0.164844 14.6321 0.371987 14.2786L4.37199 7.42143L4.36842 7.425Z"
                fill="#114560"
              />
            </svg>
            My Docs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
