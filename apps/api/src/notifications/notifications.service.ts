import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getForUser(userId: string, companyId: string) {
    return this.prisma.notification.findMany({
      where: { userId, companyId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async create(data: {
    title: string; message: string; type?: string; link?: string; userId: string; companyId: string;
  }) {
    return this.prisma.notification.create({ data });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }
}
