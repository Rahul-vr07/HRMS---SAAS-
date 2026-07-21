import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get()
  getOverview(@CompanyId() companyId: string) {
    return this.service.getOverview(companyId);
  }

  @Get('attendance-heatmap')
  getHeatmap(@CompanyId() companyId: string) {
    return this.service.getAttendanceHeatmap(companyId);
  }
}
