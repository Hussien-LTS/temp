import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @EventPattern('expansion_topic_data')
  async handleTopicCreatedVV(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('data from RMQ', data);
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      return { isError: true, message: 'data missing in payload' };
    }
    const result = await this.topicService.handleTopicCreatedVV(data);
    context.getChannelRef().ack(context.getMessage());

    return { status: 'data received from RMQ', data: result };
  }
}
