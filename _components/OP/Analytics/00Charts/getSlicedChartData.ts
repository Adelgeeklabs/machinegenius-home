export const getSlicedChartData = (data: any[], timeframe: string) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    switch (timeframe) {
      case "Daily":
        return data?.slice(-7); // Get last 7 elements
      case "Weekly":
        return data?.slice(-4); // Get last 4 elements
      case "Monthly":
        return data?.slice(-12); // Get last 12 elements
      case "Yearly":
        return data; // Return all data
      default:
        return data?.slice(-7); // Default to Daily view
    }
  };