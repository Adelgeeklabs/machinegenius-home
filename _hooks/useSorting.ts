import { useState, useEffect } from "react";

interface SortingState {
  field: string;
  direction: "Ascend" | "Descend";
  nestedField?: string;
}

type SortConfig = Record<string, SortingState>;

export function useSorting<T>(
  data: T[],
  initialSortState: SortConfig,
  options?: {
    getNestedValue?: (item: T, field: string, nestedField?: string) => any;
  }
): [T[], SortConfig, (field: string) => void] {
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [sortingState, setSortingState] =
    useState<SortConfig>(initialSortState);

  const handleSort = (field: string) => {
    setSortingState((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        direction: prev[field].direction === "Ascend" ? "Descend" : "Ascend",
      },
    }));
  };

  const getValue = (item: T, field: string, nestedField?: string) => {
    if (options?.getNestedValue) {
      return options.getNestedValue(item, field, nestedField);
    }

    let value = item[field as keyof T];
    if (nestedField && typeof value === "object" && value !== null) {
      value = (value as any)[nestedField];
    }
    return value;
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length === 0) return;
    setSortedData(
      Array.isArray(data) && data.length > 0
        ? [...data]?.sort((a, b) => {
            for (const key in sortingState) {
              const { field, direction, nestedField } = sortingState[key];
              const valueA = getValue(a, field, nestedField);
              const valueB = getValue(b, field, nestedField);

              if (valueA !== valueB) {
                const compareA =
                  typeof valueA === "string" ? valueA?.toLowerCase() : valueA;
                const compareB =
                  typeof valueB === "string" ? valueB?.toLowerCase() : valueB;

                return direction === "Ascend"
                  ? compareA < compareB
                    ? -1
                    : 1
                  : compareA > compareB
                    ? -1
                    : 1;
              }
            }
            return 0;
          })
        : (data as T[])
    );
  }, [data, sortingState]);

  return [sortedData, sortingState, handleSort];
}
