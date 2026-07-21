import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      employeeCount,
      presentToday,
      absentToday,
      lateToday,
      remoteToday,
      pendingLeaves,
      openJobs,
      pendingTickets,
      announcements,
      recentActivity,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { companyId, status: 'ACTIVE' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'PRESENT' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'ABSENT' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'LATE' } }),
      this.prisma.attendance.count({ where: { companyId, date: today, status: 'REMOTE' } }),
      this.prisma.leaveRequest.count({ where: { companyId, status: 'PENDING' } }),
      this.prisma.jobPosting.count({ where: { companyId, status: 'OPEN' } }),
      this.prisma.ticket.count({ where: { companyId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      this.prisma.announcement.findMany({
        where: { companyId },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      this.prisma.auditLog.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      }),
    ]);

    const upcomingBirthdays = await this.getUpcomingBirthdays(companyId);
    const newJoinees = await this.prisma.employee.findMany({
      where: {
        companyId,
        joinDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      take: 5,
      orderBy: { joinDate: 'desc' },
      include: { department: true, jobTitle: true },
    });

    const upcomingInterviews = await this.prisma.interview.findMany({
      where: {
        scheduledAt: { gte: new Date() },
        candidate: { companyId },
      },
      take: 5,
      orderBy: { scheduledAt: 'asc' },
      include: { candidate: true },
    });

    const leaveRequests = await this.prisma.leaveRequest.findMany({
      where: { companyId, status: 'PENDING' },
      take: 5,
      include: {
        employee: { select: { firstName: true, lastName: true, avatar: true } },
        leaveType: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const insights = this.generateInsights({
      employeeCount,
      presentToday,
      absentToday,
      lateToday,
      pendingLeaves,
      openJobs,
    });

    const departmentDistribution = await this.prisma.employee.groupBy({
      by: ['departmentId'],
      where: { companyId, status: 'ACTIVE' },
      _count: true,
    });

    const departments = await this.prisma.department.findMany({
      where: { companyId },
      select: { id: true, name: true },
    });

    const deptMap = Object.fromEntries(departments.map((d) => [d.id, d.name]));
    const departmentStats = departmentDistribution.map((d) => ({
      name: d.departmentId ? deptMap[d.departmentId] || 'Unassigned' : 'Unassigned',
      count: d._count,
    }));

    return {
      kpis: {
        employeeCount,
        presentToday,
        absentToday,
        lateToday,
        remoteToday,
        pendingLeaves,
        openJobs,
        pendingTickets,
        attendanceRate: employeeCount
          ? Math.round(((presentToday + remoteToday + lateToday) / employeeCount) * 100)
          : 0,
      },
      insights,
      upcomingBirthdays,
      newJoinees,
      upcomingInterviews,
      leaveRequests,
      announcements,
      recentActivity,
      departmentStats,
    };
  }

  private async getUpcomingBirthdays(companyId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { companyId, status: 'ACTIVE', dateOfBirth: { not: null } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        dateOfBirth: true,
        department: { select: { name: true } },
      },
    });

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return employees
      .filter((e) => {
        if (!e.dateOfBirth) return false;
        const dob = new Date(e.dateOfBirth);
        const month = dob.getMonth();
        const day = dob.getDate();
        if (month === currentMonth && day >= currentDay) return true;
        if (month === (currentMonth + 1) % 12) return true;
        return false;
      })
      .slice(0, 8)
      .map((e) => ({
        ...e,
        birthday: e.dateOfBirth
          ? `${new Date(e.dateOfBirth).getMonth() + 1}/${new Date(e.dateOfBirth).getDate()}`
          : null,
      }));
  }

  private generateInsights(data: {
    employeeCount: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    pendingLeaves: number;
    openJobs: number;
  }) {
    const insights: Array<{ type: string; message: string; priority: string; action?: string }> = [];

    if (data.absentToday > 0) {
      insights.push({
        type: 'attendance',
        message: `${data.absentToday} employee${data.absentToday > 1 ? 's are' : ' is'} absent today.`,
        priority: data.absentToday > 5 ? 'high' : 'medium',
        action: '/attendance',
      });
    }

    if (data.lateToday > 3) {
      insights.push({
        type: 'attendance',
        message: `${data.lateToday} employees arrived late today. Consider reviewing shift policies.`,
        priority: 'medium',
        action: '/attendance',
      });
    }

    if (data.pendingLeaves > 0) {
      insights.push({
        type: 'leave',
        message: `${data.pendingLeaves} leave request${data.pendingLeaves > 1 ? 's' : ''} awaiting approval.`,
        priority: 'high',
        action: '/leave/approvals',
      });
    }

    if (data.openJobs > 0) {
      insights.push({
        type: 'recruitment',
        message: `${data.openJobs} open position${data.openJobs > 1 ? 's' : ''} in the recruitment pipeline.`,
        priority: 'medium',
        action: '/recruitment',
      });
    }

    const now = new Date();
    const daysUntilMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
    if (daysUntilMonthEnd <= 5) {
      insights.push({
        type: 'payroll',
        message: `Payroll deadline in ${daysUntilMonthEnd} day${daysUntilMonthEnd !== 1 ? 's' : ''}.`,
        priority: 'high',
        action: '/payroll',
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'general',
        message: 'All systems running smoothly. No urgent actions required.',
        priority: 'low',
      });
    }

    return insights;
  }

  async getAttendanceHeatmap(companyId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const records = await this.prisma.attendance.groupBy({
      by: ['date', 'status'],
      where: { companyId, date: { gte: thirtyDaysAgo } },
      _count: true,
    });

    return records;
  }
}
