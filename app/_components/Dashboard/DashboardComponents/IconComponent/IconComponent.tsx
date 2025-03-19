import React from "react";

const IconComponent = ({
  svg,
  size,
  bg,
}: {
  svg: any;
  size: string;
  bg?: string;
}) => {
  return (
    <span
      style={{ backgroundColor: bg || "#11456012" }} // ✅ Use inline styles
      className={`flex justify-center items-center rounded-[4px] ${
        size === "large" ? "w-[32px] h-[32px]" : "w-[24px] h-[24px]"
      }`}
    >
      {svg}
    </span>
  );
};

export default IconComponent;
