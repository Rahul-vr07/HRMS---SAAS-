import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(companyId: string, date?: string) {
    const target = date ? new Date(date) : new Date();
    target.setHours(0, 0, 0, 0);

    const [present, absent, late, remote, onLeave, records] = await Promise.all([
      this.prisma.attendance.count({ where: { companyId, date: target, status: 'PRESENT' } }),
      this.prisma.attendance.count({ where: { companyId, date: target, status: 'ABSENT' } }),
      this.prisma.attendance.count({ where: { companyId, date: target, status: 'LATE' } }),
      this.prisma.attendance.count({ where: { companyId, date: target, status: 'REMOTE' } }),
      this.prisma.attendance.count({ where: { companyId, date: target, status: 'ON_LEAVE' } }),
      this.prisma.attendance.findMany({
        where: { companyId, date: target },
        include: {
          employee: {
            select: { id: true, firstName: true, lastName: true, avatar: true, department: true, employeeCode: true },
          },
          shift: true,
        },
        orderBy: { checkIn: 'asc' },
      }),
    ]);

    return { stats: { present, absent, late, remote, onLeave }, records, date: target };
  }

  async checkIn(companyId: string, employeeId: string, data: {
    latitude?: number;
    longitude?: number;
    method?: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });

    if (existing?.checkIn) {
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: { checkOut: new Date() },
      });
    }

    const now = new Date();
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    return this.prisma.attendance.create({
      data: {
        employeeId,
        companyId,
        date: today,
        checkIn: now,
        status: data.method === 'remote' ? 'REMOTE' : isLate ? 'LATE' : 'PRESENT',
        latitude: data.latitude,
        longitude: data.longitude,
        method: data.method || 'manual',
      },
    });
  }

  async getEmployeeAttendance(employeeId: string, month?: number, year?: number) {
    const m = month || new Date().getMonth() + 1;
    const y = year || new Date().getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);

    return this.prisma.attendance.findMany({
      where: { employeeId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    });
  }

  async getShifts(companyId: string) {
    return this.prisma.shift.findMany({ where: { companyId } });
  }

  async createShift(companyId: string, data: {
    name: string; startTime: string; endTime: string; breakMinutes?: number; isNightShift?: boolean;
  }) {
    return this.prisma.shift.create({ data: { ...data, companyId } });
  }
}
