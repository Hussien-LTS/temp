import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RabbitMQService } from '../shared/rabbitmq/rabbitmq.service';
import { TopicApiResponse, TopicDto } from './dtos/topic.dto';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);
  private readonly clientId: string | undefined;
  private readonly baseUrl: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private rmqService: RabbitMQService,
  ) {
    this.baseUrl = this.configService.get<string>('VAULT_BASE_URL');
    this.clientId = this.configService.get<string>('VAULT_CLIENT_ID');
  }

  async getTopics(authorizationToken: string): Promise<TopicApiResponse> {
    this.logger.log('🚀 ~ In TopicService ~ getTopics ~ getTopics:');
    const clientId = this.clientId;

    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/em_catalog__v`,
      headers: {
        Authorization: authorizationToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': clientId,
      },
    };
    if (!authorizationToken || !clientId) {
      throw new UnauthorizedException(
        'Authorization token or Client Id is missing',
      );
    }
    try {
      this.logger.log('Fetching Topics......');

      const response = await axios.request(config);
      if (!response.data) {
        this.logger.log('Topics Not Found!');
      }
      await this.rmqService.emit('All_Topics_data', response.data);
      this.logger.log('🚀 ~ TopicService ~ getTopics ~ response:', response);
      return {
        responseStatus: response?.data?.responseStatus ?? 'SUCCESS',
        responseDetails: response?.data?.responseDetails ?? null,
        data: response?.data?.data,
      };
    } catch (error) {
      this.logger.error('Error fetching topics', error?.message || error);
      throw new HttpException(
        error.response?.data || 'Failed to fetch Topic',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  async getTopicById(
    authorizationToken: string,
    topicId: string,
  ): Promise<any> {
    this.logger.log('🚀 ~ In TopicService ~ getTopicById:');
    const clientId = this.clientId;
    const config = {
      method: 'get' as const,
      url: `${this.baseUrl}/vobjects/em_catalog__v/${topicId}`,
      headers: {
        Authorization: authorizationToken,
        Accept: 'application/json',
        'X-VaultAPI-ClientID': clientId,
      },
    };

    if (!authorizationToken || !clientId) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const response = await axios.request(config);
      if (!response.data) {
        this.logger.log(`Topic with ID ${topicId} Not Found!`);
        throw new HttpException('Topic not found', 404);
      }
      const topicByIdVO: TopicDto = response.data as TopicDto;
      this.logger.log(`Topic with ID ${topicId} found`, topicByIdVO);
      await this.rmqService.emit(`topicId_data`, topicByIdVO);
      return {
        data: topicByIdVO,
      };
    } catch (error) {
      this.logger.error('Error updating topic', error?.message || error);
      throw new HttpException(
        error.response?.data || 'Failed to fetch topic',
        error.response?.status || 500,
        error.message ?? error,
      );
    }
  }

  // async createTopic(authorizationToken: string, data: any): Promise<any> {
  //   this.logger.log('🚀 ~ In TopicService ~ createTopic ~ createTopic:');
  //   if (!authorizationToken || !this.clientId) {
  //     throw new UnauthorizedException('Authorization token is missing');
  //   }

  //   const clientId = this.clientId;

  //   const config = {
  //     method: 'post' as const,
  //     url: ${this.baseUrl}/vobjects/em_catalog__v,
  //     data: data,
  //     headers: {
  //       Authorization: authorizationToken,
  //       Accept: 'application/json',
  //       'X-VaultAPI-ClientID': clientId,
  //     },
  //   };

  //   if (!authorizationToken || !clientId) {
  //     throw new HttpException('Authorization token is missing', 401);
  //   }
  //   try {
  //     const response = await axios.request(config);
  //     if (response.data.responseStatus === 'SUCCESS') {
  //       this.logger.log(Event Created successfully, response.data);
  //     }
  //     return {
  //       msg: 'Topic Created SUCCESS',
  //       data: response.data,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error creating topic', error?.message || error);
  //     throw new HttpException(
  //       error?.response?.data || 'Failed to create topic',
  //       error?.response?.status || 500,
  //       error.message ?? error,
  //     );
  //   }
  // }

  // async updateTopic(
  //   authorizationToken: string,
  //   topicId: string,
  //   body: Record<string, string>,
  // ): Promise<any> {
  //   this.logger.log('🚀 ~ In TopicService ~ updateTopic:');
  //   const record: Record<string, string> = {
  //     [body.fieldName]: body.value,
  //   };
  //   if (!authorizationToken || !this.clientId) {
  //     throw new UnauthorizedException('Authorization token is missing');
  //   }
  //   const clientId = this.clientId;
  //   const config = {
  //     method: 'put' as const,
  //     maxBodyLength: Infinity,
  //     url: ${this.baseUrl}/vobjects/em_catalog__v/${topicId},
  //     data: record,
  //     headers: {
  //       Authorization: authorizationToken,
  //       Accept: 'application/json',
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'X-VaultAPI-ClientID': clientId,
  //     },
  //   };

  //   try {
  //     const response = await axios.request(config);
  //     if (!(response.data.responseStatus === 'SUCCESS')) {
  //       this.logger.log(Event not updated !);
  //     }

  //     const topicDataUpdated = await this.getTopicById(
  //       authorizationToken,
  //       topicId,
  //     );
  //     await this.rmqService.emit(topicId, {
  //       data: response.data,
  //       topicDataUpdated,
  //     });
  //     return {
  //       msg: 'Event Updated SUCCESS and data sent to RMQ',
  //       data: response.data,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error updating topic', error?.message || error);
  //     throw new HttpException(
  //       error?.response?.data || 'Failed to update topic',
  //       error?.response?.status || 500,
  //       error.message ?? error,
  //     );
  //   }
  // }
}