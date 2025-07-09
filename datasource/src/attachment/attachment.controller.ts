import { Controller, Logger, Post } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Attachment')
@Controller('attachment')
export class AttachmentController {
  private readonly logger = new Logger(AttachmentController.name);
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly rmqService: RabbitMQService,
  ) {}

  @EventPattern('vault-attachment-data')
  async createAttachment(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('data from RMQ create Attachment', data);
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('data missing in payload');
    }
    await this.attachmentService.handelCreatedAttachment(data);
    await this.rmqService.emit('datasource-attachment-created', data);
    context.getChannelRef().ack(context.getMessage());
    this.logger.log('data received from RMQ and prisest');
    return { status: 'data received from RMQ and prisest', data };
  }

  @EventPattern('centres-attachment-data')
  async sendAttachmentToCentres(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log('data from RMQ sendAttachmentToCentres', data);
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('data missing in payload');
    }
    this.logger.log("🚀 ~ AttachmentController ~ data.AttachmentId:", data.AttachmentId);
    const response = await this.attachmentService.sendAttachmentToCentres(data.AttachmentId, data.eventId);
    this.logger.log('🚀 ~ sendAttachmentToCentres~ DATA SENT:', response);

    context.getChannelRef().ack(context.getMessage(), false, false);
    return { status: 'data received from RMQ ', response };
  }

  @EventPattern('datasource-getDocumentsOnEventSubmission-data')
  async sendAttachmentIDsToCentris(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    if (!data) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('data missing in payload');
    }
    this.logger.log('data from RMQ sendAttachmentIDsToCentris', data);
    const attachmentIDs =
      await this.attachmentService.sendAttachmentIDsToCentris(data.eventId);
    this.logger.log(
      '🚀 ~ datasource-getDocumentsOnEventSubmission-data~ DATA SENT:{}',
      attachmentIDs,
    );

    context.getChannelRef().ack(context.getMessage());
    return {
      status: 'data received from RMQ sendAttachmentIDsToCentris',
      attachmentIDs,
    };
  }
}
