import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('event_vault_queue')],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
