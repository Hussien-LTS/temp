import { Injectable } from '@nestjs/common';
import { SalesforceBudgetDto } from './DTOs/create-salesforce-budget.dto';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';

@Injectable()
export class BudgetService {
  constructor(private rmqService: RabbitMQService) {}

  async create(createSalesforceBudgetDto: SalesforceBudgetDto) {
    await this.rmqService.emit(
      `salesforce-budget-created`,
      createSalesforceBudgetDto,
    );
  }
}
