// Interfaces for the offboarding/resignation feature

// Base employee information returned by API
export interface IEmployeeInfo {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
}

// Offboarding model interface matching the API response
export interface IOffboardModel {
  _id: string;
  employee: string | IEmployeeInfo;
  approval: string | IEmployeeInfo;
  hrApprove: string | IEmployeeInfo | null;
  type: string | null;
  status: string;
  lastWorkingDay: number;
  isVolunteer: boolean;
  rehiringAbility?: boolean;
  reason: string;
  createdAt: number;
  __v?: number;
}

// Request payload for creating a resignation request
export interface IResignationRequest {
  reason: string;
  lastWorkingDay: number;
}

// Request payload for HR/manager resignation creation
export interface IManagerResignationRequest {
  employee: string;
  reason: string;
  lastWorkingDay: number;
  isVolunteer?: boolean;
  rehiringAbility?: boolean;
  type?: string;
}

// Request payload for updating a resignation
export interface IUpdateResignationRequest {
  lastWorkingDay?: number;
  rehiringAbility?: boolean;
}

// Response interfaces for service methods
export interface IBaseResponse {
  result: boolean;
  message?: string;
}

export interface IResignationResponse extends IBaseResponse {
  data?: IOffboardModel;
}

export interface IResignationsListResponse extends IBaseResponse {
  data?: IOffboardModel[];
}
