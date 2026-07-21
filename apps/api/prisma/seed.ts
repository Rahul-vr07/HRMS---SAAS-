import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Nexus HR database...');

  // Clean existing demo data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.payrollRun.deleteMany();
  await prisma.employeeSalary.deleteMany();
  await prisma.salaryStructure.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.holiday.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.employeeSkill.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.employeeTimeline.deleteMany();
  await prisma.employeeNote.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.performanceReview.deleteMany();
  await prisma.employeeTraining.deleteMany();
  await prisma.course.deleteMany();
  await prisma.document.deleteMany();
  await prisma.assetAssignment.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.ticketComment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.oauthAccount.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.department.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.jobTitle.deleteMany();
  await prisma.costCenter.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.webhook.deleteMany();
  await prisma.company.deleteMany();

  const passwordHash = await bcrypt.hash('Demo@1234', 12);

  const company = await prisma.company.create({
    data: {
      name: 'Acme Technologies',
      slug: 'acme-tech',
      industry: 'Technology',
      size: '201-500',
      timezone: 'America/New_York',
      currency: 'USD',
      website: 'https://acme.tech',
      settings: { weekStartsOn: 1, workHoursStart: '09:00', workHoursEnd: '18:00' },
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Full system access',
      permissions: ['*'],
      isSystem: true,
      companyId: company.id,
    },
  });

  const hrRole = await prisma.role.create({
    data: {
      name: 'HR Manager',
      description: 'HR operations access',
      permissions: ['employees:*', 'leave:*', 'attendance:*', 'payroll:read', 'recruitment:*'],
      isSystem: true,
      companyId: company.id,
    },
  });

  const employeeRole = await prisma.role.create({
    data: {
      name: 'Employee',
      description: 'Self-service access',
      permissions: ['self:*', 'leave:create', 'attendance:self'],
      isSystem: true,
      companyId: company.id,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@acme.tech',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Chen',
      companyId: company.id,
      roleId: adminRole.id,
      isEmailVerified: true,
      lastLoginAt: new Date(),
    },
  });

  // Departments
  const depts = await Promise.all(
    [
      { name: 'Engineering', code: 'ENG' },
      { name: 'Product', code: 'PROD' },
      { name: 'Design', code: 'DES' },
      { name: 'Human Resources', code: 'HR' },
      { name: 'Sales', code: 'SALES' },
      { name: 'Finance', code: 'FIN' },
      { name: 'Marketing', code: 'MKT' },
      { name: 'Customer Success', code: 'CS' },
    ].map((d) =>
      prisma.department.create({ data: { ...d, companyId: company.id } }),
    ),
  );

  const [eng, product, design, hr, sales, finance] = depts;

  // Branches
  const hq = await prisma.branch.create({
    data: {
      name: 'New York HQ',
      code: 'NYC',
      city: 'New York',
      country: 'USA',
      isHeadquarters: true,
      companyId: company.id,
    },
  });

  await prisma.branch.create({
    data: {
      name: 'San Francisco',
      code: 'SF',
      city: 'San Francisco',
      country: 'USA',
      companyId: company.id,
    },
  });

  // Job Titles
  const titles = await Promise.all(
    [
      { title: 'CEO', level: 'C-Level' },
      { title: 'VP Engineering', level: 'VP' },
      { title: 'Engineering Manager', level: 'Manager' },
      { title: 'Senior Software Engineer', level: 'Senior' },
      { title: 'Software Engineer', level: 'Mid' },
      { title: 'Product Manager', level: 'Manager' },
      { title: 'UX Designer', level: 'Mid' },
      { title: 'HR Director', level: 'Director' },
      { title: 'HR Specialist', level: 'Mid' },
      { title: 'Sales Executive', level: 'Mid' },
      { title: 'Financial Analyst', level: 'Mid' },
    ].map((t) => prisma.jobTitle.create({ data: { ...t, companyId: company.id } })),
  );

  // Leave Types
  const leaveTypes = await Promise.all(
    [
      { name: 'Annual Leave', code: 'AL', daysAllowed: 20, carryForward: true, maxCarryForward: 5 },
      { name: 'Sick Leave', code: 'SL', daysAllowed: 10, isPaid: true },
      { name: 'Personal Leave', code: 'PL', daysAllowed: 5 },
      { name: 'Maternity Leave', code: 'ML', daysAllowed: 90 },
      { name: 'Work From Home', code: 'WFH', daysAllowed: 24 },
    ].map((lt) => prisma.leaveType.create({ data: { ...lt, companyId: company.id } })),
  );

  // Shifts
  await prisma.shift.create({
    data: {
      name: 'General Shift',
      startTime: '09:00',
      endTime: '18:00',
      breakMinutes: 60,
      companyId: company.id,
    },
  });

  await prisma.shift.create({
    data: {
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00',
      breakMinutes: 45,
      isNightShift: true,
      companyId: company.id,
    },
  });

  // Employees
  const employeeData = [
    { firstName: 'Sarah', lastName: 'Chen', email: 'admin@acme.tech', dept: hr, title: titles[7], code: 'EMP001', manager: null, dob: '1988-03-15', gender: 'Female' },
    { firstName: 'Marcus', lastName: 'Johnson', email: 'marcus@acme.tech', dept: eng, title: titles[1], code: 'EMP002', manager: null, dob: '1985-07-22', gender: 'Male' },
    { firstName: 'Priya', lastName: 'Sharma', email: 'priya@acme.tech', dept: eng, title: titles[3], code: 'EMP003', manager: null, dob: '1992-11-08', gender: 'Female' },
    { firstName: 'Alex', lastName: 'Rivera', email: 'alex@acme.tech', dept: product, title: titles[5], code: 'EMP004', manager: null, dob: '1990-01-30', gender: 'Male' },
    { firstName: 'Jordan', lastName: 'Lee', email: 'jordan@acme.tech', dept: design, title: titles[6], code: 'EMP005', manager: null, dob: '1994-05-12', gender: 'Non-binary' },
    { firstName: 'Emily', lastName: 'Watson', email: 'emily@acme.tech', dept: eng, title: titles[4], code: 'EMP006', manager: null, dob: '1996-09-20', gender: 'Female' },
    { firstName: 'David', lastName: 'Kim', email: 'david@acme.tech', dept: eng, title: titles[3], code: 'EMP007', manager: null, dob: '1991-04-03', gender: 'Male' },
    { firstName: 'Sofia', lastName: 'Martinez', email: 'sofia@acme.tech', dept: sales, title: titles[9], code: 'EMP008', manager: null, dob: '1993-12-18', gender: 'Female' },
    { firstName: 'James', lastName: 'Wilson', email: 'james@acme.tech', dept: finance, title: titles[10], code: 'EMP009', manager: null, dob: '1989-08-25', gender: 'Male' },
    { firstName: 'Aisha', lastName: 'Patel', email: 'aisha@acme.tech', dept: hr, title: titles[8], code: 'EMP010', manager: null, dob: '1995-02-14', gender: 'Female' },
    { firstName: 'Ryan', lastName: 'O\'Brien', email: 'ryan@acme.tech', dept: eng, title: titles[4], code: 'EMP011', manager: null, dob: '1997-06-07', gender: 'Male' },
    { firstName: 'Lisa', lastName: 'Nguyen', email: 'lisa@acme.tech', dept: product, title: titles[5], code: 'EMP012', manager: null, dob: '1992-10-28', gender: 'Female' },
  ];

  const employees = [];
  for (let i = 0; i < employeeData.length; i++) {
    const e = employeeData[i];
    const emp = await prisma.employee.create({
      data: {
        employeeCode: e.code,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        dateOfBirth: new Date(e.dob),
        gender: e.gender,
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        departmentId: e.dept.id,
        jobTitleId: e.title.id,
        branchId: hq.id,
        companyId: company.id,
        userId: i === 0 ? adminUser.id : undefined,
        phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
      },
    });
    employees.push(emp);

    // Skills
    const skillSets: Record<number, string[]> = {
      1: ['TypeScript', 'React', 'Node.js', 'AWS'],
      2: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL'],
      3: ['Product Strategy', 'Analytics', 'Agile'],
      4: ['Figma', 'UI Design', 'Prototyping'],
      5: ['Python', 'React', 'Docker'],
      6: ['Go', 'Kubernetes', 'System Design'],
    };
    if (skillSets[i]) {
      for (const skill of skillSets[i]) {
        await prisma.employeeSkill.create({
          data: { name: skill, level: Math.floor(Math.random() * 3) + 3, employeeId: emp.id },
        });
      }
    }

    // Salary
    await prisma.employeeSalary.create({
      data: {
        baseSalary: 60000 + Math.floor(Math.random() * 80000),
        employeeId: emp.id,
        effectiveFrom: emp.joinDate,
        allowances: { hra: 5000, transport: 1500 },
        deductions: { pf: 1800 },
      },
    });

    // Leave balances
    for (const lt of leaveTypes) {
      await prisma.leaveBalance.create({
        data: {
          year: 2026,
          total: lt.daysAllowed,
          used: Math.floor(Math.random() * 3),
          remaining: lt.daysAllowed - Math.floor(Math.random() * 3),
          employeeId: emp.id,
          leaveTypeId: lt.id,
        },
      });
    }

    // Timeline
    await prisma.employeeTimeline.create({
      data: {
        event: 'joined',
        title: 'Joined Acme Technologies',
        description: `Started as ${e.title.title}`,
        employeeId: emp.id,
        createdAt: emp.joinDate,
      },
    });
  }

  // Set managers
  await prisma.employee.update({ where: { id: employees[2].id }, data: { managerId: employees[1].id } });
  await prisma.employee.update({ where: { id: employees[5].id }, data: { managerId: employees[1].id } });
  await prisma.employee.update({ where: { id: employees[6].id }, data: { managerId: employees[1].id } });
  await prisma.employee.update({ where: { id: employees[10].id }, data: { managerId: employees[2].id } });

  // Attendance for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'REMOTE', 'PRESENT', 'ABSENT', 'PRESENT', 'PRESENT', 'REMOTE', 'PRESENT', 'PRESENT'] as const;

  for (let i = 0; i < employees.length; i++) {
    const status = statuses[i];
    await prisma.attendance.create({
      data: {
        date: today,
        status,
        checkIn: status !== 'ABSENT' ? new Date(today.getTime() + (8 + Math.random() * 2) * 3600000) : null,
        employeeId: employees[i].id,
        companyId: company.id,
        method: status === 'REMOTE' ? 'remote' : 'manual',
      },
    });
  }

  // Leave requests
  await prisma.leaveRequest.create({
    data: {
      startDate: new Date(2026, 6, 25),
      endDate: new Date(2026, 6, 27),
      days: 3,
      reason: 'Family vacation',
      status: 'PENDING',
      employeeId: employees[5].id,
      leaveTypeId: leaveTypes[0].id,
      companyId: company.id,
    },
  });

  await prisma.leaveRequest.create({
    data: {
      startDate: new Date(2026, 6, 22),
      endDate: new Date(2026, 6, 22),
      days: 1,
      reason: 'Medical appointment',
      status: 'PENDING',
      employeeId: employees[7].id,
      leaveTypeId: leaveTypes[1].id,
      companyId: company.id,
    },
  });

  // Holidays
  await Promise.all(
    [
      { name: 'New Year\'s Day', date: new Date(2026, 0, 1) },
      { name: 'Independence Day', date: new Date(2026, 6, 4) },
      { name: 'Labor Day', date: new Date(2026, 8, 7) },
      { name: 'Thanksgiving', date: new Date(2026, 10, 26) },
      { name: 'Christmas', date: new Date(2026, 11, 25) },
    ].map((h) => prisma.holiday.create({ data: { ...h, companyId: company.id } })),
  );

  // Job postings & candidates
  const job1 = await prisma.jobPosting.create({
    data: {
      title: 'Senior Frontend Engineer',
      description: 'Build beautiful, performant web applications with React and TypeScript.',
      requirements: '5+ years React, TypeScript, design systems experience',
      location: 'New York / Remote',
      status: 'OPEN',
      salaryMin: 140000,
      salaryMax: 180000,
      publishedAt: new Date(),
      companyId: company.id,
    },
  });

  const job2 = await prisma.jobPosting.create({
    data: {
      title: 'Product Designer',
      description: 'Shape the future of our HR platform with exceptional UX.',
      location: 'San Francisco',
      status: 'OPEN',
      salaryMin: 120000,
      salaryMax: 160000,
      publishedAt: new Date(),
      companyId: company.id,
    },
  });

  await prisma.candidate.create({
    data: {
      firstName: 'Chris',
      lastName: 'Anderson',
      email: 'chris@email.com',
      status: 'INTERVIEW',
      rating: 4,
      jobPostingId: job1.id,
      companyId: company.id,
    },
  });

  await prisma.candidate.create({
    data: {
      firstName: 'Maya',
      lastName: 'Singh',
      email: 'maya@email.com',
      status: 'SCREENING',
      rating: 5,
      jobPostingId: job1.id,
      companyId: company.id,
    },
  });

  await prisma.candidate.create({
    data: {
      firstName: 'Tom',
      lastName: 'Baker',
      email: 'tom@email.com',
      status: 'APPLIED',
      jobPostingId: job2.id,
      companyId: company.id,
    },
  });

  // Announcements
  await prisma.announcement.create({
    data: {
      title: 'Q3 All-Hands Meeting',
      content: 'Join us this Friday at 3 PM ET for our quarterly all-hands. We\'ll cover product roadmap, company metrics, and celebrate wins!',
      isPinned: true,
      companyId: company.id,
      authorId: adminUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'New Parental Leave Policy',
      content: 'We\'re excited to announce expanded parental leave benefits effective August 1st. Check the HR portal for details.',
      companyId: company.id,
      authorId: adminUser.id,
    },
  });

  // Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Leadership Essentials',
      description: 'Core leadership skills for managers',
      duration: 480,
      category: 'Leadership',
      isMandatory: false,
      companyId: company.id,
    },
  });

  await prisma.course.create({
    data: {
      title: 'Security Awareness 2026',
      description: 'Annual security training',
      duration: 60,
      category: 'Compliance',
      isMandatory: true,
      companyId: company.id,
    },
  });

  // Assets
  const laptop = await prisma.asset.create({
    data: {
      name: 'MacBook Pro 16"',
      type: 'Laptop',
      serialNumber: 'MBP-2024-001',
      status: 'ASSIGNED',
      value: 2499,
      companyId: company.id,
    },
  });

  await prisma.assetAssignment.create({
    data: { assetId: laptop.id, employeeId: employees[2].id },
  });

  // Tickets
  await prisma.ticket.create({
    data: {
      subject: 'Request for dual monitor setup',
      description: 'Need a second monitor for improved productivity.',
      category: 'it',
      priority: 'MEDIUM',
      status: 'OPEN',
      employeeId: employees[5].id,
      companyId: company.id,
    },
  });

  // Projects
  const project = await prisma.project.create({
    data: {
      name: 'Nexus Platform v2',
      description: 'Next-gen HR platform redesign',
      status: 'ACTIVE',
      startDate: new Date(2026, 0, 15),
      companyId: company.id,
    },
  });

  await prisma.projectMember.create({
    data: { projectId: project.id, employeeId: employees[1].id, role: 'lead' },
  });
  await prisma.projectMember.create({
    data: { projectId: project.id, employeeId: employees[2].id, role: 'member' },
  });

  // Notifications
  await prisma.notification.create({
    data: {
      title: 'Leave request pending',
      message: 'Emily Watson requested 3 days of annual leave.',
      type: 'leave',
      link: '/leave',
      userId: adminUser.id,
      companyId: company.id,
    },
  });

  await prisma.notification.create({
    data: {
      title: 'New candidate applied',
      message: 'Maya Singh applied for Senior Frontend Engineer.',
      type: 'recruitment',
      link: '/recruitment',
      userId: adminUser.id,
      companyId: company.id,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: 'SEED',
      entity: 'System',
      metadata: { message: 'Database seeded with demo data' },
      userId: adminUser.id,
      companyId: company.id,
    },
  });

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email:    admin@acme.tech');
  console.log('  Password: Demo@1234');
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
