"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./CandidateDatabaseTable.module.css";
import { truncateText } from "../../../_utils/text";
import Link from "next/link";
import { globalContext } from "@/app/_context/store";
import { notFoundIcon } from "@/app/_utils/svgIcons";

interface Candidate {
  recommendation: null;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  linkedIn: string;
  role: {
    roleName?: string;
    _id?: string;
  };
  department: string;
  cvLink: string;
  portfolio: string;
  taskLink: string;
  appliedFrom: string;
  hiring: string;
  currentStep: string;
  __v: number;
  rejected: boolean;
  questions: [];
}

/**
 * Renders a table component displaying a list of candidate data.
 *
 * @return {JSX.Element} The rendered table component.
 */
export default function CandidateDatabaseTable({
  filter,
  filterStatus,
  search,
  setQuestions,
  setOpen,
}: {
  filter: any;
  filterStatus: string;
  search: string;
  setQuestions: (questions: any[]) => void;
  setOpen: (open: boolean) => void;
}) {
  const { handleSignOut } = useContext(globalContext);
  // An array of objects representing the rows of the table body.
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      recommendation: null,
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      linkedIn: "",
      role: {},
      department: "",
      cvLink: "",
      portfolio: "",
      taskLink: "",
      appliedFrom: "",
      hiring: "",
      currentStep: "",
      rejected: false,
      __v: 0,
      questions: [],
    },
  ]);

  useEffect(() => {
    console.log(filter?.role?._id);

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/candidate/all-candidate?role=${
        filter?.role?._id ? filter?.role?._id : ""
      }&limit=10000`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 401) {
          handleSignOut();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        let filteredData = data.filter((e: Candidate) =>
          (e.firstName + " " + e.lastName)
            ?.toLowerCase()
            .includes(search?.toLowerCase())
        );

        // Apply status filter
        if (filterStatus) {
          filteredData = filteredData.filter((e: Candidate) => {
            if (filterStatus === "active") {
              return !e.rejected;
            } else if (filterStatus === "inactive") {
              return e.rejected;
            }
            return true;
          });
        }

        setCandidates(filteredData);
      });
  }, [filter, search, filterStatus]);

  return (
    <div className={`${styles.tableContainer} h-[68vh]`}>
      {/* Start Table */}
      <div className={styles.table + " max-w-full"} id="table">
        {/* Table Header */}
        <ul
          className={
            styles.table_header +
            " space-x-2 flex w-[100vw] border-b-2 sticky top-0 bg-[#fffffb]"
          }
        >
          <li className="w-[10%] text-center">
            <span>First Name</span>
          </li>
          <li className="w-[10%] text-center">
            <span>Last Name</span>
          </li>
          <li className="w-[15%] text-center">
            <span>Mobile Number</span>
          </li>
          <li className="w-[20%] text-center">
            <span>Email</span>
          </li>
          <li className="w-[15%] text-center">
            <span>LinkedIn</span>
          </li>
          <li className="w-[15%] text-center">
            <span>Role</span>
          </li>
          <li className="w-[10%] text-center  ">
            <span>CV</span>
          </li>
          <li className="w-[5%] text-center ">
            <span>call details</span>
          </li>
          <li className="w-[5%] text-center ">
            <span>Status</span>
          </li>
        </ul>

        {/* Table Body */}
        {Array.isArray(candidates) && candidates.length ? (
          <div className={styles.table_body}>
            <div className="w-full">
              {candidates?.map((e, idx) => (
                <ul
                  key={idx}
                  className={`space-x-2 flex w-[100vw] border-b-2 border-gray-300`}
                >
                  <li className="w-[10%]  text-center">
                    <span>{e.firstName}</span>
                  </li>
                  <li className="w-[10%] text-center  ">
                    <span>{e.lastName}</span>
                  </li>
                  <li className="w-[15%] text-center">
                    <span>{e.phoneNumber}</span>
                  </li>
                  <li className="w-[20%] text-center">
                    <span>{e.email}</span>
                  </li>
                  <li className="w-[15%] text-center">
                    <Link
                      href={e.linkedIn}
                      target="_blank"
                      className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                    >
                      {truncateText(e.linkedIn, 20)}
                    </Link>
                  </li>
                  <li className="w-[15%] text-center">
                    <span>{e?.role?.roleName ? e?.role?.roleName : "-"}</span>
                  </li>
                  <li className="w-[10%] text-center">
                    <Link
                      href={e.cvLink}
                      target="_blank"
                      className="whitespace-nowrap overflow-hidden overflow-ellipsis"
                    >
                      {truncateText(e.cvLink, 20)}
                    </Link>
                  </li>
                  <li className="w-[5%] text-center">
                    {e.questions.length == 0 ? (
                      <span>no details</span>
                    ) : (
                      <button
                        className="bg-black text-white px-2 py-1 rounded-md"
                        onClick={() => {
                          setOpen(true);
                          setQuestions(e.questions);
                        }}
                      >
                        View
                      </button>
                    )}
                  </li>
                  <li className={`w-[5%] text-center ${e.rejected ? "!text-red-500" : "!text-green-500"}`}>
                    <span>{e.rejected ? "Inactive" : "Active"}</span>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            {notFoundIcon}
            <span className="text-xl font-semibold text-gray-500">
              No groups found!
            </span>
            <p className="text-gray-500 text-center max-w-xs">
              Try adjusting your filters or create a new template group to get
              started
            </p>
          </div>
        )}
      </div>
      {/* End Table */}
    </div>
  );
}
