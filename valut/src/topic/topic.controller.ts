/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TopicService } from './topic.service';
import { TopicApiResponse } from './dtos/topic.dto';

@ApiTags('Topic')
@Controller('topic')
@ApiSecurity('sessionId')
export class TopicController {
  private readonly logger = new Logger(TopicController.name);
  private currentSession: string | null = null;
  constructor(private readonly topicService: TopicService) {}

  @EventPattern('vault_auth_response')
  async handleAuthResponse(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('Auth from RMQ data true');

    const sessionId = data?.sessionId;
    if (!sessionId) {
      context.getChannelRef().nack(context.getMessage(), false, false);
      throw new Error('Session ID missing in payload');
    }
    this.currentSession = sessionId;
    return { status: 'session_received from RMQ', sessionId };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all topics information',
    description: 'Fetches all topic records from Vault',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched Topics.',
  })
  async getTopics(@Req() req: Request): Promise<TopicApiResponse> {
    console.log('🚀 ~ In TopicController ~ getTopics ~ getTopics:');
    if (this.currentSession) {
      this.logger.log('Using RMQ session:');
      const allTopicsData = await this.topicService.getTopics(
        this.currentSession,
      );
      if (!(allTopicsData.responseStatus === 'SUCCESS')) {
        this.logger.log('🚀 ~  No Topics found');
        return {
          responseStatus: allTopicsData.responseStatus || '',
          responseDetails: allTopicsData.responseDetails || '',
          data: [],
        };
      }
      this.logger.log('🚀 ~ TopicController ~ getTopics ~ res:', allTopicsData);
      return allTopicsData;
    }
    const authorizationToken = req.headers['authorization'];
    if (!authorizationToken) {
      throw new UnauthorizedException('Authorization token is missing');
    }
    const allTopicsData = await this.topicService.getTopics(authorizationToken);
    if (allTopicsData.responseStatus === 'SUCCESS') {
      this.logger.log('🚀 ~ TopicController ~ getTopics ~ res:', allTopicsData);
      return allTopicsData;
    }
    this.logger.log('🚀 ~  No Topics found');
    return {
      responseStatus: allTopicsData.responseStatus || '',
      responseDetails: allTopicsData.responseDetails || '',
      data: [],
    };
  }

  @Get(':topicId')
  @ApiOperation({
    summary: 'Get one topic by ID',
    description: 'Fetches a single topic record by ID from Vault',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched one topic by ID.',
  })
  @ApiParam({
    name: 'topicId',
    required: true,
    description: 'Topic ID (Vault object ID)',
  })
  async getTopicById(
    @Req() req: Request,
    @Param('topicId') topicId: string,
  ): Promise<any> {
    console.log('🚀 ~ In TopicController ~ getTopicById:');
    if (this.currentSession) {
      this.logger.log('Using RMQ session:', this.currentSession);
      return await this.topicService.getTopicById(this.currentSession, topicId);
    }
    const authorizationToken = req.headers['authorization'];
    if (!authorizationToken) {
      throw new UnauthorizedException('Authorization token is missing');
    }
    const topicData = this.topicService.getTopicById(
      authorizationToken,
      topicId,
    );
    this.logger.log('🚀 ~ TopicController ~ getTopics ~ res:', topicData);
    return topicData;
  }

  // @Post()
  // @ApiBody({
  //   type: Object,
  //   description: 'Topic object',
  //   required: true,
  // })
  // @ApiOperation({
  //   summary: 'create topic',
  //   description: 'create topic',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully created topic.',
  // })
  // @EventPattern('datasource-topic-created')
  // async createTopic(
  //   @Req() req: any,
  //   @Payload() data: any,
  //   @Ctx() context: RmqContext,
  // ): Promise<any> {
  //   console.log("🚀 ~ In TopicController ~ createTopic:")
  //   this.logger.log('Using RMQ session:', this.currentSession);
  //   if (!this.currentSession) {
  //     throw new UnauthorizedException('Authorization token is missing');
  //   }

  //   if (!data) {
  //     context.getChannelRef().nack(context.getMessage(), false, false);
  //     throw new Error('data missing in payload');
  //   }
  //   this.logger.log('datasource-topic-created : data from RMQ', data);
  //   return this.topicService.createTopic(this.currentSession, data);
  // }

  // @Put(':topicId')
  // @ApiConsumes('application/x-www-form-urlencoded')
  // @ApiBody({
  //   type: Object,
  //   description: 'Topic object',
  //   required: true,
  // })
  // @ApiOperation({
  //   summary: 'Update topic',
  //   description: 'Update a single topic record by ID from Vault',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully updated a single topic.',
  // })
  // @ApiParam({
  //   name: 'topicId',
  //   required: true,
  //   description: 'Topic ID (Vault object ID)',
  // })
  // async updateTopic(
  //   @Req() req: Request,
  //   @Param('topicId') topicId: string,
  //   @Body() body: any,
  // ): Promise<any> {
  //   console.log("🚀 ~ In TopicController ~ updateTopic:")
  //   if (this.currentSession) {
  //     this.logger.log('Using RMQ session:', this.currentSession);
  //     return await this.topicService.updateTopic(
  //       this.currentSession,
  //       topicId,
  //       body,
  //     );
  //   }
  //   const authorizationToken = req.headers['authorization'];
  //   if (!authorizationToken) {
  //     throw new UnauthorizedException('Authorization token is missing');
  //   }
  //   return this.topicService.updateTopic(authorizationToken, topicId, body);
  // }
}
