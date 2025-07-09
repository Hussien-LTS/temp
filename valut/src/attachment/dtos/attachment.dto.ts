import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttachmentDto {
  Body: string;
  ContentType: string;
  Name: string;
  eventId: string;
  TransactionId: string;
  AttachmentId: string;
  BodyLength: string;
}

export class AttachmentIdDto {
  @ApiProperty({
    description: 'Unique ID of the attachment',
    example: '00P5C000000VBZGUA4',
  })
  @IsString()
  @IsNotEmpty()
  AttachmentId: string;
}

export class GetEventIdDto {
  @ApiProperty({
    type: String,
    example: 'a2v5C000000YhJ0QAK',
    description: 'ID of the event to fetch attachments for',
  })
  @IsNotEmpty()
  eventId: string;
}
