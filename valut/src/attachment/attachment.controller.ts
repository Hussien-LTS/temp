import {
  Body,
  Controller,
  ForbiddenException,
  HttpException,
  Logger,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AttachmentService } from './attachment.service';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { AttachmentIdDto, GetEventIdDto } from './dtos/attachment.dto';
import { SessionStoreService } from 'src/sessionValidation/sessionValidation.service';

@ApiTags('Attachment')
@Controller('attachment')
export class AttachmentController {
  private readonly logger = new Logger(AttachmentController.name);
  private currentSession: string;
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly sessionStore: SessionStoreService,
  ) {}

  @EventPattern('vault_auth_response')
  handleVaultAuth(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('🚀 ~ AttachmentController ~ handleVaultAuth ~ data:', data);
    this.currentSession = data?.sessionId;
    if (!this.currentSession) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new ForbiddenException();
    }

    this.sessionStore.set(data.sessionId);
  }

  @Post('get-attachment')
  @ApiOperation({ summary: 'retrieve Attachment by id from Veeva Vault' })
  @ApiResponse({
    status: 200,
    description: 'retrieve Attachment by id from Veeva Vault',
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid token' })
  @ApiBody({ type: AttachmentIdDto })
  async getAttachmentById(@Body() body: AttachmentIdDto) {
    this.logger.log('🚀 ~ In AttachmentController ~ getAttachmentById:');
    this.logger.log('Request body:', body);
    if (Object.keys(body).length === 1 && Object.values(body)[0] === '') {
      try {
        body = JSON.parse(Object.keys(body)[0]);
      } catch (e) {
        throw new HttpException('Invalid JSON body', 400);
      }
    }

    if (!body.AttachmentId || body.AttachmentId.trim() === '') {
      throw new HttpException('AttachmentId is required', 400);
    }
    if (!this.currentSession) {
      throw new UnauthorizedException();
    }
    return await this.attachmentService.getAttachmentById(
      this.currentSession,
      body.AttachmentId,
    );
  }

  @Post('get-by-event')
  @ApiHeader({
    name: 'auth',
    description: 'Token JWT',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched attachment IDs.',
  })
  @ApiBody({ type: GetEventIdDto })
  async getAttachmentsIdsOnEventSubmission(
    @Req() req: Request,
    @Body() body: GetEventIdDto,
  ) {
    this.logger.log(
      '🚀 ~ In AttachmentController ~ getAttachmentsIdsOnEventSubmission',
    );
    console.log('🚀 ~ AttachmentController ~ body:', body);

    let eventId = body.eventId;
    if (!eventId) {
      const keys = Object.keys(body);
      if (keys.length === 1) {
        try {
          const parsed = JSON.parse(keys[0]);
          eventId = parsed.eventId;
        } catch (e) {
          this.logger.error('Failed to parse eventId from body');
        }
      }
    }

    if (!eventId || eventId.trim() === '') {
      throw new HttpException('eventId is missing', 400);
    }
    if (this.currentSession) {
      this.logger.log('Using RMQ session: true');
      const response =
        await this.attachmentService.getAttachmentsIdsOnEventSubmission(
          this.currentSession,
          eventId,
        );
      if (response) {
        this.logger.log('🚀 ~ AttachmentController ~ response:', response);
        return response;
      }
    }

    const authorizationToken: string = req.headers['authorization'];
    if (!authorizationToken) {
      throw new HttpException('Authorization token is missing', 401);
    }

    const data =
      await this.attachmentService.getAttachmentsIdsOnEventSubmission(
        authorizationToken,
        eventId,
      );
    this.logger.log('🚀 ~ AttachmentController ~ data:', data);
    return data;
  }
}
