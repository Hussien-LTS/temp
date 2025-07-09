import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { RabbitMQService } from "src/shared/rabbitmq/rabbitmq.service";
import { AttachmentDto, AttachmentProcessResult } from "./dtos/attachment.dto";
import axios from "axios";

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);
  private readonly baseUrl: string | undefined;
  constructor(
    private readonly configService: ConfigService,
    private rabbitMQService: RabbitMQService
  ) {
    this.baseUrl = this.configService.get<string>("SALESFORCE_URL");
  }

  async processAttachment(
    authorization: string,
    attachmentData: AttachmentDto
  ): Promise<AttachmentProcessResult> {
    this.logger.log("🚀 ~ In AttachmentService ~ processAttachment:");
    const baseUrl = `${this.baseUrl}//DocumentAttachment`;
    try {
      const receivedAttachment = await this.rabbitMQService.send(
        "centres-attachment-data",
        attachmentData
      );
      console.log(
        "🚀 ~ AttachmentService ~ receivedAttachment",
        receivedAttachment
      );
      if (!receivedAttachment || !receivedAttachment?.response?.Body) {
        this.logger.error("Received attachment data is invalid or empty");
        return {
          success: false,
          message: "Attachment Sync Failed in Centris",
        };
      }

      const mappedData = {
        Body: receivedAttachment.Body,
        ContentType: receivedAttachment.ContentType,
        Name: receivedAttachment.Name,
        parentId: receivedAttachment.eventId,
        VeevaAttachmentId: receivedAttachment.AttachmentId,
        TransactionId: receivedAttachment.TransactionId,
      };
      const response = await axios.post(baseUrl, mappedData, {
        headers: {
          Authorization: `Bearer ${authorization}`,
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      });
      console.log(
        "🚀 ~ AttachmentService ~ receivedAttachment:",
        receivedAttachment
      );

      if (response?.data?.AttachmentId) {
        this.logger.log(`Attachments Fetched Successfully`);
      }

      if (response?.data?.errors) {
        const errorTransactionLogData = {
          ModifiedDateTime: new Date().toISOString(),
          Name: receivedAttachment.Name || "",
          ErrorMessage: receivedAttachment?.data?.[0]?.message || "",
          Success: "false",
          Direction: "Outbound",
          LogType:
            `Attachment: ${receivedAttachment?.data?.errors?.[0]?.type}` ||
            "Attachment",
          Owner: "",
          ProcessCompletionTime: new Date().toISOString(),
        };
        await this.rabbitMQService.emit(
          "transaction-log",
          errorTransactionLogData
        );
        this.logger.log(
          "🚀 ~ In AttachmentService ~ processAttachment: Attachment Sync Failed in Centris"
        );
        return {
          success: false,
          message: "Attachment Sync Failed in Centris",
        };
      }
      const successTransactionLogData = {
        ModifiedDateTime: new Date().toISOString(),
        Name: receivedAttachment.Name || "",
        ErrorMessage: "",
        Success: "true",
        Direction: "Outbound",
        LogType: "Attachment",
        Owner: "",
        ProcessCompletionTime: new Date().toISOString(),
      };
      await this.rabbitMQService.emit(
        "transaction-log",
        successTransactionLogData
      );
      this.logger.log(
        "🚀 ~ In AttachmentService ~ processAttachment: Attachment Sync Successfully in Centris"
      );
      return {
        success: true,
        message: "Attachment Sync Successfully in Centris",
      };
    } catch (error) {
      this.logger.error("Error Fetching Attachment", error?.message || error);
      throw new HttpException(
        error.response?.data || "Failed to fetch Attachment",
        error.response?.status || 500,
        error.message ?? error
      );
    }
  }
}
