import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const slug = dto.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const slugExists = await this.prisma.company.findUnique({ where: { slug } });
    const finalSlug = slugExists ? `${slug}-${Date.now()}` : slug;

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const result = await this.prisma.$transaction(async (tx:any) => {
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          slug: finalSlug,
          industry: dto.industry,
          size: dto.companySize,
        },
      });

      const adminRole = await tx.role.create({
        data: {
          name: 'Admin',
          description: 'Full system access',
          permissions: ['*'],
          isSystem: true,
          companyId: company.id,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          companyId: company.id,
          roleId: adminRole.id,
          isEmailVerified: true,
        },
      });

      await tx.employee.create({
        data: {
          employeeCode: 'EMP001',
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          joinDate: new Date(),
          status: 'ACTIVE',
          companyId: company.id,
          userId: user.id,
        },
      });

      return { company, user, role: adminRole };
    });

    const tokens = await this.generateTokens(result.user.id, result.user.email, result.company.id);
    await this.createSession(result.user.id, tokens.accessToken, tokens.refreshToken);

    return {
      user: this.sanitizeUser(result.user),
      company: result.company,
      ...tokens,
    };
  }

  async login(dto: LoginDto, meta?: { ip?: string; userAgent?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true, role: true, employee: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.companyId);
    await this.createSession(user.id, tokens.accessToken, tokens.refreshToken, meta);

    await this.prisma.auditLog.create({
      data: {
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        userId: user.id,
        companyId: user.companyId,
        ipAddress: meta?.ip,
        userAgent: meta?.userAgent,
      },
    });

    return {
      user: this.sanitizeUser(user),
      company: user.company,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const session = await this.prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(
        payload.sub,
        payload.email,
        payload.companyId,
      );

      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string) {
    await this.prisma.session.deleteMany({ where: { userId, token } });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true, role: true, employee: true },
    });
    if (!user) throw new UnauthorizedException();
    return { user: this.sanitizeUser(user), company: user.company };
  }

  private async generateTokens(userId: string, email: string, companyId: string) {
    const payload = { sub: userId, email, companyId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async createSession(
    userId: string,
    token: string,
    refreshToken: string,
    meta?: { ip?: string; userAgent?: string },
  ) {
    return this.prisma.session.create({
      data: {
        userId,
        token,
        refreshToken,
        ipAddress: meta?.ip,
        userAgent: meta?.userAgent,
        deviceInfo: meta?.userAgent?.substring(0, 100),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  private sanitizeUser(user: Record<string, unknown>) {
    const { passwordHash, twoFactorSecret, ...rest } = user;
    return rest;
  }
}
