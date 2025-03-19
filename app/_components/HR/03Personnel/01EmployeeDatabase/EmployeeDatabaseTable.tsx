"use client";
import React, { useEffect, useState } from "react";
import styles from "./EmployeeDatabaseTable.module.css";
import { truncateText } from "../../../../_utils/text";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Renders an employee database table.
 *
 * @return {JSX.Element} The rendered employee database table.
 */
export default function EmployeeDatabaseTable({ employees }: any) {
  // An array of objects representing the rows of the table body.

  const router = useRouter();

  return (
    <div className={`${styles.tableContainer} h-[68vh] w-full`}>
      {/* Start Table */}
      <div className={styles.table + " max-w-full"} id="table">
        {/* Table Header */}
        <ul className={styles.table_header + " space-x-2"}>
          <li className="w-[14%]">
            <span>First Name</span>
          </li>
          <li className="w-[14%]">
            <span>Last Name</span>
          </li>
          <li className="w-[14%]">
            <span>Mobile Number</span>
          </li>
          <li className="w-[26%]">
            <span>Email</span>
          </li>
          {/* <li className="w-[8%]">
            <span>LinkedIn</span>
          </li> */}
          <li className="w-[14%]">
            <span>Depa</span>
          </li>
          {/* <li className="w-[7%]">
            <span>CV</span>
          </li> */}
          {/* <li className="w-[7%]">
            <span>Port</span>
          </li> */}
          <li className="w-[14%]">
            <span>Type</span>
          </li>
        </ul>

        {/* Table Body */}
        <div className={styles.table_body}>
          {Array.isArray(employees) &&
            employees.length > 0 &&
            employees.map((e: any, idx: any) => (
              <ul
                key={idx}
                className={`space-x-2 cursor-pointer`}
                onClick={() =>
                  router.push(`/hr/personnel/employee-database/${e._id}`)
                }
              >
                <li className="w-[14%] text-center">
                  <span>{e.firstName}</span>
                </li>
                <li className="w-[14%] text-center">
                  <span>{e.lastName}</span>
                </li>
                <li className="w-[14%] text-center">
                  <span>{e.phoneNumber}</span>
                </li>
                <li className="w-[26%] text-center">
                  <span>{e.email}</span>
                </li>
                {/* <li className="w-[8%]">
                <Link href={e.linkedin} target="_blank">
                  <span>{truncateText(e.linkedin, 20)}</span>
                </Link>
              </li> */}
                <li className="w-[14%] text-center">
                  <span>{e.department.join(", ")}</span>
                </li>
                {/* <li className="w-[7%]">
                <Link href="#" target="_blank">
                  <span>{e.cv}</span>
                </Link>
              </li> */}
                {/* <li className="w-[7%]">
                <span>{e.port}</span>
              </li> */}
                <li className="w-[14%] text-center">
                  <span>{e.type}</span>
                </li>
              </ul>
            ))}
        </div>
      </div>
      {/* End Table */}
    </div>
  );
}
