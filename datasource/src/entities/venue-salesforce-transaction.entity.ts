import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SalesforceVenue } from './salesforce_venue.entity';

@Entity()
export class VenueTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  TransactionId: string;

  @OneToMany(() => SalesforceVenue, (venue) => venue)
  VenueList: SalesforceVenue[];
}
