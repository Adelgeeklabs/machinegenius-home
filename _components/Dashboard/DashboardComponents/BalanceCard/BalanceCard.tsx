import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import IconComponent from "../IconComponent/IconComponent";
import fetchAPI from "@/app/_components/fetchAPIUtilies/fetchApiUtilies";

const BalanceCard = () => {
  const [balance, setBalance] = useState<any>([]);
  const pathname = usePathname();

  const getBalance = async () => {
    try {
      const { response, data } = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation/available-balance`
      );
      console.log(data);
      setBalance(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getBalance();
  }, []);
  
  // Calculate the strokeDashoffset based on used days ratio
  const calculateOffset = (used: number, total: number) => {
    if (!total || total === 0) return 283; // Empty circle if no data
    const ratio = used / total;
    return 283 * ratio; // Reverse the calculation
  };
  
  
  // Find balance data for a specific vacation type
  const getVacationData = (type: string) => {
    return balance?.find((b: any) => b.vacationName === type) || { vacationBalance: 0, imbalance: 0 };
  };
  
  // Get data for annual leave
  const annualData = getVacationData("Annual");
  const annualUsed = annualData?.imbalance || 0;
  const annualTotal = annualData?.vacationBalance || 0;
  const annualRemaining = annualTotal - annualUsed;
  const annualOffset = calculateOffset(annualUsed, annualTotal);
  
  // Get data for sick leave
  const sickData = getVacationData("Sick");
  const sickUsed = sickData?.imbalance || 0;
  const sickTotal = sickData?.vacationBalance || 0;
  const sickRemaining = sickTotal - sickUsed;
  const sickOffset = calculateOffset(sickUsed, sickTotal);
  
  return (
    <div className="bg-white p-6 rounded-[--15px] shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <IconComponent
            svg={
              <svg
                width="25"
                height="20"
                viewBox="0 0 25 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.76081 7.7255L4.78463 7.71597C4.80295 7.70864 4.82049 7.70126 4.83919 7.69339C4.8576 7.68564 4.87717 7.67739 4.89791 7.6691L5.1292 7.57658L5.06513 7.81731L4.405 10.2977L4.76081 7.7255ZM4.76081 7.7255L4.75544 7.73087M4.76081 7.7255L4.75544 7.73087M4.75544 7.73087L4.46455 7.85813L4.46382 7.85846C3.79133 8.1578 3.27442 8.72384 3.04059 9.42531L2.9391 9.72979C2.93909 9.72982 2.93909 9.72984 2.93908 9.72987C2.74216 10.317 2.10194 10.6368 1.51533 10.4401C0.928154 10.2432 0.608229 9.60673 0.805109 9.01609L0.906672 8.7114L0.906741 8.71119C1.33702 7.41273 2.29659 6.35406 3.54941 5.79799C3.54952 5.79794 3.54962 5.7979 3.54973 5.79785L3.86163 5.6614L3.86209 5.66119C4.6588 5.3088 5.52049 5.125 6.39355 5.125C8.08527 5.125 9.61014 6.14154 10.2626 7.70054C10.2626 7.70056 10.2626 7.70058 10.2626 7.7006L10.8602 9.13783L10.8781 9.18095L10.9199 9.20175L11.7595 9.61962C11.7596 9.61965 11.7597 9.61969 11.7597 9.61972C12.315 9.8975 12.5399 10.5723 12.2622 11.1277C11.9845 11.6831 11.3096 11.9081 10.7541 11.6304L10.754 11.6303L9.71161 11.1111C9.71151 11.111 9.71141 11.111 9.7113 11.1109C9.3356 10.9212 9.04039 10.6039 8.8801 10.2177L8.88 10.2175L8.505 9.31904L8.36931 8.99395L8.26974 9.33186L7.51584 11.8905L7.49588 11.9582L7.5436 12.0102L9.47713 14.1196L4.75544 7.73087ZM4.95042 12.5131L4.95053 12.5132L7.71225 15.5249L7.7337 15.5483L7.74139 15.5791L8.60072 19.0203C8.75199 19.6219 9.36417 19.9907 9.96463 19.8397C10.5662 19.6884 10.935 19.0763 10.784 18.4758L10.784 18.4756L9.88556 14.8779L9.88539 14.8772C9.8164 14.594 9.6746 14.3353 9.47719 14.1196L4.95042 12.5131ZM4.95042 12.5131C4.40133 11.9157 4.19716 11.0809 4.40497 10.2978L4.95042 12.5131ZM2.79865 15.5934L3.69258 13.3621C3.73997 13.4208 3.78917 13.4783 3.84066 13.5339C3.84074 13.534 3.84082 13.5341 3.8409 13.5341L5.37719 15.2101L4.84002 16.5512L4.83999 16.5512C4.75244 16.7701 4.62115 16.9706 4.4536 17.1382L4.45353 17.1382L2.04735 19.5483C1.60789 19.9878 0.894065 19.9878 0.454599 19.5483C0.0151336 19.1089 0.0151336 18.395 0.454599 17.9556L0.454674 17.9555L2.77108 15.6352L2.78914 15.6171L2.79865 15.5934ZM20.7295 8.875H21.0321L20.8177 8.66144L19.8257 7.67333C19.3862 7.23386 19.3862 6.52004 19.8257 6.08058C20.2652 5.64111 20.979 5.64111 21.4184 6.08058L24.5434 9.20558C24.9829 9.64504 24.9829 10.3589 24.5434 10.7983L21.4184 13.9233C20.979 14.3628 20.2652 14.3628 19.8257 13.9233C19.3862 13.4839 19.3862 12.77 19.8257 12.3306L20.8179 11.3384L21.0313 11.125H20.7295H14.999C14.3767 11.125 13.874 10.6224 13.874 10C13.874 9.37763 14.3767 8.875 14.999 8.875H20.7295ZM9.36146 3.11244C9.03327 3.44063 8.58815 3.625 8.12402 3.625C7.65989 3.625 7.21478 3.44063 6.88659 3.11244C6.5584 2.78425 6.37402 2.33913 6.37402 1.875C6.37402 1.41087 6.5584 0.965752 6.88659 0.637563C7.21478 0.309374 7.65989 0.125 8.12402 0.125C8.58815 0.125 9.03327 0.309374 9.36146 0.637563C9.68965 0.965752 9.87402 1.41087 9.87402 1.875C9.87402 2.33913 9.68965 2.78425 9.36146 3.11244Z"
                  fill="#114560"
                  stroke="white"
                  stroke-width="0.25"
                />
              </svg>
            }
            size="large"
          />
          <h3 className="font-medium text-headings text-lg">Leave Balance</h3>
        </div>
        <a href="#" className="text-blue-600 text-sm font-semibold">
          View details
        </a>
      </div>

      <div className="flex justify-between space-x-4">
        {/* Annual Leave Circle */}
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-3 text-sm text-[#2A2B2A80]">Annual Leave</p>

          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="10"
              />
              {/* Progress circle - Annual Leave with gradient */}
              <defs>
                <linearGradient
                  id="annualLeaveGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#annualLeaveGradient)"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={annualOffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-bold text-headings">
                {annualUsed} Days Used
              </p>
              <p className="text-xs text-[#2A2B2A80] font-semibold">
                Out Of {annualTotal} Days
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-headings font-medium">
            {annualRemaining} Days Remaining
          </p>
        </div>

        {/* Sick Leave Circle */}
        <div className="flex-1 flex flex-col items-center">
          <p className="mb-3 text-sm text-[#2A2B2A80]">Sick Leave</p>
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="10"
              />
              {/* Progress circle - Sick Leave */}
              <defs>
                <linearGradient
                  id="sickLeaveGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3BF64E" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#sickLeaveGradient)"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={sickOffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-bold text-headings">
                {sickUsed} Days Used
              </p>
              <p className="text-xs text-[#2A2B2A80] font-semibold">
                Out Of {sickTotal} Days
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-headings font-medium">
            {sickRemaining} Days Remaining
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;