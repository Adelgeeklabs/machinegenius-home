import React, { memo } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function DashboardCalendar() {
  return (
    <div className="DashboardCalendar w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          slots={{
            rightArrowIcon: ArrowRightIcon,
            leftArrowIcon: ArrowLeftIcon,
          }}
          dayOfWeekFormatter={(weekday) => `${weekday.format("ddd")}`}
          showDaysOutsideCurrentMonth={false}
          displayWeekNumber={false}
          disableHighlightToday={false}
          sx={{
            "& .MuiDateCalendar-root": {
              boxShadow: "0.79px 2.38px 5.24px 0px #00000026",
              border: "1px solid #dfdfdf",
              borderRadius: "16px",
              width: "100%",
              padding: "8px 0",
            },

            "& .MuiButtonBase-root.MuiIconButton-root.MuiPickersArrowSwitcher-button":
              {
                border: "1px solid var(--dark)",
                borderRadius: "0.2vw",
                backgroundColor: "var(--dark)",
                cursor: "pointer",
                padding: "5px",
                width: "33px",
                height: "33px",
                color: "var(--white)",
              },
            "& .MuiPickersArrowSwitcher-spacer": {
              width: "35px",
            },
            "& .MuiPickersDay-today, & .MuiButtonBase-root.MuiPickersDay-root.Mui-selected":
              {
                backgroundColor: "var(--dark)",
                color: "var(--white)",
                width: "33px",
                height: "33px",
                fontSize: "13px",
                margin: "0 2px",
              },
            "& .MuiButtonBase-root.MuiPickersDay-root": {
              color: "#bdbdbd",
              fontWeight: 500,
              fontSize: "13px",
              fontFamily: '"DM Sans", sans-serif',
              margin: "0 5px",
              height: "33px",
              width: "33px",
            },
            "& .MuiPickersCalendarHeader-root": {
              padding: "0 15px",
              marginBottom: "8px",
            },
            "& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
              display: "flex",
              justifyContent: "space-around", // Changed from space-between
              margin: "4px 0",
              width: "100%",
              padding: "0 15px",
            },
            "& .MuiDayCalendar-monthContainer": {
              minHeight: "auto", // Changed from fixed height
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start", // Changed from space-between
            },
            // Added responsive day sizing
            "& .MuiDayCalendar-weekContainer": {
              flexWrap: "wrap", // Allow days to wrap when needed
            },
            // Make sure days adjust to available space
            "@media (max-width: 600px)": {
              "& .MuiButtonBase-root.MuiPickersDay-root": {
                width: "28px",
                height: "28px",
                margin: "0 2px",
                fontSize: "12px",
              },
              "& .MuiPickersDay-today, & .MuiButtonBase-root.MuiPickersDay-root.Mui-selected":
                {
                  width: "28px",
                  height: "28px",
                  fontSize: "12px",
                },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}

export default memo(DashboardCalendar);
