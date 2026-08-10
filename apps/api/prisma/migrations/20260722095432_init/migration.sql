-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'PROBATION');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'REMOTE', 'ON_LEAVE', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "size" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" JSONB,
    "settings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "parentId" TEXT,
    "managerId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "phone" TEXT,
    "isHeadquarters" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_titles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT,
    "description" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_titles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_centers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "budget" DECIMAL(15,2),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "maritalStatus" TEXT,
    "nationality" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "joinDate" TIMESTAMP(3) NOT NULL,
    "probationEnd" TIMESTAMP(3),
    "terminationDate" TIMESTAMP(3),
    "departmentId" TEXT,
    "branchId" TEXT,
    "jobTitleId" TEXT,
    "managerId" TEXT,
    "userId" TEXT,
    "companyId" TEXT NOT NULL,
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "employee_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_notes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "authorId" TEXT,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_timeline" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "breakMinutes" INTEGER NOT NULL DEFAULT 60,
    "isNightShift" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "workMinutes" INTEGER,
    "breakMinutes" INTEGER,
    "overtimeMinutes" INTEGER,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "method" TEXT NOT NULL DEFAULT 'manual',
    "notes" TEXT,
    "employeeId" TEXT NOT NULL,
    "shiftId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "daysAllowed" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT true,
    "carryForward" BOOLEAN NOT NULL DEFAULT false,
    "maxCarryForward" INTEGER,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balances" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "total" DECIMAL(5,1) NOT NULL,
    "used" DECIMAL(5,1) NOT NULL DEFAULT 0,
    "remaining" DECIMAL(5,1) NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,

    CONSTRAINT "leave_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "days" DECIMAL(5,1) NOT NULL,
    "reason" TEXT,
    "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "employeeId" TEXT NOT NULL,
    "leaveTypeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_structures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseSalary" DECIMAL(15,2) NOT NULL,
    "components" JSONB NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_salaries" (
    "id" TEXT NOT NULL,
    "baseSalary" DECIMAL(15,2) NOT NULL,
    "allowances" JSONB,
    "deductions" JSONB,
    "salaryStructureId" TEXT,
    "employeeId" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "totalAmount" DECIMAL(15,2),
    "employeeCount" INTEGER,
    "processedAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payslips" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "grossSalary" DECIMAL(15,2) NOT NULL,
    "netSalary" DECIMAL(15,2) NOT NULL,
    "deductions" JSONB,
    "allowances" JSONB,
    "tax" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "pdfUrl" TEXT,
    "employeeId" TEXT NOT NULL,
    "payrollRunId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payslips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "location" TEXT,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "salaryMin" DECIMAL(15,2),
    "salaryMax" DECIMAL(15,2),
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "departmentId" TEXT,
    "companyId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "closesAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "resumeUrl" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'APPLIED',
    "rating" INTEGER,
    "notes" TEXT,
    "jobPostingId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "type" TEXT NOT NULL DEFAULT 'video',
    "location" TEXT,
    "meetingUrl" TEXT,
    "feedback" TEXT,
    "rating" INTEGER,
    "candidateId" TEXT NOT NULL,
    "interviewerIds" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'okr',
    "target" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "employeeId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_reviews" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'manager',
    "rating" INTEGER,
    "feedback" TEXT,
    "strengths" TEXT,
    "improvements" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "employeeId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "category" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_trainings" (
    "id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "completedAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "employeeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3),
    "employeeId" TEXT,
    "companyId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "serialNumber" TEXT,
    "status" "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "purchaseDate" TIMESTAMP(3),
    "value" DECIMAL(15,2),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_assignments" (
    "id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "notes" TEXT,
    "assetId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "asset_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'hr',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "employeeId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "dueDate" TIMESTAMP(3),
    "assigneeId" TEXT,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheets" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "employeeId" TEXT NOT NULL,
    "projectId" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT NOT NULL,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" JSONB NOT NULL,
    "secret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_slug_idx" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_companyId_idx" ON "users"("companyId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_providerId_key" ON "oauth_accounts"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_companyId_name_key" ON "roles"("companyId", "name");

-- CreateIndex
CREATE INDEX "audit_logs_companyId_createdAt_idx" ON "audit_logs"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "departments_companyId_idx" ON "departments"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_companyId_code_key" ON "departments"("companyId", "code");

-- CreateIndex
CREATE INDEX "branches_companyId_idx" ON "branches"("companyId");

-- CreateIndex
CREATE INDEX "job_titles_companyId_idx" ON "job_titles"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "cost_centers_companyId_code_key" ON "cost_centers"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- CreateIndex
CREATE INDEX "employees_companyId_status_idx" ON "employees"("companyId", "status");

-- CreateIndex
CREATE INDEX "employees_departmentId_idx" ON "employees"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_companyId_employeeCode_key" ON "employees"("companyId", "employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "employees_companyId_email_key" ON "employees"("companyId", "email");

-- CreateIndex
CREATE INDEX "employee_timeline_employeeId_createdAt_idx" ON "employee_timeline"("employeeId", "createdAt");

-- CreateIndex
CREATE INDEX "attendances_companyId_date_idx" ON "attendances"("companyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_employeeId_date_key" ON "attendances"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "leave_types_companyId_code_key" ON "leave_types"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balances_employeeId_leaveTypeId_year_key" ON "leave_balances"("employeeId", "leaveTypeId", "year");

-- CreateIndex
CREATE INDEX "leave_requests_companyId_status_idx" ON "leave_requests"("companyId", "status");

-- CreateIndex
CREATE INDEX "holidays_companyId_date_idx" ON "holidays"("companyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "employee_salaries_employeeId_key" ON "employee_salaries"("employeeId");

-- CreateIndex
CREATE INDEX "payroll_runs_companyId_period_idx" ON "payroll_runs"("companyId", "period");

-- CreateIndex
CREATE INDEX "payslips_employeeId_period_idx" ON "payslips"("employeeId", "period");

-- CreateIndex
CREATE INDEX "job_postings_companyId_status_idx" ON "job_postings"("companyId", "status");

-- CreateIndex
CREATE INDEX "candidates_companyId_status_idx" ON "candidates"("companyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "employee_trainings_employeeId_courseId_key" ON "employee_trainings"("employeeId", "courseId");

-- CreateIndex
CREATE INDEX "documents_companyId_type_idx" ON "documents"("companyId", "type");

-- CreateIndex
CREATE INDEX "assets_companyId_status_idx" ON "assets"("companyId", "status");

-- CreateIndex
CREATE INDEX "tickets_companyId_status_idx" ON "tickets"("companyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_projectId_employeeId_key" ON "project_members"("projectId", "employeeId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_titles" ADD CONSTRAINT "job_titles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "job_titles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_notes" ADD CONSTRAINT "employee_notes_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_timeline" ADD CONSTRAINT "employee_timeline_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_types" ADD CONSTRAINT "leave_types_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "leave_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_structures" ADD CONSTRAINT "salary_structures_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_salaries" ADD CONSTRAINT "employee_salaries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_salaries" ADD CONSTRAINT "employee_salaries_salaryStructureId_fkey" FOREIGN KEY ("salaryStructureId") REFERENCES "salary_structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payslips" ADD CONSTRAINT "payslips_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "payroll_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_trainings" ADD CONSTRAINT "employee_trainings_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_trainings" ADD CONSTRAINT "employee_trainings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
