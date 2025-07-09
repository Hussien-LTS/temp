
import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FieldMappingEngineService } from 'src/field-mapping-engine/field-mapping-engine.service';
import { Topic } from 'src/entities/topic.entity';

@Injectable()
export class SalesforceTopicService {
  private readonly logger = new Logger(SalesforceTopicService.name);
  constructor(
    private readonly fieldMappingEngine: FieldMappingEngineService,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async handleTopicCreated(data: any): Promise<any> {
    console.log(
      '🚀 ~ SalesforceTopicService ~ handleTopicCreated ~ data:',
      data,
    );
    try {
      const test = data?.topicList[0];
      const payload = test;
      const targetApiId = 'topic';
      const direction = 'centrisToAWS';

      const enrichedPayload = await this.fieldMappingEngine.applyFieldMappings(
        targetApiId,
        direction,
        payload,
      );
      console.log(
        '🚀 ~ SalesforceTopicService ~ handleTopicCreated ~ enrichedPayload:',
        enrichedPayload,
      );

      const { TransactionId, topicList } = data;

      for (const t of topicList) {
        const topic = this.topicRepository.create({
          Id: t.TopicID,
          ModifiedDateTime: new Date().toISOString(),
          ExternalId: t.ExternalId,
          Description: t.TopicDescription,
          Status: t.Status || null,
          expansionList: t.expansionList || null,

        });
        console.log("🚀 ~ SalesforceTopicService ~ handleTopicCreated ~ topic:", topic)
       
        await this.topicRepository.save(topic);
        return {
          success: true,
          message: 'Topic created successfully',
          data: topic,
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
