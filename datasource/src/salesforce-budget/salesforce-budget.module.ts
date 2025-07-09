import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetService } from './salesforce-budget.service';
import { BudgetTransaction } from 'src/entities/budget-salesforce-transaction.entity';
import { SalesforceBudget } from 'src/entities/salesforce-budget.entity';
import { SalesforceBudgetController } from './salesforce-budget.controller';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetTransaction, SalesforceBudget]),
  RabbitMQModule.register('datasource_budget_queue')
  ],
  providers: [BudgetService],
  exports: [BudgetService],
  controllers: [SalesforceBudgetController],
})
export class BudgetModule { }
