import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Venue {
  @ApiProperty({ example: 'QA Test Location Nov 21' })
  @IsString()
  @IsNotEmpty()
  VenueName: string;

  @ApiProperty({ example: 'Eligible' })
  @IsString()
  @IsNotEmpty()
  Status: string;

  @ApiProperty({ example: 'North Dakota' })
  @IsString()
  @IsNotEmpty()
  State: string;

  @ApiProperty({ example: '58703' })
  @IsString()
  @IsNotEmpty()
  PostalCode: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  ExternalId: string;

  @ApiProperty({ example: 'Minot' })
  @IsString()
  @IsNotEmpty()
  City: string;

  @ApiProperty({ example: '10 North Main Street' })
  @IsString()
  @IsNotEmpty()
  AddressLine1: string;

  @ApiProperty({ example: 'Suite 5B' })
  @IsString()
  @IsNotEmpty()
  AddressLine2: string;
}

export class CreateVenueDto {
  @ApiProperty({
    type: [Venue],
    example: [
      {
        VenueName: 'QA Test Location Nov 21',
        Status: 'Eligible',
        State: 'North Dakota',
        PostalCode: '58703',
        ExternalId: '12345678',
        City: 'Minot',
        AddressLine1: '10 North Main Street',
        AddressLine2: 'Suite 5B',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => Venue)
  VenueList: Venue[];

  @ApiProperty({ example: 'a3Gf4000000TVhOEAW' })
  @IsString()
  @IsNotEmpty()
  TransactionId: string;
}
