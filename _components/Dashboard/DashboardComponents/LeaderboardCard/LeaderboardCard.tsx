import React from "react";
import MonthPagination from "../NavigateDate/NavigateDate";
import { Icon } from "lucide-react";
import IconComponent from "../IconComponent/IconComponent";

const LeaderboardCard = () => {
  return (
    <div className="bg-transparent p-4 pb-0">
      <div className="flex justify-between w-full mb-8">
        <div className="flex items-center gap-4">
          <IconComponent
            size="large"
            bg="white"
            svg={
              <svg
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1619 1.90315L11.3506 0.222804C11.2166 -0.0689715 10.7972 -0.0795176 10.6494 0.222804L9.83813 1.90315L8.04031 2.1668C7.72063 2.21601 7.58313 2.62028 7.82031 2.86284L9.12656 4.16353L8.81719 5.99503C8.76906 6.32196 9.09906 6.57507 9.39469 6.4239L11.0069 5.55209L12.6088 6.40984C12.9044 6.561 13.2378 6.3079 13.1862 5.98097L12.8769 4.14947L14.1831 2.86284C14.4169 2.6238 14.2828 2.21953 13.9631 2.1668L12.1653 1.90315H12.1619ZM8.8 9.00067C8.19156 9.00067 7.86622 9.45 7.92 10.35L7.86622 16.8751C7.86622 17.4973 8.19156 18 8.8 18H13.2C13.8084 18 14.08 17.4973 14.08 16.8751V10.1256C14.08 9.50336 13.8084 9.00067 13.2 9.00067H8.8ZM1.1 11.2505C0.491563 11.2505 0 11.7532 0 12.3754V16.8751C0 17.4973 0.491563 18 1.1 18H5.5C6.10844 18 6.16 17.55 6.16 16.8751V12.3754C6.16 11.7532 6.10844 11.2505 5.5 11.2505H1.1ZM15.84 14.6252V16.8751C15.84 17.4973 15.8916 18 16.5 18H20.9C21.5084 18 22 17.4973 22 16.8751V14.6252C22 14.003 21.5084 13.5003 20.9 13.5003H16.5C15.8916 13.5003 15.84 14.003 15.84 14.6252Z"
                  fill="#114560"
                />
              </svg>
            }
          />
          <h3 className="font-medium text-base text-headings">
            Employee Leaderboard
          </h3>
        </div>
        <div>
          <MonthPagination />
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="flex flex-col items-center gap-y-1 pt-3">
          <div className="relative h-16 w-16">
            <div className="w-Full h-full bg-black rounded-full mx-auto relative">
              <span className=" w-[18px] h-[18px] rounded-full flex justify-center absolute top-full left-1/2 -translate-x-1/2 -translate-y-[9px] z-10 items-center border-[1.8px] border-[#114560] bg-[#E0D912] text-sm">
                2
              </span>
            </div>
          </div>
          <h4 className="text-sm font-semibold text-[#2a2b2a]">Youssef Ali</h4>
          <p className="text-[--10px] font-medium text-[#2A2B2A80]">AB/1621</p>
        </div>

        <div className="flex flex-col items-center gap-y-1 relative">
          <svg
            width="27"
            height="23"
            viewBox="0 0 27 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=" absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1/4"
          >
            <path
              d="M4.62188 22.0628V20.7809C6.9448 19.9651 10.1437 19.4949 13.5038 19.4949C16.8638 19.4949 20.0658 19.9651 22.3856 20.7808V22.2105C20.0448 21.3741 16.8338 20.865 13.294 20.8647C10.359 20.8204 7.43463 21.2245 4.62188 22.0628Z"
              fill="#E0D912"
              stroke="#114560"
              stroke-width="0.9"
            />
            <path
              d="M17.2072 12.5541L17.2077 12.5552L17.5949 13.3615L17.8514 13.8956L18.2971 13.5052L24.2094 8.32584L22.5996 18.2918C20.0588 17.488 16.8752 17.0608 13.4892 17.0608C10.1032 17.0608 6.91662 17.488 4.37542 18.2917L2.77125 8.32309L8.69932 13.5055L9.14638 13.8963L9.40176 13.3602L13.4946 4.76841L17.2072 12.5541Z"
              fill="#E0D912"
              stroke="#114560"
              stroke-width="0.9"
            />
            <path
              d="M14.6725 1.61971C14.6725 2.26569 14.1488 2.78943 13.5027 2.78943C12.8565 2.78943 12.3328 2.26569 12.3328 1.61971C12.3328 0.973734 12.8565 0.45 13.5027 0.45C14.1488 0.45 14.6725 0.973734 14.6725 1.61971Z"
              fill="#E0D912"
              stroke="#114560"
              stroke-width="0.9"
            />
            <path
              d="M2.1787 5.17595V5.17716C2.1787 5.40542 2.08801 5.62434 1.92659 5.78575C1.76516 5.94716 1.54621 6.03785 1.3179 6.03785L1.31668 6.03785C1.14553 6.03832 0.978086 5.98796 0.835585 5.89317C0.693086 5.79838 0.581943 5.66342 0.516237 5.50541C0.450532 5.3474 0.43322 5.17345 0.466494 5.00559C0.499768 4.83773 0.58213 4.68353 0.70315 4.56252C0.824169 4.44151 0.978397 4.35914 1.14629 4.32587C1.31418 4.29259 1.48817 4.30991 1.64621 4.37561C1.80425 4.44132 1.93922 4.55246 2.03401 4.69494C2.12881 4.83742 2.17916 5.00483 2.1787 5.17595Z"
              fill="#E0D912"
              stroke="#114560"
              stroke-width="0.9"
            />
            <path
              d="M26.5537 5.17752C26.5537 5.65479 26.1668 6.04176 25.6894 6.04176C25.2119 6.04176 24.825 5.65479 24.825 5.17752C24.825 4.70025 25.2119 4.31328 25.6894 4.31328C26.1668 4.31328 26.5537 4.70025 26.5537 5.17752Z"
              fill="#E0D912"
              stroke="#114560"
              stroke-width="0.9"
            />
          </svg>

          <div className="relative h-16 w-16">
            <div className="w-Full h-full bg-black rounded-full mx-auto relative">
              <span className=" w-[18px] h-[18px] rounded-full flex justify-center absolute top-full left-1/2 -translate-x-1/2 -translate-y-[9px] z-10 items-center border-[1.8px] border-[#114560] bg-[#E0D912] text-sm">
                1
              </span>
            </div>
          </div>
          <h4 className="text-sm font-semibold text-[#2a2b2a]">
            Mohamed Ramadan
          </h4>
          <p className="text-[--10px] font-medium text-[#2A2B2A80]">AB/1916</p>
        </div>

        <div className="flex flex-col items-center gap-y-1 pt-4">
          <div className="relative h-16 w-16">
            <div className="w-Full h-full bg-black rounded-full mx-auto relative">
              <span className=" w-[18px] h-[18px] rounded-full flex justify-center absolute top-full left-1/2 -translate-x-1/2 -translate-y-[9px] z-10 items-center border-[1.8px] border-[#114560] bg-[#E0D912] text-sm">
                3
              </span>
            </div>
          </div>
          <h4 className="text-sm font-semibold text-[#2a2b2a]">Amany Hesham</h4>
          <p className="text-[--10px] font-medium text-[#2A2B2A80]">AB/1160</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
