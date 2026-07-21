import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  async getTypes(companyId: string) {
    return this.prisma.leaveType.findMany({ where: { companyId } });
  }

  async createType(companyId: string, data: { name: string; code: string; daysAllowed: number; isPaid?: boolean; carryForward?: boolean }) {
    return this.prisma.leaveType.create({ data: { ...data, companyId } });
  }

  async getRequests(companyId: string, query: { status?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: Record<string, unknown> = { companyId };
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          employee: { select: { id: true, firstName: true, lastName: true, avatar: true, department: true } },
          leaveType: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createRequest(companyId: string, data: {
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason?: string;
    days: number;
  }) {
    return this.prisma.leaveRequest.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        companyId,
      },
      include: { leaveType: true, employee: true },
    });
  }

  async approve(id: string, companyId: string, approverId: string) {
    const request = await this.prisma.leaveRequest.findFirst({ where: { id, companyId } });
    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request already processed');

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: approverId, approvedAt: new Date() },
    });

    const year = new Date(request.startDate).getFullYear();
    await this.prisma.leaveBalance.updateMany({
      where: { employeeId: request.employeeId, leaveTypeId: request.leaveTypeId, year },
      data: {
        used: { increment: Number(request.days) },
        remaining: { decrement: Number(request.days) },
      },
    });

    return updated;
  }

  async reject(id: string, companyId: string, reason?: string) {
    const request = await this.prisma.leaveRequest.findFirst({ where: { id, companyId } });
    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== 'PENDING') throw new BadRequestException('Request already processed');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'REJECTED', rejectedReason: reason },
    });
  }

  async getBalances(employeeId: string) {
    return this.prisma.leaveBalance.findMany({
      where: { employeeId },
      include: { leaveType: true },
    });
  }

  async getHolidays(companyId: string) {
    return this.prisma.holiday.findMany({
      where: { companyId },
      orderBy: { date: 'asc' },
    });
  }
}
