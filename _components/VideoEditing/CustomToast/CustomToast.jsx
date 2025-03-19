import React, { memo } from "react";
import { X, AlertCircle } from "lucide-react";

const CustomToast = ({ message, onClose, type = "error" }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow border-l-4 border-red-500">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-[--25px] h-[--25px] text-red-400" />
        <span className="text-[--16px] font-normal text-white">
          {message}
        </span>
      </div>
      <button
        onClick={onClose}
        className="inline-flex items-center justify-center flex-shrink-0 w-[--30px] h-[--30px] rounded-lg text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <X className="w-[--15px] h-[--15px]" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

export default memo(CustomToast);
