import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from 'src/entities/attachment.entity';
import { RabbitMQModule } from 'src/shared/rabbitmq/rabbitmq.module';
import { AttachmentIds } from 'src/entities/attachmentIds.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment,  AttachmentIds]),
    RabbitMQModule.register('datasource_attachment_queue'),
  ],
  providers: [AttachmentService],
  exports: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}