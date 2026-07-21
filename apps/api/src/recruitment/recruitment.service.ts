import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async getJobs(companyId: string) {
    return this.prisma.jobPosting.findMany({
      where: { companyId },
      include: { _count: { select: { candidates: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createJob(companyId: string, data: {
    title: string; description: string; requirements?: string; location?: string;
    employmentType?: string; salaryMin?: number; salaryMax?: number;
  }) {
    return this.prisma.jobPosting.create({
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        location: data.location,
        employmentType: (data.employmentType as any) || 'FULL_TIME',
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        status: 'OPEN',
        publishedAt: new Date(),
        companyId,
      },
    });
  }

  async getCandidates(companyId: string, status?: string) {
    return this.prisma.candidate.findMany({
      where: { companyId, ...(status ? { status: status as any } : {}) },
      include: { jobPosting: true, interviews: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCandidate(companyId: string, data: {
    firstName: string; lastName: string; email: string; phone?: string; jobPostingId: string;
  }) {
    return this.prisma.candidate.create({ data: { ...data, companyId } });
  }

  async updateCandidateStatus(id: string, companyId: string, status: string) {
    return this.prisma.candidate.updateMany({
      where: { id, companyId },
      data: { status: status as any },
    });
  }

  async getPipeline(companyId: string) {
    const statuses = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
    const pipeline = await Promise.all(
      statuses.map(async (status) => ({
        status,
        candidates: await this.prisma.candidate.findMany({
          where: { companyId, status: status as any },
          include: { jobPosting: { select: { title: true } } },
          take: 20,
        }),
      })),
    );
    return pipeline;
  }

  async scheduleInterview(data: {
    candidateId: string; scheduledAt: string; duration?: number; type?: string; meetingUrl?: string;
  }) {
    return this.prisma.interview.create({
      data: {
        candidateId: data.candidateId,
        scheduledAt: new Date(data.scheduledAt),
        duration: data.duration || 60,
        type: data.type || 'video',
        meetingUrl: data.meetingUrl,
      },
    });
  }
}
