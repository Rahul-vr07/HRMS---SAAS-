import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyId } from '../auth/decorators/current-user.decorator';

@ApiTags('AI Assistant')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private service: AiService) {}

  @Post('chat')
  chat(@CompanyId() companyId: string, @Body() body: { message: string }) {
    return this.service.chat(companyId, body.message);
  }
}
