import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    departmentId?: string;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { companyId };
    if (query.status) where.status = query.status;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { employeeCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: true,
          jobTitle: true,
          branch: true,
          manager: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, companyId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, companyId },
      include: {
        department: true,
        jobTitle: true,
        branch: true,
        manager: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        skills: true,
        emergencyContacts: true,
        salary: true,
        leaveBalances: { include: { leaveType: true } },
        documents: true,
        timeline: { orderBy: { createdAt: 'desc' }, take: 20 },
        assets: { include: { asset: true } },
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(companyId: string, dto: CreateEmployeeDto) {
    const count = await this.prisma.employee.count({ where: { companyId } });
    const employeeCode = dto.employeeCode || `EMP${String(count + 1).padStart(3, '0')}`;

    const employee = await this.prisma.employee.create({
      data: {
        ...dto,
        employeeCode,
        companyId,
        joinDate: new Date(dto.joinDate),
      },
      include: { department: true, jobTitle: true },
    });

    await this.prisma.employeeTimeline.create({
      data: {
        event: 'joined',
        title: 'Joined the company',
        description: `${employee.firstName} ${employee.lastName} joined as ${employee.employeeCode}`,
        employeeId: employee.id,
      },
    });

    return employee;
  }

  async update(id: string, companyId: string, dto: UpdateEmployeeDto) {
    await this.findOne(id, companyId);
    return this.prisma.employee.update({
      where: { id },
      data: dto as any,
      include: { department: true, jobTitle: true },
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.employee.update({
      where: { id },
      data: { status: 'TERMINATED', terminationDate: new Date() },
    });
  }
}
