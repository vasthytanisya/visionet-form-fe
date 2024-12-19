// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    listEmployee: baseUrl + '/api/v1/Employees/list',
    getEmployee: baseUrl + '/api/v1/Employees',
    createEmployee: baseUrl + '/api/v1/Employees',
    updateEmployee: baseUrl + '/api/v1/Employees',
    deleteEmployee: baseUrl + '/api/v1/Employees',
    skill: baseUrl + '/api/v1/Employees/skill',
}
