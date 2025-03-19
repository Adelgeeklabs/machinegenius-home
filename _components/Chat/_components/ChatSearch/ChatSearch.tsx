"use client";
import React, { useEffect, useState, memo } from "react";

const ChatSearch = ({
  setSearchTerm,
  handleArrowClick,
  searchTerm,
  currentIndex,
  highlightedIndexes,
}: {
  setSearchTerm: Function;
  handleArrowClick: Function;
  searchTerm: string;
  currentIndex: number;
  highlightedIndexes: number[];
}) => {
  const [openSearch, setOpenSearch] = useState<Boolean>(false);
  useEffect(() => {
    window.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("chatSearch")) {
        return;
      } else {
        setSearchTerm("");
        setOpenSearch(false);
      }
    });
  }, []);
  return (
    <>
      <div className=" relative chatSearch">
        <input
          type="text"
          placeholder="search"
          value={searchTerm}
          className={`rounded-md chatSearch border-[1px] border-gray-400 focus-within:border-[1px] focus-within:border-gray-400 focus-within:outline-none h-[--sy-40px] transition-all duration-200 ${openSearch ? "border-[1px] px-4 w-[180px]" : "w-[0px] border-[0px]"}`}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 absolute top-1/2 -translate-y-1/2 right-[--6px] chatSearch cursor-pointer"
          onClick={() => {
            setOpenSearch(true);
            const input = document.querySelector(".chatSearch input") as HTMLInputElement;
            if (input) {
              input.focus();
            }
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            className="chatSearch"
          />
        </svg>
        {openSearch && searchTerm && (
          <div className=" flex flex-col items-center gap-2 mr-[--10px] absolute -left-[--60px] top-1/2 -translate-y-1/2">
            <button
              onClick={() => handleArrowClick("up")}
              className=" p-1 bg-gray-200 rounded chatSearch cursor-pointer text-[--14px]"
            >
              ↑
            </button>
            <span className="text-[--12px]chatSearch">
              {currentIndex + 1}/{highlightedIndexes.length}
            </span>
            <button
              onClick={() => handleArrowClick("down")}
              className=" p-1 bg-gray-200 rounded chatSearch cursor-pointer text-[--14px]"
            >
              ↓
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(ChatSearch);
