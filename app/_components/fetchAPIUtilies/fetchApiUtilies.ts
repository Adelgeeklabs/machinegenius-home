const fetchAPI = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" = "GET",
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ response: Response; data: T }> => {
  try {
    // Set default headers
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Include authentication token if available (modify based on your auth setup)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Request options
    const options: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    // Attach body if not GET or HEAD
    if (body && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    // Make the request
    const response = await fetch(url, options);
    const data: T = await response.json();

    return { response, data };
  } catch (error) {
    console.error("API Fetch Error:", (error as Error).message);
    throw error;
  }
};

export default fetchAPI;
