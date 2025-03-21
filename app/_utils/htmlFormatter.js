import toast from "react-hot-toast";

export function formatHtml(content) {
  if (!content) {
    toast.error("No content provided");
    return "";
  }

  return content
    .replace(/<html[^>]*>|<\/html>/gi, "")
    .replace(/\bhtml\b/gi, "")
    .replace(/[`]/g, "")
    .replace(/^\n+|\n+$|(\n)+/g, (match, group) =>
      group ? "<span class='custom-spacing'></span>" : "",
    );
}
