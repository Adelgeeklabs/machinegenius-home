import { IComplaint } from "../_types/complaint";

interface ComplaintFilters {
  complaintType?: string;
  complaintStatus?: string;
  priority?: string;
  dateSubmitted?: string;
  dateResolved?: string;
  search?: string;
}

interface ComplaintReport {
  avgResolutionTime: {
    avgResolutionMs: number;
  };
  monthlyComplaintTrends: {
    year: number;
    month: number;
    count: number;
  }[];
  mostAgainstDepartment: {
    _id: string;
    count: number;
  };
  mostAgainstEmployee: {
    _id: string;
    count: number;
    employee: {
      firstName: string;
      lastName: string;
    };
  };
  mostCommonComplaintTypes: {
    department: string;
    count: number;
  }[];
}

export const HRComplaintService = {
  getComplaints: async (
    type: "assigned" | "unassigned" | "all" = "assigned",
    filters?: ComplaintFilters
  ): Promise<IComplaint[]> => {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams(filters as Record<string, string>);
    const queryString = queryParams.toString() ? `?${queryParams}` : "";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/${type}${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  assignComplaint: async (complaintId: string): Promise<IComplaint> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/assign/${complaintId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  updateComplaintStatus: async (
    complaintId: string,
    status: string
  ): Promise<IComplaint> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/update-complaint/${complaintId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          UpdateDateComplaint: Date.now(),
          complaintStatus: status,
          dateResolved: status === "Resolved" ? Date.now() : undefined,
        }),
      }
    );
    return response.json();
  },

  getComplaintReport: async (): Promise<ComplaintReport> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/report`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getComplaint: async (complaintId: string): Promise<IComplaint> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/${complaintId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  async assignToHR(complaintId: string, assignedTo: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/assign-to-hr/${complaintId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo }),
      }
    );
    if (!response.ok) throw new Error("Failed to assign complaint");
    return response.json();
  },

  async assignToManager(complaintId: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/assign-to-manager/${complaintId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to escalate complaint");
    return response.json();
  },

  async getHREmployees(complaintId: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/hr-employee/${complaintId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch HR employees");
    return response.json();
  },

  addComment: async (id: string, comment: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/complaint/comment/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      }
    );
    return response.json();
  },
};
