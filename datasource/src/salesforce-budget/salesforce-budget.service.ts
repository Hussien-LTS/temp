import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetTransaction } from 'src/entities/budget-salesforce-transaction.entity';
import { SalesforceBudget } from 'src/entities/salesforce-budget.entity';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetTransaction)
    private budgetTransactionRepository: Repository<BudgetTransaction>,

    @InjectRepository(SalesforceBudget)
    private salesforceBudgetRepository: Repository<SalesforceBudget>,
  ) {}

  async handleBudgetCreated(data: any): Promise<void> {
    const { TransactionId, budgetList } = data;
    const transaction = this.budgetTransactionRepository.create({
      transactionId: TransactionId,
    });
    await this.budgetTransactionRepository.save(transaction);

    for (const b of budgetList) {
      const budget = this.salesforceBudgetRepository.create({
        totalBudget: parseFloat(b.TotalBudget),
        territory: b.Territory,
        startDate: b.StartDate,
        endDate: b.EndDate,
        externalId: b.ExternalId,
        budgetName: b.BudgetName,
        transaction,
      });

      await this.salesforceBudgetRepository.save(budget);
    }
  }
}
