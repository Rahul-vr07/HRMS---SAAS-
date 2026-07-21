import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private service: CompaniesService) {}

  @Get('me')
  getCompany(@CompanyId() companyId: string) {
    return this.service.getCompany(companyId);
  }

  @Put('me')
  updateCompany(@CompanyId() companyId: string, @Body() body: Record<string, unknown>) {
    return this.service.updateCompany(companyId, body as any);
  }

  @Get('roles')
  getRoles(@CompanyId() companyId: string) {
    return this.service.getRoles(companyId);
  }

  @Get('audit-logs')
  getAuditLogs(
    @CompanyId() companyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.getAuditLogs(companyId, +page! || 1, +limit! || 50);
  }
}
