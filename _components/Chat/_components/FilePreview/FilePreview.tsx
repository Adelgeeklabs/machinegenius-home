"use client";
import React from "react";
import { Download } from "lucide-react";

// Helper function to get file extension
const getFileExtension = (filename: string) => {
  return filename?.split(".").pop()?.toUpperCase();
};

const FilePreview = ({ file, onRemove }: { file: any; onRemove: any }) => {
  console.log(file);

  // Helper function to format file name
  const formatFileName = (filename: string) => {
    // Remove extension and replace underscores with spaces
    return filename?.split(".")[0].replace(/_/g, " ");
  };

  return (
    <div className="group relative shrink-0 bg-white w-[140px] h-[--58px] shadow-sm flex flex-col justify-end pb-2 border-[--1px] border-[var(--dark)] rounded-[12px]">
      {/* Remove button */}
      {file.loading ? (
        <div className="absolute -top-[--5px] -right-[--5px] flex items-center justify-center w-[--20px] h-[--20px] bg-[#DBDBD7] rounded-full border-[--2px] border-[var(--white)]">
          <div className="w-[--10px] h-[--10px] border-2 border-[--dark] border-t-transparent border-b-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="absolute -top-[--5px] -right-[--5px] flex items-center justify-center w-[--20px] h-[--20px] bg-[#DBDBD7] rounded-full border-[--2px] border-[var(--white)]">
          <button
            onClick={() => {
              onRemove();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-[--15px] h-[--15px]"
            >
              <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
            </svg>
          </button>
        </div>
      )}
      {/* File name and type */}
      <div className="px-3">
        <div className="text-sm text-[#0000EE] font-medium mb-0.5 truncate">
          {formatFileName(file.name)}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-black/60 bg-black/5 px-1.5 rounded">
            {getFileExtension(file.name)}
          </span>

          {file.info && (
            <span className="text-xs text-black/40">{file.info}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const FileMessage = ({
  file,
  sender = "user",
  timestamp,
  length,
  index,
  isUser,
}: {
  file: any;
  sender: string;
  timestamp: string;
  length: number;
  index: number;
  isUser: boolean;
}) => {
  return (
    <a
      className={`max-w-[--313px] w-full block bg-[var(--dark)] rounded-lg p-1
      ${
        length % 2 !== 0 && index === length - 1 && isUser
          ? "col-span-2 justify-self-end"
          : ""
      }
      `}
      href={file.url}
      target="_blank"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Files Grid */}
      <div className="flex flex-wrap w-full gap-2 mb-1">
        <div key={file.name} className="bg-white rounded-lg w-full shadow-sm">
          {/* File Preview Section */}
          <div className="p-3 border-b border-gray-300">
            <div className="flex items-center gap-[--5px] justify-between">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                <span className="text-gray-900 capitalize">{file.type}</span>{" "}
                <span className="text-gray-500 text-[--9px]">
                  {getFileExtension(file.name)}
                </span>
              </span>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!file.url) {
                    file.onDownload?.(file);
                    return;
                  }
                  const response = await fetch(file.url);
                  if (!response.ok) {
                    file.onDownload?.(file);
                    return;
                  }
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.target = "_blank";
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(link);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Download size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* File Info Section */}
          <div className="p-3 w-full">
            <div className="text-sm text-gray-900 font-medium mb-1 truncate min-w-0 w-full">
              {file.name}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{file.info}</span>
              {file.progress !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {file.progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div
        className={`text-xs ${
          sender === "user" ? "text-blue-100" : "text-gray-500"
        } text-right mt-1`}
      >
        {timestamp}
      </div>
    </a>
  );
};

export { FilePreview, FileMessage };
