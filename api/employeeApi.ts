import { APIRequestContext } from '@playwright/test';
import type { EmployeeData } from '../utils/testDataUtils';

const defaultOrangeHrmBaseUrl = 'https://opensource-demo.orangehrmlive.com';

export type OrangeHrmEmployee = {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
};

export class EmployeeApi {
  private readonly baseUrl: string;

  constructor(
    private readonly request: APIRequestContext,
    baseUrl = process.env.ORANGEHRM_BASE_URL || defaultOrangeHrmBaseUrl,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getEmployees(employeeId?: string) {
    const params = new URLSearchParams({ limit: '100', offset: '0' });
    if (employeeId) {
      params.set('employeeId', employeeId);
    }

    const response = await this.request.get(
      `${this.baseUrl}/web/index.php/api/v2/pim/employees?${params.toString()}`,
    );
    if (!response.ok()) {
      throw new Error(`API call failed: ${response.status()} ${response.statusText()}`);
    }

    return response.json();
  }

  async findEmployee(employeeId: string): Promise<OrangeHrmEmployee> {
    const response = await this.getEmployees(employeeId);
    const employees = Array.isArray(response.data) ? response.data : [];
    const employee = employees.find((item: OrangeHrmEmployee) => item.employeeId === employeeId);

    if (!employee) {
      throw new Error(`Employee ${employeeId} was not found in the OrangeHRM API response`);
    }

    return employee;
  }

  async isEmployeePresent(employeeId: string): Promise<boolean> {
    const response = await this.getEmployees(employeeId);
    const employees = Array.isArray(response.data) ? response.data : [];
    return employees.some((item: OrangeHrmEmployee) => item.employeeId === employeeId);
  }
}

export class SimulatedEmployeeApi {
  constructor(private readonly request: APIRequestContext) {}

  async createEmployee(employee: EmployeeData) {
    const response = await this.request.post('https://jsonplaceholder.typicode.com/users', {
      data: {
        name: `${employee.firstName} ${employee.lastName}`,
        username: employee.employeeId,
        company: { name: employee.jobTitle },
      },
    });

    if (!response.ok()) {
      throw new Error(`Simulated API call failed: ${response.status()} ${response.statusText()}`);
    }

    const body = await response.json();
    return {
      id: body.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeId: employee.employeeId,
      jobTitle: body.company.name,
    };
  }
}
