import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { SessionStoreService } from 'src/sessionValidation/sessionValidation.service';

@Module({
  controllers: [VenueController],
  providers: [VenueService, SessionStoreService],
})
export class VenueModule {}
