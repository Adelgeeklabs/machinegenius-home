"use client";
import React, { useState } from "react";
import CustomSelectInput from "../CustomSelectInput/CustomSelectInput";
import { toast } from "react-hot-toast";

const TaskOrEvent = ({
  chooseTypeOpen,
  setChooseTypeOpen,
  type,
  setType,
  createModal,
  setCreateModal,
  setCreateTaskModal,
}: {
  chooseTypeOpen: boolean;
  setChooseTypeOpen: (value: boolean) => void;
  type: "Task" | "Event" | null;
  setType: (value: "Task" | "Event" | null) => void;
  createModal: boolean;
  setCreateModal: (value: boolean) => void;
  setCreateTaskModal: (value: boolean) => void;
}) => {
  const handleClose = () => {
    if (type == "Task") {
      setChooseTypeOpen(false);
      setCreateTaskModal(true);
    } else if (type == "Event") {
      setChooseTypeOpen(false);
      setCreateModal(true);
    } else {
      toast.error("Please select a type");
    }
  };

  return (
    <div
      className={`${
        chooseTypeOpen ? "block" : "hidden"
      } inset-0 absolute bg-black bg-opacity-20 z-50`}
    >
      <div
        className={` absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[6px] p-6 shadow-md bg-white z-[60] w-[550px]`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 absolute right-5 top-5 cursor-pointer"
          onClick={() => setChooseTypeOpen(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>

        <div className=" flex flex-col gap-[25px]">
          <div className=" flex flex-col gap-[--sy-30px]">
            <label
              htmlFor="title"
              className=" leading-[22px] font-bold text-[18px] text-center block"
            >
              Select Type
            </label>
            <div className=" w-1/2 mx-auto">
              <CustomSelectInput
                options={["Task", "Event"]}
                label={"..."}
                getValue={(value) => {
                  setType(value as "Task" | "Event");
                }}
              />
            </div>
          </div>

          <button
            className=" bg-black text-white px-5 py-3 text-center rounded-[5px] w-fit mx-auto"
            onClick={handleClose}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskOrEvent;
