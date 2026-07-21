import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId, CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leave')
export class LeaveController {
  constructor(private service: LeaveService) {}

  @Get('types')
  getTypes(@CompanyId() companyId: string) {
    return this.service.getTypes(companyId);
  }

  @Post('types')
  createType(@CompanyId() companyId: string, @Body() body: { name: string; code: string; daysAllowed: number }) {
    return this.service.createType(companyId, body);
  }

  @Get('requests')
  getRequests(
    @CompanyId() companyId: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.getRequests(companyId, { status, page: +page! || 1, limit: +limit! || 20 });
  }

  @Post('requests')
  createRequest(@CompanyId() companyId: string, @Body() body: {
    employeeId: string; leaveTypeId: string; startDate: string; endDate: string; reason?: string; days: number;
  }) {
    return this.service.createRequest(companyId, body);
  }

  @Put('requests/:id/approve')
  approve(@Param('id') id: string, @CompanyId() companyId: string, @CurrentUser('id') userId: string) {
    return this.service.approve(id, companyId, userId);
  }

  @Put('requests/:id/reject')
  reject(@Param('id') id: string, @CompanyId() companyId: string, @Body() body: { reason?: string }) {
    return this.service.reject(id, companyId, body.reason);
  }

  @Get('balances/:employeeId')
  getBalances(@Param('employeeId') employeeId: string) {
    return this.service.getBalances(employeeId);
  }

  @Get('holidays')
  getHolidays(@CompanyId() companyId: string) {
    return this.service.getHolidays(companyId);
  }
}
