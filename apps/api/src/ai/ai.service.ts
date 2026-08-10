import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async chat(companyId: string, message: string) {
    const lower = message.toLowerCase().trim();

    // Intent detection
    if (this.matches(lower, ['absent', 'who is absent', 'absentees'])) {
      return this.handleAbsentToday(companyId);
    }
    if (this.matches(lower, ['present today', 'who is present', 'attendance today'])) {
      return this.handlePresentToday(companyId);
    }
    if (this.matches(lower, ['leave pending', 'pending leave', 'leave requests'])) {
      return this.handlePendingLeaves(companyId);
    }
    if (this.matches(lower, ['employee count', 'how many employees', 'headcount', 'total employees'])) {
      return this.handleHeadcount(companyId);
    }
    if (this.matches(lower, ['birthday', 'birthdays'])) {
      return this.handleBirthdays(companyId);
    }
    if (this.matches(lower, ['skill', 'skills', 'find employees with'])) {
      return this.handleSkillSearch(companyId, message);
    }
    if (this.matches(lower, ['payroll', 'salary', 'payslip'])) {
      return this.handlePayroll(companyId);
    }
    if (this.matches(lower, ['recruitment', 'hiring', 'open positions', 'candidates'])) {
      return this.handleRecruitment(companyId);
    }
    if (this.matches(lower, ['attrition', 'predict', 'turnover'])) {
      return this.handleAttrition(companyId);
    }
    if (this.matches(lower, ['promotion', 'suggest promotion'])) {
      return this.handlePromotions(companyId);
    }
    if (this.matches(lower, ['summarize attendance', 'attendance summary'])) {
      return this.handleAttendanceSummary(companyId);
    }
    if (this.matches(lower, ['new joinee', 'new hire', 'recent join'])) {
      return this.handleNewJoinees(companyId);
    }
    if (this.matches(lower, ['help', 'what can you', 'capabilities'])) {
      return this.handleHelp();
    }

    return {
      type: 'text',
      message: `I understood your question: "${message}". I can help with attendance, leave, payroll, recruitment, skills search, attrition prediction, and more. Try asking "Who is absent today?" or "Show pending leave requests."`,
      suggestions: [
        'Who is absent today?',
        'Show pending leave requests',
        'What is our headcount?',
        'Find employees with React skills',
        'Summarize attendance',
      ],
    };
  }

  private matches(text: string, keywords: string[]) {
    return keywords.some((k) => text.includes(k));
  }

  private async handleAbsentToday(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const records = await this.prisma.attendance.findMany({
      where: { companyId, date: today, status: 'ABSENT' },
      include: { employee: { select: { firstName: true, lastName: true, department: true } } },
    });

    if (records.length === 0) {
      return { type: 'text', message: 'Great news! No employees are marked absent today.' };
    }

    const names = records.map((r: any) => `${r.employee.firstName} ${r.employee.lastName}`).join(', ');
    return {
      type: 'list',
      message: `${records.length} employee${records.length > 1 ? 's are' : ' is'} absent today: ${names}.`,
      data: records.map((r: any) => ({
        name: `${r.employee.firstName} ${r.employee.lastName}`,
        department: r.employee.department?.name,
      })),
      action: { label: 'View Attendance', href: '/attendance' },
    };
  }

  private async handlePresentToday(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await this.prisma.attendance.count({
      where: { companyId, date: today, status: { in: ['PRESENT', 'LATE', 'REMOTE'] } },
    });
    const total = await this.prisma.employee.count({ where: { companyId, status: 'ACTIVE' } });
    return {
      type: 'metric',
      message: `${count} of ${total} employees are present today (${total ? Math.round((count / total) * 100) : 0}% attendance rate).`,
      data: { present: count, total, rate: total ? Math.round((count / total) * 100) : 0 },
    };
  }

  private async handlePendingLeaves(companyId: string) {
    const requests = await this.prisma.leaveRequest.findMany({
      where: { companyId, status: 'PENDING' },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        leaveType: true,
      },
      take: 10,
    });

    return {
      type: 'list',
      message: `There ${requests.length === 1 ? 'is' : 'are'} ${requests.length} pending leave request${requests.length !== 1 ? 's' : ''}.`,
      data: requests.map((r:any) => ({
        name: `${r.employee.firstName} ${r.employee.lastName}`,
        type: r.leaveType.name,
        days: Number(r.days),
        from: r.startDate,
        to: r.endDate,
      })),
      action: { label: 'Review Approvals', href: '/leave' },
    };
  }

  private async handleHeadcount(companyId: string) {
    const [active, onLeave, probation] = await Promise.all([
      this.prisma.employee.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.employee.count({ where: { companyId, status: 'ON_LEAVE' } }),
      this.prisma.employee.count({ where: { companyId, status: 'PROBATION' } }),
    ]);
    return {
      type: 'metric',
      message: `Your company has ${active} active employees, ${onLeave} on leave, and ${probation} on probation.`,
      data: { active, onLeave, probation, total: active + onLeave + probation },
    };
  }

  private async handleBirthdays(companyId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { companyId, status: 'ACTIVE', dateOfBirth: { not: null } },
      select: { firstName: true, lastName: true, dateOfBirth: true },
    });
    const thisMonth = new Date().getMonth();
    const birthdays = employees.filter((e: any) =>e.dateOfBirth && new Date(e.dateOfBirth).getMonth() === thisMonth);
    return {
      type: 'list',
      message: `${birthdays.length} birthday${birthdays.length !== 1 ? 's' : ''} this month.`,
      data: birthdays.map((e:any) => ({
        name: `${e.firstName} ${e.lastName}`,
        date: e.dateOfBirth,
      })),
    };
  }

  private async handleSkillSearch(companyId: string, message: string) {
    const skillMatch = message.match(/(?:with|having|know)\s+(\w+)/i) || message.match(/skills?\s+(\w+)/i);
    const skill = skillMatch?.[1] || 'React';

    const skills = await this.prisma.employeeSkill.findMany({
      where: {
        name: { contains: skill, mode: 'insensitive' },
        employee: { companyId },
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, department: true } },
      },
      take: 10,
    });

    return {
      type: 'list',
      message: skills.length
        ? `Found ${skills.length} employee${skills.length !== 1 ? 's' : ''} with ${skill} skills.`
        : `No employees found with "${skill}" skills.`,
      data: skills.map((s:any) => ({
        name: `${s.employee.firstName} ${s.employee.lastName}`,
        level: s.level,
        department: s.employee.department?.name,
        href: `/employees/${s.employee.id}`,
      })),
    };
  }

  private async handlePayroll(companyId: string) {
    const latest = await this.prisma.payrollRun.findFirst({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    const now = new Date();
    const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();

    return {
      type: 'text',
      message: latest
        ? `Latest payroll run (${latest.period}): ${latest.status}. ${latest.employeeCount || 0} employees processed. Next payroll deadline in ${daysLeft} days.`
        : `No payroll runs yet. Payroll deadline in ${daysLeft} days.`,
      action: { label: 'Go to Payroll', href: '/payroll' },
    };
  }

  private async handleRecruitment(companyId: string) {
    const [open, candidates, interviews] = await Promise.all([
      this.prisma.jobPosting.count({ where: { companyId, status: 'OPEN' } }),
      this.prisma.candidate.count({ where: { companyId, status: { in: ['APPLIED', 'SCREENING', 'INTERVIEW'] } } }),
      this.prisma.interview.count({
        where: { scheduledAt: { gte: new Date() }, candidate: { companyId } },
      }),
    ]);
    return {
      type: 'metric',
      message: `Recruitment pipeline: ${open} open positions, ${candidates} active candidates, ${interviews} upcoming interviews.`,
      data: { open, candidates, interviews },
      action: { label: 'View Pipeline', href: '/recruitment' },
    };
  }

  private async handleAttrition(companyId: string) {
    const [active, terminated] = await Promise.all([
      this.prisma.employee.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.employee.count({
        where: {
          companyId,
          status: 'TERMINATED',
          terminationDate: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);
    const rate = active + terminated ? Math.round((terminated / (active + terminated)) * 100) : 0;
    return {
      type: 'analysis',
      message: `Predicted annual attrition rate: ~${rate}%. ${terminated} departures in the last 12 months out of ${active + terminated} total. ${rate > 15 ? 'Attrition is elevated — consider retention initiatives.' : 'Attrition is within healthy range.'}`,
      data: { active, terminated, rate },
    };
  }

  private async handlePromotions(companyId: string) {
    const topPerformers = await this.prisma.performanceReview.findMany({
      where: { companyId, rating: { gte: 4 }, status: 'completed' },
      include: { employee: { select: { firstName: true, lastName: true, jobTitle: true } } },
      take: 5,
      orderBy: { rating: 'desc' },
    });

    return {
      type: 'list',
      message: topPerformers.length
        ? `Based on performance reviews, ${topPerformers.length} employee${topPerformers.length !== 1 ? 's are' : ' is'} recommended for promotion consideration.`
        : 'No high-performing employees identified yet. Complete more performance reviews.',
      data: topPerformers.map((p:any) => ({
        name: `${p.employee.firstName} ${p.employee.lastName}`,
        rating: p.rating,
        title: p.employee.jobTitle?.title,
      })),
    };
  }

  private async handleAttendanceSummary(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [present, absent, late, remote] = await Promise.all([
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'PRESENT' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'ABSENT' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'LATE' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'REMOTE' } }),
    ]);
    return {
      type: 'summary',
      message: `Today's attendance summary: ${present} present, ${absent} absent, ${late} late, ${remote} remote.`,
      data: { present, absent, late, remote },
    };
  }

  private async handleNewJoinees(companyId: string) {
    const joinees = await this.prisma.employee.findMany({
      where: {
        companyId,
        joinDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      take: 10,
      orderBy: { joinDate: 'desc' },
      include: { department: true, jobTitle: true },
    });
    return {
      type: 'list',
      message: `${joinees.length} new joinee${joinees.length !== 1 ? 's' : ''} in the last 30 days.`,
      data: joinees.map((e:any) => ({
        name: `${e.firstName} ${e.lastName}`,
        title: e.jobTitle?.title,
        department: e.department?.name,
        joinDate: e.joinDate,
      })),
    };
  }

  private handleHelp() {
    return {
      type: 'help',
      message: "I'm your AI HR Assistant. Here's what I can help with:",
      data: [
        { category: 'Attendance', examples: ['Who is absent today?', 'Summarize attendance'] },
        { category: 'Leave', examples: ['Show pending leave requests'] },
        { category: 'People', examples: ['What is our headcount?', 'Find employees with React skills'] },
        { category: 'Payroll', examples: ['Analyze payroll', 'When is payroll deadline?'] },
        { category: 'Talent', examples: ['Show recruitment pipeline', 'Suggest promotions'] },
        { category: 'Insights', examples: ['Predict employee attrition', 'Birthdays this month'] },
      ],
    };
  }
}
