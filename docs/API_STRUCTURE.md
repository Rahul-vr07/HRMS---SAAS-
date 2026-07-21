# Nexus HR — API Structure

Base URL: `/api/v1`

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create company + admin |
| POST | `/auth/login` | Email/password login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate session |
| GET | `/auth/me` | Current user profile |

## Core Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Intelligent dashboard overview |
| GET | `/dashboard/attendance-heatmap` | 30-day heatmap |
| GET | `/search?q=` | Universal search |
| POST | `/ai/chat` | AI HR Assistant |

## Employees

| Method | Endpoint |
|--------|----------|
| GET | `/employees` |
| GET | `/employees/:id` |
| POST | `/employees` |
| PUT | `/employees/:id` |
| DELETE | `/employees/:id` |

## Organization

| Method | Endpoint |
|--------|----------|
| GET/POST | `/organization/departments` |
| GET | `/organization/org-chart` |
| GET/POST | `/organization/branches` |
| GET/POST | `/organization/job-titles` |

## Attendance

| Method | Endpoint |
|--------|----------|
| GET | `/attendance` |
| POST | `/attendance/check-in` |
| GET | `/attendance/employee/:id` |
| GET/POST | `/attendance/shifts` |

## Leave

| Method | Endpoint |
|--------|----------|
| GET/POST | `/leave/types` |
| GET/POST | `/leave/requests` |
| PUT | `/leave/requests/:id/approve` |
| PUT | `/leave/requests/:id/reject` |
| GET | `/leave/balances/:employeeId` |
| GET | `/leave/holidays` |

## Payroll

| Method | Endpoint |
|--------|----------|
| GET/POST | `/payroll/runs` |
| PUT | `/payroll/runs/:id/process` |
| GET | `/payroll/payslips` |
| GET | `/payroll/structures` |

## Recruitment

| Method | Endpoint |
|--------|----------|
| GET/POST | `/recruitment/jobs` |
| GET/POST | `/recruitment/candidates` |
| PUT | `/recruitment/candidates/:id/status` |
| GET | `/recruitment/pipeline` |
| POST | `/recruitment/interviews` |

## Notifications & Company

| Method | Endpoint |
|--------|----------|
| GET | `/notifications` |
| PUT | `/notifications/:id/read` |
| GET | `/companies/me` |
| PUT | `/companies/me` |
| GET | `/companies/roles` |
| GET | `/companies/audit-logs` |

## Auth Header

```
Authorization: Bearer <accessToken>
```

All authenticated endpoints extract `companyId` from the JWT for tenant isolation.
