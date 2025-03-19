import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

interface MonthPaginationProps {
  initialDate?: Date;
  showDayMonth?: boolean; // Control display format
  onChange?: (date: Date, timestamp: number) => void; // Callback for date changes
}

const MonthPagination = ({
  initialDate,
  showDayMonth = false,
  onChange,
}: MonthPaginationProps) => {
  // Use today's date as default if initialDate is not provided
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("");
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize component with today's date
  useEffect(() => {
    if (onChange) {
      onChange(currentDate, currentDate.getTime());
    }
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
        setDropdownPosition("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to update date and invoke callback
  const updateDate = (newDate: Date) => {
    setCurrentDate(newDate);
    if (onChange) {
      onChange(newDate, newDate.getTime());
    }
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (showDayMonth) {
      // Go to previous day
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      // Go to previous month
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    updateDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (showDayMonth) {
      // Go to next day
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      // Go to next month
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    updateDate(newDate);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(true);
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    updateDate(newDate);
    setIsCalendarOpen(false);
  };

  const selectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    updateDate(newDate);
  };

  const selectDay = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    updateDate(newDate);
    setIsCalendarOpen(false);
  };

  // Reset to today's date
  const goToToday = () => {
    updateDate(new Date());
    setIsCalendarOpen(false);
  };

  // Format the date according to the showDayMonth prop
  const getFormattedDate = () => {
    if (showDayMonth) {
      return `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  const currentDateText = getFormattedDate();

  // Get aria labels for navigation buttons based on mode
  const getPreviousAriaLabel = () =>
    showDayMonth ? "Previous day" : "Previous month";
  const getNextAriaLabel = () => (showDayMonth ? "Next day" : "Next month");

  // Generate year options (current year ± 5 years)
  const currentYear = currentDate.getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  useEffect(() => {
    if (isCalendarOpen && calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      const dropdownBottom = rect.top + rect.height;
      const viewportHeight = window.innerHeight;

      if (dropdownBottom + 10 > viewportHeight) {
        setDropdownPosition("up"); // Open upwards
      } else {
        setDropdownPosition("down"); // Open downwards
      }
    }
    if (!isCalendarOpen) {
      setDropdownPosition("");
    }
  }, [isCalendarOpen]);

  return (
    <div className="relative">
      <div className="flex items-center justify-center space-x-2">
        <button
          className="p-2 rounded-full bg-[#F7F7F7] transition-colors"
          aria-label={getPreviousAriaLabel()}
          onClick={goToPrevious}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          className={`text-sm font-medium ${showDayMonth ? "w-36" : "w-24"} h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors`}
          onClick={toggleCalendar}
          aria-expanded={isCalendarOpen}
          aria-haspopup="true"
        >
          <span className="font-semibold text-headings">{currentDateText}</span>
        </button>

        <button
          className="p-2 rounded-full bg-[#F7F7F7] transition-colors"
          aria-label={getNextAriaLabel()}
          onClick={goToNext}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className={`calendarRef absolute ${dropdownPosition === "up" ? "bottom-full" : dropdownPosition === "down" ? "top-10" : " invisible"} left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-4 z-[10000] border border-gray-200 w-64`}
        >
          <div className="mb-4 flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <button
              className="text-xs text-blue-500 hover:text-blue-700"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <select
            className="w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 text-sm mb-4"
            value={currentDate.getFullYear()}
            onChange={(e) => selectYear(parseInt(e.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`p-2 text-sm rounded-md transition-colors ${
                    index === currentDate.getMonth()
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => selectMonth(index)}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {showDayMonth && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day
              </label>
              <div className="grid grid-cols-7 gap-1">
                {Array.from(
                  { length: getDaysInMonth(currentDate) },
                  (_, i) => i + 1
                ).map((day) => (
                  <button
                    key={day}
                    className={`p-1 text-sm rounded-md transition-colors ${
                      day === currentDate.getDate()
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => selectDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get the number of days in a month
function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export default MonthPagination;
