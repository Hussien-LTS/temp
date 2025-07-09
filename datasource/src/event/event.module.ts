import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RabbitMQModule.register('event_queue'),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
