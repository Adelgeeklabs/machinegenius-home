const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface EventFilter {
  type?: string;
  startNumber?: number;
  endNumber?: number;
  brand?: string;
}

export interface Event {
  _id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  backgroundColor: string;
  employee: {
    firstName: string;
    lastName: string;
    department: string[];
  } | null;
  department: string;
  type: string | null;
}

export enum EventEnum {
  OfficialHolidays = "OfficialHolidays",
  Birthdays = "Birthdays",
  CompanyHolidays = "CompanyHolidays",
  Meetings = "Meetings",
}

export interface EventInput {
  type: EventEnum;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
}

export const eventService = {
  async getMonthEvents(): Promise<Event[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/user/event/month-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching month events:", error);
      throw error;
    }
  },

  async getEventById(eventId: string): Promise<Event> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/user/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event details:", error);
      throw error;
    }
  },

  async getCompanyHolidays(): Promise<Event[]> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/user/event/filter?type=CompanyHolidays`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching company holidays:", error);
      throw error;
    }
  },

  async getFilteredEvents(filters: EventFilter): Promise<Event[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters.type) {
        queryParams.append("type", filters.type);
      }
      if (filters.startNumber) {
        queryParams.append("startNumber", filters.startNumber.toString());
      }
      if (filters.endNumber) {
        queryParams.append("endNumber", filters.endNumber.toString());
      }
      if (filters.brand) {
        queryParams.append("brand", filters.brand);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/user/event/filter?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching filtered events:", error);
      throw error;
    }
  },

  async createHREvent(eventData: EventInput): Promise<Event> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/hr/event`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating HR event:", error);
      throw error;
    }
  },

  async updateHREvent(eventId: string, eventData: EventInput): Promise<Event> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/hr/event/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating HR event:", error);
      throw error;
    }
  },

  async deleteHREvent(eventId: string): Promise<string> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/hr/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting HR event:", error);
      throw error;
    }
  },
};
