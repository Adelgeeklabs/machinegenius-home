// Service file for resignation management API interactions
import {
  IManagerResignationRequest,
  IUpdateResignationRequest,
  IOffboardModel,
} from "../_interfaces/offboardInterfaces";

class ResignationManagementService {
  // Determine if user is HR/CEO or manager
  private isHRorCEO(decodedToken: any): boolean {
    return decodedToken?.department?.some(
      (dept: string) => dept === "hr" || dept === "ceo"
    );
  }

  // Get base API endpoint based on user role
  private getBaseEndpoint(decodedToken: any): string {
    return this.isHRorCEO(decodedToken)
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/offboard`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/offboard`;
  }

  // Get all resignation requests
  async getResignationRequests(
    decodedToken: any,
    status?: string
  ): Promise<IOffboardModel[]> {
    const endpoint = this.getBaseEndpoint(decodedToken);
    const queryParams = status ? `?status=${status}` : "";

    try {
      const response = await fetch(`${endpoint}${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching resignation requests:", error);
      throw error;
    }
  }

  // Create new resignation request
  async createResignationRequest(
    decodedToken: any,
    data: IManagerResignationRequest
  ): Promise<IOffboardModel> {
    const endpoint = this.getBaseEndpoint(decodedToken);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating resignation request:", error);
      throw error;
    }
  }

  // Approve resignation request
  async approveResignation(
    decodedToken: any,
    id: string,
    data?: IUpdateResignationRequest
  ): Promise<IOffboardModel> {
    const endpoint = this.getBaseEndpoint(decodedToken);

    try {
      const response = await fetch(`${endpoint}/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return await response.json();
    } catch (error) {
      console.error("Error approving resignation request:", error);
      throw error;
    }
  }

  // Reject resignation request
  async rejectResignation(
    decodedToken: any,
    id: string
  ): Promise<IOffboardModel> {
    const endpoint = this.getBaseEndpoint(decodedToken);

    try {
      const response = await fetch(`${endpoint}/reject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error rejecting resignation request:", error);
      throw error;
    }
  }

  // Process employee exit (HR only)
  async processEmployeeExit(employeeId: string): Promise<any> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/employee/exit/${employeeId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error processing employee exit:", error);
      throw error;
    }
  }
}

export const resignationManagementService = new ResignationManagementService();
