import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { FieldMappingEngineService } from 'src/field-mapping-engine/field-mapping-engine.service';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(private readonly fieldMappingEngine: FieldMappingEngineService) {}

  async handleTopicCreatedVV(data: any): Promise<any> {
    try {
      const targetApiId = 'topic';
      const direction = 'centrisToAWS';

      const enrichedPayload = await this.fieldMappingEngine.applyFieldMappings(
        targetApiId,
        direction,
        data,
      );

      return {
        success: true,
        message: 'Topic created successfully',
        data: enrichedPayload,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
