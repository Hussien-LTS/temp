import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Venue {
  @PrimaryColumn()
  Id: string;

  @Column({ nullable: true })
  ModifiedDateTime: string;

  @Column({ nullable: true })
  ExternalId: string;

  @Column({ nullable: true })
  Name: string;

  @Column({ nullable: true })
  Status: string;

  @Column({ nullable: true })
  AddressLine1: string;

  @Column({ nullable: true })
  AddressLine2: string;

  @Column({ nullable: true })
  City: string;

  @Column({ nullable: true })
  State: string;

  @Column({ nullable: true })
  PostalCode: string;
}
