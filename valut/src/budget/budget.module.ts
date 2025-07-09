import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { SessionStoreService } from 'src/sessionValidation/sessionValidation.service';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService, SessionStoreService],
})
export class BudgetModule {}
