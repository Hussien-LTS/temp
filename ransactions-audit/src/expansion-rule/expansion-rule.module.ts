import { Module } from '@nestjs/common';
import { ExpansionRuleService } from './expansion-rule.service';
import { ExpansionRuleController } from './expansion-rule.controller';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('expansion-rule')],
  providers: [ExpansionRuleService],
  controllers: [ExpansionRuleController],
})
export class ExpansionRuleModule {}
