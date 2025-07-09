import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Topic } from './topic.entity';

@Entity()
export class Training {
  @PrimaryColumn()
  Id: string;

  @Column({ nullable: true })
  ModifiedDateTime: string;

  @Column({ nullable: true })
  ExternalId: string;

  @Column({ nullable: true })
  TrainingName: string;

  @Column({ nullable: true })
  StartDate: string;

  @Column({ nullable: true })
  EndDate: string;

  @Column({ nullable: true })
  TopicID: string;

  @Column({ nullable: true })
  TopicType: string;

  @Column({ nullable: true })
  TopicDescription: string;

  @Column({ nullable: true })
  TopicStatus: string;

  @Column({ nullable: true })
  TopicName: string;

  @ManyToOne(() => Topic)
  @JoinColumn({ name: 'TopicID' })
  topic: Topic;
}
