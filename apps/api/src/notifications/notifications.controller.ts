import { Controller, Get, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId, CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private service: NotificationsService) {}

  @Get()
  getAll(@CurrentUser('id') userId: string, @CompanyId() companyId: string) {
    return this.service.getForUser(userId, companyId);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.service.getUnreadCount(userId);
  }

  @Put(':id/read')
  markRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.markRead(id, userId);
  }

  @Put('read-all')
  markAllRead(@CurrentUser('id') userId: string) {
    return this.service.markAllRead(userId);
  }
}
