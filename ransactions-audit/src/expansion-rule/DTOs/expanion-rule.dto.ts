import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateExpansionRuleDto {
  @ApiProperty({ description: 'Name of the expansion rule' })
  @IsString()
  @IsNotEmpty()
  ruleName: string;

  @ApiProperty({ description: 'ID of the target API' })
  @IsNumber()
  @IsNotEmpty()
  targetApiId: number;

  @ApiProperty({ description: 'Optional custom logic applied to the rule' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customLogic: string;

  @ApiProperty({ description: 'Name of the object involved' })
  @IsString()
  @IsNotEmpty()
  objectName: string;

  @ApiProperty({ description: 'Field in Centris to be mapped' })
  @IsString()
  @IsNotEmpty()
  centrisField: string;

  @ApiProperty({ description: 'Field in Vault to be mapped' })
  @IsString()
  @IsNotEmpty()
  vaultField: string;

  @ApiProperty({ description: 'Data type of the field' })
  @IsString()
  @IsNotEmpty()
  dataType: string;

  @ApiProperty({
    description: 'allow null prop',
  })
  @IsBoolean()
  @IsNotEmpty()
  allowNull: boolean;

  @ApiProperty({ description: 'Value of the field being used in mapping' })
  @IsString()
  @IsNotEmpty()
  fieldValue: string;
}

export class UpdateExpansionRuleDto {
  @ApiPropertyOptional({ description: 'Updated name of the rule' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ruleName?: string;

  @ApiPropertyOptional({ description: 'Optional custom logic for the rule' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customLogic?: string;

  @ApiPropertyOptional({
    description: 'Updated name of the target object (e.g., Account, Territory)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  objectName?: string;

  @ApiPropertyOptional({
    description: 'Updated field from Centris side to map',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  centrisField?: string;

  @ApiPropertyOptional({ description: 'Updated field from Vault side to map' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  vaultField?: string;

  @ApiPropertyOptional({
    description: 'Updated data type of the mapped field (e.g., string, number)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dataType?: string;

  @ApiPropertyOptional({
    description: 'Updated allow null prop',
  })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  allowNull?: boolean;

  @ApiPropertyOptional({
    description: 'Updated static or dynamic value to apply for mapping',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fieldValue?: string;
}
