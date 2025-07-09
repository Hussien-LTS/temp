import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity'; // adjust the path based on your structure

@Entity()
export class HCPEligibility {
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
  Region: string;

  @Column({ nullable: true })
  ExternalSpeakerId: string;

  @Column({ nullable: true })
  Status: string;

  @Column({ nullable: true })
  EventSubType: string;

  @Column({ nullable: true })
  EventType: string;

  @Column()
  EventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'EventId' })
  Event: Event;

  @Column({ nullable: true })
  Topic: string;

  @Column({ nullable: true })
  Role: string;

  @Column({ nullable: true })
  DurationType: string;

  @Column({ nullable: true })
  TravelType: string;

  @Column({ nullable: true })
  SpendType: string;
}
