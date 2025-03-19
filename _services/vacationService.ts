import {
  IVacationRequest,
  IVacation,
  IVacationType,
  IVacationResponse,
  IVacationBalance,
  IAvailableTime,
} from "../_types/vacation";

export const vacationService = {
  requestVacation: async (
    data: IVacationRequest
  ): Promise<{
    result: boolean;
    message?: string;
    data?: IVacationResponse;
  }> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        return {
          result: false,
          message: responseData.message || "Failed to create vacation request",
        };
      }

      return {
        result: true,
        data: responseData,
      };
    } catch (error) {
      return {
        result: false,
        message: "An error occurred while creating the vacation request",
      };
    }
  },

  getVacations: async (
    status?: string,
    startDate?: number,
    endDate?: number
  ): Promise<IVacation[]> => {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (startDate) queryParams.append("startDate", startDate.toString());
    if (endDate) queryParams.append("endDate", endDate.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  deleteVacation: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAvailableTime: async (): Promise<IAvailableTime> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation/available-time`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getVacationTypes: async (): Promise<IVacationType[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation/type`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getVacationBalance: async (type: string): Promise<IVacationBalance> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/vacation/available-balance/${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },
};

export const HRVacationService = {
  getVacations: async (params?: {
    status?: string;
    startDate?: string | null;
    endDate?: string | null;
    employeeId?: string | null;
  }): Promise<IVacation[]> => {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.employeeId) queryParams.append("employeeId", params.employeeId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/vacation?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  approveVacation: async (id: string): Promise<IVacation> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/vacation/approve/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  rejectVacation: async (id: string): Promise<IVacation> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/vacation/reject/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },
};
