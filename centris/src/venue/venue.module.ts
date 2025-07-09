import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('salesforce_venue_queue')],
  controllers: [VenueController],
  providers: [VenueService],
})
export class VenueModule {}
