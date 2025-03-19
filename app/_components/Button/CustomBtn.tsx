"use client";
import React, { memo } from "react";
import styles from "./CustomBtn.module.css";
import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactElement,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Custom button props
type IBtn = {
  word?: string;
  btnColor: "white" | "black";
  icon?: ReactElement;
  href?: string;
  widthSize?: string | "";
  width?: string;
  className?: string;
  paddingVal?: string;
  loading?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
} & (
  | React.DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  | React.DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
);

const LoadingSpinner = ({
  loading = false,
  btnColor,
}: {
  loading?: boolean;
  btnColor: "white" | "black";
}) => {
  return loading ? (
    <div
      className={`${loading ? "opacity-100" : "opacity-0"} relative z-50 custom-loader [grid-area:stack]
            ${
              btnColor === "white"
                ? "[border:5px_solid_#1c1c1c_!important]"
                : "[border:5px_solid_#fff_!important]"
            }
            ${
              btnColor === "white"
                ? "group-hover:[border-inline:5px_solid_#fff_!important] group-hover:[border-top:5px_solid_#fff_!important] group-hover:[border-bottom:5px_solid_transparent_!important]"
                : "group-hover:[border-inline:5px_solid_#1c1c1c_!important] group-hover:[border-top:5px_solid_#1c1c1c_!important] group-hover:[border-bottom:5px_solid_transparent_!important]"
            }`}
    ></div>
  ) : null;
};

const CustomBtn = memo((props: IBtn) => {
  const router = useRouter();
  const {
    href,
    btnColor,
    className,
    width,
    icon,
    word,
    paddingVal,
    loading,
    onClick,
    ...restProps
  } = props;

  const buttonContent = (
    <div
      className={`${styles.iconAndTxtBtn} ${
        paddingVal ? paddingVal : `py-[0.5vw] px-[3vw]`
      }`}
    >
      {icon ? icon : null}
      {word ? <span>{word}</span> : null}
    </div>
  );

  const buttonClass = `${
    btnColor === "white" ? styles.whiteBtn : styles.blackBtn
  } ${className} ${width ? width : "w-fit"}`;

  if (href && !onClick) {
    // Anchor attributes only
    const anchorProps = restProps as React.DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >;

    return (
      <Link
        href={href}
        className={`${buttonClass} group`}
        {...anchorProps}
      >
        <div className="grid justify-center items-center grid-template-areas-[stack] place-items-center">
          <LoadingSpinner loading={loading} btnColor={btnColor} />
          <span
            className={`${loading ? "opacity-0" : "opacity-100"} w-full [grid-area:stack] `}
          >
            {buttonContent}
          </span>
        </div>
      </Link>
    );
  } else {
    // Button attributes only
    const buttonProps = restProps as React.DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >;

    return (
      <button
        className={`${buttonClass} group`}
        {...buttonProps}
        onClick={(e) => {
          if (href) {
            router.push(href);
          } else if (onClick) {
            onClick(e);
          }
        }}
      >
        <div className="grid justify-center items-center grid-template-areas-[stack] place-items-center">
          <LoadingSpinner loading={loading} btnColor={btnColor} />
          <span
            className={`${loading ? "opacity-0" : "opacity-100"} w-full [grid-area:stack] `}
          >
            {buttonContent}
          </span>
        </div>
      </button>
    );
  }
});

export default CustomBtn;
