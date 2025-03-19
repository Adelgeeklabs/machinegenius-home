import { IEmployeeInfo } from "../_interfaces/offboardInterfaces";

class EmployeeService {
  /**
   * Get all employees - needed for the resignation management
   */
  async getAllEmployees(): Promise<IEmployeeInfo[]> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/employees`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  }

  /**
   * Get all employees excluding the current user (for HR/CEO)
   */
  async getEmployeesExcludingSelf(): Promise<IEmployeeInfo[]> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/employee/excluding-self?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employees excluding self:", error);
      return [];
    }
  }

  /**
   * Get employee children (for managers)
   */
  async getEmployeeChildren(): Promise<IEmployeeInfo[]> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/manager/employee/employee-children`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching employee children:", error);
      return [];
    }
  }

  /**
   * Get employees by department
   */
  async getEmployeesByDepartment(department: string): Promise<IEmployeeInfo[]> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/employees?department=${department}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error fetching employees for department ${department}:`,
        error
      );
      return [];
    }
  }

  /**
   * Get an employee by ID
   */
  async getEmployeeById(id: string): Promise<IEmployeeInfo | null> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/hr/employee/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      return null;
    }
  }
}

export const employeeService = new EmployeeService();
