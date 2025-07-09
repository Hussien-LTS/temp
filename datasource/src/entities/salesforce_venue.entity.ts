import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class SalesforceVenue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  VenueName: string;

  @Column()
  Status: string;

  @Column()
  State: string;

  @Column()
  PostalCode: string;

  @Column()
  ExternalId: string;

  @Column()
  City: string;

  @Column({ nullable: true })
  AddressLine1: string;

  @Column({ nullable: true })
  AddressLine2: string;
}
