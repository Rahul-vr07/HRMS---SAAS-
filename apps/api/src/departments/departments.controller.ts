import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organization')
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get('departments')
  getDepartments(@CompanyId() companyId: string) {
    return this.service.findAll(companyId);
  }

  @Post('departments')
  createDepartment(@CompanyId() companyId: string, @Body() body: { name: string; code?: string; description?: string }) {
    return this.service.create(companyId, body);
  }

  @Get('org-chart')
  getOrgChart(@CompanyId() companyId: string) {
    return this.service.getOrgChart(companyId);
  }

  @Get('branches')
  getBranches(@CompanyId() companyId: string) {
    return this.service.getBranches(companyId);
  }

  @Post('branches')
  createBranch(@CompanyId() companyId: string, @Body() body: {
    name: string; code?: string; address?: string; city?: string; country?: string; isHeadquarters?: boolean;
  }) {
    return this.service.createBranch(companyId, body);
  }

  @Get('job-titles')
  getJobTitles(@CompanyId() companyId: string) {
    return this.service.getJobTitles(companyId);
  }

  @Post('job-titles')
  createJobTitle(@CompanyId() companyId: string, @Body() body: { title: string; level?: string }) {
    return this.service.createJobTitle(companyId, body);
  }
}
