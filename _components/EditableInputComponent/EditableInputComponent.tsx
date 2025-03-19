"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomSelectInput from "../CustomSelectInput/CustomSelectInput";

const EditableInputComponent = ({
  label,
  initialValue,
  className,
  onChangeValue,
  type,
}: {
  label: string;
  initialValue: string;
  className: string;
  onChangeValue: (value: string) => void;
  type?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "+" ||
      e.key === "-" ||
      e.key === "e" ||
      e.key === "E" ||
      e.key === "."
    ) {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className={`flex flex-col gap-[--sy-12px] ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-[--sy-20px] font-bold">{label}</h1>
        <div
          className="flex gap-[--sy-10px] items-center cursor-pointer"
          onClick={handleEditClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={`${isEditing ? "blue" : "currentColor"}`}
            className="size-6 !transition-all !duration-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          <span
            className={`${
              isEditing ? "text-blue-800" : ""
            } transition-all duration-500 font-bold`}
          >
            Edit
          </span>
        </div>
      </div>
      {type !== "select" ? (
        <input
          ref={inputRef}
          type="number"
          value={initialValue}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numeric characters
            if (/^\d*$/.test(value)) {
              onChangeValue(value);
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`border border-gray-300 py-[--sy-6px] px-[--sy-20px] rounded-[--sy-5px] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
            isEditing ? "border-blue-500" : ""
          }`}
          readOnly={!isEditing}
        />
      ) : (
        <CustomSelectInput
          options={["FaceToFace", "PhoneCall"]}
          getValue={(value: string) => onChangeValue(value)}
          disabled={!isEditing}
          onBlur={handleBlur}
          label={initialValue}
        />
      )}
    </div>
  );
};

export default EditableInputComponent;
