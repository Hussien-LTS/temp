import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('salesforce_budget_queue')],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
