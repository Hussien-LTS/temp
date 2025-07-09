import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { SalesforceBudgetDto } from './DTOs/create-salesforce-budget.dto';

@ApiTags('Budget')
@Controller('salesforce/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  @ApiBody({ type: SalesforceBudgetDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() salesforceBudget: SalesforceBudgetDto) {
    return this.budgetService.create(salesforceBudget);
  }
}
