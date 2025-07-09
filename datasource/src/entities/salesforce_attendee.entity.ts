import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SalesforceAttendeeAddress } from './salesforce_attendee_address.entity';

@Entity()
export class SalesforceAttendee {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ nullable: true })
  ExternalID: string;

  @Column({ nullable: true })
  Name: string;

  @Column({ nullable: true })
  FirstName: string;

  @Column({ nullable: true })
  LastName: string;

  @OneToMany(() => SalesforceAttendeeAddress, (Address) => Address.Attendee, {
    cascade: true,
    nullable: true,
  })
  Addresses?: SalesforceAttendeeAddress[];
}
