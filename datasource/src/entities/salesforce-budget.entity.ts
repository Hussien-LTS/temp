
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BudgetTransaction } from './budget-salesforce-transaction.entity';

@Entity()
export class SalesforceBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalBudget: number;

  @Column()
  territory: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column()
  externalId: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  budgetName: string;

  @ManyToOne(() => BudgetTransaction, (transaction) => transaction.budgetList, {
    onDelete: 'CASCADE',
  })
  transaction: BudgetTransaction;
}
