import {
  IsString,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class VenueDto {
  @ApiProperty({ example: "QA Test Location Nov 21" })
  @IsString()
  @IsNotEmpty()
  VenueName: string;

  @ApiProperty({ example: "Eligible" })
  @IsString()
  @IsNotEmpty()
  Status: string;

  @ApiProperty({ example: "North Dakota" })
  @IsString()
  @IsNotEmpty()
  State: string;

  @ApiProperty({ example: "58703" })
  @IsString()
  @IsNotEmpty()
  PostalCode: string;

  @ApiProperty({ example: "12345678" })
  @IsString()
  @IsNotEmpty()
  ExternalId: string;

  @ApiProperty({ example: "Minot" })
  @IsString()
  @IsNotEmpty()
  City: string;

  @ApiProperty({ example: "10 North Main Street", nullable: true })
  @IsString()
  @IsNotEmpty()
  AddressLine1: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsNotEmpty()
  AddressLine2: string;
}

export class CreateVenueTransactionDto {
  @ApiProperty({ type: [VenueDto] })
  @ValidateNested({ each: true })
  @Type(() => VenueDto)
  VenueList: VenueDto[];

  @ApiProperty({ example: "a3Gf4000000TVhOEAW" })
  @IsString()
  @IsNotEmpty()
  TransactionId: string;
}
