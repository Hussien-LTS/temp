/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AttendeeService } from './salesforce-attendee.service';

@Controller()
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @EventPattern('salesforce-attendee-info')
  async createAttendee(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data from RMQ', data);
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('data missing in payload');
    }

    await this.attendeeService.createAttendee(data);
    context.getChannelRef().ack(context.getMessage());
  }
}
