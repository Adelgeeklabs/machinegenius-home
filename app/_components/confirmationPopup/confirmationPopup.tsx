"use client";

import { useState } from "react";
import CustomBtn from "../Button/CustomBtn";

export default function ConfirmationPopup({
  cadidate,
  open,
  setOpen,
  functionToCall,
}: {
  cadidate: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  functionToCall: () => void;
}) {
  return (
    <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-[--16px] py-[--sy-10px] rounded-[--10px] border border-gray-300 bg-[#fffffb] min-w-[26vw] min-h-[16vh] flex items-center justify-center flex-col">
      <p className="text-[--16px] font-bold text-center mb-[--sy-20px]">
        Are you sure you want to send this message to {cadidate}?
      </p>
      <div className="flex justify-center items-center gap-[--10px]">
        <CustomBtn
          word="Cancel"
          btnColor="white"
          onClick={() => setOpen(false)}
        />
        <CustomBtn
          word="Send"
          btnColor="black"
          onClick={() => {
            functionToCall();
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
}
