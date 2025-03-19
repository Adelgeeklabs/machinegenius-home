import { IComplaint, IComplaintRequest } from "../_types/complaint";

export const ComplaintService = {
  createComplaint: async (
    complaint: IComplaintRequest
  ): Promise<IComplaint> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/complaint`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(complaint),
      }
    );
    return response.json();
  },

  getComplaints: async (): Promise<IComplaint[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/complaint/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  getComplaint: async (id: string): Promise<IComplaint> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/complaint/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },

  addFeedback: async (id: string, feedback: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/complaint/feedback/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback }),
      }
    );
    return response.json();
  },

  addComment: async (id: string, comment: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/complaint/comment/${id}`,
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
