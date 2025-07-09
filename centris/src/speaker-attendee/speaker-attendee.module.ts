import { Module } from '@nestjs/common';
import { SpeakerAttendeeController } from './speaker-attendee.controller';
import { SpeakerAttendeeService } from './speaker-attendee.service';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('salesforce_attendee_queue')],
  controllers: [SpeakerAttendeeController],
  providers: [SpeakerAttendeeService],
})
export class SpeakerAttendeeModule {}
