"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DateAndTimePicker({ getDateTimeValue }) {
  const [value, setValue] = useState(dayjs());
  const [error, setError] = useState("");

  //   useEffect(() => {
  //     const milliseconds = new Date(value).getTime();
  //     console.log(milliseconds);
  //   }, [value]);

  const handleDateChange = (newValue) => {
    // Check if the value is null or undefined
    if (!newValue) {
      setError("Please select a valid date and time");
      return;
    }

    const selectedDate = new Date(newValue);
    const currentDate = new Date();

    // Check if selected date is in the past
    if (selectedDate < currentDate) {
      setError("Cannot select a past date and time");
      return;
    }

    setError("");
    setValue(newValue);
    const milliseconds = selectedDate.getTime();
    getDateTimeValue(milliseconds);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
        <DateTimePicker
          label="Posting Time"
          value={value}
          onChange={handleDateChange}
          minDateTime={dayjs()} // This will disable past dates
          slotProps={{
            textField: {
              helperText: error,
              error: !!error,
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
