"use client";
import { useEffect, useState } from "react";
import { vacationService } from "@/app/_services/vacationService";
import {
  IAvailableTime,
  IVacationType,
  IVacationBalance,
} from "@/app/_types/vacation";
import { toast } from "react-hot-toast";
import CustomSelectInput from "@/app/_components/CustomSelectInput/CustomSelectInput";
import CustomBtn from "../../Button/CustomBtn";
import { Calendar, X, Wallet } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  onSuccess: () => void;
}

const resetTimeInDate = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export default function VacationRequestForm({ onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [availableTime, setAvailableTime] = useState<IAvailableTime | null>(
    null
  );
  const [vacationTypes, setVacationTypes] = useState<IVacationType[]>([]);
  const [formData, setFormData] = useState({
    days: [] as number[],
    vacationType: "",
    reason: "",
  });
  const [balance, setBalance] = useState<IVacationBalance | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [timeData, typesData] = await Promise.all([
          vacationService.getAvailableTime(),
          vacationService.getVacationTypes(),
        ]);
        setAvailableTime(timeData);
        setVacationTypes(typesData);
        // Set default vacation type if available
        if (typesData.length > 0) {
          setFormData((prev) => ({ ...prev, vacationType: typesData[0].type }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load vacation data");
      }
    };

    fetchData();
  }, []);

  // Transform vacation types for the select input
  const vacationTypeOptions = vacationTypes.map(
    (type) => `${type.type} (Balance: ${type.balance} days)`
  );

  const handleVacationTypeChange = (value: string) => {
    // Extract the actual type from the formatted string
    const type = value.split(" (")[0];
    setFormData((prev) => ({ ...prev, vacationType: type }));
  };

  // Get the current vacation type object for description
  const currentVacationType = vacationTypes.find(
    (type) => type.type === formData.vacationType
  );

  // Update the balance fetching effect
  useEffect(() => {
    const fetchBalance = async () => {
      if (!formData.vacationType) return;
      setIsBalanceLoading(true);
      try {
        const data = await vacationService.getVacationBalance(
          formData.vacationType
        );
        setBalance(data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsBalanceLoading(false);
      }
    };

    fetchBalance();
  }, [formData.vacationType]);

  // Calculate projected balance
  const projectedBalance = balance
    ? balance.balance! -
      balance.imbalance! -
      formData.days.filter(
        (date) => new Date(date).getFullYear() === new Date().getFullYear()
      ).length
    : null;

  const isDateSelectable = (date: Date) => {
    if (!availableTime) return false;

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const timestamp = resetTimeInDate(date).getTime();

    // Check if it's a working day
    if (!availableTime?.shift?.includes(dayName)) {
      return false;
    }

    // Check if it's a holiday
    const isHoliday = availableTime.holidays.some((holiday) => {
      return timestamp >= holiday.startDate && timestamp <= holiday.endDate;
    });
    if (isHoliday) {
      return false;
    }

    // Check if it's already a vacation day
    const isVacation = availableTime.vacations.some(
      (vacation) => vacation === timestamp
    );
    if (isVacation) {
      return false;
    }

    return true;
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    const timestamp = resetTimeInDate(date).getTime();

    setFormData((prev) => {
      const currentDates = [...prev.days];
      const dateIndex = currentDates.indexOf(timestamp);

      if (dateIndex >= 0) {
        currentDates.splice(dateIndex, 1);
      } else {
        currentDates.push(timestamp);
      }

      return {
        ...prev,
        days: currentDates,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await vacationService.requestVacation({
        days: formData.days,
        vacationType: formData.vacationType,
        reason: formData.reason,
      });

      if (res.result) {
        toast.success("Vacation request submitted successfully");
        onSuccess();
        setFormData({
          days: [],
          vacationType: vacationTypes[0]?.type || "", // Set to first available type or empty
          reason: "",
        });
        setIsCalendarOpen(false);
      } else {
        toast.error(res.message || "Failed to submit vacation request");
      }
    } catch (error) {
      console.error("Error submitting vacation request:", error);
      toast.error("Failed to submit vacation request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const isDateSelected = (date: Date) => {
    const timestamp = resetTimeInDate(date).getTime();
    return formData.days.includes(timestamp);
  };

  const removeDate = (timestamp: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.filter((date) => date !== timestamp),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-fit">
      {/* Balance display at the top */}
      {(balance || isBalanceLoading) && (
        <div className="absolute top-6 right-6 flex justify-end">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <Wallet className="w-5 h-5 text-gray-600" />
            {isBalanceLoading ? (
              <div className="h-5 w-24 animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 text-right mb-1">
                  (Only current year counts)
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Balance:{" "}
                  <span
                    className={`${
                      balance?.imbalance && balance.imbalance > 0
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    {balance?.balance! - balance?.imbalance!} days
                  </span>{" "}
                </span>
                {formData.days.length > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-500">After request:</span>
                    <span
                      className={`font-medium ${
                        projectedBalance && projectedBalance < 0
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {projectedBalance} days
                    </span>
                    {/* {balance?.imbalance && balance.imbalance > 0 ? ( */}
                    {/* <span className="text-orange-500">
                      (+{balance?.imbalance} pending)
                    </span> */}
                    {/* ) : null} */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="!mt-10">
        <label className="block text-sm font-medium text-gray-700">
          Select Vacation Days
        </label>
        <div className="relative">
          <div
            className="mt-1 px-4 py-2 w-full rounded-md border border-gray-400 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 cursor-pointer flex items-center"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <div className="flex-1 flex flex-wrap gap-2">
              {formData.days.length > 0 ? (
                formData.days
                  .sort((a, b) => a - b)
                  .map((timestamp) => (
                    <span
                      key={timestamp}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      {new Date(timestamp).toLocaleDateString()}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDate(timestamp);
                        }}
                        className="hover:bg-gray-200 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
              ) : (
                <span className="text-gray-500">Select dates</span>
              )}
            </div>
            <Calendar className="text-gray-400 ml-2" />
          </div>

          {isCalendarOpen && (
            <div className="absolute z-10 mt-1 w-full">
              {availableTime ? (
                <DatePicker
                  selected={null}
                  onChange={handleDateChange}
                  filterDate={isDateSelectable}
                  inline
                  monthsShown={1}
                  dayClassName={(date: Date) => {
                    return isDateSelected(date) ? "selected-day" : "";
                  }}
                  calendarClassName="custom-datepicker shadow-lg"
                  onClickOutside={() => setIsCalendarOpen(false)}
                  shouldCloseOnSelect={false}
                  dateFormat="yyyy/MM/dd"
                  showPopperArrow={false}
                  minDate={new Date()}
                />
              ) : (
                <div className="custom-datepicker shadow-lg flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Vacation Type
        </label>
        <div className="space-y-2">
          <CustomSelectInput
            options={vacationTypeOptions}
            getValue={handleVacationTypeChange}
          />
          {currentVacationType?.description && (
            <p className="text-sm text-gray-500">
              {currentVacationType.description}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="mt-1 p-2 block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
          placeholder="Please provide a reason for your vacation request"
        />
      </div>

      <CustomBtn
        type="submit"
        word={"Submit Request"}
        loading={isLoading}
        paddingVal="py-[--10px] px-[--22px]"
        btnColor="black"
      />
    </form>
  );
}
