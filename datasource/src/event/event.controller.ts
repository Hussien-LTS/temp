import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @EventPattern('event_data')
  async handleAuthResponse(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('from RMQ', data);
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('data missing in payload');
    }

    try {
      const createdEvent = await this.eventService.createEvent(data);
      console.log('Event created:', createdEvent);

      context.getChannelRef().ack(context.getMessage());
      return {
        status: 'event_data_received_and_persisted',
        data: createdEvent,
      };
    } catch (error) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error(`Failed to process event: ${error.message}`);
    }
  }
}
