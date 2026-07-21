import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getCompany(companyId: string) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: { select: { employees: true, departments: true, branches: true } },
      },
    });
  }

  async updateCompany(companyId: string, data: {
    name?: string; logo?: string; website?: string; industry?: string;
    timezone?: string; currency?: string; language?: string; theme?: object; settings?: object;
  }) {
    return this.prisma.company.update({ where: { id: companyId }, data });
  }

  async getRoles(companyId: string) {
    return this.prisma.role.findMany({ where: { companyId } });
  }

  async getAuditLogs(companyId: string, page = 1, limit = 50) {
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { companyId },
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where: { companyId } }),
    ]);
    return { data, meta: { total, page, limit } };
  }
}
