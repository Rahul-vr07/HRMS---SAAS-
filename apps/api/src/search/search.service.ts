import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(companyId: string, query: string) {
    if (!query || query.length < 2) return { results: [] };

    const q = query.trim();

    const [employees, departments, leaveRequests, tickets, projects, documents, assets, jobs] =
      await Promise.all([
        this.prisma.employee.findMany({
          where: {
            companyId,
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { employeeCode: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 5,
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true, employeeCode: true, jobTitle: true },
        }),
        this.prisma.department.findMany({
          where: { companyId, name: { contains: q, mode: 'insensitive' } },
          take: 3,
        }),
        this.prisma.leaveRequest.findMany({
          where: {
            companyId,
            OR: [
              { reason: { contains: q, mode: 'insensitive' } },
              { employee: { firstName: { contains: q, mode: 'insensitive' } } },
            ],
          },
          take: 3,
          include: { employee: true, leaveType: true },
        }),
        this.prisma.ticket.findMany({
          where: {
            companyId,
            OR: [
              { subject: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 3,
        }),
        this.prisma.project.findMany({
          where: { companyId, name: { contains: q, mode: 'insensitive' } },
          take: 3,
        }),
        this.prisma.document.findMany({
          where: { companyId, name: { contains: q, mode: 'insensitive' } },
          take: 3,
        }),
        this.prisma.asset.findMany({
          where: {
            companyId,
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { serialNumber: { contains: q, mode: 'insensitive' } },
            ],
          },
          take: 3,
        }),
        this.prisma.jobPosting.findMany({
          where: { companyId, title: { contains: q, mode: 'insensitive' } },
          take: 3,
        }),
      ]);

    const results = [
      ...employees.map((e) => ({
        type: 'employee',
        id: e.id,
        title: `${e.firstName} ${e.lastName}`,
        subtitle: e.jobTitle?.title || e.email,
        href: `/employees/${e.id}`,
        avatar: e.avatar,
      })),
      ...departments.map((d) => ({
        type: 'department',
        id: d.id,
        title: d.name,
        subtitle: 'Department',
        href: `/organization/departments`,
      })),
      ...leaveRequests.map((l) => ({
        type: 'leave',
        id: l.id,
        title: `${l.employee.firstName} ${l.employee.lastName} — ${l.leaveType.name}`,
        subtitle: l.status,
        href: `/leave`,
      })),
      ...tickets.map((t) => ({
        type: 'ticket',
        id: t.id,
        title: t.subject,
        subtitle: `${t.priority} · ${t.status}`,
        href: `/helpdesk`,
      })),
      ...projects.map((p) => ({
        type: 'project',
        id: p.id,
        title: p.name,
        subtitle: p.status,
        href: `/projects`,
      })),
      ...documents.map((d) => ({
        type: 'document',
        id: d.id,
        title: d.name,
        subtitle: d.type,
        href: `/documents`,
      })),
      ...assets.map((a) => ({
        type: 'asset',
        id: a.id,
        title: a.name,
        subtitle: a.type,
        href: `/assets`,
      })),
      ...jobs.map((j) => ({
        type: 'job',
        id: j.id,
        title: j.title,
        subtitle: j.status,
        href: `/recruitment`,
      })),
    ];

    return { results, query: q };
  }
}
