import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_CLIENT } from '../constants/rabbitmq.constants';

@Injectable()
export class RabbitMQService {
  constructor(@Inject(RABBITMQ_CLIENT) private client: ClientProxy) {}

  emit(pattern: string, data: any) {
    return firstValueFrom(this.client.emit(pattern, data));
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
