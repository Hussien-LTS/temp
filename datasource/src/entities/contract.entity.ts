import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Contract {
  @PrimaryColumn()
  Id: string;

  @Column({ nullable: true })
  ModifiedDateTime: string;

  @Column({ nullable: true })
  ExternalId: string;

  @Column({ nullable: true })
  ContractName: string;

  @Column({ nullable: true })
  Status: string;

  @Column({ nullable: true })
  StartDate: string;

  @Column({ nullable: true })
  EndDate: string;

  @Column({ nullable: true })
  ContractTypeId: string;

  @Column({ nullable: true })
  ContractTypeName: string;
}
