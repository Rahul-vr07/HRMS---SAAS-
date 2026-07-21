import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private service: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'List employees' })
  findAll(
    @CompanyId() companyId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.service.findAll(companyId, { page: +page! || 1, limit: +limit! || 20, search, status, departmentId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee profile' })
  findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.service.findOne(id, companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create employee' })
  create(@CompanyId() companyId: string, @Body() dto: CreateEmployeeDto) {
    return this.service.create(companyId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update employee' })
  update(@Param('id') id: string, @CompanyId() companyId: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Terminate employee' })
  remove(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.service.remove(id, companyId);
  }
}
