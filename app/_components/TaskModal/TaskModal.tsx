"use client";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CustomSelectInput from "../CustomSelectInput/CustomSelectInput";
import { log } from "console";
import toast from "react-hot-toast";

const TaskModal = ({
  createTaskModal,
  setCreateTaskModal,
  getSchedule,
  taskSelectedDay,
}: {
  createTaskModal: boolean;
  setCreateTaskModal: (value: boolean) => void;
  getSchedule: () => void;
  taskSelectedDay: string;
}) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [title, setTitle] = useState("");
  const [bg, setBg] = useState("");
  const [assignedToList, setAssignedToList] = useState<string[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  const [returnedHR, setReturnedHR] = useState<any[]>([]);

  const createTask = async () => {
    console.log(
      JSON.stringify({
        title: title,
        start: start,
        end: end,
        backgroundColor: bg,
        assignedTo: selectedPerson,
      })
    );

    if (!title || !bg || !selectedPerson || !start || !end) {
      toast.error("Please Complete The Inputs");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/task/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window !== "undefined" && localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify({
          title: title,
          start: start,
          end: end,
          backgroundColor: bg,
          assignedTo: selectedPerson,
        }),
      }
    );

    if (res.ok) {
      // Wrap getSchedule in a Promise
      const getSchedulePromise = new Promise<void>((resolve, reject) => {
        try {
          getSchedule();
          resolve();
        } catch (error) {
          reject(error);
        }
        setCreateTaskModal(false);
      });

      // Use toast.promise to handle loading, success, and error
      toast.promise(getSchedulePromise, {
        loading: "Loading schedule...", // Fixed the key from pending to loading
        success: "Task created successfully!",
        error: "Failed to load schedule.",
      });
    } else {
      const data = await res.json();
      if (data.message == "END_TIME_MUST_BE_AFTER_START_TIME") {
        toast.error("End time must be after start time");
      } else {
        toast.error("Something Went Wrong!");
      }
    }
  };

  const getAssignedTo = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/employee/data?department=hr`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window !== "undefined" && localStorage.getItem("token")
          }`,
        },
      }
    );
    const response = await res.json();
    setReturnedHR(response);
    console.log(response);
    setAssignedToList(
      response.map((p: any) => p.firstName?.trim() + " " + p.lastName?.trim())
    );
  };

  useEffect(() => {
    getAssignedTo();
  }, []);

  return (
    <div
      className={`${
        createTaskModal ? "block" : "hidden"
      } absolute inset-0 bg-black bg-opacity-20 z-50`}
    >
      <div
        className={` absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[6px] p-6 shadow-md bg-white z-[60] w-[550px]`}
      >
        <span
          className=" text-2xl absolute top-1 right-2 cursor-pointer font-bold"
          onClick={() => setCreateTaskModal(false)}
        >
          x
        </span>
        <h3 className=" text-center uppercase mb-[30px] text-[24px] leading-[22px] font-bold">
          Enter your Task info
        </h3>
        <div className=" flex flex-col gap-[25px]">
          <div className=" flex flex-col gap-[10px]">
            <label
              htmlFor="title"
              className=" leading-[22px] font-bold text-[18px]"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className=" w-full rounded-[4px] p-2 border-[1px] border-black"
            />
          </div>
          <div className=" flex flex-col gap-[10px]">
            <label
              htmlFor="title"
              className=" leading-[22px] font-bold text-[18px]"
            >
              Background Color
            </label>
            <input
              type="text"
              id="title"
              value={bg}
              className=" w-full rounded-[4px] p-2 border-[1px] border-black"
              onChange={(e) => setBg(e.target.value)}
            />
          </div>
          <div className=" flex flex-col gap-[10px]">
            <label
              htmlFor="bg"
              className=" leading-[22px] font-bold text-[18px]"
            >
              Task Date
            </label>
            <div className=" flex gap-[--20px] items-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker", "TimePicker"]}>
                  <TimePicker
                    label="Start Date"
                    onChange={(newValue: any) => {
                      console.log(newValue);
                      if (newValue) {
                        setStart(
                          new Date(
                            `${taskSelectedDay}T${newValue.$H
                              .toString()
                              .padStart(2, "0")}:${newValue.$m
                              .toString()
                              .padStart(2, "0")}:00`
                          )
                            .getTime()
                            .toString()
                        );
                      } else {
                        setStart(""); // Reset to null if no value selected
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker", "TimePicker"]}>
                  <TimePicker
                    label="End Date"
                    onChange={(newValue: any) => {
                      console.log(newValue);
                      if (newValue) {
                        setEnd(
                          new Date(
                            `${taskSelectedDay}T${newValue.$H
                              .toString()
                              .padStart(2, "0")}:${newValue.$m
                              .toString()
                              .padStart(2, "0")}:00`
                          )
                            .getTime()
                            .toString()
                        );
                      } else {
                        setEnd(""); // Reset to null if no value selected
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <div className=" flex flex-col gap-[10px]">
            <label
              htmlFor="title"
              className=" leading-[22px] font-bold text-[18px]"
            >
              Assigned To
            </label>
            <CustomSelectInput
              options={assignedToList}
              label={"Select Employee"}
              getValue={(val) => {
                console.log(
                  returnedHR.find(
                    (h) => h.firstName?.trim() + " " + h.lastName?.trim() == val
                  )
                );

                setSelectedPerson(
                  returnedHR.find(
                    (h) => h.firstName?.trim() + " " + h.lastName?.trim() == val
                  )._id
                );
              }}
            />
          </div>
          <button
            className=" bg-black text-white px-5 py-3 text-center rounded-[5px] w-fit ml-auto"
            onClick={createTask}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
