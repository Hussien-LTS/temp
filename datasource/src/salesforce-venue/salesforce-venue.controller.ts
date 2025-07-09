import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { VenueService } from './salesforce-venue.service';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';

@Controller('venue')
export class VenueController {
  constructor(
    private readonly venueService: VenueService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @EventPattern('salesforce-venue-created')
  async createVenue(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Data from RMQ:', data);

    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('Data missing in payload');
    }
    await this.rmqService.emit(`datasource-venue-created`, data);

    await this.venueService.handleVenueCreated(data);
    context.getChannelRef().ack(context.getMessage());

    return { status: 'Data received from RMQ and processed', data };
  }
}
