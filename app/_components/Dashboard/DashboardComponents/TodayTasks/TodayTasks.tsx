"use client";
import React, { useEffect, useState } from "react";
import IconComponent from "../IconComponent/IconComponent";
import StatusDropdown from "../StatusDropdown/StatusDropdown";
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast
import MonthPagination from "../NavigateDate/NavigateDate";

const TodayTasks = () => {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const [tasks, setTasks] = useState<any>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const pathname = usePathname();
  const [date, setDate] = useState(new Date().getTime());
  const handleDateChange = (date: any, timestamp: any) => {
    console.log("Selected date:", date);
    console.log("Timestamp:", timestamp);
    setDate(timestamp);
    // You can use the timestamp for API calls, etc.
  };

  const [decodedToken, setDecodedToken] = useState<any>({});

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("decodedToken") || "{}");
    setDecodedToken(token);
  }, []); // Runs only on the client

  const getTasks = async () => {
    try {
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/task/today?today=${date}`
      );
      console.log(data);
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTasks();
  }, [date]);

  useEffect(() => {
    console.log(pathname.split("/")[1]);
  }, [pathname]);

  return (
    <div className="bg-white py-6 px-4 rounded-[--15px] shadow h-fit min-h-[240px] max-h-[250px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-[--10px]">
          <IconComponent
            bg="#11456012"
            size="large"
            svg={
              <svg
                width="20"
                height="17"
                viewBox="0 0 20 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.94336 0.245456C6.33008 0.593113 6.36133 1.18296 6.01367 1.56968L3.20117 4.69468C3.0293 4.88608 2.78711 4.99936 2.5293 5.00327C2.27148 5.00717 2.02539 4.90952 1.8418 4.72983L0.275391 3.16733C-0.0878906 2.80014 -0.0878906 2.20639 0.275391 1.83921C0.638672 1.47202 1.23633 1.47202 1.59961 1.83921L2.46289 2.70249L4.61523 0.311863C4.96289 -0.074856 5.55273 -0.106106 5.93945 0.24155L5.94336 0.245456ZM5.94336 6.49546C6.33008 6.84311 6.36133 7.43296 6.01367 7.81968L3.20117 10.9447C3.0293 11.1361 2.78711 11.2494 2.5293 11.2533C2.27148 11.2572 2.02539 11.1595 1.8418 10.9798L0.275391 9.41733C-0.0917969 9.05014 -0.0917969 8.45639 0.275391 8.09311C0.642578 7.72983 1.23633 7.72593 1.59961 8.09311L2.46289 8.95639L4.61523 6.56577C4.96289 6.17905 5.55273 6.1478 5.93945 6.49546H5.94336ZM8.75195 2.50327C8.75195 1.81186 9.31055 1.25327 10.002 1.25327H18.752C19.4434 1.25327 20.002 1.81186 20.002 2.50327C20.002 3.19468 19.4434 3.75327 18.752 3.75327H10.002C9.31055 3.75327 8.75195 3.19468 8.75195 2.50327ZM8.75195 8.75327C8.75195 8.06186 9.31055 7.50327 10.002 7.50327H18.752C19.4434 7.50327 20.002 8.06186 20.002 8.75327C20.002 9.44468 19.4434 10.0033 18.752 10.0033H10.002C9.31055 10.0033 8.75195 9.44468 8.75195 8.75327ZM6.25195 15.0033C6.25195 14.3119 6.81055 13.7533 7.50195 13.7533H18.752C19.4434 13.7533 20.002 14.3119 20.002 15.0033C20.002 15.6947 19.4434 16.2533 18.752 16.2533H7.50195C6.81055 16.2533 6.25195 15.6947 6.25195 15.0033ZM1.87695 13.1283C2.37423 13.1283 2.85115 13.3258 3.20278 13.6774C3.55441 14.0291 3.75195 14.506 3.75195 15.0033C3.75195 15.5005 3.55441 15.9775 3.20278 16.3291C2.85115 16.6807 2.37423 16.8783 1.87695 16.8783C1.37967 16.8783 0.902759 16.6807 0.551128 16.3291C0.199497 15.9775 0.00195311 15.5005 0.00195311 15.0033C0.00195311 14.506 0.199497 14.0291 0.551128 13.6774C0.902759 13.3258 1.37967 13.1283 1.87695 13.1283Z"
                  fill="#114560"
                />
              </svg>
            }
          />
          <h3 className="font-semibold text-headings text-lg">Ongoing Tasks</h3>
        </div>
        <div className=" flex gap-4 items-center">
          <MonthPagination showDayMonth={true} onChange={handleDateChange} />
          {/* <Link
            href={
              decodedToken?.type == "employee"
                ? `/events-tasks`
                : `/${pathname.split("/")[1]}/tasks`
            }
            className="bg-[#114560] text-white flex items-center justify-center gap-2 text-sm font-semibold  py-[7px] px-[10px] rounded-[5px]"
          >
            <span className=" w-[20px] h-[20px] flex justify-center items-center bg-[#235772] rounded-full ">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 10C4.60571 10 4.28571 9.68 4.28571 9.28571V0.714286C4.28571 0.32 4.60571 0 5 0C5.39429 0 5.71429 0.32 5.71429 0.714286V9.28571C5.71429 9.68 5.39429 10 5 10Z"
                  fill="white"
                />
                <path
                  d="M9.28571 5.71429H0.714286C0.32 5.71429 0 5.39429 0 5C0 4.60571 0.32 4.28571 0.714286 4.28571H9.28571C9.68 4.28571 10 4.60571 10 5C10 5.39429 9.68 5.71429 9.28571 5.71429Z"
                  fill="white"
                />
              </svg>
            </span>
            Add Task
          </Link> */}
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <p className=" font-medium text-[#2A2B2A]">
          Today{" "}
          <span className=" font-semibold text-headings">
            {tasks?.length || 0} Tasks
          </span>
        </p>
      </div>

      {tasks?.length > 0 ? (
        <ul className="space-y-4">
          {tasks?.slice(0, 3).map((t: any) => (
            <li
              key={t._id}
              className={`w-full flex items-center justify-between px-[--16px] py-[--sy-9px] rounded-none hover:rounded-[10px] border-l-[--3px] hover:shadow-[0px_2px_10px_0px_#00000026]
 ${
   t?.priorityLevel == "Low"
     ? "border-l-[#06B217]"
     : t?.priorityLevel == "Medium"
       ? "border-l-[#F99B1F]"
       : t?.priorityLevel == "High"
         ? "border-l-[#E9313E]"
         : "border-l-[#5f1319]"
 }`}
            >
              <div className=" flex flex-col gap-6 w-[80%] text-headings">
                <span className="flex-grow font-medium">{t?.title}</span>
                <div className=" flex justify-between items-center">
                  <span className=" text-xs font-semibold">
                    Due :{" "}
                    {t?.endNumber
                      ? `${new Date(t?.endNumber).toLocaleDateString("en-GB", options as any)} (${new Date(t?.endNumber).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })})`
                      : "N/A"}
                  </span>
                  <div className="flex items-center">
                    <span className="text-[#2A2B2A80] text-xs font-semibold mr-3">
                      Assigned Employees
                    </span>
                    <div className="flex -space-x-2">
                      {t?.employee?.slice(0, 3).map((employee: any) => (
                        <div
                          key={employee._id}
                          className="w-6 h-6 rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-white text-sm"
                          style={{
                            backgroundColor: employee.profile
                              ? "transparent"
                              : "black",
                          }}
                        >
                          {employee.profile ? (
                            <img
                              src={employee.profile}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            `${employee.firstName[0]}${employee.lastName[0]}`
                          )}
                        </div>
                      ))}
                      {t?.employee?.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-800">
                          +{t?.employee?.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <StatusDropdown
                currStatus={t?.status}
                taskId={t._id}
                setTasks={setTasks}
                setSelectedTask={setSelectedTask}
                selectedTask={selectedTask}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center font-semibold">NO Tasks Found</div>
      )}
    </div>
  );
};

export default TodayTasks;
