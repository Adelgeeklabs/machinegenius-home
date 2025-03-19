// Function to format numbers (e.g., 1000 -> 1K)
export function formatNumbers(num: number | undefined): string {
  if (!num) return "-";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};
