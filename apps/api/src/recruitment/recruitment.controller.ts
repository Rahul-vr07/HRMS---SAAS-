import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Recruitment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recruitment')
export class RecruitmentController {
  constructor(private service: RecruitmentService) {}

  @Get('jobs')
  getJobs(@CompanyId() companyId: string) {
    return this.service.getJobs(companyId);
  }

  @Post('jobs')
  createJob(@CompanyId() companyId: string, @Body() body: {
    title: string; description: string; requirements?: string; location?: string;
  }) {
    return this.service.createJob(companyId, body);
  }

  @Get('candidates')
  getCandidates(@CompanyId() companyId: string, @Query('status') status?: string) {
    return this.service.getCandidates(companyId, status);
  }

  @Post('candidates')
  createCandidate(@CompanyId() companyId: string, @Body() body: {
    firstName: string; lastName: string; email: string; jobPostingId: string; phone?: string;
  }) {
    return this.service.createCandidate(companyId, body);
  }

  @Put('candidates/:id/status')
  updateStatus(@Param('id') id: string, @CompanyId() companyId: string, @Body() body: { status: string }) {
    return this.service.updateCandidateStatus(id, companyId, body.status);
  }

  @Get('pipeline')
  getPipeline(@CompanyId() companyId: string) {
    return this.service.getPipeline(companyId);
  }

  @Post('interviews')
  scheduleInterview(@Body() body: {
    candidateId: string; scheduledAt: string; duration?: number; type?: string; meetingUrl?: string;
  }) {
    return this.service.scheduleInterview(body);
  }
}
