import {
  Body,
  Controller,
  HttpException,
  Logger,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { EventPattern, Payload, Ctx, RmqContext } from "@nestjs/microservices";
import { AttachmentService } from "./attachment.service";
import { ApiBody, ApiHeader, ApiResponse } from "@nestjs/swagger";
import {
  AttachmentDto,
  AuthResponseDto,
  GetEventIdDto,
} from "./dtos/attachment.dto";

@Controller("attachment")
export class AttachmentController {
  private access_token: string;
  private readonly logger = new Logger(AttachmentController.name);
  constructor(private readonly attachmentService: AttachmentService) {}

  @EventPattern("salesforce_auth_response")
  async handleAuthResponse(
    @Payload() data: AuthResponseDto,
    @Ctx() context: RmqContext
  ) {
    this.logger.log(
      "🚀 ~ AttachmentController ~ handleAuthResponse ~ handleAuthResponse:"
    );
    this.logger.log("Auth from RMQ", data);
    const access_token = data?.access_token;
    this.access_token = access_token;
    if (!access_token) {
      this.logger.log("access_token missing in payload");
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error("access_token missing in payload");
    }
    context.getChannelRef().ack(context.getMessage());
    return { status: "access_token received from RMQ", access_token };
  }

  @Post("DatasourceAttachment")
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  @ApiResponse({
    status: 201,
    description: "Attachment successfully created and response returned.",
  })
  @ApiBody({ type: AttachmentDto })
  async handleDatasourceAttachment(@Body() attachmentData: AttachmentDto) {
    this.logger.log("🚀 ~ AttachmentController ~ handleDatasourceAttachment");
    try {
      if (!this.access_token) {
        this.logger.error("Access token is missing");
        return {
          success: false,
          message: "Access token is missing",
        };
      } else {
        const response = await this.attachmentService.processAttachment(
          this.access_token,
          attachmentData
        );
        return response;
      }
    } catch (error) {
      this.logger.error("Error processing attachment", error);
    }
  }
}
