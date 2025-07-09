import { ApiProperty } from '@nestjs/swagger';

export class SparkMessageDto {
  @ApiProperty({ description: 'Type of event, e.g., CREATE, UPDATE, DELETE' })
  event_type: string;

  @ApiProperty({
    description: 'Name of the Vault object affected by the event',
  })
  object: string;

  @ApiProperty({ description: 'Unique Vault record ID of the affected object' })
  record_id: string;

  @ApiProperty({ description: 'Timestamp of the event in ISO format' })
  timestamp: string;

  @ApiProperty({ description: 'User who triggered the event' })
  user: string;

  @ApiProperty({ description: 'Object data at the time of the event' })
  data: Record<string, any>;
}
