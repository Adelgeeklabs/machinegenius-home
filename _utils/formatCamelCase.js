function formatCamelCase(text) {
  // Handle undefined, null, or empty input
  if (text === undefined || text === null || text === "") {
    return "";
  }

  // Convert to string in case a number is passed
  const str = String(text);

  // Add space before capital letters and capitalize first letter
  const formatted = str
    // Add space before capital letters
    .replace(/([A-Z])/g, " $1")
    // Capitalize first letter
    .replace(/^./, (str) => str?.toUpperCase())
    // Remove any extra spaces
    ?.trim();

  return formatted;
}
export default formatCamelCase;
