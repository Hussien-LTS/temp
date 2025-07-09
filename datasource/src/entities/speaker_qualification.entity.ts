import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class SpeakerQualification {
  @PrimaryColumn()
  Id: string;

  @Column({ nullable: true })
  ModifiedDateTime: string;

  @Column({ nullable: true })
  ExternalId: string;

  @Column({ nullable: true })
  SpeakerId: string;

  @Column({ nullable: true })
  SpeakerFName: string;

  @Column({ nullable: true })
  SpeakerLName: string;

  @Column({ nullable: true })
  SpeakerAddr: string;

  @Column({ nullable: true })
  SpeakerStatus: string;

  @Column({ nullable: true })
  NextYearStatus: string;
}
