import { readJsonFile } from './fileUtils';

export type EmployeeData = {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  jobTitle: string;
  status: string;
  location: string;
};

export function getEmployeePayload(): EmployeeData {
  const data = readJsonFile<{ employee: EmployeeData }>('./test-data/employee.json');
  return data.employee;
}

export function getUpdatedEmployeePayload(): Partial<EmployeeData> {
  const data = readJsonFile<{ updatedEmployee: Partial<EmployeeData> }>('./test-data/employee.json');
  return data.updatedEmployee;
}
