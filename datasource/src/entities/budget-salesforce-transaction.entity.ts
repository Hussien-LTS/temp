import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { SalesforceBudget } from './salesforce-budget.entity';

@Entity()
export class BudgetTransaction {
  @PrimaryColumn()
  transactionId: string;

  @OneToMany(() => SalesforceBudget, (budget) => budget.transaction, {
    cascade: true,
  })
  budgetList: SalesforceBudget[];
}
