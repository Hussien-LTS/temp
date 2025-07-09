import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '../entities/attachment.entity';
import { AttachmentIds } from '../entities/attachmentIds.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    @InjectRepository(AttachmentIds)
    private attachmentsIdsRepository: Repository<AttachmentIds>,
  ) {}

  async handelCreatedAttachment(attachmentData: any): Promise<void> {
    console.log(
      '🚀 ~ AttachmentService ~ handelCreatedAttachment ~ attachmentData:',
      attachmentData,
    );

    try {
      const attachment = this.attachmentRepository.create({
        Id: String(attachmentData[0].AttachmentId) || '',
        ExternalId: String(attachmentData[0].ExternalId) || '',
        Body: String(attachmentData[0].Body) || '',
        BodyLength: String(attachmentData[0].BodyLength) || '',
        ContentType: String(attachmentData[0].ContentType) || '',
        Name: String(attachmentData[0].Name) || '',
        ExternalRecordId: String(attachmentData[0].eventId) || '',
        ExternalRecordName: String(attachmentData[0].eventId) || '',
        ModifiedDateTime: new Date().toISOString(),
      });
      this.logger.log('🚀 ~ In  AttachmentService ~ handelCreatedAttachment');
      await this.attachmentRepository.save(attachment);
      this.logger.log('🚀 ~ In  AttachmentService ~ handelCreatedAttachment ~ attachment saved successfully');
    } catch (error) {
      this.logger.log('🚀 ~ In  AttachmentService ~ handelCreatedAttachment');
      throw new Error(`Failed to Create Attachment: ${error.message}`);
    }
  }

  async sendAttachmentToCentres(attachmentId: string , eventId: string): Promise<any> {
    this.logger.log('🚀 ~ In AttachmentService ~ sendAttachmentToCentres');
    try {
      const response = await this.attachmentRepository.findOneBy({
        Id: String(attachmentId),
        ExternalRecordId: String(eventId),
        });
      this.logger.log(
        '🚀 ~ AttachmentService ~ sendAttachmentToCentres ~ response:',
        response,
      );
      return response;
    } catch (error) {
      this.logger.error('Error Fetching Attachment', error?.message || error);
      throw new HttpException(
        error.response?.data || 'Failed to fetch Attachment',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  async sendAttachmentIDsToCentris(eventId: string): Promise<string[]> {
    this.logger.log('🚀 ~ In AttachmentService ~ sendAttachmentIDsToVault');
    this.logger.log(
      '🚀 ~ AttachmentService ~ sendAttachmentIDsToVault ~ eventId:',
      eventId,
    );

    try {
      if (!eventId) {
        this.logger.error('Event ID is missing');
        throw new HttpException('Event ID is missing', 400);
      }
      const attachmentRecords = await this.attachmentRepository.find({
        where: { ExternalRecordId: eventId },
        select: ['Id'],
      });

      const attachmentIdsRecords = attachmentRecords.map((record) => record.Id);

      const attachmentIds = this.attachmentsIdsRepository.create({
        Id: String(eventId),
        AttachmentIdList: attachmentIdsRecords,
      });
      console.log(
        '🚀 ~ AttachmentService ~ sendAttachmentIDsToVault ~ attachmentIds:',
        attachmentIds,
      );
      await this.attachmentsIdsRepository.save(attachmentIds);

      this.logger.log(
        '🚀 ~ AttachmentService ~ sendAttachmentIDsToVault ~ attachmentIdsRecords:',
        attachmentIdsRecords,
      );
      return attachmentIdsRecords;
    } catch (error) {
      this.logger.error('Error Fetching Attachments', error?.message || error);
      throw new HttpException(
        'Failed to fetch Attachments',
        error.status || 500,
      );
    }
  }
}
