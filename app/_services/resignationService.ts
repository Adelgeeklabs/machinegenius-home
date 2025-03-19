import {
  IOffboardModel,
  IResignationRequest,
  IResignationResponse,
  IResignationsListResponse,
} from "../_interfaces/offboardInterfaces";

// Service object with methods for resignation-related API calls
export const resignationService = {
  /**
   * Submit a new resignation request
   */
  submitResignation: async (
    data: IResignationRequest
  ): Promise<IResignationResponse> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/offboard`,
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
          message:
            responseData.message || "Failed to submit resignation request",
        };
      }

      return {
        result: true,
        data: responseData,
      };
    } catch (error) {
      console.error("Error submitting resignation request:", error);
      return {
        result: false,
        message: "An error occurred while submitting the resignation request",
      };
    }
  },

  /**
   * Get all resignation requests for the current user
   */
  getResignationRequests: async (): Promise<IResignationsListResponse> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/offboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        return {
          result: false,
          message:
            responseData.message || "Failed to retrieve resignation requests",
        };
      }

      return {
        result: true,
        data: responseData,
      };
    } catch (error) {
      console.error("Error retrieving resignation requests:", error);
      return {
        result: false,
        message: "An error occurred while retrieving resignation requests",
      };
    }
  },

  /**
   * Cancel a resignation request
   */
  cancelResignation: async (id: string): Promise<IResignationResponse> => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/offboard/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        return {
          result: false,
          message:
            responseData.message || "Failed to cancel resignation request",
        };
      }

      return {
        result: true,
        data: responseData,
      };
    } catch (error) {
      console.error("Error canceling resignation request:", error);
      return {
        result: false,
        message: "An error occurred while canceling the resignation request",
      };
    }
  },
};
