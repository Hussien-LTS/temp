import { ApiProperty } from '@nestjs/swagger';

export class LitsAttendeeInfoDto {
  @ApiProperty({
    example: [
      'a2u3g000000Z7jmAAC_TEAM_MEMBER',
      'a2u3g000000Z7jrAAC_TEAM_MEMBER',
    ],
    description: 'external Ids for attendees',
    type: [String],
  })
  ExternalId: string[];
}
