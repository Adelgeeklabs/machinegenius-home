import toast from "react-hot-toast";

export const downloadLocalStorage = () => {
  if (typeof window === "undefined") return;

  try {
    const data = JSON.stringify(Object.assign({}, window.localStorage));

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.download = `localStorage-${Date.now()}.json`;

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Your Backup Has Completed Successfully");
  } catch {
    toast.error("Failed to backup");
    console.error(`Failed to download localStorage:`, error || "");
  }
};

export const downloadSessionStorage = (fileName = "sessionStorage") => {
  if (typeof window === "undefined") return;

  try {
    const data = JSON.stringify(Object.assign({}, window.sessionStorage));

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.download = `${fileName?.replaceAll(" ", "")}-Backup-${new Date().toISOString().split("T")[0]}.json`;

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Your Backup Has Completed Successfully");
  } catch {
    toast.error("Failed to backup");
    console.error(`Failed to download sessionStorage:`, error || "");
  }
};
