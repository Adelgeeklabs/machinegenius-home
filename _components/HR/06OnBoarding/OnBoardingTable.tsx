"use client";
import React, { useEffect, useState } from "react";
import styles from "./OnBoardingTable.module.css";
import { truncateText } from "../../../_utils/text";
import Link from "next/link";
import CustomBtn from "../../Button/CustomBtn";

/**
 * Renders a table component displaying a list of employees.
 *
 * @return {JSX.Element} The rendered table component.
 */
export default function OnBoardingTable({
  searchTerm,
  candidatesFilter,
  setAllDepartments,
  setCandidatesFilter,
}: {
  searchTerm: string;
  candidatesFilter: string;
  setAllDepartments: (value: string[]) => void;
  setCandidatesFilter: (value: string) => void;
}) {
  const [originalData, setOriginalData] = useState<any>([]);

  const token = typeof window !== "undefined" && localStorage.getItem("token");
  const [data, setData] = useState<any>([]);

  async function fetchData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/candidate/ready-to-convert`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      console.log(result);
      setData(result);
      setOriginalData(result);
      setAllDepartments(
        Array.from(new Set(result?.map((e: any) => String(e?.department))))
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (candidatesFilter !== "All Departments") {
      setData(
        originalData?.filter(
          (e: any) =>
            (e.firstName?.toLowerCase() + e.lastName?.toLowerCase()).includes(
              searchTerm?.toLowerCase()
            ) && e.department?.toLowerCase() === candidatesFilter?.toLowerCase()
        )
      );
    } else {
      setData(
        originalData?.filter((e: any) =>
          (e.firstName?.toLowerCase() + e.lastName?.toLowerCase()).includes(
            searchTerm?.toLowerCase()
          )
        )
      );
    }
  }, [searchTerm, candidatesFilter]);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.table}>
        <ul className={styles.table_header}>
          <li className="w-[10%] flex items-center justify-center">
            <span>First Name</span>
          </li>
          <li className="w-[10%] flex items-center justify-center">
            <span>Last Name</span>
          </li>
          <li className="w-[12%] flex items-center justify-center">
            <span>Mobile Number</span>
          </li>
          <li className="w-[12%] flex items-center justify-center">
            <span>Email</span>
          </li>
          <li className="w-[20%] flex items-center justify-center">
            <span>LinkedIn</span>
          </li>
          <li className="w-[15%] flex items-center justify-center">
            <span>CV</span>
          </li>
          <li className="w-[10%] flex items-center justify-center">
            <span>Department</span>
          </li>
          <li className="w-[10%] flex items-center justify-center">
            <span>Status</span>
          </li>
          <li className="w-[10%] flex items-center justify-center"></li>
        </ul>
        <div className={styles.table_body}>
          {data?.map((e: any, idx: number) => (
            <ul key={idx}>
              <li className="w-[10%] flex items-center justify-center">
                <span>{e?.firstName}</span>
              </li>
              <li className="w-[10%] flex items-center justify-center">
                <span>{e?.lastName}</span>
              </li>
              <li className="w-[12%] flex items-center justify-center">
                <span>{e?.phoneNumber}</span>
              </li>
              <li className="w-[12%] flex items-center justify-center">
                <span>{e?.email}</span>
              </li>
              <li className="w-[20%] flex items-center justify-center">
                <Link href={e?.linkedIn} target="_blank">
                  <span>{truncateText(e?.linkedIn, 20)}</span>
                </Link>
              </li>
              <li className="w-[15%] flex items-center justify-center">
                <Link href={e?.cvLink} target="_blank">
                  <span>{truncateText(e?.cvLink, 20)}</span>
                </Link>
              </li>
              <li className="w-[10%] flex items-center justify-center">
                <span>{e?.department}</span>
              </li>
              <li className="w-[10%] flex items-center justify-center">
                <span>{e?.rejected ? "Active" : "Inactive"}</span>
              </li>
              <li className="w-[10%] flex items-center justify-center">
                <CustomBtn
                  btnColor="black"
                  word="Convert"
                  href={`/hr/on-boarding/${e.department}/${e._id}`}
                />
              </li>
            </ul>
          ))}
        </div>
      </div>
      {/* End Table */}
    </div>
  );
}
