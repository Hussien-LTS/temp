import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { RABBITMQ_CLIENT } from '../constants/rabbitmq.constants';

@Injectable()
export class RabbitMQService {
  constructor(@Inject(RABBITMQ_CLIENT) private client: ClientProxy) {}

  emit(pattern: string, data: any) {
    return firstValueFrom(this.client.emit(pattern, data));
  }
  send(pattern: string, data: any, timeoutMs: number = 30000) {
    return firstValueFrom(
      this.client.send(pattern, data).pipe(
        timeout(timeoutMs),
        catchError((err) => {
          console.error(
            `Microservice unreachable for pattern: ${pattern}`,
            err,
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          throw new Error(`Service unavailable: ${err.message}`);
        }),
      ),
    );
  }

  getClient(): ClientProxy {
    return this.client;
  }
}
