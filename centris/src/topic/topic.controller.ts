import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { TopicService } from './topic.service';
import { SalesforceTopicDto } from './DTOs/create-salesforce-topic.dto';

@ApiTags('Topic')
@Controller('salesforce/topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @ApiBody({ type: SalesforceTopicDto })
  create(@Body() salesforceTopic: Object) {
    console.log("🚀 ~ TopicController ~ create ~ salesforceTopic controller body:", salesforceTopic)
    return this.topicService.create(salesforceTopic);
  }
}
