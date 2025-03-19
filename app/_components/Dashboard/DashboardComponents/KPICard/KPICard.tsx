import React from "react";

const KPICard = () => {
  return (
    <div className="bg-white px-6 py-4 rounded-[--15px] shadow">
      <div className="flex items-center mb-2">
        <div className="bg-[#11456012] w-[--32px] h-[--32px] flex justify-center items-center rounded-[--4px] mr-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.9032 3.87097L16.7742 0V3.22581H20L16.129 7.09677H13.695L10.2003 10.7579C10.0724 10.8919 9.89523 10.9677 9.71 10.9677C9.33568 10.9677 9.03226 10.6643 9.03226 10.29C9.03226 10.1048 9.10806 9.92761 9.24206 9.79974L12.9032 6.30499V3.87097ZM13.514 1.43546C12.3377 0.926955 11.0405 0.645161 9.67742 0.645161C4.33273 0.645161 0 4.97789 0 10.3226C0 15.6673 4.33273 20 9.67742 20C15.0221 20 19.3548 15.6673 19.3548 10.3226C19.3548 8.95955 19.073 7.66239 18.5646 6.48606L16.6635 8.38716H16.5071C16.6811 9.00239 16.7742 9.65161 16.7742 10.3226C16.7742 14.242 13.5968 17.4194 9.67742 17.4194C5.75798 17.4194 2.58065 14.242 2.58065 10.3226C2.58065 6.40314 5.75798 3.22581 9.67742 3.22581C10.3484 3.22581 10.9976 3.31892 11.6129 3.49294V3.33654L13.514 1.43546ZM11.6129 5.53646C11.0152 5.29452 10.3619 5.16129 9.67742 5.16129C6.8269 5.16129 4.51613 7.47206 4.51613 10.3226C4.51613 13.1731 6.8269 15.4839 9.67742 15.4839C12.5279 15.4839 14.8387 13.1731 14.8387 10.3226C14.8387 9.63813 14.7055 8.98484 14.4635 8.38716H14.2471L12.2536 10.4756C12.1745 11.8296 11.0513 12.9032 9.67742 12.9032C8.25219 12.9032 7.09677 11.7478 7.09677 10.3226C7.09677 8.94871 8.17039 7.82555 9.52445 7.74639L11.6129 5.75287V5.53646Z"
              fill="#114560"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-[#114560] text-lg">My KPIs</h3>
      </div>

      <div className="flex justify-between items-center mb-3">
        <p className=" font-semibold text-headings">KPIs Met</p>
        <p className=" font-bold text-[#114560] text-2xl">
          15<span className=" font-medium text-[#2A2B2A80] text-base">/19</span>
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: "66%" }}
        ></div>
      </div>
    </div>
  );
};

export default KPICard;
