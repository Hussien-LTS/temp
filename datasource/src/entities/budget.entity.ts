import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Territory } from './territory.entity';

@Entity()
export class Budget {
  @PrimaryColumn()
  Id: string;

  @Column({ nullable: true })
  ModifiedDateTime: string;

  @Column({ nullable: true })
  ExternalId: string;

  @Column({ nullable: true })
  StartDate: string;

  @Column({ nullable: true })
  EndDate: string;

  @Column({ nullable: true })
  TotalBudget: string;

  @Column({ nullable: true })
  BudgetName: string;

  @Column({ nullable: true })
  Territory: string;

  @ManyToOne(() => Territory, { nullable: true })
  @JoinColumn({ name: 'Territory' })
  TerritoryEntity?: Territory;
}
