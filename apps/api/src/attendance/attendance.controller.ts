import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Get()
  getDashboard(@CompanyId() companyId: string, @Query('date') date?: string) {
    return this.service.getDashboard(companyId, date);
  }

  @Post('check-in')
  checkIn(
    @CompanyId() companyId: string,
    @Body() body: { employeeId: string; latitude?: number; longitude?: number; method?: string },
  ) {
    return this.service.checkIn(companyId, body.employeeId, body);
  }

  @Get('employee/:id')
  getEmployeeAttendance(
    @Param('id') id: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.service.getEmployeeAttendance(id, +month! || undefined, +year! || undefined);
  }

  @Get('shifts')
  getShifts(@CompanyId() companyId: string) {
    return this.service.getShifts(companyId);
  }

  @Post('shifts')
  createShift(@CompanyId() companyId: string, @Body() body: {
    name: string; startTime: string; endTime: string; breakMinutes?: number; isNightShift?: boolean;
  }) {
    return this.service.createShift(companyId, body);
  }
}
