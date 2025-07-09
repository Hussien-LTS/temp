import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class TopicListDto {
  @ApiProperty({
    example: "Discussion",
    description: "Type of the topic",
  })
  @IsNotEmpty()
  TopicType: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Unique identifier for the topic",
  })
  @IsNotEmpty()
  TopicID: string;

  @ApiProperty({
    example: "Quarterly planning meeting",
    description: "Detailed description of the topic",
  })
  TopicDescription: string;

  @ApiProperty({
    example: "EXT-TOPIC-789",
    description: "External system identifier for the topic",
  })
  ExternalId: string;
}
export class SalesforceTopicDto {
  @ApiProperty({
    example: "TX-001",
    description: "Unique ID for the transaction",
  })
  @IsNotEmpty()
  TransactionId: string;

  @ApiProperty({ type: [TopicListDto], description: "List of topic records" })
  @ValidateNested({ each: true })
  @Type(() => TopicListDto)
  topicList: TopicListDto[];
}
