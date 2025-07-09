import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueController } from './salesforce-venue.controller';
import { VenueTransaction } from 'src/entities/venue-salesforce-transaction.entity';
import { VenueService } from './salesforce-venue.service';
import { SalesforceVenue } from 'src/entities/salesforce_venue.entity';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    RabbitMQModule.register('datasource_venue_queue'),
    TypeOrmModule.forFeature([VenueTransaction, SalesforceVenue]),
  ],
  providers: [VenueService],
  exports: [VenueService],
  controllers: [VenueController],
})
export class VenueModule {}
