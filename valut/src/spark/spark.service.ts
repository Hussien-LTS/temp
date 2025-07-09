import { Injectable } from '@nestjs/common';
import { SparkMessageDto } from './dtos/sparkMessage.dto';

@Injectable()
export class SparkService {
  async handleSparkMessage(msg: SparkMessageDto, auth: string) {
    if (msg.event_type === 'CREATE') {
      if (msg.object === 'em_event__v') {
        const eventId = msg.record_id;
        return {
          message: 'success from spark',
          eventId,
        };
      }
    }
  }
}
