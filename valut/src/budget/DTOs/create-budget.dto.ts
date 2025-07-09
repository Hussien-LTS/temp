import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class BudgetItem {
  @ApiProperty({ example: '10000.00' })
  @IsString()
  @IsNotEmpty()
  TotalBudget: string;

  @ApiProperty({ example: 'North America' })
  @IsString()
  @IsNotEmpty()
  Territory: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsString()
  @IsNotEmpty()
  StartDate: string;

  @ApiProperty({ example: 'EXT-001' })
  @IsString()
  @IsNotEmpty()
  ExternalId: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsString()
  @IsNotEmpty()
  EndDate: string;

  @ApiProperty({ example: 'Marketing Q1 Budget' })
  @IsString()
  @IsNotEmpty()
  BudgetName: string;
}

export class CreateBudgetDto {
  @ApiProperty({ example: 'TX-001' })
  @IsString()
  @IsNotEmpty()
  TransactionId: string;

  @ApiProperty({
    type: [BudgetItem],
    example: [
      {
        TotalBudget: '10000.00',
        Territory: 'North America',
        StartDate: '2025-01-01',
        ExternalId: 'EXT-001',
        EndDate: '2025-12-31',
        BudgetName: 'Marketing Q1 Budget',
      },
    ],
  })
  budgetList: BudgetItem[];
}
