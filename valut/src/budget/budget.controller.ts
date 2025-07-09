import { Controller, ForbiddenException, Post, UnauthorizedException } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ApiBody, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { SessionStoreService } from 'src/sessionValidation/sessionValidation.service';
import { CreateBudgetDto } from './DTOs/create-budget.dto';

@ApiTags('Budget')
@Controller('vault/v1/budget')
export class BudgetController {
  private sessionId: string;

  constructor(
    private readonly budgetService: BudgetService,
    private readonly sessionStore: SessionStoreService,
  ) {}

  @EventPattern('vault_auth_response')
  handleVaultAuth(@Payload() data: any, @Ctx() context: RmqContext) {
    this.sessionId = data?.sessionId;
    if (!this.sessionId) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new ForbiddenException();
    }

    this.sessionStore.set(data.sessionId);
  }

  @Post()
  @ApiBody({ type: CreateBudgetDto })
  async handleBudgetCreate(
    @Payload() data: CreateBudgetDto,
    @Ctx() context: RmqContext,
  ) {
    console.log('🚀 ~ BudgetController ~ handleBudgetCreate ~ Payload:', data);
    const sessionData = this.sessionId;
    if (!sessionData) {
      throw new UnauthorizedException('Session ID is missing or invalid.');
    }
    return await this.budgetService.create(data, sessionData);
  }
}
