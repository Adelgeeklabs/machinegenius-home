export const mimeTypes = {
  img: {
    png: "image/png",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
  },
  audio: {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    ogg: "audio/ogg",
    flac: "audio/flac",
    midi: "audio/midi",
    amr: "audio/amr",
    wma: "audio/x-ms-wma",
    mp4: "audio/mp4",
    aiff: "audio/aiff",
  },
  file: {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    excel: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    csv: "text/csv",
    zip: "application/zip",
    tar: "application/x-tar",
    gzip: "application/gzip",
    json: "application/json",
    xml: "application/xml",
    js: "application/javascript",
    binary: "application/octet-stream",
    form: "application/x-www-form-urlencoded",
  },
};

export function formatTime(date: Date) {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return hours + ":" + minutes + ampm;
}

export const faceEmojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "👽",
  "🥵",
  "👾",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
];

export const fetchMessages = async (
  conversationId: string,
  handleSignOut?: () => void
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/all-messages/${conversationId}?limit=999999`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 401 && handleSignOut) {
      handleSignOut();
    }

    if (!response.ok) {
      console.error("Error fetching messages");
      throw new Error(`Error fetching messages: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
