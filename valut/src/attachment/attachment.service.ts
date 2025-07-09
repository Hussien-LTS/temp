import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { AttachmentDto } from './dtos/attachment.dto';
import {
  mapErrorToTransactionLog,
  mapToTransactionLog,
} from 'src/shared/mappers/transaction-log.mapper';
import { mapApiResponseToAttachment } from './mapApiResponseToAttachment';

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);
  private readonly clientId: any;
  private readonly baseUrl: any;
  constructor(
    private readonly configService: ConfigService,
    private rabbitMQService: RabbitMQService,
  ) {
    this.baseUrl = this.configService.get<string>('VAULT_BASE_URL');
    this.clientId = this.configService.get<string>('VAULT_CLIENT_ID');
  }
  async getAttachmentById(
    authorizationToken: string,
    attachmentId: string,
  ): Promise<any> {
    this.logger.log('🚀 ~ In AttachmentService ~ getAttachmentById:');

    const clientId = this.clientId;
    if (!authorizationToken) {
      this.logger.error('Authorization token or Client ID is missing');
      throw new HttpException(
        'Missing Authorization header',
        HttpStatus.BAD_REQUEST,
      );
    }
    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/transaction_logs__c/VIRZ08LKW9549TF/attachments/5433740/versions/1`,
      headers: {
        Authorization: authorizationToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    try {
      this.logger.log(`Fetching Attachment: ${attachmentId}.....`);
      const response = await axios.request(config);

      if (response?.data?.responseStatus === 'SUCCESS') {
        this.logger.log(`Attachments Fetched Successfully`);
      }
      const attachmentByIdDto = response?.data;

      if (response?.data?.errors) {
        await this.rabbitMQService.emit(
          'transaction-log',
          mapErrorToTransactionLog(attachmentByIdDto),
        );
        return;
      }
      await this.rabbitMQService.emit(
        'vault-attachment-data',
        mapApiResponseToAttachment(attachmentByIdDto.data),
      );
      await this.rabbitMQService.emit(
        'transaction-log',
        mapToTransactionLog(attachmentByIdDto, 'Attachment', 'Outbound'),
      );
      this.logger.log(`Attachment: ${attachmentId}:`, attachmentByIdDto);
      return mapApiResponseToAttachment(attachmentByIdDto.data);
    } catch (error) {
      this.logger.error('Error Fetching Attachment', error?.message || error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            error?.response?.data ||
            'Failed to fetch Attachment from Veeva Vault',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAttachmentsIdsOnEventSubmission(
    authorizationToken: string,
    eventId: string,
  ): Promise<any> {
    this.logger.log(
      '🚀 ~ In AttachmentService ~ getDocumentsOnEventSubmission:',
    );
    if (!authorizationToken) {
      this.logger.error('Authorization token or Client ID is missing');
      throw new HttpException(
        'Authorization token or Client ID is missing',
        401,
      );
    }
    try {
      const receivedAttachmentIds = await this.rabbitMQService.send(
        'datasource-getDocumentsOnEventSubmission-data',
        { eventId },
      );
      this.logger.log(
        '🚀 ~ AttachmentService ~ receivedAttachmentIds:!',
        receivedAttachmentIds,
      );
      if (
        !receivedAttachmentIds?.attachmentIDs ||
        receivedAttachmentIds?.attachmentIDs?.length === 0
      ) {
        this.logger.warn('No attachment IDs found in response');
        const errorTransactionLogData = {
          ModifiedDateTime: new Date().toISOString(),
          Name: 'No Attachments Found',
          ErrorMessage: 'No attachment IDs found in response',
          Success: 'false',
          Direction: 'vault to AWS',
          LogType: `Attachment: No attachment IDs found for event ID ${eventId}`,
          Owner: '',
          ProcessCompletionTime: new Date().toISOString(),
        };
        await this.rabbitMQService.emit(
          'transaction-log',
          errorTransactionLogData,
        );
        return {
          success: false,
          message: 'No attachment IDs found for the provided event ID',
        };
      }
      const successTransactionLogData = {
        ModifiedDateTime: new Date().toISOString(),
        Name: `Attachments for Event ID: ${eventId}`,
        ErrorMessage: '',
        Success: 'true',
        Direction: 'vault to AWS',
        LogType: `Attachment: Fetched IDs for Event ID ${eventId}`,
        Owner: '',
        ProcessCompletionTime: new Date().toISOString(),
      };
      await this.rabbitMQService.emit(
        'transaction-log',
        successTransactionLogData,
      );
      this.logger.log(
        `Attachments IDs Fetched Successfully for Event ID: ${eventId}`,
      );
      return receivedAttachmentIds?.attachmentIDs;
    } catch (error) {
      this.logger.error(
        'Error Fetching Attachments IDs',
        error?.message || error,
      );
      throw new HttpException(
        error.response?.data || 'Failed to fetch Attachments IDs',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }
}
