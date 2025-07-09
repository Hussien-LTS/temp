import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { BudgetService } from './salesforce-budget.service';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';

@Controller('salesforce-budget')
export class SalesforceBudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @EventPattern('salesforce-budget-created')
  async createBudget(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data from RMQ', data);
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('data missing in payload');
    }
    await this.budgetService.handleBudgetCreated(data);
    await this.rmqService.emit(`datasource-budget-created`, data);
    context.getChannelRef().ack(context.getMessage());
    return { status: 'data received from RMQ and prisest', data };
  }
}
