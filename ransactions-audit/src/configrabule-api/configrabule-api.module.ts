import { Module } from '@nestjs/common';
import { ConfigrubleApiService } from './configrabule-api.service';
import { ConfigrubleApiController } from './configrabule-api.controller';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('configruble-api')],
  providers: [ConfigrubleApiService],
  controllers: [ConfigrubleApiController],
})
export class ConfigrubleApiModule {}
