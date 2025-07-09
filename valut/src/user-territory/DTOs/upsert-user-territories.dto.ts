import { ApiProperty } from '@nestjs/swagger';

export class UpsertUserTerritoriesDto {
  @ApiProperty({
    example: ['VCT000000001001', 'VCT000000001002'],
    description: 'user territory Ids',
    type: [String],
    required: true,
  })
  userTerritoryId: string[];
}
