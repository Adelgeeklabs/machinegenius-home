export enum ComplaintTypeEnum {
  Department = "Department",
  Employee = "Employee",
  General = "General",
}

export enum PriorityTypeEnum {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export interface IComplaint {
  _id: string;
  employee: string;
  department: string;
  complaintType: ComplaintTypeEnum;
  ageinstEmployee?: {
    _id: string | null;
    firstName: string;
    lastName: string;
  };
  fullName: string;
  ageinstDepartment?: string;
  title: string;
  complaintDetails: string;
  attachments?: string[] | null;
  confidential: boolean;
  priority: PriorityTypeEnum;
  complaintStatus: string;
  dateSubmitted: number;
  trackComplaintStatus: string;
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  isOpen: boolean;
  feedback?: string;
  comments?: {
    createdAt: number;
    employee: {
      _id: string;
      firstName: string;
      lastName: string;
    } | null;
    comment: string;
    _id: string;
  }[];
}

export interface IComplaintRequest {
  complaintType: ComplaintTypeEnum;
  ageinstEmployee?: string | null;
  ageinstDepartment?: string | null;
  title: string;
  complaintDetails: string;
  confidential: boolean;
  priority: PriorityTypeEnum;
  attachments?: string[] | null;
}
