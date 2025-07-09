import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule.register('salesforce_attachment_queue')],
  controllers: [AttachmentController],
  providers: [AttachmentService]
})
export class AttachmentModule {}
