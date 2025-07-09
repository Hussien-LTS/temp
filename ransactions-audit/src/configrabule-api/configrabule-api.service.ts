import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';

@Injectable()
export class ConfigrubleApiService {
  constructor(private readonly rmqService: RabbitMQService) {}

  async getAllConfigrabuleApi() {
    try {
      const configrubleApis = await this.rmqService.send(
        'get_all_configruble-api',
        {},
      );
      return configrubleApis;
    } catch (error) {
      console.log(
        '🚀 ~ ConfigrubleApiService ~ getConfigrabuleApi ~ error:',
        error,
      );
    }
  }
}
