import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async getRuns(companyId: string) {
    return this.prisma.payrollRun.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { payslips: true } } },
    });
  }

  async createRun(companyId: string, data: { period: string; startDate: string; endDate: string }) {
    return this.prisma.payrollRun.create({
      data: {
        period: data.period,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        companyId,
        status: 'DRAFT',
      },
    });
  }

  async processRun(id: string, companyId: string) {
    const run = await this.prisma.payrollRun.findFirst({ where: { id, companyId } });
    if (!run) throw new Error('Payroll run not found');

    const employees = await this.prisma.employee.findMany({
      where: { companyId, status: 'ACTIVE' },
      include: { salary: true },
    });

    let totalAmount = 0;
    const payslips = [];

    for (const emp of employees) {
      const base = Number(emp.salary?.baseSalary || 50000);
      const tax = Math.round(base * 0.1);
      const net = base - tax;
      totalAmount += net;

      const payslip = await this.prisma.payslip.create({
        data: {
          period: run.period,
          grossSalary: base,
          netSalary: net,
          tax,
          employeeId: emp.id,
          payrollRunId: run.id,
          companyId,
          allowances: emp.salary?.allowances || {},
          deductions: emp.salary?.deductions || {},
        },
      });
      payslips.push(payslip);
    }

    return this.prisma.payrollRun.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        totalAmount,
        employeeCount: employees.length,
        processedAt: new Date(),
      },
    });
  }

  async getPayslips(companyId: string, employeeId?: string) {
    return this.prisma.payslip.findMany({
      where: { companyId, ...(employeeId ? { employeeId } : {}) },
      include: { employee: { select: { firstName: true, lastName: true, employeeCode: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getStructures(companyId: string) {
    return this.prisma.salaryStructure.findMany({ where: { companyId } });
  }
}
