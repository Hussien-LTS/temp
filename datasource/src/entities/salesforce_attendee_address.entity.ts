import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { SalesforceAttendee } from './salesforce_attendee.entity';

@Entity()
export class SalesforceAttendeeAddress {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  Address: string;

  @ManyToOne(() => SalesforceAttendee, (Attendee) => Attendee.Addresses, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  Attendee?: SalesforceAttendee[];
}
