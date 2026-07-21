import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Payroll')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private service: PayrollService) {}

  @Get('runs')
  getRuns(@CompanyId() companyId: string) {
    return this.service.getRuns(companyId);
  }

  @Post('runs')
  createRun(@CompanyId() companyId: string, @Body() body: { period: string; startDate: string; endDate: string }) {
    return this.service.createRun(companyId, body);
  }

  @Put('runs/:id/process')
  processRun(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.service.processRun(id, companyId);
  }

  @Get('payslips')
  getPayslips(@CompanyId() companyId: string, @Query('employeeId') employeeId?: string) {
    return this.service.getPayslips(companyId, employeeId);
  }

  @Get('structures')
  getStructures(@CompanyId() companyId: string) {
    return this.service.getStructures(companyId);
  }
}
