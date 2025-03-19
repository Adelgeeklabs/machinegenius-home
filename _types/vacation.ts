export enum VacationStatusEnum {
  PENDING = "PENDING",
  ADMIN_APPROVED = "Admin_Approved",
  ADMIN_REJECT = "Admin_Reject",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  OVER = "OVER",
}

export enum VacationTypeEnum {
  Annual = "Annual",
  Sick = "Sick",
  Casual = "Casual",
  Maternity = "Maternity Paternity",
  Unpaid = "Unpaid",
  Bereavement = "Bereavement",
}

export interface IVacationRequest {
  days: number[];
  vacationType: string;
  reason: string;
}

export interface IDeduction {
  _id: string;
  amount: number;
}

export interface IEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  department: string[];
}

export interface IVacation {
  _id: string;
  days: number[];
  vacationType: string;
  approval: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    department: string[];
  }>;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    department: string[];
  };
  status: VacationStatusEnum;
  reason: string;
  escalade: number;
  createdAt: number;
  updatedAt: number;
  details: {
    [key: string]: {
      duration: number;
      dedication: number;
    };
  };
  __v: number;
}

export interface IAvailableTime {
  shift: string[];
  holidays: Array<{
    startDate: number;
    endDate: number;
  }>;
  vacations: number[];
}

export interface IVacationType {
  type: string;
  balance: number;
  maxDuration: number;
  description: string;
  _id: string;
}

export interface IVacationDetails {
  [key: string]: {
    duration: number;
    dedication: number;
  };
}

export interface IVacationResponse {
  _id: string;
  days: number[];
  vacationType: string;
  approval: string[];
  employee: string;
  status: VacationStatusEnum;
  reason: string;
  escalade: number;
  createdAt: number;
  updatedAt: number;
  details: IVacationDetails;
  __v: number;
}

export interface IVacationBalance {
  balance: number;
  imbalance: number;
}
