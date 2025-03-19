"use client";
import styles from "./SpecificChecker.module.css";
import { passIcon, failIcon, warningIcon } from "@/app/_utils/svgIcons";
interface ICheckerProps {
  word: string;
  checkStatus: string;
}

// component for type of check and result of check
const SpecificChecker = ({ word, checkStatus }: ICheckerProps) => {
  return (
    <div className={`${styles.properityAndResult}`}>
      {/* type of check */}
      <p>{word}</p>
      {/* right icon with green or red background based on the recieved result */}
      <div className="flex justify-center items-center">
        {checkStatus === "waiting" ? (
          <span className="custom-loader"></span>
        ) : checkStatus === "pass" ? (
          passIcon
        ) : checkStatus === "fail" ? (
          failIcon
        ) : checkStatus === "fetchError" ? (
          warningIcon
        ) : null}
      </div>
    </div>
  );
};

export default SpecificChecker;
