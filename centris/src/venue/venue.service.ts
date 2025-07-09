import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { CreateVenueTransactionDto } from './DTOs/create-salesforce-venue.dto';

@Injectable()
export class VenueService {
  constructor(private rmqService: RabbitMQService) {}

  async create(createSalesforceVenueDto: CreateVenueTransactionDto) {
    await this.rmqService.emit(
      `salesforce-venue-created`,
      createSalesforceVenueDto,
    );
  }
}
