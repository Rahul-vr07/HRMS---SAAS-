import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { PayrollModule } from './payroll/payroll.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SearchModule } from './search/search.module';
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    CompaniesModule,
    EmployeesModule,
    DepartmentsModule,
    AttendanceModule,
    LeaveModule,
    PayrollModule,
    RecruitmentModule,
    DashboardModule,
    SearchModule,
    AiModule,
    NotificationsModule,
  ],
})
export class AppModule {}
