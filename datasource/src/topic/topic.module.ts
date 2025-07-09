import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { FieldMappingEngineModule } from 'src/field-mapping-engine/field-mapping-engine.module';

@Module({
  imports: [FieldMappingEngineModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
