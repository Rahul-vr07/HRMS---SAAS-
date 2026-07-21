import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.department.findMany({
      where: { companyId },
      include: {
        _count: { select: { employees: true } },
        children: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(companyId: string, data: { name: string; code?: string; description?: string; parentId?: string }) {
    return this.prisma.department.create({ data: { ...data, companyId } });
  }

  async getOrgChart(companyId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { companyId, status: 'ACTIVE' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        managerId: true,
        jobTitle: { select: { title: true } },
        department: { select: { name: true } },
      },
    });
    return employees;
  }

  async getBranches(companyId: string) {
    return this.prisma.branch.findMany({
      where: { companyId },
      include: { _count: { select: { employees: true } } },
    });
  }

  async createBranch(companyId: string, data: {
    name: string; code?: string; address?: string; city?: string; country?: string; isHeadquarters?: boolean;
  }) {
    return this.prisma.branch.create({ data: { ...data, companyId } });
  }

  async getJobTitles(companyId: string) {
    return this.prisma.jobTitle.findMany({
      where: { companyId },
      include: { _count: { select: { employees: true } } },
    });
  }

  async createJobTitle(companyId: string, data: { title: string; level?: string; description?: string }) {
    return this.prisma.jobTitle.create({ data: { ...data, companyId } });
  }
}
